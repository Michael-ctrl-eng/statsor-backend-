"""
Example usage of the Groq API with OpenAI-like interface
This file shows exactly the code structure you requested
"""

import os
import openai

# Set your API key directly in the environment
os.environ["GROQ_API_KEY"] = "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"

# This is the exact code structure you requested
client = openai.OpenAI(
  base_url="https://api.groq.com/openai/v1",
  api_key=os.environ.get("GROQ_API_KEY")
)

# Example usage
def main():
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
        print("Note: This example requires the actual openai package to work.")
        print("For a working implementation, please use the final_groq_integration.py file.")

if __name__ == "__main__":
    main()