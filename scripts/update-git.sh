#!/bin/bash
# VitaApp Git Update Script for Linux/Mac
# Automates the process of committing and pushing changes to Git repository

echo "🔄 VitaApp Git Update Tool"
echo "========================"

ERRORS=0

print_error() {
    echo "❌ $1"
    ERRORS=$((ERRORS+1))
}

print_success() {
    echo "✅ $1"
}

print_warning() {
    echo "⚠️ $1"
}

# Check if we're in the right directory (project root)
if [ ! -d ".git" ]; then
    print_error "Not in a Git repository. Please run from the root of your Git repository."
    exit 1
fi

# Check Git status
echo "📊 Checking Git status..."
git_status=$(git status --porcelain)

if [ -z "$git_status" ]; then
    print_warning "No changes detected in the repository."
    exit 0
fi

# Count modified, added, and deleted files
modified_files=$(echo "$git_status" | grep -E '^ M|^M ' | wc -l)
added_files=$(echo "$git_status" | grep -E '^\?\?' | wc -l)
deleted_files=$(echo "$git_status" | grep -E '^ D|^D ' | wc -l)

echo "Found $modified_files modified files, $added_files new files, and $deleted_files deleted files."

# Ask for commit message
echo ""
echo "💬 Commit Message"
echo "-------------"

read -p "Enter commit type (feat, fix, docs, style, refactor, test, chore): " commit_type
while ! [[ "$commit_type" =~ ^(feat|fix|docs|style|refactor|test|chore)$ ]]; do
    print_warning "Invalid commit type. Please use one of: feat, fix, docs, style, refactor, test, chore"
    read -p "Enter commit type: " commit_type
done

read -p "Enter commit scope (optional, press Enter to skip): " commit_scope
read -p "Enter commit message: " commit_message

# Format the commit message according to conventional commits
if [ -z "$commit_scope" ]; then
    full_commit_message="$commit_type: $commit_message"
else
    full_commit_message="$commit_type($commit_scope): $commit_message"
fi

# Stage and commit changes
echo ""
echo "🚀 Updating Git Repository"

# Stage all changes
echo "Staging changes..."
git add .

if [ $? -ne 0 ]; then
    print_error "Failed to stage changes."
    exit 1
fi

# Commit changes
echo "Committing with message: '$full_commit_message'"
git commit -m "$full_commit_message"

if [ $? -ne 0 ]; then
    print_error "Failed to commit changes."
    exit 1
else
    print_success "Changes committed successfully."
fi

# Ask if user wants to push changes
read -p "Do you want to push changes to remote repository? (y/n): " push_changes

if [ "$push_changes" = "y" ]; then
    # Get current branch
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    echo "Pushing to branch '$current_branch'..."
    git push origin $current_branch
    
    if [ $? -ne 0 ]; then
        print_error "Failed to push changes to remote repository."
        exit 1
    else
        print_success "Changes pushed successfully to '$current_branch'."
    fi
fi

echo ""
echo "🎯 Summary"
echo "========="

if [ $ERRORS -eq 0 ]; then
    print_success "Git update completed successfully! 🚀"
    exit 0
else
    print_error "Git update completed with $ERRORS error(s)."
    exit 1
fi