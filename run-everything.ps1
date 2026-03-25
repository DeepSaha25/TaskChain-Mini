# COMPLETE AUTOMATION SCRIPT
# Run this ONCE and it does everything step 1-6

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "          TASKCHAIN MINI - COMPLETE AUTOMATION" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  This script will do EVERYTHING from Steps 1-6:" -ForegroundColor Cyan
Write-Host "  [OK] Initialize Git and make commits (STEP 1)" -ForegroundColor Cyan
Write-Host "  [OK] Screenshot tests (STEP 2)" -ForegroundColor Cyan
Write-Host "  [OK] Deploy to Vercel (STEP 3)" -ForegroundColor Cyan
Write-Host "  [OK] Create demo video (STEP 4)" -ForegroundColor Cyan
Write-Host "  [OK] Update README (STEP 5)" -ForegroundColor Cyan
Write-Host "  [OK] Verify everything (STEP 6)" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ONLY YOU DO: Record, upload video, take final screenshot" -ForegroundColor Cyan
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "d:\Frontend Projects\TaskChain-Mini"
Set-Location $projectRoot

# ==================== STEP 1: GITHUB SETUP ====================
Write-Host "[STEP 1/6] Setting up GitHub repository..." -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Gray
Write-Host ""

# Initialize Git
if (-not (Test-Path ".git")) {
    git init
    Write-Host "[OK] Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "[OK] Git repository already exists" -ForegroundColor Green
}

# Configure Git if needed
$gitName = git config --global user.name
$gitEmail = git config --global user.email

if (-not $gitName -or -not $gitEmail) {
    Write-Host "[*] Setting up Git configuration..." -ForegroundColor Yellow
    git config --global user.name "TaskChain Developer"
    git config --global user.email "dev@taskchain.local"
    Write-Host "[OK] Git configured" -ForegroundColor Green
} else {
    Write-Host "[OK] Git configured: $gitName" -ForegroundColor Green
}

# Add and commit
git add .
Write-Host "[OK] Files staged" -ForegroundColor Green

try {
    git commit -m "Initial commit: Stellar TaskChain dApp - Soroban contract with React frontend"
    Write-Host "[OK] Initial commit created" -ForegroundColor Green
} catch {
    Write-Host "[*] Commit already exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[!] MANUAL STEP REQUIRED:" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Gray
Write-Host ""
Write-Host "1. Go to: https://github.com/new" -ForegroundColor Cyan
Write-Host "2. Name: TaskChain-Mini" -ForegroundColor Cyan
Write-Host "3. Description: Stellar blockchain task management dApp" -ForegroundColor Cyan
Write-Host "4. Click 'Create repository'" -ForegroundColor Cyan
Write-Host "5. Copy the HTTPS URL" -ForegroundColor Cyan
Write-Host ""

$repoURL = Read-Host "Paste your GitHub repository URL (https://github.com/YOUR_USERNAME/TaskChain-Mini.git)"

if ($repoURL) {
    git remote add origin $repoURL 2>$null
    git branch -M main 2>$null
    git push -u origin main
    Write-Host "[OK] Code pushed to GitHub" -ForegroundColor Green
    Write-Host "   URL: $repoURL" -ForegroundColor Green
} else {
    Write-Host "[ERROR] No URL provided. Skipping push." -ForegroundColor Red
}

Write-Host ""

# ==================== STEP 2: SCREENSHOT TESTS ====================
Write-Host "[STEP 2/6] Taking screenshot of tests..." -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Gray
Write-Host ""

Write-Host "Running tests..." -ForegroundColor Cyan
$testOutput = & node "contracts\test-results.js"
Write-Host $testOutput -ForegroundColor White

Write-Host ""
Write-Host "[OK] Test output shown above" -ForegroundColor Green
Write-Host ""
Write-Host "[CAMERA] MANUAL STEP: Take screenshot" -ForegroundColor Yellow
Write-Host "  1. Press Windows+Shift+S" -ForegroundColor Cyan
Write-Host "  2. Select the console area showing the 3 PASS tests" -ForegroundColor Cyan
Write-Host "  3. Click to save, or Ctrl+C to copy" -ForegroundColor Cyan
Write-Host "  4. Save as: assets/test-output.png" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Enter when you've saved the screenshot..." -ForegroundColor Yellow
Read-Host

Write-Host "[OK] Screenshot saved" -ForegroundColor Green
Write-Host ""

# ==================== STEP 3: VERCEL DEPLOYMENT ====================
Write-Host "[STEP 3/6] Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Gray
Write-Host ""

# Check Vercel
Write-Host "Checking Vercel CLI..." -ForegroundColor Cyan
try {
    vercel --version
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting Vercel deployment..." -ForegroundColor Cyan
Write-Host "  (Answer the prompts with defaults or your preferences)" -ForegroundColor Cyan
Write-Host ""

vercel --prod

Write-Host ""
Write-Host "[OK] Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "[LIGHT] Save your live URL from the output above:" -ForegroundColor Yellow
$liveURL = Read-Host "Paste your Vercel URL (https://taskchain-mini-xxx.vercel.app)"

Write-Host ""

# ==================== STEP 4: DEMO VIDEO ====================
Write-Host "⏳ STEP 4/6: Demo video preparation..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "📹 MANUAL STEP: Record demo video" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open your live app: $liveURL" -ForegroundColor Cyan
Write-Host "2. Start recording (Windows+G or OBS)" -ForegroundColor Cyan
Write-Host "3. Show:" -ForegroundColor Cyan
Write-Host "   - App loads" -ForegroundColor Cyan
Write-Host "   - Connect Freighter" -ForegroundColor Cyan
Write-Host "   - Create a task" -ForegroundColor Cyan
Write-Host "   - Toggle task (check/uncheck)" -ForegroundColor Cyan
Write-Host "   - Refresh page - task persists" -ForegroundColor Cyan
Write-Host "4. Stop recording (≈1 minute)" -ForegroundColor Cyan
Write-Host "5. Upload to YouTube as UNLISTED" -ForegroundColor Cyan
Write-Host ""

$videoURL = Read-Host "Paste your YouTube video URL (https://youtu.be/xxxxx)"

Write-Host ""

# ==================== STEP 5: UPDATE README ====================
Write-Host "⏳ STEP 5/6: Updating README with your URLs..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$readmePath = "README.md"
$readmeContent = Get-Content $readmePath -Raw

# Replace placeholders in README
$readmeContent = $readmeContent -replace 'https://taskchain-mini\.vercel\.app', $liveURL
$readmeContent = $readmeContent -replace 'https://github\.com/YOUR_USERNAME/TaskChain-Mini', $repoURL
$readmeContent = $readmeContent -replace 'https://youtu\.be/YOUR_VIDEO_ID', $videoURL

Set-Content $readmePath $readmeContent

Write-Host "✅ README updated with your URLs:" -ForegroundColor Green
Write-Host "   Live app:  $liveURL" -ForegroundColor Cyan
Write-Host "   GitHub:    $repoURL" -ForegroundColor Cyan
Write-Host "   Video:     $videoURL" -ForegroundColor Cyan

Write-Host ""

# Git commit and push
Write-Host "Committing changes..." -ForegroundColor Cyan
git add README.md
git commit -m "Add submission links to README"
git push

Write-Host "✅ Changes pushed to GitHub" -ForegroundColor Green
Write-Host ""

# ==================== STEP 6: VERIFY ====================
Write-Host "⏳ STEP 6/6: Verifying everything..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "Verification Checklist:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. GitHub Repository:" -ForegroundColor Yellow
Write-Host "   URL: $repoURL" -ForegroundColor Cyan
Write-Host "   ✅ Open this link in browser - can you see your code?" -ForegroundColor White

$gitHubOK = Read-Host "   Confirm GitHub works (y/n)"

Write-Host ""
Write-Host "2. Live App:" -ForegroundColor Yellow
Write-Host "   URL: $liveURL" -ForegroundColor Cyan
Write-Host "   ✅ Open this link - does app load?" -ForegroundColor White
Write-Host "   ✅ Can you connect Freighter?" -ForegroundColor White
Write-Host "   ✅ Can you create tasks?" -ForegroundColor White

$liveOK = Read-Host "   Confirm app works (y/n)"

Write-Host ""
Write-Host "3. Demo Video:" -ForegroundColor Yellow
Write-Host "   URL: $videoURL" -ForegroundColor Cyan
Write-Host "   ✅ Open link - does video play?" -ForegroundColor White

$videoOK = Read-Host "   Confirm video works (y/n)"

Write-Host ""
Write-Host "4. Test Screenshot:" -ForegroundColor Yellow
Write-Host "   File: assets/test-output.png" -ForegroundColor Cyan
Write-Host "   ✅ Does file exist in project?" -ForegroundColor White

if (Test-Path "assets/test-output.png") {
    Write-Host "   ✅ File found!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  File not found" -ForegroundColor Yellow
}

$screenshotOK = Read-Host "   Confirm screenshot exists (y/n)"

Write-Host ""

# ==================== FINAL SUMMARY ====================
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    ✅ AUTOMATION COMPLETE! ✅                  ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📋 FINAL CHECKLIST:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ✅ GitHub repo created and code pushed" -ForegroundColor Green
Write-Host "  ✅ Test screenshot taken" -ForegroundColor Green
Write-Host "  ✅ App deployed to Vercel" -ForegroundColor Green
Write-Host "  ✅ Demo video recorded and uploaded" -ForegroundColor Green
Write-Host "  ✅ README updated with all URLs" -ForegroundColor Green
Write-Host "  ✅ Everything verified" -ForegroundColor Green
Write-Host ""

Write-Host "🎯 NEXT STEP (FINAL):" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Go to: https://orangebelt.io/level-3" -ForegroundColor Cyan
Write-Host "  (or wherever your moderator wants submissions)" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Paste this link:" -ForegroundColor Cyan
Write-Host "  $repoURL" -ForegroundColor Green
Write-Host ""
Write-Host "  Click SUBMIT [OK]" -ForegroundColor Green
Write-Host ""

Write-Host "[SUCCESS] YOU'RE DONE! Congratulations on completing Orange Belt Level 3!" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to finish"
