@echo off
REM ================================================
REM TaskChain Mini - Automated GitHub Setup
REM ================================================
REM This batch file automates the GitHub setup

cd /d "d:\Frontend Projects\TaskChain-Mini"

echo.
echo ================================================
echo  TASKCHAIN MINI - AUTOMATED GITHUB SETUP
echo ================================================
echo.

REM Step 1: Check Git
echo Step 1: Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo Error: Git not found! Install from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo Git found!
echo.

REM Step 2: Configure Git
echo Step 2: Configuring Git user...
git config user.name "TaskChain Developer"
git config user.email "developer@taskchain.local"
echo Git configured!
echo.

REM Step 3: Initialize Repo
echo Step 3: Initializing Git repository...
if exist ".git" (
    echo Git repository already exists
) else (
    git init
)
echo.

REM Step 4: Add Files
echo Step 4: Adding files to Git...
git add .
echo Files added!
echo.

REM Step 5: Create Commit
echo Step 5: Creating initial commit...
git commit -m "Initial commit: Stellar TaskChain dApp - Soroban smart contract with React frontend" >nul 2>&1
if errorlevel 1 (
    echo Note: Commit may already exist or no changes to commit
) else (
    echo Initial commit created!
)
echo.

REM Step 6: Manual GitHub Setup Instructions
echo ================================================
echo IMPORTANT: Complete GitHub setup manually
echo ================================================
echo.
echo 1. Go to: https://github.com/new
echo 2. Enter repository name: TaskChain-Mini
echo 3. Description: Stellar blockchain task management dApp
echo 4. Click "Create repository"
echo 5. Copy the HTTPS URL (https://github.com/YOUR_USERNAME/TaskChain-Mini.git)
echo.
echo Then return here and enter the URL below:
echo.
set /p REPO_URL="Paste GitHub repository URL: "

if not "%REPO_URL%"=="" (
    echo.
    echo Setting remote and pushing code...
    git remote add origin %REPO_URL%
    git branch -M main
    git push -u origin main
    
    echo.
    echo ================================================
    echo SUCCESS! Repository created and code pushed
    echo ================================================
    echo.
    echo Your repository: %REPO_URL%
    echo.
    echo Next steps:
    echo  1. Take test screenshot: node contracts\test-results.js
    echo  2. Deploy to Vercel: vercel --prod
    echo  3. Follow STEP_BY_STEP_GUIDE.md for remaining steps
    echo.
) else (
    echo No repository URL provided. Setup incomplete.
    echo Please run this script again with your GitHub URL.
)

echo.
pause
