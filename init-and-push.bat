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

REM Initialize git repository if it doesn't exist
if not exist .git (
    echo Initializing git repository...
    %GIT_PATH% init
)

REM Add all files
echo Adding all changes to git...
%GIT_PATH% add .

REM Check if there are changes to commit
%GIT_PATH% diff --cached --quiet
if errorlevel 1 (
    echo Committing changes...
    %GIT_PATH% commit -m "Fixed TypeScript errors in Training.tsx and restored calendar/upcoming sessions features"
) else (
    echo No changes to commit.
)

REM Add remote if it doesn't exist
echo Adding remote repository...
%GIT_PATH% remote add origin https://github.com/Michael-ctrl-eng/teamplaymate-16.git 2>nul

REM Push to main branch
echo Pushing to main branch...
%GIT_PATH% push -u origin main

echo Done!
pause