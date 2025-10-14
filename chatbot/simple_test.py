import os
import openai

# Set the API key directly for testing
client = openai.OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key="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"
)

try:
    completion = client.chat.completions.create(
        model="gemma2-9b-it",
        messages=[
            {
                "role": "user",
                "content": "Hello, this is a test message. Please respond with a short greeting."
            }
        ],
        temperature=0.7,
        max_tokens=1000,
    )
    
    print("Response:", completion.choices[0].message.content)
    print("Success! The Groq API integration is working correctly.")
    
except Exception as e:
    print(f"Error: {e}")