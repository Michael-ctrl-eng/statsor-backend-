#!/usr/bin/env python3
"""
Test script for the Groq API integration using OpenAI library
"""

import os
from groq_integration import GroqIntegration

def test_groq_integration():
    """Test the Groq integration"""
    try:
        # Initialize the Groq integration
        groq = GroqIntegration()
        print("Groq API key loaded successfully")
        print(f"Using model: {groq.model}")
        
        # Test prompt
        test_prompt = "Hello, this is a test message. Please respond with a short greeting."
        
        # Test non-streaming response
        print("\nTesting non-streaming response:")
        response = groq.generate_response(test_prompt)
        if response:
            print(f"Response: {response}")
        else:
            print("Failed to get response")
        
        return True
        
    except Exception as e:
        print(f"Error testing Groq integration: {e}")
        return False

if __name__ == "__main__":
    print("Testing Groq API Integration with OpenAI library...")
    print("=" * 50)
    
    success = test_groq_integration()
    
    print("\n" + "=" * 50)
    if success:
        print("✅ Test completed successfully!")
    else:
        print("❌ Test failed!")