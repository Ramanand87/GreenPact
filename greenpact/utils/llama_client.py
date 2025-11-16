from openai import OpenAI
from django.conf import settings

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.GREENBOT_API_KEY,
)

def call_llama(messages):
    completion = client.chat.completions.create(
        model="meta-llama/llama-3.3-8b-instruct:free",
        extra_headers={
            "HTTP-Referer": "http://localhost:8000",
            "X-Title": "My Django DRF App",
        },
        messages=messages,
    )
    return completion.choices[0].message.content
