from openai import OpenAI
from django.conf import settings

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.GREENBOT_API_KEY,
)

def call_gpt_oss(messages):
    completion = client.chat.completions.create(
        model="openai/gpt-oss-20b:free",
        messages=messages,
        extra_headers={
            "HTTP-Referer": "http://localhost:8000",
            "X-Title": "GreenBot Chat API"
        }
    )
    return completion.choices[0].message.content
