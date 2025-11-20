from rest_framework.serializers import ModelSerializer
from . import models
from user.models import FarmerProfile,ContractorProfile
from user.serializers import userSerializers,FarmerProfileSerializer,ContractorProfileSerializer
from rest_framework import serializers

class MessageSerializer(ModelSerializer):
    class Meta:
        model=models.ChatMessage
        fields='__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Notification
        fields = ['sender', 'message', 'is_read', 'timestamp']

class ChatRoomSerializer(ModelSerializer):
    chat_user= serializers.SerializerMethodField()
    profile=serializers.SerializerMethodField()
    class Meta:
        model=models.ChatRoom
        fields=["name","chat_user","profile"]

    def get_chat_user(self, obj):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            other_users = obj.participants.exclude(id=request.user.id)
            if other_users.exists():
                return other_users.first().username
        return None
    
    def get_profile(self,obj):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            other_users = obj.participants.exclude(id=request.user.id)
            if not other_users.exists():
                return None
            role=other_users.first().type
            if role=="farmer":
                prof=FarmerProfile.objects.get(user=other_users.first())
                serial=FarmerProfileSerializer(prof).data
                return {"name":serial["name"],"image":serial["image"]}
            else:
                prof=ContractorProfile.objects.get(user=other_users.first())
                serial=ContractorProfileSerializer(prof).data
                return {"name":serial["name"],"image":serial["image"]}
        return None
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get("request")
        if request:
            profile_data = representation.get('profile')
            if profile_data:
                image_url = profile_data.get('image')
                if image_url and not image_url.startswith('http'):
                    profile_data['image'] = request.build_absolute_uri(image_url)
        return representation