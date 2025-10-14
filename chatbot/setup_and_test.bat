@echo off
echo Setting up Node.js environment for Groq API integration...
cd /d "c:\Users\JOE\Downloads\teamplaymate-16-master\chatbot"

echo Installing required packages...
npm install openai dotenv

echo Running the test...
node simple_node_test.js

echo Done!
pause