#!/bin/bash

# VitaApp Pre-deployment Script
# Checks compliance with AI Coding Guidelines before deployment

echo "🚀 VitaApp Pre-deployment Checks"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
    ERRORS=$((ERRORS + 1))
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

echo "🔍 Checking project structure..."

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    print_error "Not in project root directory. Please run from vitadasingle/"
    exit 1
fi

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_error "Dependencies not installed. Run 'npm install' first."
    exit 1
fi

print_success "Project structure is valid"

echo ""
echo "🔤 Checking English code compliance..."

# Check for Italian comments/strings in TypeScript files
if grep -r "//.*[àèìòù]" src/ 2>/dev/null; then
    print_error "Found Italian comments in code. All comments should be in English."
elif grep -r "console\.log.*[àèìòù]" src/ 2>/dev/null; then
    print_error "Found Italian text in console.log statements."
else
    print_success "All code is in English"
fi

echo ""
echo "📅 Checking ISO 8601 date format compliance..."

# Check for hardcoded non-ISO dates
if grep -r "new Date.*[0-9]*/[0-9]*/[0-9]*" src/ 2>/dev/null; then
    print_error "Found non-ISO date formats. Use ISO 8601 format (YYYY-MM-DD)."
elif grep -r "\.toLocaleDateString" src/ 2>/dev/null; then
    print_warning "Found .toLocaleDateString() usage. Consider using formatDateForDisplay() instead."
    print_success "Date format compliance check passed (with warnings)"
else
    print_success "All dates use ISO 8601 format"
fi

echo ""
echo "🌐 Checking internationalization..."

# Check for hardcoded English strings in JSX
if grep -r "\"[A-Z][a-z].*\"" src/components/ 2>/dev/null | grep -v "className\|src\|href\|alt\|placeholder" | head -5; then
    print_warning "Found potential hardcoded strings. Consider using translation keys."
    print_success "Internationalization check passed (with warnings)"
else
    print_success "Internationalization properly implemented"
fi

echo ""
echo "🔧 Running TypeScript checks..."

# TypeScript compilation check
if npm run type-check > /dev/null 2>&1; then
    print_success "TypeScript compilation successful"
else
    print_error "TypeScript compilation failed. Fix type errors first."
fi

echo ""
echo "🧹 Running ESLint..."

# ESLint check
if npm run lint > /dev/null 2>&1; then
    print_success "ESLint checks passed"
else
    print_error "ESLint checks failed. Fix linting errors first."
fi

echo ""
echo "🏗️ Testing build process..."

# Build check
if npm run build > /dev/null 2>&1; then
    print_success "Build process successful"
else
    print_error "Build process failed. Check build configuration."
fi

echo ""
echo "📋 Checking required files..."

# Check for required files
required_files=(
    "vercel.json"
    "README.md"
    ".env.example"
    "src/utils/dateHelpers.ts"
    "src/utils/formatters.ts"
    "src/context/LanguageContext.tsx"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "Required file exists: $file"
    else
        print_error "Missing required file: $file"
    fi
done

echo ""
echo "🎯 Summary"
echo "=========="

if [ $ERRORS -eq 0 ]; then
    print_success "All checks passed! Ready for deployment 🚀"
    echo ""
    echo "Next steps:"
    echo "1. git add ."
    echo "2. git commit -m 'feat: ready for deployment'"
    echo "3. git push origin main"
    echo "4. Deploy to Vercel"
    exit 0
else
    print_error "Found $ERRORS error(s). Please fix before deployment."
    echo ""
    echo "Common fixes:"
    echo "- Replace Italian comments with English"
    echo "- Use ISO 8601 date format (YYYY-MM-DD)"
    echo "- Fix TypeScript errors"
    echo "- Fix ESLint warnings"
    echo "- Add missing files"
    exit 1
fi
