"""
Verification script for the Groq API integration
"""

import os
import requests
import json

# Set your API key directly in the environment
GROQ_API_KEY = "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"

def verify_integration():
    """Verify the Groq API integration is working"""
    try:
        print("Verifying Groq API integration...")
        print("=" * 50)
        
        # Test the API directly
        url = "https://api.groq.com/openai/v1/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "gemma2-9b-it",
            "messages": [
                {
                    "role": "user",
                    "content": "Hello, this is a test message. Please respond with a short greeting."
                }
            ],
            "temperature": 0.7,
            "max_tokens": 1000,
            "top_p": 1,
            "stream": False
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        
        print("✅ API Connection: SUCCESS")
        print(f"✅ Model Used: {result['model']}")
        print(f"✅ Response: {result['choices'][0]['message']['content']}")
        
        print("\n" + "=" * 50)
        print("✅ All verifications passed! The integration is working correctly.")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n" + "=" * 50)
        print("❌ Verification failed!")
        return False

if __name__ == "__main__":
    verify_integration()