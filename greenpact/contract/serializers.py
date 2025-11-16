# contracts/serializers.py
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from . import models
from user.models import FarmerProfile, CustomUser
from crops.models import Crops


class ContractSerializer(serializers.ModelSerializer):
    farmer_name = serializers.SerializerMethodField()
    buyer_name = serializers.SerializerMethodField()
    crop_name = serializers.SerializerMethodField()
    qr_code = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()   # ✅ NEW
    terms = serializers.ListField(child=serializers.CharField(), required=False)

    class Meta:
        model = models.Contract
        fields = [
            "contract_id",
            "farmer_name",
            "buyer_name",
            "crop_name",
            "nego_price",
            "quantity",
            "created_at",
            "delivery_address",
            "delivery_date",
            "terms",
            "status",
            "qr_code",
            "pdf_url",   # ✅ NEW
        ]

    def get_qr_code(self, obj):
        request = self.context.get("request")
        try:
            prof = FarmerProfile.objects.get(user=obj.farmer)
            if request is not None:
                return request.build_absolute_uri(prof.qr_code_image.url)
            return prof.qr_code_image.url
        except (FarmerProfile.DoesNotExist, AttributeError):
            return obj.farmer.username

    def get_pdf_url(self, obj):
        """
        Return absolute URL for the contract PDF if it exists.
        """
        if not obj.pdf_document:
            return None

        request = self.context.get("request")
        if request is not None:
            return request.build_absolute_uri(obj.pdf_document.url)
        return obj.pdf_document.url

    def get_farmer_name(self, obj):
        try:
            return obj.farmer.farmer_profile.name
        except AttributeError:
            return obj.farmer.username

    def get_buyer_name(self, obj):
        try:
            return obj.buyer.contractor_profile.name
        except AttributeError:
            return obj.buyer.username

    def get_crop_name(self, obj):
        return obj.crop.crop_name

    def create(self, validated_data):
        """
        - buyer = request.user (must NOT be farmer)
        - farmer_username & crop_id come from initial_data
        """
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")

        if request.user.type == "farmer":
            raise serializers.ValidationError(
                "Farmer does not have permission to create contract"
            )

        validated_data["buyer"] = request.user

        farmer_username = self.initial_data.get("farmer_username")
        crop_id = self.initial_data.get("crop_id")

        try:
            validated_data["farmer"] = CustomUser.objects.get(username=farmer_username)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(
                {"farmer_username": "Invalid farmer username"}
            )

        try:
            validated_data["crop"] = Crops.objects.get(crop_id=crop_id)
        except Crops.DoesNotExist:
            raise serializers.ValidationError({"crop_id": "Invalid crop ID"})

        return super().create(validated_data)


class TransactionSerializer(serializers.ModelSerializer):
    buyer = serializers.SerializerMethodField(read_only=True)
    farmer = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.Transaction
        fields = "__all__"
        extra_kwargs = {
            "contract": {"required": False},
        }

    def create(self, validated_data):
        contract_id = self.initial_data.get("contract_id")
        contract = get_object_or_404(models.Contract, contract_id=contract_id)
        validated_data["contract"] = contract
        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if instance.receipt:
            if request:
                data["receipt"] = request.build_absolute_uri(instance.receipt.url)
            else:
                data["receipt"] = instance.receipt.url
        return data

    def get_buyer(self, obj):
        return obj.contract.buyer.username if obj.contract and obj.contract.buyer else None

    def get_farmer(self, obj):
        return obj.contract.farmer.username if obj.contract and obj.contract.farmer else None


class FarmerProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FarmerProgress
        fields = "__all__"
        extra_kwargs = {
            "farmer": {"required": False},
            "contract": {"required": False},
        }

    def create(self, validated_data):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")

        if request.user.type == "contractor":
            raise serializers.ValidationError("Contractor does not have permission")

        validated_data["farmer"] = request.user

        contract_id = self.initial_data.get("contract_id")
        contract = get_object_or_404(models.Contract, contract_id=contract_id)
        validated_data["contract"] = contract

        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            request = self.context.get("request")
            if request:
                data["image"] = request.build_absolute_uri(instance.image.url)
            else:
                data["image"] = instance.image.url
        return data


class TransactionListSerializer(serializers.ModelSerializer):
    contract_id = serializers.UUIDField(source="contract.contract_id", read_only=True)
    buyer_name = serializers.CharField(source="contract.buyer.username", read_only=True)
    receipt = serializers.SerializerMethodField()

    class Meta:
        model = models.Transaction
        fields = [
            "contract_id",
            "buyer_name",
            "receipt",
            "date",
            "amount",
            "reference_number",
            "description",
        ]

    def get_receipt(self, obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.receipt.url)
        return obj.receipt.url
