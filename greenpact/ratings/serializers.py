from rest_framework.serializers import ModelSerializer,SerializerMethodField
from rest_framework import serializers
from . import models
from user.models import CustomUser


class RatingSerializer(ModelSerializer):
    rated_user = SerializerMethodField()
    rating_user = SerializerMethodField()
    class Meta:
        model=models.Rating
        fields='__all__'
    
    def get_rated_user(self, obj):
        return obj.rated_user.username

    def get_rating_user(self, obj):
        return obj.rating_user.username

    def to_representation(self, instance):
        """ Ensure the full URL of rating image is included in the GET response. """
        data = super().to_representation(instance)
        if instance.images:
            data['images'] = instance.images.url
        return data
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['rating_user'] = request.user
            rated_user_username = request.data.get('rated_user')
            try:
                validated_data['rated_user'] = CustomUser.objects.get(username=rated_user_username)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError({"rated_user": "User not found."})
        return super().create(validated_data)