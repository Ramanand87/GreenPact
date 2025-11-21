# contracts/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from user.models import CustomUser, FarmerProfile, ContractorProfile
from rest_framework_simplejwt.tokens import AccessToken
from . import models, serializers
import json
from asgiref.sync import sync_to_async
import requests
from django.core.files.base import ContentFile


class ContractConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = None
        self.contract_groupname = None
        await self.accept()

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get("action")
            token = data.get("token")

            # authenticate once per connection or per-message token
            if token:
                self.user = await self.authenticate_user(token)

            if not self.user:
                await self.send_json({"error": "Authentication failed"})
                return

            # join group if not already
            if not self.contract_groupname:
                self.contract_groupname = f"contract_{self.user.username}"
                await self.channel_layer.group_add(
                    self.contract_groupname,
                    self.channel_name
                )

            if action == "fetch_contracts":
                await self.handle_fetch_contracts()
            elif action == "approve_contracts":
                await self.handle_approve_contract(data)
            else:
                await self.send_json({"error": "Unknown action"})
        except Exception as e:
            await self.send_json({"error": str(e)})

    async def disconnect(self, close_code):
        if self.user and self.contract_groupname:
            await self.channel_layer.group_discard(
                self.contract_groupname,
                self.channel_name
            )

    async def send_json(self, payload: dict):
        await self.send(text_data=json.dumps(payload))

    async def handle_fetch_contracts(self):
        contracts = await self.get_contracts()
        await self.send_json({"data": contracts})

    async def handle_approve_contract(self, data):
        if self.user.type != "farmer":
            await self.send_json(
                {"error": "You can't approve this contract, wait for seller to approve"}
            )
            return

        success = await self.approve_contract_sync(data)
        if success:
            await self.send_json({"success": True})
        else:
            await self.send_json({"error": "Failed to approve contract"})

    # ---------- sync helpers wrapped with sync_to_async ----------

    @sync_to_async
    def authenticate_user(self, token):
        try:
            access_token = AccessToken(token)
            return CustomUser.objects.get(id=access_token["user_id"])
        except Exception:
            return None

    @sync_to_async
    def get_contracts(self):
        try:
            qs = models.Contract.objects.select_related("farmer", "buyer", "crop")
            if self.user.type == "farmer":
                qs = qs.filter(farmer=self.user)
            else:
                qs = qs.filter(buyer=self.user)
            return serializers.ContractSerializer(qs, many=True).data
        except Exception:
            return []

    @sync_to_async
    def approve_contract_sync(self, data):
        try:
            contract = models.Contract.objects.select_related(
                "farmer", "buyer", "crop"
            ).get(contract_id=data["contract_id"])

            farmer_profile = FarmerProfile.objects.get(user=contract.farmer)
            contractor_profile = ContractorProfile.objects.get(user=contract.buyer)

            payload = {
                "orderDate": "2025-04-02",
                "farmerName": farmer_profile.name,
                "farmerAddress": farmer_profile.address,
                "farmerContact": farmer_profile.phoneno,
                "customerName": contractor_profile.name,
                "customerAddress": contractor_profile.address,
                "customerContact": contractor_profile.phoneno,
                "cropName": contract.crop.crop_name,
                "quantity": contract.quantity,
                "pricePerUnit": contract.nego_price,
                "totalAmount": contract.quantity * contract.nego_price,
                "orderId": str(contract.contract_id)[:8],
                "contractId": str(contract.contract_id),
                "deliveryDate": contract.delivery_date.strftime("%Y-%m-%d"),
                "deliveryLocation": contract.delivery_address,
                "agreementDate": "2025-04-10",
                "additionalConditions": "\n".join(contract.terms or []),
            }

            files = {
                "farmerSignature": farmer_profile.signature,
                "customerSignature": contractor_profile.signature,
            }

            # response = requests.post(
            #     "http://localhost:6000/api/contracts/create",
            #     data=payload,
            #     files=files,
            # )

            # if response.status_code != 200:
            #     print("PDF generation failed:", response.text)
            #     return False

            contract.status = True
            contract.save()

            pdf_name = f"contract_{contract.contract_id}.pdf"
            contract_doc = models.ContractDoc(contract=contract)
            # contract_doc.document.save(pdf_name, ContentFile(response.content))
            contract_doc.save()

            return True
        except Exception as e:
            print("Error approving contract:", e)
            return False

    async def contract_notification(self, event):
        contracts = await self.get_contracts()
        await self.send_json({"data": contracts})
