import os
import openai

# Set the API key directly in the environment for testing
os.environ["GROQ_API_KEY"] = "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"

client = openai.OpenAI(
  base_url="https://api.groq.com/openai/v1",
  api_key=os.environ.get("GROQ_API_KEY")
)

def call_groq_api(prompt, system_message="You are a helpful football assistant.", temperature=0.7, max_tokens=1000):
    """Call Groq API using OpenAI library"""
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
        print("Testing Groq API Integration with OpenAI library...")
        print("=" * 50)
        
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
    
    print("\n" + "=" * 50)
    if success:
        print("✅ Test completed successfully!")
    else:
        print("❌ Test failed!")