# VitaApp Vercel Setup Script for Windows
# Prepares the project for Vercel deployment

Write-Host "VitaApp Vercel Setup" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

function Write-Info {
    param($Message)
    Write-Host "Info: $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "Success: $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "Warning: $Message" -ForegroundColor Yellow
}

function Write-Error-Message {
    param($Message)
    Write-Host "Error: $Message" -ForegroundColor Red
}

# Check if we're in the right directory
if (!(Test-Path "frontend\package.json")) {
    Write-Error-Message "Not in project root directory. Please run from vitadasingle\"
    exit 1
}

Write-Host ""
Write-Info "Setting up Vercel configuration..."

Set-Location frontend

# Create or update vercel.json
$vercelConfig = @"
{
  "version": 2,
  "name": "vitadasingle",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "VITE_API_URL": "@vite_api_url",
    "VITE_APP_NAME": "VitaApp",
    "VITE_APP_VERSION": "1.0.0"
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci --only=production"
}
"@

$vercelConfig | Out-File -FilePath "vercel.json" -Encoding UTF8
Write-Success "vercel.json configured"

# Update package.json for Vercel
Write-Info "Updating package.json for Vercel..."

$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
if (!$packageJson.scripts.PSObject.Properties.Name.Contains("vercel-build")) {
    $packageJson.scripts | Add-Member -NotePropertyName "vercel-build" -NotePropertyValue "npm run build"
    $packageJson | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding UTF8
    Write-Success "Added vercel-build script"
}

# Create .env.example if it doesn't exist
if (!(Test-Path ".env.example")) {
    $envExample = @"
# VitaApp Frontend Environment Variables

# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_VERSION=v1

# App Configuration
VITE_APP_NAME=VitaApp
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false

# Development
VITE_DEV_TOOLS=true
VITE_LOG_LEVEL=info

# External Services
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=
"@

    $envExample | Out-File -FilePath ".env.example" -Encoding UTF8
    Write-Success "Created .env.example"
}

# Create .env for local development
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Success "Created .env from template"
}

# Update .gitignore for Vercel
if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw
    if ($gitignoreContent -notmatch "\.vercel") {
        $vercelIgnore = @"


# Vercel
.vercel
.vercel.json
"@
        $vercelIgnore | Out-File -FilePath ".gitignore" -Append -Encoding UTF8
        Write-Success "Updated .gitignore for Vercel"
    }
}

Write-Host ""
Write-Info "Vercel setup complete!"

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "==============" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 🔧 Install Vercel CLI (if not already installed):" -ForegroundColor Yellow
Write-Host "   npm i -g vercel" -ForegroundColor White
Write-Host ""
Write-Host "2. 🔑 Login to Vercel:" -ForegroundColor Yellow
Write-Host "   vercel login" -ForegroundColor White
Write-Host ""
Write-Host "3. 🏗️ Deploy to Vercel:" -ForegroundColor Yellow
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "4. 📊 Or link to existing project:" -ForegroundColor Yellow
Write-Host "   vercel link" -ForegroundColor White
Write-Host ""
Write-Host "5. 🌐 Set up environment variables in Vercel dashboard:" -ForegroundColor Yellow
Write-Host "   - VITE_API_URL" -ForegroundColor White
Write-Host "   - VITE_APP_NAME" -ForegroundColor White
Write-Host "   - VITE_APP_VERSION" -ForegroundColor White
Write-Host ""
Write-Host "6. 🚀 For automatic deployments, push to main branch:" -ForegroundColor Yellow
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m 'feat: configure for Vercel deployment'" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor White
Write-Host ""

Write-Info "Environment Variables for Vercel:"
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "VITE_API_URL=https://your-api-domain.com/api" -ForegroundColor White
Write-Host "VITE_APP_NAME=VitaApp" -ForegroundColor White
Write-Host "VITE_APP_VERSION=1.0.0" -ForegroundColor White
Write-Host "VITE_ENABLE_ANALYTICS=false" -ForegroundColor White
Write-Host "VITE_ENABLE_ERROR_REPORTING=false" -ForegroundColor White
Write-Host ""

Write-Warning "Remember to:"
Write-Host "- Set up custom domain in Vercel dashboard" -ForegroundColor White
Write-Host "- Configure environment variables" -ForegroundColor White
Write-Host "- Set up GitHub integration for automatic deployments" -ForegroundColor White
Write-Host "- Test the deployment thoroughly" -ForegroundColor White
Write-Host ""

Write-Success "VitaApp is ready for Vercel deployment! 🚀"
