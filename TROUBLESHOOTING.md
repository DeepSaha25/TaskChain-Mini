# 🔧 TROUBLESHOOTING GUIDE

## Common Issues & Solutions

---

## ❌ Git Issues

### Problem: "Git is not recognized"
**Solution:**
```powershell
# Install Git from: https://git-scm.com/download/win
# Then restart PowerShell or CMD
```

### Problem: "Permission denied" when pushing
**Solution:**
```powershell
# Use GitHub CLI instead:
npm install -g gh
gh auth login
# Then use web interface at GitHub.com to create repo
```

### Problem: "Failed to push" after setting remote
**Solution:**
```powershell
# Check remote URL:
git remote -v

# If wrong, fix it:
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/TaskChain-Mini.git
git push -u origin main
```

---

## ❌ Vercel Deployment Issues

### Problem: "Vercel not found during npm install"
**Solution:**
```powershell
npm install -g vercel --force
vercel --version  # Verify installation
```

### Problem: "Build failed on Vercel" 
**Solution:**
1. Check errors in Vercel dashboard
2. Likely missing environment variable:
   - Go to Vercel project settings
   - Add environment variable:
     - Name: `VITE_CONTRACT_ADDRESS`
     - Value: `CAxxxxxxxxxxxxxxx` (your contract address)
   - Redeploy

### Problem: "App says missing contract address"
**Solution:**
1. Ensure `.env` file exists in `client/` with:
   ```
   VITE_CONTRACT_ADDRESS=CAxxxxxxx
   ```
2. Rebuild: `npm run build`
3. Redeploy to Vercel

---

## ❌ Freighter Wallet Issues

### Problem: "Freighter not found/installed"
**Solution:**
1. Download from: https://freighter.app
2. Install extension in Chrome/Firefox
3. Create wallet or import secret key
4. Refresh the app

### Problem: "Can't connect wallet to app"
**Solution:**
1. Make sure Freighter is UNLOCKED
2. Check if app is asking for permissions - click "Allow"
3. Check browser console (F12) for errors
4. Refresh page and try again
5. Try different browser if still fails

### Problem: "Wallet connects but says 'no tasks'"
**Solution:**
This is normal! The app needs a contract address to fetch tasks.
- Ensure `VITE_CONTRACT_ADDRESS` is set in `.env`
- Restart the app (`npm run dev`)

---

## ❌ Demo Video Issues

### Problem: "Windows Game Bar not recording"
**Solution:**
```powershell
# Try OBS instead:
# Download from: https://obsproject.com/download
# Or use Loom.com (no installation needed)
```

### Problem: "Video too large to upload"
**Solution:**
1. Compress video: Use HandBrake (free)
2. Or upload to YouTube:
   - YouTube handles large files
   - Auto-compresses for streaming
3. Or use Google Drive instead of YouTube

### Problem: "Can't share YouTube video"
**Solution:**
1. Go to video
2. Click "Share"
3. Make sure "Public" or "Unlisted" is selected
4. Copy link

---

## ❌ Screenshot Issues

### Problem: "Can't take screenshot of test output"
**Solution:**
```powershell
# Alternative method - Save output to file:
cd "d:\Frontend Projects\TaskChain-Mini\contracts"
node test-results.js > test-output.txt

# Then open in Notepad and screenshot
# Or: Print-to-PDF
#   - Open test-output.txt
#   - Ctrl+P → "Print to PDF" → Save as test-output.pdf
```

---

## ❌ README Issues

### Problem: "Links don't work in GitHub"
**Solution:**
Check that links are correct:
- GitHub links must start with `https://github.com/`
- YouTube links must be full URL like `https://youtu.be/xxxxx`
- Image paths must use `/` not `\`
- Check no extra spaces in links

### Problem: "Screenshot not showing in README"
**Solution:**
1. Ensure image file exists: `assets/test-output.png`
2. Path in markdown must be: `![Test](assets/test-output.png)`
3. NOT: `![Test](d:\Frontend...)` (wrong path format)
4. File must be PNG/JPG
5. Push image file to GitHub too

---

## ❌ Live App Issues

### Problem: "App says 'Freighter not found'"
**Solution:**
- Install Freighter extension from https://freighter.app
- Refresh the Vercel app page

### Problem: "App loads but shows errors"
**Solution:**
1. Open browser console: `F12`
2. Look for red error messages
3. Common errors:
   - "Missing VITE_CONTRACT_ADDRESS" → Set in `.env` and redeploy
   - "Cannot connect" → Ensure Freighter is installed
   - "Contract not found" → Verify contract address is correct

### Problem: "Can't create task"
**Solution:**
1. Ensure Freighter is unlocked
2. Ensure wallet is connected
3. Check browser console for detailed error
4. Ensure contract address is correct format (starts with `CA...`)

---

## ❌ Submission Issues

### Problem: "Moderator says links are broken"
**Solution:**
Before submitting, verify each link yourself:
- Copy each link
- Paste in new browser tab
- Make sure page loads
- If broken, fix and update README

### Problem: "Moderator can't see test screenshot"
**Solution:**
1. Ensure file exists: `assets/test-output.png`
2. File is committed and pushed to GitHub
3. Markdown path is correct: `![Test](assets/test-output.png)`
4. Check GitHub web interface - can you see the file?

### Problem: "Video link doesn't work"
**Solution:**
1. If YouTube: Make sure it's "Unlisted" or "Public", not "Private"
2. If Google Drive: Make sure "Anyone with link can view"
3. Test link in incognito/private browser
4. Re-record and re-upload if still broken

---

## ✅ VERIFICATION CHECKLIST

Before submitting, verify:

```
❓ Can I open my live app in browser? 
   → https://taskchain-mini.vercel.app
   → Should show app interface

❓ Can I click "Connect Freighter"?
   → Should open wallet dialog
   → Should connect successfully

❓ Can I create a task?
   → Type task name
   → Click Add Task
   → Task appears in list

❓ Does task persist after refresh?
   → Press F5 to refresh
   → Task should still be there

❓ Can I open my GitHub repo?
   → https://github.com/YOUR_USERNAME/TaskChain-Mini
   → Should show code

❓ Can I play my demo video?
   → https://youtu.be/YOUR_ID
   → Should play 1-minute video

❓ Can I see test screenshot?
   → https://github.com/YOUR_USERNAME/TaskChain-Mini/blob/main/assets/test-output.png
   → Should show 3 tests PASS

❓ Does README show all sections?
   → Submission links
   → Live app link
   → GitHub link
   → Video link
   → Test screenshot
```

If all ✅: **READY TO SUBMIT**

---

## 📞 Still Stuck?

1. **Check STEP_BY_STEP_GUIDE.md** - For detailed instructions
2. **Check QUICK_REFERENCE.md** - For exact commands
3. **Check README.md** - For project info
4. **Check browser console (F12)** - For detailed error messages
5. **Try different browser** - Some issues are browser-specific

---

**Most issues are solved by:**
1. Checking an error message in console (F12)
2. Searching that error message
3. Following the solution above

You've got this! 🚀
