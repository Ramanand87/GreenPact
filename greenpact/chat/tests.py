from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from chat.models import ChatRoom, ChatMessage, Notification
from user.models import CustomUser


class ChatRoomModelTests(TestCase):
    """Test cases for ChatRoom model"""

    def setUp(self):
        self.user1 = CustomUser.objects.create_user(
            username="user1", password="testpass123", type=CustomUser.Types.FARMER
        )
        self.user2 = CustomUser.objects.create_user(
            username="user2", password="testpass123", type=CustomUser.Types.CONTRACTOR
        )
        self.chat_room = ChatRoom.objects.create(name="room123")
        self.chat_room.participants.add(self.user1, self.user2)

    def test_chat_room_creation(self):
        """Test chat room is created successfully"""
        self.assertEqual(self.chat_room.name, "room123")
        self.assertEqual(self.chat_room.participants.count(), 2)

    def test_chat_room_participants(self):
        """Test chat room has correct participants"""
        participants = self.chat_room.participants.all()
        self.assertIn(self.user1, participants)
        self.assertIn(self.user2, participants)


class ChatMessageModelTests(TestCase):
    """Test cases for ChatMessage model"""

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser", password="testpass123", type=CustomUser.Types.FARMER
        )
        self.chat_room = ChatRoom.objects.create(name="room123")
        self.chat_room.participants.add(self.user)
        self.message = ChatMessage.objects.create(
            user=self.user,
            room=self.chat_room,
            content="Hello World"
        )

    def test_message_creation(self):
        """Test message is created successfully"""
        self.assertEqual(self.message.content, "Hello World")
        self.assertEqual(self.message.user, self.user)
        self.assertEqual(self.message.room, self.chat_room)
        self.assertIsNotNone(self.message.timestamp)


class NotificationModelTests(TestCase):
    """Test cases for Notification model"""

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="receiver", password="testpass123", type=CustomUser.Types.FARMER
        )
        self.sender = CustomUser.objects.create_user(
            username="sender", password="testpass123", type=CustomUser.Types.CONTRACTOR
        )
        self.chat_room = ChatRoom.objects.create(name="room123")
        self.chat_room.participants.add(self.user, self.sender)

    def test_notification_default_unread(self):
        """Test notification is unread by default"""
        notification = Notification.objects.create(
            user=self.user,
            sender=self.sender,
            room=self.chat_room,
            message="New message"
        )
        self.assertFalse(notification.is_read)


class ChatRoomViewTests(APITestCase):
    """Test cases for ChatRoom API views"""

    def setUp(self):
        self.client = APIClient()
        self.user1 = CustomUser.objects.create_user(
            username="user1", password="testpass123", type=CustomUser.Types.FARMER
        )
        self.user2 = CustomUser.objects.create_user(
            username="user2", password="testpass123", type=CustomUser.Types.CONTRACTOR
        )
        self.client.force_authenticate(user=self.user1)

    def test_get_chat_rooms(self):
        """Test getting chat rooms for authenticated user"""
        chat_room = ChatRoom.objects.create(name="room123")
        chat_room.participants.add(self.user1, self.user2)
        
        url = '/chat/rooms/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)

    def test_create_chat_room(self):
        """Test creating a new chat room"""
        url = '/chat/create/'
        data = {'username': 'user2'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('name', response.data)

    def test_create_chat_room_invalid_user(self):
        """Test creating chat room with non-existent user"""
        url = '/chat/create/'
        data = {'username': 'nonexistent'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class NotificationViewTests(APITestCase):
    """Test cases for Notification API views"""

    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username="user", password="testpass123", type=CustomUser.Types.FARMER
        )
        self.sender = CustomUser.objects.create_user(
            username="sender", password="testpass123", type=CustomUser.Types.CONTRACTOR
        )
        self.chat_room = ChatRoom.objects.create(name="room123")
        self.notification = Notification.objects.create(
            user=self.user,
            sender=self.sender,
            room=self.chat_room,
            message="Test notification"
        )
        self.client.force_authenticate(user=self.user)

    def test_get_unread_notifications(self):
        \"\"\"Test getting unread notifications\"\"\"
        url = '/chat/unread-notifications/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('notifications', response.data)
