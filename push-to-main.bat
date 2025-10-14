@echo off
setlocal

REM Try to find git in common installation paths
set GIT_PATH=git
where git >nul 2>&1
if errorlevel 1 (
    if exist "C:\Program Files\Git\bin\git.exe" (
        set GIT_PATH="C:\Program Files\Git\bin\git.exe"
    ) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
        set GIT_PATH="C:\Program Files (x86)\Git\bin\git.exe"
    ) else (
        echo Git not found. Please install Git or add it to your PATH.
        pause
        exit /b 1
    )
)

echo Using git from: %GIT_PATH%
echo Adding all changes to git...
%GIT_PATH% add .

echo Committing changes...
%GIT_PATH% commit -m "Fixed TypeScript errors in Training.tsx and restored calendar/upcoming sessions features"

echo Pushing to main branch...
%GIT_PATH% push origin main

echo Done!
pause