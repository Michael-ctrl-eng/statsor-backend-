#!/usr/bin/env python3
"""
Groq API integration module for the AI Football Assistant.
This module provides a proper integration with the Groq API using the official Python library.
"""

import os
import json
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GroqIntegration:
    def __init__(self):
        """Initialize the Groq client with API key from environment variables"""
        self.api_key = os.getenv('GROQ_API_KEY')
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.client = Groq(api_key=self.api_key)
        
        # Use a model that is currently supported by Groq
        # Based on our previous tests, gemma2-9b-it seems to work
        self.model = "gemma2-9b-it"
    
    def generate_response(self, prompt, system_message="You are a helpful football assistant.", temperature=0.7, max_tokens=1500):
        """
        Generate a response using the Groq API
        
        Args:
            prompt (str): The user's input prompt
            system_message (str): System message to guide the AI behavior
            temperature (float): Controls randomness (0.0 to 1.0)
            max_tokens (int): Maximum number of tokens in the response
            
        Returns:
            str: The generated response or None if there was an error
        """
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
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
            # Return a more detailed error message for debugging
            return f"I'm experiencing technical difficulties with my AI processing. Error: {str(e)}"
    
    def generate_streaming_response(self, prompt, system_message="You are a helpful football assistant.", temperature=0.7, max_tokens=1000):
        """
        Generate a streaming response using the Groq API
        
        Args:
            prompt (str): The user's input prompt
            system_message (str): System message to guide the AI behavior
            temperature (float): Controls randomness (0.0 to 1.0)
            max_tokens (int): Maximum number of tokens in the response
            
        Yields:
            str: Chunks of the generated response
        """
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
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
                stream=True,
                stop=None,
                frequency_penalty=0,
                presence_penalty=0
            )
            
            for chunk in completion:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            yield f"Error: {str(e)}"

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
        
        # Test streaming response
        print("\nTesting streaming response:")
        for chunk in groq.generate_streaming_response(test_prompt):
            print(chunk, end="", flush=True)
        print("\n")
        
        return True
        
    except Exception as e:
        print(f"Error testing Groq integration: {e}")
        return False

if __name__ == "__main__":
    test_groq_integration()