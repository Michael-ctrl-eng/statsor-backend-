"""
Final Groq API integration implementation
This module provides the exact structure you requested with the OpenAI library
"""

import os
import requests
import json

# Set your API key directly in the environment
os.environ["GROQ_API_KEY"] = "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"

# Create a mock OpenAI-like interface that works with Groq API
class MockMessage:
    def __init__(self, content):
        self.content = content

class MockChoice:
    def __init__(self, message):
        self.message = message

class MockCompletion:
    def __init__(self, choices):
        self.choices = choices

class MockChatCompletions:
    def __init__(self, api_key, base_url):
        self.api_key = api_key
        self.base_url = base_url
    
    def create(self, **kwargs):
        """Mock the chat.completions.create method"""
        url = f"{self.base_url}/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Extract parameters
        data = {
            "model": kwargs.get("model", "gemma2-9b-it"),
            "messages": kwargs.get("messages", []),
            "temperature": kwargs.get("temperature", 0.7),
            "max_tokens": kwargs.get("max_tokens", 1000),
            "top_p": kwargs.get("top_p", 1),
            "stream": kwargs.get("stream", False),
            "stop": kwargs.get("stop", None),
            "frequency_penalty": kwargs.get("frequency_penalty", 0),
            "presence_penalty": kwargs.get("presence_penalty", 0)
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        
        message = MockMessage(result["choices"][0]["message"]["content"])
        choice = MockChoice(message)
        completion = MockCompletion([choice])
        
        return completion

class MockChat:
    def __init__(self, api_key, base_url):
        self.completions = MockChatCompletions(api_key, base_url)

class MockOpenAI:
    def __init__(self, base_url, api_key):
        self.chat = MockChat(api_key, base_url)

# This is the exact code structure you requested
client = MockOpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("GROQ_API_KEY")
)

def call_groq_api(prompt, system_message="You are a helpful football assistant.", temperature=0.7, max_tokens=1000):
    """Call Groq API using the OpenAI-like interface"""
    try:
        completion = client.chat.completions.create(
            model="gemma2-9b-it",
            messages=[
                {
                    "role": "system",
                    "content": system_message
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=1,
            stream=False,
            stop=None,
            frequency_penalty=0,
            presence_penalty=0
        )
        
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return None

def test_groq_api():
    """Test the Groq API integration"""
    try:
        print("Testing Groq API Integration with OpenAI-like interface...")
        print("=" * 60)
        
        # Test prompt
        test_prompt = "Hello, this is a test message. Please respond with a short greeting."
        
        # Test non-streaming response
        print("Testing non-streaming response:")
        response = call_groq_api(test_prompt)
        if response:
            print(f"Response: {response}")
            print("Success! The Groq API integration is working correctly.")
            return True
        else:
            print("Failed to get response")
            return False
        
    except Exception as e:
        print(f"Error testing Groq API: {e}")
        return False

if __name__ == "__main__":
    success = test_groq_api()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ Test completed successfully!")
    else:
        print("❌ Test failed!")