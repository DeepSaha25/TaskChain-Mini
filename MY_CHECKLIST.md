# ✏️ MY SUBMISSION CHECKLIST

**Print this out or keep it open while following STEP_BY_STEP_GUIDE.md**

---

## SET UP (Do once)

- [ ] I have opened `STEP_BY_STEP_GUIDE.md`
- [ ] I have opened `QUICK_REFERENCE.md` for commands
- [ ] I have a GitHub account at github.com
- [ ] I have Freighter wallet installed
- [ ] I'm ready to start (30 min available)

---

## STEP 1: GIT SETUP (5 minutes)

- [ ] Opened PowerShell/CMD in project folder
- [ ] Created GitHub empty repo (no README, no gitignore)
- [ ] Ran: `git init`
- [ ] Ran: `git config user.name "My Name"`
- [ ] Ran: `git config user.email "my@email.com"`
- [ ] Ran: `git add .`
- [ ] Ran: `git commit -m "Initial commit: Stellar TaskChain dApp"`
- [ ] Ran: `git remote add origin https://github.com/...`
- [ ] Ran: `git branch -M main`
- [ ] Ran: `git push -u origin main`
- [ ] ✅ Code is now on GitHub

**My GitHub URL:** `https://github.com/_____________/______________`

---

## STEP 2: SCREENSHOT TESTS (2 minutes)

- [ ] Opened PowerShell in `contracts` folder
- [ ] Ran: `node test-results.js`
- [ ] Saw output with 3 tests PASSING ✅
- [ ] Took screenshot with Windows+Shift+S
- [ ] Saved screenshot as: `assets/test-output.png`
- [ ] File is in project folder (can see it there)

**Screenshot Status:** 
- [ ] File exists
- [ ] Shows 3 tests PASSING
- [ ] File size is reasonable (not too small)

---

## STEP 3: DEPLOY TO VERCEL (5 minutes)

- [ ] Ran: `npm install -g vercel`
- [ ] Ran: `vercel --prod` from project root
- [ ] Confirmed project name
- [ ] Confirmed Vite project
- [ ] Answered deployment questions
- [ ] Waited for deployment to complete
- [ ] Got URL from output (https://taskchain-mini-xxx.vercel.app)

**My Live URL:** `https://______________________.vercel.app`

**Verification:**
- [ ] Can I visit the URL in browser?
- [ ] Does app load (see task interface)?
- [ ] Can I click "Connect Freighter"?

---

## STEP 4: DEMO VIDEO (10 minutes)

### Recording
- [ ] Chose recording tool (Game Bar / OBS / Loom)
- [ ] Opened live app in browser
- [ ] Started recording
- [ ] Showed:
  - [ ] App loads and looks right
  - [ ] Click "Connect Freighter" → wallet connects
  - [ ] Type task name → click Add Task
  - [ ] Task appears in list
  - [ ] Click checkbox → task marks done
  - [ ] Page refreshes → task still there (persistence!)
- [ ] Stopped recording (about 1 minute total)
- [ ] Saved video file

### Uploading to YouTube
- [ ] Went to youtube.com
- [ ] Clicked "Create" → "Upload video"
- [ ] Selected my video file
- [ ] Added title: "TaskChain dApp Demo"
- [ ] Added description: "Stellar blockchain task management app"
- [ ] Set to "UNLISTED" (important! not private, not public)
- [ ] Waited for upload/processing
- [ ] Got YouTube link

**My YouTube URL:** `https://youtu.be/______________`

**Verification:**
- [ ] Link works in incognito window
- [ ] Video plays
- [ ] Video is 30 seconds - 3 minutes

---

## STEP 5: UPDATE README (3 minutes)

- [ ] Opened: `README.md` in VS Code
- [ ] Found section: "## 🎮 Submission Links"
- [ ] Replaced placeholder URLs:
  - `https://taskchain-mini.vercel.app` → My live URL
  - `https://github.com/YOUR_USERNAME/TaskChain-Mini` → My GitHub URL
  - `https://youtu.be/YOUR_VIDEO_ID` → My YouTube URL
- [ ] Saved file
- [ ] Ran: `git add .`
- [ ] Ran: `git commit -m "Add submission links"`
- [ ] Ran: `git push`

**Updated URLs in README:**
- [ ] Live app link
- [ ] GitHub link
- [ ] Video link
- [ ] Test screenshot path

---

## STEP 6: VERIFY (5 minutes)

### Test All Links
- [ ] GitHub link works → Shows my code
  - URL: ________________________
  - Status: [ ] Working

- [ ] Live app link works → Shows app interface
  - URL: ________________________
  - Status: [ ] Working

- [ ] Video link works → Shows video
  - URL: ________________________
  - Status: [ ] Working

- [ ] Screenshot shows in README
  - Path should show green checkmark in GitHub
  - Status: [ ] Working

### Test App Functionality
- [ ] App loads in browser
- [ ] Can connect Freighter
- [ ] Can create task
- [ ] Can toggle task (check/uncheck)
- [ ] Tasks persist after refresh (F5)

**All verified:** [ ] YES - READY TO SUBMIT

---

## STEP 7: SUBMIT (1 minute)

- [ ] Went to Orange Belt Level 3 submission form
- [ ] Pasted GitHub link
- [ ] Clicked "Submit"
- [ ] Got confirmation message

**Submission Status:**
- [ ] SUBMITTED! 🎉

**Confirmation:**
- [ ] Received email confirmation
- [ ] Can see submission on dashboard

---

## 🎉 COMPLETION SUMMARY

| Step | Time | Status |
|------|------|--------|
| 1. Git Setup | 5 min | [ ] Done |
| 2. Screenshots | 2 min | [ ] Done |
| 3. Deploy | 5 min | [ ] Done |
| 4. Demo Video | 10 min | [ ] Done |
| 5. Update README | 3 min | [ ] Done |
| 6. Verify | 5 min | [ ] Done |
| 7. Submit | 1 min | [ ] Done |
| **TOTAL** | **31 min** | |

---

## 📋 IMPORTANT NOTES

**Things that might go wrong:**

1. **Git error?**
   - Check TROUBLESHOOTING.md > Git Issues
   - Or re-read STEP 1 in STEP_BY_STEP_GUIDE.md

2. **Video won't upload?**
   - Try YouTube instead of other platform
   - Make sure it's "UNLISTED" not "PRIVATE"

3. **Link doesn't work?**
   - Copy exact URL from the source
   - Test in new browser tab
   - Test in incognito window

4. **App doesn't work live?**
   - Check browser console (F12)
   - Verify Freighter is installed
   - Check Vercel dashboard for build errors

5. **Stuck?**
   - Read TROUBLESHOOTING.md
   - Copy exact command from QUICK_REFERENCE.md
   - Take a screenshot of the error

---

## 🔑 KEY URLS REFERENCE

| What | Where |
|------|-------|
| Soroban Docs | https://developers.stellar.org/docs |
| Freighter Wallet | https://freighter.app |
| Stellar Testnet | https://stellar.expert (check balance) |
| My GitHub | https://github.com/YOUR_USERNAME |
| My Live App | https://taskchain-mini-xxx.vercel.app |

---

## 💪 YOU'VE GOT THIS!

**Remember:**
- All code is done ✅
- All files are ready ✅
- Just follow the steps ✅
- Takes 30 minutes ✅
- Then you're done! 🎉

**When you get stuck:**
1. DON'T PANIC
2. Check TROUBLESHOOTING.md
3. Re-read the current step
4. Look at the error message
5. It will make sense

**Start STEP 1 NOW!** ⏰

---

## 📝 NOTES FOR MYSELF

Use this space to write any personal notes while going through the steps:

```
STEP 1 NOTES:
_________________________________________________________________
_________________________________________________________________

STEP 2 NOTES:
_________________________________________________________________
_________________________________________________________________

STEP 3 NOTES:
_________________________________________________________________
_________________________________________________________________

STEP 4 NOTES:
_________________________________________________________________
_________________________________________________________________

STEP 5 NOTES:
_________________________________________________________________
_________________________________________________________________

STEP 6 NOTES:
_________________________________________________________________
_________________________________________________________________

STEP 7 NOTES:
_________________________________________________________________
_________________________________________________________________
```

---

**PRINT ME OUT! 📄**

Keep me open on phone while you follow STEP_BY_STEP_GUIDE.md!

Good luck! 🚀
