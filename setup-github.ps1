# 🚀 AUTOMATED GITHUB SETUP SCRIPT
# This script does EVERYTHING for you - just run it!

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🚀 TASKCHAIN MINI - AUTOMATED GITHUB SETUP" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Set Error Action
$ErrorActionPreference = "Stop"

# Get current directory
$projectRoot = "d:\Frontend Projects\TaskChain-Mini"
Set-Location $projectRoot

Write-Host "📁 Working directory: $projectRoot" -ForegroundColor Green
Write-Host ""

# Step 1: Check Git Installation
Write-Host "Step 1️⃣  Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found! Install from: https://git-scm.com/download/win" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Step 2: Configure Git (if not already done)
Write-Host "Step 2️⃣  Configuring Git user..." -ForegroundColor Yellow

# Check if git config is set globally
$gitName = git config --global user.name
$gitEmail = git config --global user.email

if (-not $gitName -or -not $gitEmail) {
    Write-Host "Git config not found. Setting up..." -ForegroundColor Cyan
    $name = Read-Host "Enter your name"
    $email = Read-Host "Enter your email"
    
    git config --global user.name $name
    git config --global user.email $email
    
    Write-Host "✅ Git configured globally" -ForegroundColor Green
} else {
    Write-Host "✅ Git already configured: $gitName <$gitEmail>" -ForegroundColor Green
}

Write-Host ""

# Step 3: Initialize Git Repository
Write-Host "Step 3️⃣  Initializing Git repository..." -ForegroundColor Yellow

if (Test-Path ".git") {
    Write-Host "⚠️  Git repo already exists. Skipping init." -ForegroundColor Yellow
} else {
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

Write-Host ""

# Step 4: Add All Files
Write-Host "Step 4️⃣  Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✅ All files added" -ForegroundColor Green

Write-Host ""

# Step 5: Create Initial Commit
Write-Host "Step 5️⃣  Creating initial commit..." -ForegroundColor Yellow
$commitMessage = "Initial commit: Stellar TaskChain dApp - Soroban smart contract with React frontend"

try {
    git commit -m $commitMessage
    Write-Host "✅ Initial commit created" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Commit may have already existed or no changes to commit" -ForegroundColor Yellow
}

Write-Host ""

# Step 6: Try to use GitHub CLI
Write-Host "Step 6️⃣  Checking GitHub CLI..." -ForegroundColor Yellow

$hasGH = $false
try {
    $ghVersion = gh --version
    Write-Host "✅ GitHub CLI found: $ghVersion" -ForegroundColor Green
    $hasGH = $true
} catch {
    Write-Host "⚠️  GitHub CLI not found" -ForegroundColor Yellow
    Write-Host "   Install from: https://cli.github.com/" -ForegroundColor Cyan
}

Write-Host ""

if ($hasGH) {
    Write-Host "Step 7️⃣  Using GitHub CLI to create and push repository..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You'll need to authenticate with GitHub CLI (one-time setup)" -ForegroundColor Cyan
    Write-Host ""
    
    try {
        # Check if already authenticated
        gh auth status 2>&1 | Out-Null
        Write-Host "✅ Already authenticated with GitHub" -ForegroundColor Green
    } catch {
        Write-Host "🔐 Starting GitHub authentication..." -ForegroundColor Cyan
        gh auth login
        Write-Host "✅ GitHub authentication complete" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Creating repository on GitHub..." -ForegroundColor Cyan
    Write-Host ""
    
    # Create repo
    try {
        gh repo create TaskChain-Mini --source=. --remote=origin --push --public
        Write-Host ""
        Write-Host "✅ Repository created and code pushed to GitHub!" -ForegroundColor Green
        Write-Host ""
        
        # Get repo URL
        $repoURL = gh repo view --json url -q .url
        Write-Host "🌐 Your repository: $repoURL" -ForegroundColor Green
        
    } catch {
        Write-Host "⚠️  Could not create repo with GitHub CLI" -ForegroundColor Yellow
        Write-Host "Error: $_" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Falling back to manual git push method..." -ForegroundColor Cyan
        $hasGH = $false
    }
}

Write-Host ""

# Step 7 (Alternative): Manual Git Push
if (-not $hasGH) {
    Write-Host "Step 7️⃣  Manual GitHub Setup Required" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Follow these steps to complete the setup:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "2. Enter repository name: TaskChain-Mini" -ForegroundColor White
    Write-Host "3. Description: Stellar blockchain task management dApp" -ForegroundColor White
    Write-Host "4. Click 'Create repository'" -ForegroundColor White
    Write-Host "5. Copy the HTTPS URL that appears (https://github.com/YOUR_USERNAME/TaskChain-Mini.git)" -ForegroundColor White
    Write-Host ""
    
    $repoURL = Read-Host "Paste your GitHub repository URL here"
    
    if ($repoURL) {
        Write-Host ""
        Write-Host "Setting remote and pushing code..." -ForegroundColor Cyan
        
        git remote add origin $repoURL
        Write-Host "✅ Remote added" -ForegroundColor Green
        
        git branch -M main
        Write-Host "✅ Branch renamed to main" -ForegroundColor Green
        
        git push -u origin main
        Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Your repository: $repoURL" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "✅ GITHUB SETUP COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Verify code on GitHub"
Write-Host "  2. Run: node contracts\test-results.js (take screenshot)"
Write-Host "  3. Run: vercel --prod (deploy to Vercel)"
Write-Host "  4. Follow STEP_BY_STEP_GUIDE.md for remaining steps"
Write-Host ""
Write-Host "🚀 You're on your way to submission!" -ForegroundColor Green
Write-Host ""

# Prompt to continue
Read-Host "Press Enter to continue"
