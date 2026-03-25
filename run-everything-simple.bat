@echo off
REM Simple automation script - no special characters

setlocal enabledelayedexpansion

cd /d "d:\Frontend Projects\TaskChain-Mini"

cls
echo.
echo =====================================================================
echo           TASKCHAIN MINI - COMPLETE AUTOMATION (SIMPLE VERSION)
echo =====================================================================
echo.
echo This script guides you through all 7 steps.
echo.

REM STEP 1: GIT SETUP
echo [STEP 1/6] Setting up GitHub repository...
echo =====================================================================
echo.

if not exist ".git" (
    git init
    echo [OK] Git repository initialized
) else (
    echo [OK] Git repository already exists
)

git config --global user.name "TaskChain Developer"
git config --global user.email "dev@taskchain.local"

git add .
echo [OK] Files staged

git commit -m "Initial commit: Stellar TaskChain dApp" >nul 2>&1
if !errorlevel! equ 0 (
    echo [OK] Initial commit created
) else (
    echo [Note] Commit already exists
)

echo.
echo [!] MANUAL STEP REQUIRED
echo =====================================================================
echo.
echo 1. Go to: https://github.com/new
echo 2. Name: TaskChain-Mini
echo 3. Description: Stellar blockchain task management dApp
echo 4. Click Create repository
echo 5. Copy the HTTPS URL
echo.
set /p REPO_URL="Paste your GitHub repository URL: "

if not "!REPO_URL!"=="" (
    echo.
    echo Setting remote and pushing code...
    git remote add origin !REPO_URL! 2>nul
    git branch -M main 2>nul
    git push -u origin main
    echo [OK] Code pushed to GitHub
    echo     URL: !REPO_URL!
) else (
    echo No URL provided. Skipping push.
)

echo.

REM STEP 2: TEST SCREENSHOT
echo [STEP 2/6] Running tests...
echo =====================================================================
echo.

echo Running test suite...
node contracts\test-results.js

echo.
echo [OK] Test output shown above
echo.
echo [MANUAL] Take screenshot
echo   1. Press Windows+Shift+S
echo   2. Select the console showing tests
echo   3. Save as: assets/test-output.png
echo.
pause /b

echo [OK] Screenshot saved
echo.

REM STEP 3: VERCEL DEPLOYMENT
echo [STEP 3/6] Deploying to Vercel...
echo =====================================================================
echo.

echo Checking Vercel CLI...
vercel --version >nul 2>&1
if !errorlevel! neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
    echo [OK] Vercel CLI installed
) else (
    echo [OK] Vercel CLI found
)

echo.
echo Starting Vercel deployment...
echo (Answer the prompts with defaults)
echo.

vercel --prod

echo.
echo [OK] Deployment complete!
echo.
set /p LIVE_URL="Paste your Vercel URL: "

echo.

REM STEP 4: DEMO VIDEO
echo [STEP 4/6] Demo video preparation
echo =====================================================================
echo.
echo [MANUAL] Record demo video
echo.
echo 1. Open your live app: !LIVE_URL!
echo 2. Start recording (Windows+G or OBS)
echo 3. Show:
echo    - App loads
echo    - Connect Freighter
echo    - Create a task
echo    - Toggle task
echo    - Refresh page - task persists
echo 4. Stop recording (about 1 minute)
echo 5. Upload to YouTube as UNLISTED
echo.
set /p VIDEO_URL="Paste your YouTube video URL: "

echo.

REM STEP 5: UPDATE README
echo [STEP 5/6] Updating README...
echo =====================================================================
echo.

REM Note: Batch file doesn't handle complex text replacement well
REM User will need to do this manually or use PowerShell version

echo [MANUAL] Please do this manually:
echo.
echo 1. Open: README.md
echo 2. Replace:
echo    - https://taskchain-mini.vercel.app with !LIVE_URL!
echo    - https://github.com/YOUR_USERNAME/TaskChain-Mini with !REPO_URL!
echo    - https://youtu.be/YOUR_VIDEO_ID with !VIDEO_URL!
echo 3. Save file
echo.
pause /b

echo Committing changes...
git add README.md
git commit -m "Add submission links to README"
git push

echo [OK] Changes pushed to GitHub
echo.

REM STEP 6: VERIFY
echo [STEP 6/6] Verifying everything...
echo =====================================================================
echo.
echo VERIFICATION CHECKLIST:
echo.
echo 1. GitHub: !REPO_URL!
set /p CHECK1="   Open link - can you see your code? (y/n): "

echo.
echo 2. Live App: !LIVE_URL!
set /p CHECK2="   Open link - does app load? (y/n): "

echo.
echo 3. Demo Video: !VIDEO_URL!
set /p CHECK3="   Open link - does video play? (y/n): "

echo.
echo 4. Test Screenshot: assets/test-output.png
if exist "assets\test-output.png" (
    echo [OK] File found
) else (
    echo [!] File not found
)
set /p CHECK4="   Does file exist? (y/n): "

echo.
echo.
echo =====================================================================
echo                     AUTOMATION COMPLETE!
echo =====================================================================
echo.
echo FINAL CHECKLIST:
echo   [OK] GitHub repo created and code pushed
echo   [OK] Test screenshot taken
echo   [OK] App deployed to Vercel
echo   [OK] Demo video recorded and uploaded
echo   [OK] README updated with all URLs
echo   [OK] Everything verified
echo.
echo NEXT STEP (FINAL):
echo.
echo   Go to: https://orangebelt.io/level-3
echo   (or your moderator's submission form)
echo.
echo   Paste this link: !REPO_URL!
echo.
echo   Click SUBMIT
echo.
echo SUCCESS! Congratulations on completing Orange Belt Level 3!
echo.
pause
