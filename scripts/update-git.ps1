Write-Host "VitaApp Git Update Tool" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

$ErrorCount = 0

function Write-Error-Message {
param($Message)
Write-Host "Error: $Message" -ForegroundColor Red
$script:ErrorCount++
}

function Write-Success-Message {
param($Message)
Write-Host "Success: $Message" -ForegroundColor Green
}

function Write-Warning-Message {
param($Message)
Write-Host "Warning: $Message" -ForegroundColor Yellow
}

if (!(Test-Path ".git")) {
Write-Error-Message "Not in a Git repository. Please run from the root of your Git repository."
exit 1
}

Write-Host "Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain

if ([string]::IsNullOrEmpty($gitStatus)) {
Write-Warning-Message "No changes detected in the repository."
exit 0
}

$modifiedFiles = ($gitStatus | Where-Object { $_ -match "^ M" }).Count
$addedFiles = ($gitStatus | Where-Object { $_ -match "^??" }).Count
$deletedFiles = ($gitStatus | Where-Object { $_ -match "^ D" }).Count

Write-Host "Found $modifiedFiles modified files, $addedFiles new files, and $deletedFiles deleted files." -ForegroundColor White

Write-Host ""
Write-Host "Files to be committed:" -ForegroundColor Yellow
Write-Host $gitStatus -ForegroundColor White

Write-Host ""
Write-Host "Commit Message" -ForegroundColor Yellow
Write-Host "-------------" -ForegroundColor Yellow

$commitMessage = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

while ([string]::IsNullOrEmpty($commitMessage)) {
Write-Warning-Message "Commit message cannot be empty. Please provide a message."
$commitMessage = Read-Host "Enter commit message"
}

$fullCommitMessage = "Automated commit: $commitMessage"

Write-Host ""
Write-Host "Updating Git Repository" -ForegroundColor Yellow

Write-Host "Staging changes..." -ForegroundColor White
git add .

if ($LASTEXITCODE -ne 0) {
Write-Error-Message "Failed to stage changes."
exit 1
}

Write-Host "Committing with message: '$fullCommitMessage'" -ForegroundColor White
git commit -m "$fullCommitMessage"

if ($LASTEXITCODE -ne 0) {
Write-Error-Message "Failed to commit changes."
exit 1
} else {
Write-Success-Message "Changes committed successfully."
}

$pushChanges = Read-Host "Do you want to push changes to remote repository? (y/n)"

if ($pushChanges -eq "y" -or $pushChanges -eq "Y") {
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Pushing to branch '$currentBranch'..." -ForegroundColor White
git push origin $currentBranch
if ($LASTEXITCODE -ne 0) {
Write-Error-Message "Failed to push changes to remote repository."
exit 1
} else {
Write-Success-Message "Changes pushed successfully to '$currentBranch'."
}
}

Write-Host ""
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "=========" -ForegroundColor Cyan

if ($ErrorCount -eq 0) {
Write-Success-Message "Git update completed successfully!"
exit 0
} else {
Write-Error-Message "Git update completed with $ErrorCount errors"
exit 1
}
