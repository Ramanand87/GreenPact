from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import models
from . import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from uuid import uuid4

class MessagesView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request,pk):
        try:
            messages = models.ChatMessage.objects.filter(chatroom_name=pk)
            data = [{'sender': msg.sender.username, 'content': msg.content, 'timestamp': msg.timestamp} for msg in messages]
            return Response({'data':data},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_200_OK)


class ChatRoomView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
 
    def get(self, request):
        try:
            rooms = models.ChatRoom.objects.filter(participants=request.user)
            serial = serializers.ChatRoomSerializer(rooms, many=True,context={"request": request})
            return Response({'data': serial.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            username = request.data.get('username')
            if not username:
                return Response({'Error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

            roomname = str(uuid4())

            new_user = models.CustomUser.objects.get(username=username)

            chat_room = models.ChatRoom.objects.create(name=roomname)
            chat_room.participants.add(request.user, new_user)

            return Response({'Success': 'Room Created', 'name': roomname}, status=status.HTTP_201_CREATED)

        except models.CustomUser.DoesNotExist:
            return Response({'Error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UnreadNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            notifications = models.Notification.objects.filter(user=request.user, is_read=False)
            serializer = serializers.NotificationSerializer(notifications, many=True)
            return Response({"notifications": serializer.data}) 
        except Exception as e:
            return Response({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class MarkNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):
        try:
            notification = models.Notification.objects.get(id=notification_id, user=request.user)
            notification.is_read = True
            notification.save()
            return Response({"message": "Notification marked as read"})
        except models.Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=404)
