# Quick Git Add, Commit, and Push PowerShell script
# Usage: .\quick-git.ps1 "Your commit message"

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

$GitPath = "C:\Program Files\Git\bin\git.exe"

try {
    Write-Host "Adding all changes..." -ForegroundColor Green
    & $GitPath add .
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to add files"
    }
    
    Write-Host "Committing with message: $CommitMessage" -ForegroundColor Green
    & $GitPath commit -m $CommitMessage
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to commit changes"
    }
    
    Write-Host "Pushing to remote repository..." -ForegroundColor Green
    & $GitPath push origin main
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to push to remote"
    }
    
    Write-Host "✅ Success! All changes have been pushed to Git." -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}