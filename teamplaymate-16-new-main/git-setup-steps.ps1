# Simple Git setup script
Write-Host "Step 1: Configuring Git user settings..."
& "C:\Program Files\Git\bin\git.exe" config --global user.name "Statsor Developer"
& "C:\Program Files\Git\bin\git.exe" config --global user.email "developer@statsor.com"

Write-Host "Step 2: Adding remote repository..."
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/Michael-ctrl-eng/teamplaymate-16.git
# If the remote already exists, uncomment and use this line instead
# & "C:\Program Files\Git\bin\git.exe" remote set-url origin https://github.com/Michael-ctrl-eng/teamplaymate-16.git

Write-Host "Step 3: Making initial commit..."
& "C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: Statsor football management platform with fixed API integrations"

Write-Host "Git setup completed!"
Write-Host "To push to GitHub, run the following command:"
Write-Host "& 'C:\Program Files\Git\bin\git.exe' push -u origin master"