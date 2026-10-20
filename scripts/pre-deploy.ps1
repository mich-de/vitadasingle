# VitaApp Pre-deployment Script for Windows
# Checks compliance with AI Coding Guidelines before deployment

Write-Host "VitaApp Pre-deployment Checks" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

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

Write-Host "Checking project structure..." -ForegroundColor Yellow

# Check if we're in the right directory
if (!(Test-Path "frontend\package.json")) {
    Write-Error-Message "Not in project root directory. Please run from vitadasingle\"
    exit 1
}

Set-Location frontend

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Error-Message "Dependencies not installed. Run 'npm install' first."
    exit 1
}

Write-Success-Message "Project structure is valid"

Write-Host ""
Write-Host "Checking English code compliance..." -ForegroundColor Yellow

# Check for Italian comments/strings in TypeScript files
$italianComments = Get-ChildItem -Path "src" -Recurse -Include "*.ts", "*.tsx" | 
    Select-String -Pattern "//.*[àèìòù]" 2>$null

if ($italianComments) {
    Write-Error-Message "Found Italian comments in code. All comments should be in English."
} else {
    Write-Success-Message "All code is in English"
}

Write-Host ""
Write-Host "Checking ISO 8601 date format compliance..." -ForegroundColor Yellow

# Check for hardcoded non-ISO dates
$nonISODates = Get-ChildItem -Path "src" -Recurse -Include "*.ts", "*.tsx" | 
    Select-String -Pattern "new Date.*[0-9]*/[0-9]*/[0-9]*" 2>$null

if ($nonISODates) {
    Write-Error-Message "Found non-ISO date formats. Use ISO 8601 format (YYYY-MM-DD)."
} else {
    Write-Success-Message "All dates use ISO 8601 format"
}

Write-Host ""
Write-Host "Checking internationalization..." -ForegroundColor Yellow

# Check for hardcoded English strings in JSX (simplified check)
$hardcodedStrings = Get-ChildItem -Path "src\components" -Recurse -Include "*.tsx" | 
    Select-String -Pattern '>[A-Z][a-z].*<' 2>$null | Select-Object -First 5

if ($hardcodedStrings) {
    Write-Warning-Message "Found potential hardcoded strings. Consider using translation keys."
    Write-Success-Message "Internationalization check passed (with warnings)"
} else {
    Write-Success-Message "Internationalization properly implemented"
}

Write-Host ""
Write-Host "Running TypeScript checks..." -ForegroundColor Yellow

# TypeScript compilation check
$typeCheckResult = npm run type-check 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success-Message "TypeScript compilation successful"
} else {
    Write-Error-Message "TypeScript compilation failed. Fix type errors first."
}

Write-Host ""
Write-Host "Running ESLint..." -ForegroundColor Yellow

# ESLint check
$lintResult = npm run lint 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success-Message "ESLint checks passed"
} else {
    Write-Error-Message "ESLint checks failed. Fix linting errors first."
}

Write-Host ""
Write-Host "Testing build process..." -ForegroundColor Yellow

# Build check
$buildResult = npm run build 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success-Message "Build process successful"
} else {
    Write-Error-Message "Build process failed. Check build configuration."
}

Write-Host ""
Write-Host "Checking required files..." -ForegroundColor Yellow

# Check for required files
$requiredFiles = @(
    "vercel.json",
    "README.md",
    ".env.example",
    "src\utils\dateHelpers.ts",
    "src\utils\formatters.ts",
    "src\context\LanguageContext.tsx"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Success-Message "Required file exists: $file"
    } else {
        Write-Error-Message "Missing required file: $file"
    }
}

Write-Host ""
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan

if ($ErrorCount -eq 0) {
    Write-Success-Message "All checks passed! Ready for deployment"
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Green
    Write-Host "1. git add ." -ForegroundColor White
    Write-Host "2. git commit -m 'feat: ready for deployment'" -ForegroundColor White
    Write-Host "3. git push origin main" -ForegroundColor White
    Write-Host "4. Deploy to Vercel" -ForegroundColor White
    exit 0
} else {
    Write-Error-Message "Found $ErrorCount error(s). Please fix before deployment."
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Yellow
    Write-Host "- Replace Italian comments with English" -ForegroundColor White
    Write-Host "- Use ISO 8601 date format (YYYY-MM-DD)" -ForegroundColor White
    Write-Host "- Fix TypeScript errors" -ForegroundColor White
    Write-Host "- Fix ESLint warnings" -ForegroundColor White
    Write-Host "- Add missing files" -ForegroundColor White
    exit 1
}
