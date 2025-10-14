import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize the Groq client
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "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",
  baseURL: "https://api.groq.com/openai/v1"
});

async function callGroqAPI(prompt, systemMessage = "You are a helpful football assistant.", temperature = 0.7, maxTokens = 1000) {
  try {
    const completion = await client.chat.completions.create({
      model: "gemma2-9b-it",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: temperature,
      max_tokens: maxTokens,
      top_p: 1,
      stream: false,
      stop: null,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return null;
  }
}

async function testGroqAPI() {
  try {
    console.log("Testing Groq API Integration...");
    console.log("=".repeat(50));

    // Test prompt
    const testPrompt = "Hello, this is a test message. Please respond with a short greeting.";

    // Test non-streaming response
    console.log("Testing non-streaming response:");
    const response = await callGroqAPI(testPrompt);
    if (response) {
      console.log(`Response: ${response}`);
      console.log("Success! The Groq API integration is working correctly.");
      return true;
    } else {
      console.log("Failed to get response");
      return false;
    }
  } catch (error) {
    console.error("Error testing Groq API:", error);
    return false;
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testGroqAPI().then(success => {
    console.log("\n" + "=".repeat(50));
    if (success) {
      console.log("✅ Test completed successfully!");
    } else {
      console.log("❌ Test failed!");
    }
  });
}

export { callGroqAPI };