@echo off
echo Starting StatSor Services...
echo.

echo 1. Starting Frontend Development Server...
start "Frontend Server" cmd /k "npx vite"
timeout /t 5 /nobreak >nul

echo 2. Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"
timeout /t 5 /nobreak >nul

echo 3. Starting AI Assistant (Python chatbot)...
start "AI Assistant" cmd /k "cd chatbot && python app.py"

echo.
echo All services started!
echo.
echo Frontend: http://localhost:3008
echo Backend: http://localhost:3001
echo AI Assistant: http://localhost:5000
echo.
echo Press any key to exit...
pause >nul