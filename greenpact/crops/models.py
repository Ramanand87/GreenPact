from django.db import models
from user.models import CustomUser
import uuid
from datetime import datetime    
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

class Crops(models.Model):
    crop_id=models.UUIDField(primary_key = True,default=uuid.uuid4,editable=False)
    crop_name=models.CharField(max_length=256) 
    publisher=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    crop_image = CloudinaryField('image', folder='crop/image/', null=True, blank=True)
    crop_price=models.IntegerField()
    quantity=models.IntegerField()
    Description=models.TextField(max_length=200)
    harvested_time=models.DateField()
    location=models.TextField(max_length=150)
