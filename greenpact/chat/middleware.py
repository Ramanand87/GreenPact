import jwt
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from user.models import CustomUser  # Import your user model

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token", [None])[0]  # Extract token from URL

        if token:
            scope["user"] = await self.get_user_from_token(token)
        else:
            scope["user"] = AnonymousUser()
        print("Authenticated User:", scope["user"])  
        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            decoded_data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = decoded_data.get("user_id")
            return CustomUser.objects.get(id=user_id)
        except (jwt.ExpiredSignatureError, jwt.DecodeError, CustomUser.DoesNotExist):
            return AnonymousUser()
