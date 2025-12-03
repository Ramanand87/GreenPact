from rest_framework.serializers import ModelSerializer,SerializerMethodField
from rest_framework import serializers
from . import models
from user.models import CustomUser,FarmerProfile,ContractorProfile

class RatingImageSerializer(ModelSerializer):
    class Meta:
        model=models.RatingImage
        fields='__all__'

    def create(self, validated_data):
        return super().create(validated_data)
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if request:
            if instance.image:
                try:
                    representation['image'] = instance.image.url
                except Exception:
                    pass

            image_url = representation.get('image')
            if image_url and not image_url.startswith('http'):
                representation['image'] = request.build_absolute_uri(image_url)
        return representation

class RatingSerializer(ModelSerializer):
    rating_images = RatingImageSerializer(many=True, read_only=True)
    rated_user = SerializerMethodField()
    rating_user = SerializerMethodField()
    rating_user_image= SerializerMethodField()
    class Meta:
        model=models.Rating
        fields='__all__'
    
    def get_rated_user(self, obj):
        return obj.rated_user.username

    def get_rating_user(self, obj):
        return obj.rating_user.username
    
    def get_rating_user_image(self, obj):
        request = self.context.get('request')
        image_url=None
        if request:
            if obj.rating_user.type=="farmer":
                try:
                    farmerprofile=FarmerProfile.objects.get(user=obj.rating_user)
                    image_url = farmerprofile.image.url
                except Exception:
                    pass
            else:
                try:
                    contractorprofile=ContractorProfile.objects.get(user=obj.rating_user)
                    image_url = contractorprofile.image.url
                except Exception:
                    pass
            if image_url and not image_url.startswith('http'):
                image_url = request.build_absolute_uri(image_url)
        return image_url
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['rating_user'] = request.user
            rated_user_username = request.data.get('rated_user')
            try:
                validated_data['rated_user'] = CustomUser.objects.get(username=rated_user_username)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError({"rated_user": "User not found."})
            rating=super().create(validated_data)
            images = request.FILES.getlist('images')
            for image in images:
                models.RatingImage.objects.create(rating=rating, image=image)
            return rating