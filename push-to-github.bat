@echo off
setlocal

REM Set the repository URL
set REPO_URL=https://github.com/Michael-ctrl-eng/teamplaymate-16.git

echo Initializing git repository...
git init

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Fixed TypeScript errors in Training.tsx and restored calendar/upcoming sessions features"

echo Adding remote repository...
git remote add origin %REPO_URL%

echo Pushing to main branch...
git push -u origin main

echo Done!
pause