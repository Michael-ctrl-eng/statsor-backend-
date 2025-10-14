@echo off
REM Quick Git Add, Commit, and Push script
REM Usage: quick-git.bat "Your commit message"

if "%~1"=="" (
    echo Error: Please provide a commit message
    echo Usage: quick-git.bat "Your commit message"
    exit /b 1
)

echo Adding all changes...
"C:\Program Files\Git\bin\git.exe" add .

echo Committing with message: %~1
"C:\Program Files\Git\bin\git.exe" commit -m "%~1"

echo Pushing to remote repository...
"C:\Program Files\Git\bin\git.exe" push origin main

echo Done! All changes have been pushed to Git.
pause