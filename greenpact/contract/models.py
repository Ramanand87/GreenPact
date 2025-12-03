from django.db import models
from user.models import CustomUser
import uuid
from crops.models import Crops
from django.contrib.postgres.fields import ArrayField
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from cloudinary.models import CloudinaryField

class Contract(models.Model):
    contract_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(CustomUser, related_name="farmer_contracts", on_delete=models.CASCADE)
    buyer = models.ForeignKey(CustomUser, related_name="buyer_contracts", on_delete=models.CASCADE)
    crop = models.ForeignKey(Crops, related_name="crop_detail", on_delete=models.CASCADE)
    nego_price = models.IntegerField()
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    delivery_address = models.TextField()
    delivery_date = models.DateField()
    terms = ArrayField(models.TextField(), blank=True, default=list)
    status = models.BooleanField(default=False)
    # pdf_document = models.FileField(upload_to="contracts_pdfs/", null=True, blank=True)
    def __str__(self):
        return f"Contract {self.farmer} & {self.buyer}"

    def _notify_counts(self, farmer_delta=0, buyer_delta=0):
        channel_layer = get_channel_layer()
        if not channel_layer:
            return

        farmer_contracts_count = (
            Contract.objects.filter(farmer=self.farmer).count() + farmer_delta
        )
        buyer_contracts_count = (
            Contract.objects.filter(buyer=self.buyer).count() + buyer_delta
        )

        async_to_sync(channel_layer.group_send)(
            f"contract_{self.farmer.username}",
            {"type": "contract_notification", "contract": max(0, farmer_contracts_count)},
        )

        async_to_sync(channel_layer.group_send)(
            f"contract_{self.buyer.username}",
            {"type": "contract_notification", "contract": max(0, buyer_contracts_count)},
        )

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        self._notify_counts()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self._notify_counts(farmer_delta=-1, buyer_delta=-1)

class Transaction(models.Model):
    contract=models.ForeignKey(Contract,on_delete=models.CASCADE)
    receipt=models.FileField(upload_to="receipts")
    description=models.TextField(blank=True)
    date=models.DateField()
    amount=models.IntegerField(default=0)
    reference_number=models.CharField(max_length=255)

    def __str__(self):
        return f'receipt of {self.contract.contract_id}'
    
class FarmerProgress(models.Model):
    farmer=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    contract=models.ForeignKey(Contract,on_delete=models.CASCADE,null=True)
    current_status=models.CharField(max_length=255)
    date=models.DateField()
    notes=models.TextField(blank=True)
    image = CloudinaryField('image', folder='progess/image/', null=True, blank=True)

    def __str__(self):
        return f'{self.current_status} by {self.farmer.username}'

