@echo off
echo Pushing TypeScript fixes to GitHub...
echo.

cd /d "c:\Users\JOE\Downloads\mm"

echo Setting user config...
"C:\Program Files\Git\bin\git.exe" config --global user.name "Statsor Developer"
"C:\Program Files\Git\bin\git.exe" config --global user.email "developer@statsor.com"

echo Adding fixed files...
"C:\Program Files\Git\bin\git.exe" add src/contexts/AuthContext.tsx
"C:\Program Files\Git\bin\git.exe" add src/services/aiChatService_clean.ts
"C:\Program Files\Git\bin\git.exe" add src/components/AIAssistantSection.tsx

echo Committing changes...
"C:\Program Files\Git\bin\git.exe" commit -m "Fix TypeScript compilation errors in AuthContext, AI chat service, and AI assistant section"

echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push

echo.
echo Done! TypeScript fixes have been pushed to GitHub.
pause