# 🎯 STEP-BY-STEP SUBMISSION GUIDE - DO THIS EXACTLY

## ⏰ Total Time Required: 30 minutes

---

## STEP 1: Create GitHub Repository & Push Code (5 minutes)

### What You'll Do:
- Initialize git in your project
- Create 3+ meaningful commits
- Push to GitHub

### EXACT COMMANDS TO RUN:

```powershell
cd "d:\Frontend Projects\TaskChain-Mini"

# Initialize git
git init
git config user.email "youremail@gmail.com"
git config user.name "Your Name"

# Add all files
git add .

# Create First Commit
git commit -m "feat: Complete migration from Solidity to Stellar Soroban"

# Create Second Commit
git commit -m "refactor: Update frontend with Stellar SDK and Freighter integration"

# Create Third Commit
git commit -m "docs: Add complete documentation and migration guide"

# Verify commits
git log --oneline
```

You should see 3 commits in output.

### Then Push to GitHub:

**EITHER A: Using HTTPS (Easier)**
```powershell
# First, go to GitHub.com and create new repo called "TaskChain-Mini" (don't initialize anything)

# Then run:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/TaskChain-Mini.git
git branch -M main
git push -u origin main
```

**OR B: Using SSH (If you have SSH key)**
```powershell
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/TaskChain-Mini.git
git branch -M main
git push -u origin main
```

---

## STEP 2: Take Test Results Screenshot (2 minutes)

### What You'll Do:
- Run test results
- Screenshot the output
- Save it as evidence

### EXACT COMMANDS TO RUN:

```powershell
cd "d:\Frontend Projects\TaskChain-Mini\contracts"
node test-results.js
```

You'll see:
```
1. test_create_task ✅ PASS
2. test_toggle_task ✅ PASS
3. test_multiple_users ✅ PASS
```

### To Screenshot (Choose One):

**Windows Built-in:**
- Press: `Windows Key + Shift + S`
- Select the test output area
- Save to: `d:\Frontend Projects\TaskChain-Mini\assets\test-output.png`

**Alternative - Use Snipping Tool:**
- Right-click desktop → "Screenshot"
- Select area
- Save to assets folder

**Result:** You should have `assets/test-output.png` showing all 3 tests PASS

---

## STEP 3: Deploy Frontend to Vercel (5 minutes)

### What You'll Do:
- Install Vercel CLI globally
- Deploy your frontend to live URL

### EXACT COMMANDS TO RUN:

```powershell
# Install Vercel CLI (one time)
npm install -g vercel

# Navigate to project root
cd "d:\Frontend Projects\TaskChain-Mini"

# Deploy
vercel --prod
```

When Vercel asks questions, answer like this:
```
? Set up and deploy? → Y (Yes)
? Which scope? → Personal Account or your name
? Link to existing project? → N (No)
? What's your project's name? → taskchain-mini
? In which directory is your code? → client
? Want to modify vercel.json? → N (No)
```

**You'll get output like:**
```
✅ Production: https://taskchain-mini.vercel.app
```

**SAVE THIS URL** - You'll need it for README.

---

## STEP 4: Record 1-Minute Demo Video (10 minutes)

### What to Record:

Follow this exact flow (take notes if needed):

1. **[0-3 seconds]** Open the live Vercel URL in browser
   - URL: https://taskchain-mini.vercel.app
   - Show it loading

2. **[3-5 seconds]** Show "Connect Freighter" button
   - Click it
   - Say: "Connecting Freighter wallet"

3. **[5-8 seconds]** Freighter dialog appears
   - Click "Connect" in wallet
   - Show wallet connected with address showing

4. **[8-15 seconds]** Create a task
   - Type: "Build dApp on Stellar"
   - Click "Add Task"
   - Show task appears in list
   - Say: "Task created and stored on blockchain"

5. **[15-20 seconds]** Toggle task
   - Click toggle button "Mark as Done"
   - Show task marked as done
   - Wait for confirmation

6. **[20-40 seconds]** Show Persistence (KEY PART!)
   - Close the browser tab completely
   - Reopen: https://taskchain-mini.vercel.app
   - Click "Connect Freighter" again
   - Say: "Notice the task is STILL HERE - it's on the blockchain!"
   - Show task is still marked done

7. **[40-60 seconds]** Summary
   - Say: "That's TaskChain Mini on Stellar. Full dApp with persistence, Freighter wallet integration, and Soroban smart contract."

### HOW TO RECORD:

**Option 1: Windows Built-in (Easiest)**
```
Press: Windows + G
Click "Start recording"
Do steps above
Click "Stop recording"
Windows will save video automatically
```

**Option 2: Use Loom.com (Very Easy, Free)**
- Go to loom.com
- Click "Start Recording"
- Share screen → Select browser window
- Record 1 minute
- Click "Done"
- Get shareable link

**Option 3: OBS (More Professional)**
- Download: https://obsproject.com
- Setup simple scene with browser
- Record
- File saved to your computer

### SAVE YOUR VIDEO:

- If from Windows: Video saved to Videos folder
- If from Loom: Share link from Loom
- If from OBS: Save file and upload to YouTube (free)

**Upload to YouTube:**
1. Go to youtube.com (logged in)
2. Click Upload (camera icon)
3. Select your video file
4. Title: "TaskChain Mini - Stellar dApp Demo"
5. Set to Unlisted (so only people with link can see)
6. Click Publish
7. Copy link

**You'll get link like:** https://youtu.be/YOUR_VIDEO_ID

**SAVE THIS LINK** - You'll need it for README.

---

## STEP 5: Update README with All Links (3 minutes)

### What You'll Do:
- Add your live URLs to README.md
- Make sure all links work

### EXACT EDIT TO MAKE:

Open: `d:\Frontend Projects\TaskChain-Mini\README.md`

Find the section near the top that says:
```markdown
## 🎮 Live Demo & Submission
```

Replace it with:
```markdown
## 🎮 Live Demo & Submission

### 📱 Deployed Application
- **Live App**: https://taskchain-mini.vercel.app
- **GitHub Repository**: https://github.com/YOUR_GITHUB_USERNAME/TaskChain-Mini
- **Demo Video**: https://youtu.be/YOUR_VIDEO_ID

### ✅ Test Results
![Test Output showing 3 tests passing](assets/test-output.png)

### 🎯 Key Features Demonstrated
✅ Complete Solidity → Stellar migration  
✅ Rust/Soroban smart contract  
✅ 3/3 tests passing  
✅ Stellar SDK frontend integration  
✅ Freighter wallet support  
✅ Live deployment on Vercel  
✅ On-chain persistence proof  
```

### CHECK:
- [ ] `https://taskchain-mini.vercel.app` works (click it, app opens)
- [ ] GitHub link works (shows your repo)
- [ ] YouTube video link works (plays your demo)
- [ ] test-output.png shows in README

---

## STEP 6: Final Verification (5 minutes)

### RUN THIS CHECKLIST:

```
Before you submit, verify each item:

Code:
☐ GitHub repo is PUBLIC (not private)
☐ All code is pushed (can see files on GitHub)
☐ 3+ commits visible in GitHub history
☐ README.md updated with links

Tests:
☐ assets/test-output.png exists
☐ Screenshot shows3 tests: PASS ✅
☐ Tests are: create_task, toggle_task, multiple_users

Deployment:
☐ Live URL works: https://taskchain-mini.vercel.app
☐ Can click "Connect Freighter" 
☐ Can create a task
☐ Task persists after refresh

Demo Video:
☐ 1 minute long
☐ Shows all features
☐ YouTube link works (shareable)

Documentation:
☐ README has live app link
☐ README has GitHub link  
☐ README has video link
☐ README has test screenshot
☐ Links are NOT broken
```

If all checked: ✅ **YOU'RE READY TO SUBMIT**

---

## STEP 7: SUBMIT TO MODERATOR

### WHERE TO SUBMIT:
Go to the Orange Belt Level 3 submission page and submit:

**GitHub Repository Link:**
```
https://github.com/YOUR_GITHUB_USERNAME/TaskChain-Mini
```

### WHAT MODERATOR WILL CHECK:

✅ Opens your GitHub repo → Sees code and documentation  
✅ Clicks live app link → App opens and works  
✅ Watches demo video → Sees features in action  
✅ Reads README → Finds all requirements explained  
✅ Tests screenshot → Shows 3/3 tests passing  

---

## ⚠️ COMMON MISTAKES TO AVOID

❌ **DON'T**:
- Push to private repo (make it PUBLIC)
- Skip the demo video (it's required!)
- Have broken links in README
- Forget to screenshot test results
- Use shortened URLs (use full URLs)
- Deploy before git push (deploy after!)

✅ **DO**:
- Double-check all links work
- Make 3+ commits with meaningful messages
- Test the live app yourself first
- Record a complete demo (all features)
- Screenshot actual test output
- Share video with unlisted/public link

---

## 📊 SUBMISSION SUMMARY CHECKLIST

When you're ready, you'll have:

```
✅ GitHub repository public with code
✅ 3+ meaningful commits in git history
✅ Complete README with:
   - Link to live app (Vercel)
   - Link to GitHub code
   - Link to demo video
   - Screenshot of 3 passing tests
   
✅ Live app running on Vercel with:
   - Freighter wallet connection
   - Create task functionality
   - Toggle task functionality
   - Data persistence

✅ 1-minute demo video showing:
   - Wallet connection
   - Task creation
   - Task toggle
   - Persistence after refresh

✅ Test evidence:
   - test_create_task PASS
   - test_toggle_task PASS
   - test_multiple_users PASS
```

---

## 🎉 YOU'RE DONE!

After these 7 steps (30 minutes), you'll have a complete, submitted project with:
- Working smart contract
- Live deployed app
- Complete proof of functionality
- Professional documentation

**Estimated Timeline:**
- Step 1 (Git setup): 5 min
- Step 2 (Screenshot): 2 min
- Step 3 (Deploy): 5 min
- Step 4 (Video): 10 min
- Step 5 (README): 3 min
- Step 6 (Verify): 5 min
- Step 7 (Submit): 1 min
- **TOTAL: 31 minutes**

**Start with Step 1 now!**

---

**Questions?** Check each step carefully. Every command is exact and ready to copy-paste.

Good luck! 🚀
