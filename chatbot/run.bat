@echo off
echo Starting AI Football Assistant chatbot...
set FLASK_APP=app.py
set FLASK_ENV=development
set FLASK_RUN_HOST=0.0.0.0
set FLASK_RUN_PORT=5000
python -m flask run
echo ======================================

cd /d "%~dp0"

echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.7 or higher and add it to your PATH
    pause
    exit /b 1
)

echo Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo Downloading spaCy English model...
python -m spacy download en_core_web_sm
if %errorlevel% neq 0 (
    echo Error: Failed to download spaCy English model
    pause
    exit /b 1
)

echo Starting chatbot service...
echo The chatbot will be available at http://localhost:5000
python app.py

pause