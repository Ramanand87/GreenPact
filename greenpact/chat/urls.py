from django.urls import path
from . import views
urlpatterns = [
    path('<str:pk>',views.MessagesView.as_view()),
    path('',views.MessagesView.as_view()),
    path('create/',views.ChatRoomView.as_view()),
    path('rooms/',views.ChatRoomView.as_view()),
    path("unread-notifications/", views.UnreadNotificationsView.as_view(), name="unread-notifications"),
]
