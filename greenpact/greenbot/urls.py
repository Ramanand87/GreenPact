from django.urls import path
from .views import GreenBotChatView

urlpatterns = [
    path("chat/", GreenBotChatView.as_view(), name="greenbot-chat"),
]
