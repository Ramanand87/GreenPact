from django.db import models
from user.models import CustomUser
import uuid

class Demand(models.Model):
    demand_id=models.UUIDField(primary_key = True,default=uuid.uuid4,editable=False)
    crop_name=models.CharField(max_length=256) 
    demand_user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    crop_price=models.IntegerField()
    contact_no=models.CharField(max_length=10) 
    quantity=models.IntegerField()
    description=models.TextField(max_length=200)
    location=models.TextField(max_length=150)
    harvested_time=models.DateField()

    def __str__(self):
        return f'{self.crop_name} demanded by {self.demand_user.username}'