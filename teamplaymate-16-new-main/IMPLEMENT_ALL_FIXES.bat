@echo off
echo ================================================
echo StatSor AI Assistant - Complete Fix Implementation
echo ================================================
echo.

echo 1. Checking if Docker is installed...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or not in PATH
    echo    Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    echo.
    echo    Alternatively, you can run services manually:
    echo    - Run start-all-services.bat to start all services manually
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Docker is installed
)

echo.
echo 2. Building and starting all services with Docker...
docker-compose up --build -d
if %errorlevel% neq 0 (
    echo ❌ Failed to start Docker services
    echo    Please check Docker is running and you have sufficient permissions
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Docker services started successfully
)

echo.
echo 3. Waiting for services to initialize...
timeout /t 15 /nobreak >nul

echo.
echo 4. Verifying services are running...
docker-compose ps
echo.

echo.
echo ================================================
echo FIX IMPLEMENTATION COMPLETE
echo ================================================
echo.
echo Services should now be accessible at:
echo 🔵 Frontend: http://localhost:3006
echo 🟢 Backend API: http://localhost:3001
echo 🤖 AI Assistant Backend: http://localhost:5000
echo.
echo To test the AI assistant:
echo 1. Open your browser and go to http://localhost:3006
echo 2. Navigate to the AI Assistant section
echo 3. Try sending a message like "Analyze my team data"
echo.
echo To stop services later, run: docker-compose down
echo.
echo For manual installation, see AI_ASSISTANT_STARTUP_GUIDE.md
echo.
pause