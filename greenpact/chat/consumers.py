from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import ChatRoom, ChatMessage, Notification
from user.models import CustomUser
from asgiref.sync import sync_to_async,async_to_sync
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
import re
from django.db.models import Count, Max
from django.db.models import Q, Count, Max, Subquery, OuterRef
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        messages = await self.get_chat_history(self.room_name)
        await self.send(text_data=json.dumps({
            'messages': messages
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        username = data['username']

        user = await self.get_user(username)
        room = await self.get_room(self.room_name)

            
        chat_message = await sync_to_async(ChatMessage.objects.create)(
            room=room,
            user=user,
            content=message
        )

        await self.notify_users(room, message, username)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
                'timestamp': chat_message.timestamp.isoformat(),
            }
        )

    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        timestamp = event['timestamp']

        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'timestamp': timestamp,
        }))

    async def notify_users(self, room, message, sender):
        sender_user = await self.get_user(sender)
        participants = await sync_to_async(list)(room.participants.exclude(username=sender))

        for participant in participants:
            await sync_to_async(Notification.objects.create)(
                user=participant,
                sender=sender_user,
                room=room,
                message=message,
                is_read=False
            )
            notification_group_name = f'notifications_{participant.username}'
            await self.channel_layer.group_send(
                notification_group_name,
                {
                    'type': 'send_notification',
                    'message': f'New message in {room.name} from {sender}: {message}',
                    'sender': sender
                }
            )
    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'notification': event['message'],
            'sender': event['sender'],
        }))

    @sync_to_async
    def get_user(self, username):
        return CustomUser.objects.get(username=username)

    @sync_to_async
    def get_room(self, room_name):
        return ChatRoom.objects.get(name=room_name)
 
    @sync_to_async
    def get_chat_history(self, room_name, limit=50):
        room = ChatRoom.objects.get(name=room_name)
        messages = ChatMessage.objects.filter(room=room).order_by('-timestamp').reverse()[:limit]
        return [
            {
                'username': message.user.username,
                'message': message.content,
                'timestamp': message.timestamp.isoformat()
            }
            for message in messages
        ]
    


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.user = None  

    async def receive(self, text_data):
        data = json.loads(text_data)
        token = data.get("token")
        type=data.get("type",None)
        room_name = data.get("room_name", None)
        
        if token:
            self.user = await self.authenticate_user(token)

        if not self.user:
            await self.close()
            return

        if type == "mark_as_read" and room_name:
            await self.mark_notifications_as_read(self.user,room_name)
        
        self.notification_group_name = f'notifications_{self.user.username}'
        await self.channel_layer.group_add(
            self.notification_group_name,
            self.channel_name
        )
        notifications_data = await self.get_unread_notifications(self.user)
        await self.send(text_data=json.dumps(notifications_data))

    async def disconnect(self, close_code):
        if self.user and self.user.is_authenticated:
            await self.channel_layer.group_discard(
                self.notification_group_name,
                self.channel_name
            )

    async def send_notification(self, event):
        pattern = r"New message in (\S+) from \S+: (.+)"
        match = re.search(pattern, event["message"])
        
        if match:
            room_id = match.group(1)
            message = match.group(2)
            notifications_data = await self.get_unread_notifications(self.user)

            await self.send(text_data=json.dumps({
                # "notification": {
                #     "room": room_id,
                #     "message": message
                # },
                # "sender": event["sender"],
                **notifications_data
            }))

    @sync_to_async
    def authenticate_user(self, token):
        try:
            access_token = AccessToken(token)
            return CustomUser.objects.get(id=access_token["user_id"])
        except Exception:
            return None

    @sync_to_async
    def get_unread_notifications(self, user):
        total_unread_count = Notification.objects.filter(user=user, is_read=False).count()
        last_message_subquery = Notification.objects.filter(
            room=OuterRef("room"), user=user
        ).order_by("-timestamp").values("message")[:1]
        last_messages = (
            Notification.objects.filter(user=user)
            .values("room__name")
            .annotate(
                last_message=Subquery(last_message_subquery),  # ✅ Fetch last message
                unread_count=Count("id", filter=Q(is_read=False))  # ✅ Unread count
            )
        )

        last_messages_list = [
            {
                room["room__name"]: {
                    "message": room["last_message"],
                    "unread": room["unread_count"]
                }
            }
            for room in last_messages
        ]

        return {
            "total_unread": total_unread_count,
            "lastmessages": last_messages_list
        }
    async def update_unread_count(self, event):
        await self.send(text_data=json.dumps({
            "type": "notification_update",
            "unread_count": event["unread_count"],
        }))
    
    @sync_to_async
    def mark_notifications_as_read(self, user, room_id):
        query = Notification.objects.filter(user=user, is_read=False)
        if room_id:
            query = query.filter(room__name=room_id)
        query.update(is_read=True)
        unread_count = Notification.objects.filter(user=user, is_read=False).count()



    