from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from . import models
from user.models import FarmerProfile
from user.serializers import userSerializers,FarmerProfileSerializer

class CropsSerializer(ModelSerializer):
    publisher=userSerializers(read_only=True)
    publisher_profile = serializers.SerializerMethodField()
    class Meta:
        model=models.Crops
        fields='__all__'

    def get_publisher_profile(self, obj):
        contractor_profile = FarmerProfile.objects.filter(user=obj.publisher).first()
        if contractor_profile:
            return FarmerProfileSerializer(contractor_profile).data
        return None
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['publisher'] = request.user
        return super().create(validated_data)
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if request:
            if representation.get('publisher_profile'):
                # Fix for publisher profile image (Cloudinary)
                contractor_profile = FarmerProfile.objects.filter(user=instance.publisher).first()
                if contractor_profile and contractor_profile.image:
                    try:
                        representation['publisher_profile']['image'] = contractor_profile.image.url
                    except Exception:
                        pass
                
                # Fallback for local development if not Cloudinary
                image_url = representation['publisher_profile'].get('image')
                if image_url and not image_url.startswith('http'):
                    representation['publisher_profile']['image'] = request.build_absolute_uri(image_url)
            
            # Fix for Cloudinary image URL
            if instance.crop_image:
                try:
                    representation['crop_image'] = instance.crop_image.url
                except Exception:
                    pass

            crop_image_url = representation.get('crop_image')
            if crop_image_url and not crop_image_url.startswith('http'):
                representation['crop_image'] = request.build_absolute_uri(crop_image_url)
        return representation