@echo off
echo Initializing and pushing Git repository for Statsor platform...
echo.

REM Navigate to project directory
cd /d "c:\Users\JOE\Downloads\teamplaymate-16-master"

REM Check if Git is installed
"C:\Program Files\Git\bin\git.exe" --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in PATH.
    echo Please download and install Git from https://git-scm.com/downloads
    echo After installation, please run this script again.
    pause
    exit /b 1
)

echo Git is installed. Setting up repository...
echo.

REM Initialize Git repository
echo Initializing Git repository...
"C:\Program Files\Git\bin\git.exe" init
if %errorlevel% neq 0 (
    echo Error initializing Git repository.
    pause
    exit /b 1
)

REM Configure Git user (you may want to change these)
echo Configuring Git user...
"C:\Program Files\Git\bin\git.exe" config --global user.name "Statsor Developer"
"C:\Program Files\Git\bin\git.exe" config --global user.email "developer@statsor.com"

REM Add all files
echo Adding files to repository...
"C:\Program Files\Git\bin\git.exe" add .

REM Make initial commit
echo Making initial commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: Statsor football management platform with Google OAuth and email fixes"

REM Create main branch and switch to it
echo Creating main branch...
"C:\Program Files\Git\bin\git.exe" checkout -b main

REM Add remote origin (you'll need to change this to your repository)
echo Adding remote origin...
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/your-username/your-repo.git

echo.
echo Git repository setup complete!
echo.
echo To push to GitHub, you'll need to:
echo 1. Change the remote origin URL to your actual GitHub repository
echo 2. Run: "C:\Program Files\Git\bin\git.exe" push -u origin main
echo.
echo If you get authentication errors, you'll need to set up a Personal Access Token on GitHub.
echo.
pause