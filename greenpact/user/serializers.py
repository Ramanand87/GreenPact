from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer, ValidationError
from . import models
from rest_framework import serializers
from django.conf import settings
from django.db import transaction


class userSerializers(ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ["username", "email", "password","date_joined"]
        extra_kwargs = {"password": {"write_only": True}}

    def get_role(self, obj):
        return obj.type 

    def validate(self, data):
        if models.CustomUser.objects.filter(username=data.get("username")).exists():
            raise ValidationError({'error': 'CustomUsername already taken'})
        elif models.FarmerProfile.objects.filter(phoneno=self.initial_data.get("phoneno")).exists() or \
             models.ContractorProfile.objects.filter(phoneno=self.initial_data.get("phoneno")).exists():
            raise ValidationError({'error': 'Phone no already taken'})
        elif not self.initial_data.get("signature"):
            raise ValidationError({'error': 'Signature is required'})
        elif not self.initial_data.get("aadhar_image"):
            raise ValidationError({'error': 'Aadhaar image is required'})
        return data

    def create(self, validated_data):
        with transaction.atomic():
            user = models.CustomUser(username=validated_data["username"], type=self.initial_data.get("role"))
            user.set_password(validated_data["password"])
            user.save()

            profile_data = {
                "name": self.initial_data.get("name"),
                "phoneno": self.initial_data.get("phoneno"),
                "address": self.initial_data.get("address"),
                "image": self.initial_data.get("image"),
                "aadhar_image":self.initial_data.get("aadhar_image"),
                "user": user
            }
            if user.type == "farmer":
                profile_data["screenshot"] = self.initial_data.get("screenshot")
                profile_data["signature"] = self.initial_data.get("signature")
                if not self.initial_data.get("qr_code_image"):
                    raise ValidationError({'error': 'Farmer QR code image is required'})
                else :
                    profile_data["qr_code_image"] = self.initial_data.get("qr_code_image")
                models.FarmerProfile.objects.create(**profile_data)
            elif user.type == "contractor":
                profile_data["gstin"] = self.initial_data.get("gstin")
                profile_data["signature"] = self.initial_data.get("signature")
                models.ContractorProfile.objects.create(**profile_data)
            return user
        return None

class FarmerProfileSerializer(ModelSerializer):
    user = userSerializers()
    class Meta:
        model = models.FarmerProfile 
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if request:
            for field in ['image', 'screenshot', 'aadhar_image', 'signature', 'qr_code_image']:
                file_field = getattr(instance, field, None)
                if file_field and hasattr(file_field, 'url'):
                    representation[field] = request.build_absolute_uri(file_field.url)
        return representation

class ContractorProfileSerializer(ModelSerializer):
    user = userSerializers()

    class Meta: 
        model = models.ContractorProfile
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        print(f"DEBUG: ContractorProfileSerializer to_representation called for {instance}")
        print(f"DEBUG: request is {request}")
        if request:
            for field in ['image', 'aadhar_image', 'signature']:
                file_field = getattr(instance, field, None)
                if file_field and hasattr(file_field, 'url'):
                    try:
                        abs_url = request.build_absolute_uri(file_field.url)
                        print(f"DEBUG: Converting {field} url {file_field.url} to {abs_url}")
                        representation[field] = abs_url
                    except Exception as e:
                        print(f"DEBUG: Error converting {field}: {e}")
        return representation
