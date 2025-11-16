from django.db import models
from user.models import CustomUser
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class ChatRoom(models.Model):
    name = models.CharField()
    participants = models.ManyToManyField(CustomUser,related_name='chat_rooms')

class ChatMessage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications")
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="sent_notifications")
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"notifications_{self.user.id}",
            {"type": "send_notification", "message": {"message": self.message, "timestamp": str(self.timestamp)}},
        )