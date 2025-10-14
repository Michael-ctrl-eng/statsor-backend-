import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_groq_integration():
    """Test the Groq API integration"""
    groq_api_key = os.getenv('GROQ_API_KEY')
    
    if not groq_api_key:
        print("ERROR: GROQ_API_KEY not found in environment variables")
        return False
    
    print(f"Groq API Key loaded: {groq_api_key[:10]}...{groq_api_key[-10:]}")
    
    # Test Groq API directly
    test_prompt = "Hello, this is a test message. Please respond with a short greeting."
    
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "gemma2-9b-it",
        "messages": [
            {"role": "user", "content": test_prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 100
    }
    
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            print("Groq API test successful!")
            print(f"Response: {result['choices'][0]['message']['content']}")
            return True
        else:
            print(f"Groq API test failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"Error testing Groq API: {e}")
        return False

def test_chatbot_endpoint():
    """Test the chatbot endpoint"""
    try:
        # Test health endpoint
        print("Testing health endpoint...")
        response = requests.get('http://localhost:5000/health')
        if response.status_code == 200:
            print("✓ Health check passed")
            print(f"  Response: {response.json()}")
        else:
            print(f"✗ Health check failed with status {response.status_code}")
            return False
            
        # Test chat endpoint
        print("\nTesting chat endpoint...")
        test_message = "Tell me about my players"
        response = requests.post('http://localhost:5000/api/chat', 
                                json={"message": test_message, "context": {}})
        if response.status_code == 200:
            print("✓ Chat endpoint passed")
            data = response.json()
            print(f"  Message: {test_message}")
            print(f"  Response: {data['response']}")
            print(f"  Intent: {data.get('intent', 'N/A')}")
            return True
        else:
            print(f"✗ Chat endpoint failed with status {response.status_code}")
            print(f"  Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Chat endpoint test failed with error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Groq API Integration...")
    print("=" * 50)
    
    # Test Groq API
    groq_success = test_groq_integration()
    
    print("\n" + "=" * 50)
    
    # Test chatbot endpoint
    chatbot_success = test_chatbot_endpoint()
    
    print("\n" + "=" * 50)
    print("Test Summary:")
    print(f"Groq API Integration: {'✓ PASS' if groq_success else '✗ FAIL'}")
    print(f"Chatbot Endpoint: {'✓ PASS' if chatbot_success else '✗ FAIL'}")
    
    if groq_success and chatbot_success:
        print("\n🎉 All tests passed! The chatbot is ready to use.")
    else:
        print("\n❌ Some tests failed. Please check the errors above.")