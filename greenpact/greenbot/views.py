from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utils.llama_client import call_llama

class GreenBotChatView(APIView):
    def post(self, request):
        user_message = request.data.get("message")
        history = request.data.get("history", [])

        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            *history,
            {"role": "user", "content": user_message},
        ]

        try:
            reply = call_llama(messages)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "reply": reply,
            "history": [
                *history,
                {"role": "user", "content": user_message},
                {"role": "assistant", "content": reply},
            ]
        })