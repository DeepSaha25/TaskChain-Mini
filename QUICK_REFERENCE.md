# ⚡ QUICK COMMAND REFERENCE CARD

## Copy & Paste These Commands in Order

---

### STEP 1: GIT SETUP (5 MIN)

```powershell
cd "d:\Frontend Projects\TaskChain-Mini"
git init
git config user.email "youremail@gmail.com"
git config user.name "Your Name"
git add .
git commit -m "feat: Complete migration from Solidity to Stellar Soroban"
git commit -m "refactor: Update frontend with Stellar SDK and Freighter integration"  
git commit -m "docs: Add complete documentation and migration guide"
git log --oneline
```

Then push to GitHub (replace YOUR_GITHUB_USERNAME):
```powershell
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/TaskChain-Mini.git
git branch -M main
git push -u origin main
```

---

### STEP 2: TEST SCREENSHOT (2 MIN)

```powershell
cd "d:\Frontend Projects\TaskChain-Mini\contracts"
node test-results.js
```

Then screenshot the output:
- Press: `Windows Key + Shift + S`
- Save to: `d:\Frontend Projects\TaskChain-Mini\assets\test-output.png`

---

### STEP 3: DEPLOY TO VERCEL (5 MIN)

```powershell
npm install -g vercel

cd "d:\Frontend Projects\TaskChain-Mini"

vercel --prod
```

When asked: Choose defaults, at end you get URL like:
```
https://taskchain-mini.vercel.app
```

---

### STEP 4: RECORD DEMO VIDEO (10 MIN)

**Windows Built-in Recording:**
1. Press: `Windows Key + G`
2. Click "Start Recording"
3. Follow demo steps:
   - Open https://taskchain-mini.vercel.app
   - Click "Connect Freighter"
   - Create task "Build dApp on Stellar"
   - Toggle it done
   - Close and reopen app
   - Show task still persists
4. Press `Windows Key + G` → Click "Stop"
5. Video saves automatically

**Upload to YouTube:**
1. Go to youtube.com
2. Click upload icon
3. Select video file
4. Title: "TaskChain Mini - Stellar dApp Demo"
5. Set to "Unlisted"
6. Publish → Copy link

You get: `https://youtu.be/YOUR_VIDEO_ID`

---

### STEP 5: UPDATE README (3 MIN)

Open: `d:\Frontend Projects\TaskChain-Mini\README.md`

Find: `## 🎮 Live Demo & Submission`

Replace with:
```markdown
## 🎮 Live Demo & Submission

### 📱 Deployed Application
- **Live App**: https://taskchain-mini.vercel.app
- **GitHub Repository**: https://github.com/YOUR_GITHUB_USERNAME/TaskChain-Mini
- **Demo Video**: https://youtu.be/YOUR_VIDEO_ID

### ✅ Test Results
![Test Output](assets/test-output.png)
```

---

### STEP 6: VERIFY (5 MIN)

Click each link to test:
- [ ] https://taskchain-mini.vercel.app (opens app)
- [ ] https://github.com/YOUR_USERNAME/TaskChain-Mini (opens repo)
- [ ] https://youtu.be/YOUR_VIDEO_ID (plays video)
- [ ] assets/test-output.png (screenshot shows)

---

### STEP 7: SUBMIT

Go to Orange Belt Level 3 submission page.

Submit this link:
```
https://github.com/YOUR_GITHUB_USERNAME/TaskChain-Mini
```

---

## SAVE THIS FILE FOR REFERENCE

Print or bookmark this page while doing each step!

---

## KEY THINGS TO REMEMBER

✅ 3 commits required  
✅ GitHub must be PUBLIC  
✅ Test screenshot is REQUIRED  
✅ Demo video is REQUIRED  
✅ All links must WORK  
✅ Video must show persistence (reopen app and task is still there)

---

## ESTIMATED TIMES

| Step | Time | Critical? |
|------|------|-----------|
| 1. Git | 5 min | YES |
| 2. Screenshot | 2 min | YES |
| 3. Deploy | 5 min | YES |
| 4. Video | 10 min | YES |
| 5. README | 3 min | YES |
| 6. Verify | 5 min | YES |
| 7. Submit | 1 min | YES |
| **TOTAL** | **31 min** | |

---

**START WITH STEP 1 NOW!**

Use the detailed guide (`STEP_BY_STEP_GUIDE.md`) for full explanations.

Use this card for quick command reference.

Good luck! 🚀
