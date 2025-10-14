import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "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",
  baseURL: "https://api.groq.com/openai/v1"
});

async function testGroqAPI() {
  try {
    console.log("Testing Groq API Integration...");
    console.log("=".repeat(50));

    const completion = await client.chat.completions.create({
      model: "gemma2-9b-it",
      messages: [
        {
          role: "user",
          content: "Hello, this is a test message. Please respond with a short greeting."
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log("Response:", completion.choices[0].message.content);
    console.log("Success! The Groq API integration is working correctly.");
  } catch (error) {
    console.error("Error:", error);
  }
}

testGroqAPI();