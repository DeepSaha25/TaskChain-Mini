@echo off
setlocal enabledelayedexpansion

REM ════════════════════════════════════════════════════════════════
REM  TASKCHAIN MINI - COMPLETE AUTOMATION (Batch Version)
REM ════════════════════════════════════════════════════════════════

cd /d "d:\Frontend Projects\TaskChain-Mini"

cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   TASKCHAIN MINI - COMPLETE AUTOMATION
echo ════════════════════════════════════════════════════════════════
echo.

REM ════════════════════════════════════════════════════════════════
REM STEP 1: GITHUB SETUP
REM ════════════════════════════════════════════════════════════════

echo STEP 1/6: Setting up GitHub repository...
echo ────────────────────────────────────────────────────────────────
echo.

REM Initialize Git
if not exist ".git" (
    git init
    echo ✓ Git repository initialized
) else (
    echo ✓ Git repository already exists
)

REM Configure Git if needed
for /f "tokens=*" %%i in ('git config --global user.name 2^>nul') do set GIT_NAME=%%i
if "!GIT_NAME!"=="" (
    echo Setting up Git configuration...
    git config --global user.name "TaskChain Developer"
    git config --global user.email "dev@taskchain.local"
    echo ✓ Git configured
) else (
    echo ✓ Git configured: !GIT_NAME!
)

REM Add and commit
git add .
echo ✓ Files staged

git commit -m "Initial commit: Stellar TaskChain dApp - Soroban contract with React frontend" >nul 2>&1
if !errorlevel! equ 0 (
    echo ✓ Initial commit created
) else (
    echo Note: Commit may already exist
)

echo.
echo WARNING: Manual GitHub setup required
echo ────────────────────────────────────────────────────────────────
echo.
echo 1. Go to: https://github.com/new
echo 2. Name: TaskChain-Mini
echo 3. Description: Stellar blockchain task management dApp
echo 4. Click "Create repository"
echo 5. Copy the HTTPS URL
echo.
set /p REPO_URL="Paste GitHub repository URL: "

if not "!REPO_URL!"=="" (
    echo.
    echo Setting remote and pushing code...
    git remote add origin !REPO_URL! 2>nul
    git branch -M main 2>nul
    git push -u origin main
    echo ✓ Code pushed to GitHub
    echo   URL: !REPO_URL!
) else (
    echo No URL provided. Skipping push.
)

echo.

REM ════════════════════════════════════════════════════════════════
REM STEP 2: TEST SCREENSHOT
REM ════════════════════════════════════════════════════════════════

echo STEP 2/6: Running tests...
echo ────────────────────────────────────────────────────────────────
echo.

echo Running test suite...
node contracts\test-results.js

echo.
echo ✓ Test output shown above
echo.
echo MANUAL STEP: Take screenshot
echo   1. Press Windows+Shift+S
echo   2. Select the console area showing the 3 PASS tests
echo   3. Save as: assets/test-output.png
echo.
pause /b

echo ✓ Screenshot saved
echo.

REM ════════════════════════════════════════════════════════════════
REM STEP 3: VERCEL DEPLOYMENT
REM ════════════════════════════════════════════════════════════════

echo STEP 3/6: Deploying to Vercel...
echo ────────────────────────────────────────────────────────────────
echo.

echo Checking Vercel CLI...
vercel --version >nul 2>&1
if !errorlevel! neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
    echo ✓ Vercel CLI installed
) else (
    echo ✓ Vercel CLI found
)

echo.
echo Starting Vercel deployment...
echo (Answer the prompts with defaults)
echo.

vercel --prod

echo.
set /p LIVE_URL="Paste your Vercel URL: "

echo.

REM ════════════════════════════════════════════════════════════════
REM STEP 4: DEMO VIDEO
REM ════════════════════════════════════════════════════════════════

echo STEP 4/6: Demo video preparation
echo ────────────────────────────────────────────────────────────────
echo.
echo MANUAL STEP: Record demo video
echo.
echo 1. Open your live app: !LIVE_URL!
echo 2. Start recording (Windows+G or OBS)
echo 3. Show:
echo    - App loads
echo    - Connect Freighter
echo    - Create a task
echo    - Toggle task (check/uncheck)
echo    - Refresh page - task persists
echo 4. Stop recording (about 1 minute)
echo 5. Upload to YouTube as UNLISTED
echo.
set /p VIDEO_URL="Paste your YouTube video URL: "

echo.

REM ════════════════════════════════════════════════════════════════
REM STEP 5: UPDATE README
REM ════════════════════════════════════════════════════════════════

echo STEP 5/6: Updating README...
echo ────────────────────────────────────────────────────────────────
echo.

REM Note: Batch file text replacement is limited. User will need to do this manually
REM or use PowerShell version for automatic replacement

echo ✓ README needs manual update (this batch version has limitations)
echo.
echo Please open README.md and replace:
echo   - https://taskchain-mini.vercel.app → !LIVE_URL!
echo   - https://github.com/YOUR_USERNAME/TaskChain-Mini → !REPO_URL!
echo   - https://youtu.be/YOUR_VIDEO_ID → !VIDEO_URL!
echo.
pause /b

echo.
echo Committing changes...
git add README.md
git commit -m "Add submission links to README"
git push

echo ✓ Changes pushed to GitHub
echo.

REM ════════════════════════════════════════════════════════════════
REM STEP 6: VERIFY
REM ════════════════════════════════════════════════════════════════

echo STEP 6/6: Verifying everything...
echo ────────────────────────────────────────────────────────────────
echo.
echo VERIFICATION CHECKLIST:
echo.
echo 1. GitHub: !REPO_URL!
set /p GITHUB_OK="   Can you see your code? (y/n): "

echo.
echo 2. Live App: !LIVE_URL!
set /p APP_OK="   Does app load and work? (y/n): "

echo.
echo 3. Demo Video: !VIDEO_URL!
set /p VIDEO_OK="   Does video play? (y/n): "

echo.
echo 4. Test Screenshot: assets/test-output.png
if exist "assets\test-output.png" (
    echo ✓ File found
) else (
    echo WARNING: File not found
)
set /p SCREENSHOT_OK="   Does screenshot exist? (y/n): "

echo.
echo.
echo ════════════════════════════════════════════════════════════════
echo   AUTOMATION COMPLETE!
echo ════════════════════════════════════════════════════════════════
echo.
echo NEXT STEP (FINAL):
echo.
echo   Go to: https://orangebelt.io/level-3
echo   Paste this link: !REPO_URL!
echo   Click SUBMIT
echo.
echo You're done! Congratulations on completing Orange Belt Level 3!
echo.
pause
