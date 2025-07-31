#!/bin/bash

# VitaApp Vercel Setup Script
# Prepares the project for Vercel deployment

echo "🚀 VitaApp Vercel Setup"
echo "======================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    print_error "Not in project root directory. Please run from vitadasingle/"
    exit 1
fi

echo ""
print_info "Setting up Vercel configuration..."

cd frontend

# Create or update vercel.json
cat > vercel.json << 'EOF'
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
EOF

print_success "vercel.json configured"

# Create deployment-ready package.json script
print_info "Updating package.json for Vercel..."

# Add vercel-build script if it doesn't exist
if ! grep -q "vercel-build" package.json; then
    # Use Node.js to add the script
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.scripts['vercel-build'] = 'npm run build';
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
    print_success "Added vercel-build script"
fi

# Create .env.example if it doesn't exist
if [ ! -f ".env.example" ]; then
    cat > .env.example << 'EOF'
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
EOF
    print_success "Created .env.example"
fi

# Create .env for local development
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Created .env from template"
fi

# Create .gitignore additions for Vercel
if ! grep -q ".vercel" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# Vercel" >> .gitignore
    echo ".vercel" >> .gitignore
    echo ".vercel.json" >> .gitignore
    print_success "Updated .gitignore for Vercel"
fi

echo ""
print_info "Vercel setup complete!"

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. 🔧 Install Vercel CLI (if not already installed):"
echo "   npm i -g vercel"
echo ""
echo "2. 🔑 Login to Vercel:"
echo "   vercel login"
echo ""
echo "3. 🏗️ Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "4. 📊 Or link to existing project:"
echo "   vercel link"
echo ""
echo "5. 🌐 Set up environment variables in Vercel dashboard:"
echo "   - VITE_API_URL"
echo "   - VITE_APP_NAME"
echo "   - VITE_APP_VERSION"
echo ""
echo "6. 🚀 For automatic deployments, push to main branch:"
echo "   git add ."
echo "   git commit -m 'feat: configure for Vercel deployment'"
echo "   git push origin main"
echo ""

print_info "Environment Variables for Vercel:"
echo "================================="
echo "VITE_API_URL=https://your-api-domain.com/api"
echo "VITE_APP_NAME=VitaApp"
echo "VITE_APP_VERSION=1.0.0"
echo "VITE_ENABLE_ANALYTICS=false"
echo "VITE_ENABLE_ERROR_REPORTING=false"
echo ""

print_warning "Remember to:"
echo "- Set up custom domain in Vercel dashboard"
echo "- Configure environment variables"
echo "- Set up GitHub integration for automatic deployments"
echo "- Test the deployment thoroughly"
echo ""

print_success "VitaApp is ready for Vercel deployment! 🚀"
