# PowerShell script to push code to GitHub
Write-Host "Pushing code to GitHub with fixed commits..."
Write-Host ""

Set-Location "c:\Users\JOE\Downloads\mm"

Write-Host "Setting user config..."
& "C:\Program Files\Git\bin\git.exe" config --global user.name "Statsor Developer"
& "C:\Program Files\Git\bin\git.exe" config --global user.email "developer@statsor.com"

Write-Host "Adding all files..."
& "C:\Program Files\Git\bin\git.exe" add .

Write-Host "Creating new commit..."
& "C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: Statsor football management platform with fixed API integrations"

Write-Host "Checking out main branch..."
& "C:\Program Files\Git\bin\git.exe" checkout -b main 2>$null
if ($LASTEXITCODE -ne 0) {
    & "C:\Program Files\Git\bin\git.exe" checkout main
}

Write-Host "Force pushing to GitHub..."
& "C:\Program Files\Git\bin\git.exe" push -u origin main --force

Write-Host ""
Write-Host "Done!"
Pause