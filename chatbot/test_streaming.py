"""
Test script to verify streaming functionality
"""

from final_groq_integration import call_groq_api

def test_streaming():
    """Test the streaming functionality"""
    print("Testing streaming response:")
    
    # Test prompt
    test_prompt = "Please tell me a short story about a football player."
    
    # Get streaming response
    response = call_groq_api(test_prompt)
    if response:
        print(f"Response: {response}")
        print("Streaming test completed successfully!")
        return True
    else:
        print("Failed to get streaming response")
        return False

if __name__ == "__main__":
    test_streaming()