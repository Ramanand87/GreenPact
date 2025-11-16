from django.urls import path
from .consumers import NotificationConsumer, ChatConsumer

websocket_urlpatterns = [
    path("ws/notifications/", NotificationConsumer.as_asgi()),  
    path("ws/chat/<str:room_name>/", ChatConsumer.as_asgi()),  # Include ChatConsumer
]
