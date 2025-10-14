"""
Simple streaming test for the Groq API integration
"""

import os
import requests
import json

# Set your API key directly in the environment
GROQ_API_KEY = "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"

def test_streaming():
    """Test streaming response from Groq API"""
    try:
        print("Testing streaming response from Groq API...")
        print("=" * 50)
        
        # Test the API directly with streaming
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
                    "content": "Please tell me a very short story about a football player in exactly one sentence."
                }
            ],
            "temperature": 0.7,
            "max_tokens": 1000,
            "top_p": 1,
            "stream": True
        }
        
        print("Streaming response:")
        with requests.post(url, headers=headers, json=data, stream=True) as response:
            response.raise_for_status()
            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8')
                    if decoded_line.startswith("data: "):
                        data_line = decoded_line[6:]  # Remove "data: " prefix
                        if data_line != "[DONE]":
                            try:
                                json_data = json.loads(data_line)
                                content = json_data["choices"][0]["delta"].get("content", "")
                                if content:
                                    print(content, end="", flush=True)
                            except (json.JSONDecodeError, KeyError):
                                # Skip malformed JSON or missing keys
                                continue
        print("\n")  # New line after streaming
        
        print("\n" + "=" * 50)
        print("✅ Streaming test completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n" + "=" * 50)
        print("❌ Streaming test failed!")
        return False

if __name__ == "__main__":
    test_streaming()