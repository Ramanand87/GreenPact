from django.urls import path
from .consumers import ContractConsumer

websocket_urlpatterns = [
    path("ws/contract/", ContractConsumer.as_asgi()),  
]
