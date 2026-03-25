# 🚀 TaskChain Mini - Stellar Edition - Quick Start

## Prerequisites (5 minutes)

### Have you already installed?
- [ ] Node.js 18+ (`node --version`)
- [ ] Rust (`rustc --version`)
- [ ] Soroban CLI (`cargo install soroban-cli --locked`)
- [ ] Freighter Wallet (https://freighter.app)

### Get Testnet XLM
1. Go to https://stellar.org/developers/reference/testnet
2. Fund your Freighter wallet account

---

## Deploy Smart Contract (5-10 minutes)

### Step 1: Prepare Environment
```bash
cd contracts
cp .env.example .env
```

### Step 2: Get Your Secret Key
1. Open Freighter extension (top right)
2. Click **Settings** (gear icon)
3. Go to **Account Settings**
4. Click **Export Secret Key**
5. Copy the key (starts with `S`)
6. Paste into `contracts/.env`:
   ```
   SOROBAN_SECRET_KEY=Syour_secret_here
   ```

### Step 3: Build and Deploy
```bash
# Install dependencies
npm install

# Build WASM contract
cargo build --target wasm32-unknown-unknown --release

# Deploy to Stellar testnet
npm run deploy
```

### Step 4: Save Contract Address
Look for output like:
```
TaskRegistry deployed to: CAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Copy this address!**

---

## Run Frontend Locally (2 minutes)

### Step 1: Set Contract Address
```bash
cd ../client
echo "VITE_CONTRACT_ADDRESS=CAxxxxxxxxxxxxxxxx" > .env
```

(Replace with your contract address from Step 4 above)

### Step 2: Install and Run
```bash
npm install
npm run dev
```

### Step 3: Open App
- Open http://localhost:5173 in browser
- Click **"Connect Freighter"**
- Grant permissions when prompted
- Start creating tasks!

---

## Test Everything (5 minutes)

### In the App:
1. ✅ **Connect Wallet** - Button shows your address
2. ✅ **Create Task** - Type "Test task" and click Add Task
3. ✅ **Sign Transaction** - Freighter popup appears, click Approve
4. ✅ **Task Created** - See task in list below
5. ✅ **Toggle Task** - Click "Mark as Done"
6. ✅ **Persist** - Refresh page (F5) - task still there
7. ✅ **Disconnect** - Click button to disconnect

---

## Troubleshooting

### ❌ "Freighter not found"
```bash
# Install from https://freighter.app
# Then refresh the browser
```

### ❌ "Deploy failed"
```bash
# Update Soroban CLI
cargo install soroban-cli --locked --force

# Clean and rebuild
cargo clean
cargo build --target wasm32-unknown-unknown --release
```

### ❌ "Port 5173 already in use"
```bash
# Kill process or use different port
npm run dev -- --port 5174
```

### ❌ "No XLM for fees"
- Fund account at: https://stellar.org/developers/reference/testnet
- Paste your Freighter public key (starts with `G`)

---

## Next Steps

### Local Testing ✅ Done
You're now running on local testnet with Freighter!

### Deploy to Vercel (Optional)
```bash
# Push to GitHub
git add .
git commit -m "Migrate to Stellar Soroban"
git push

# Connect to Vercel and set env var:
# VITE_CONTRACT_ADDRESS=CA...
```

### Read More
- [Full README](./README.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Soroban Docs](https://developers.stellar.org/docs/smart-contracts)

---

## Quick Reference

| Action | Command |
|--------|---------|
| Build contract | `cd contracts && cargo build --target wasm32-unknown-unknown --release` |
| Deploy contract | `npm run deploy` (in contracts/) |
| Run frontend | `npm run dev` (in client/) |
| Run tests | `npm test` (in contracts/) |
| View logs | Browser console (F12) |

---

**Happy building! 🎉**

Questions? Check the README or MIGRATION_GUIDE.
