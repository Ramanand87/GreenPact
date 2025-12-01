from django.db import models
from user.models import CustomUser

class Complaint(models.Model):
    complainant = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="complaints_filed")
    accused = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name="complaints_against")
    category = models.CharField(max_length=30,default="fraud")
    description = models.TextField()
    proof = models.FileField(upload_to="complaint_proofs/", blank=True, null=True)
    priority = models.CharField(max_length=10, default="Low")
    status = models.CharField(max_length=20,default="pending") 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.category} - {self.complainant.username}"
