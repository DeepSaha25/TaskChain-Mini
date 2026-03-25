# TaskChain Mini dApp - Stellar Edition

**Migrated from Solidity to Stellar Soroban** ✨

TaskChain Mini is a full-stack Web3 task manager built on the Stellar blockchain using Soroban smart contracts. It features a Rust smart contract, a React frontend with Stellar SDK, and comprehensive testing.

## 🎮 Submission Links

> **Replace the XXX values below with your actual links after completing deployment**

| Item | Link |
|------|------|
| 🌐 **Live App** | `https://taskchain-mini.vercel.app` |
| 💾 **GitHub Repository** | `https://github.com/YOUR_USERNAME/TaskChain-Mini` |
| 🎬 **Demo Video (1 min)** | `https://youtu.be/YOUR_VIDEO_ID` |
| ✅ **Test Results Screenshot** | [View](assets/test-output.png) (3/3 tests passing) |

**Follow [STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md) for detailed submission instructions (30 minutes total)**

---

## Stack

- **Smart Contracts**: Rust + Soroban (Stellar's smart contract platform)
- **Frontend**: React + Vite + @stellar/js-sdk
- **Wallet**: Freighter (Stellar wallet)
- **Network**: Stellar Testnet
- **Testing**: Rust Cargo tests
- **UX**: Transaction progress feedback + short-lived local cache (30s TTL)

## What It Does

- Connects a Stellar wallet (Freighter)
- Creates personal tasks on the Stellar blockchain
- Toggles task completion status
- Loads only the connected wallet's tasks
- Shows transaction/loading progress
- Caches reads in localStorage (TTL: 30s)

## Workspace Structure

```
.
├── client/
│   ├── src/
│   │   ├── App.jsx                          # Main React app (Stellar SDK)
│   │   ├── main.jsx
│   │   ├── styles.css
│   │   ├── components/
│   │   │   └── ProgressBar.jsx
│   │   └── lib/
│   │       ├── cache.js
│   │       └── contract.js                  # Stellar contract helpers
│   ├── package.json
│   └── vite.config.js
├── contracts/
│   ├── src/
│   │   └── lib.rs                           # Soroban TaskRegistry contract
│   ├── Cargo.toml                           # Rust project config
│   ├── soroban-rep.toml                     # Soroban registry config
│   ├── deploy.js                            # Deployment script
│   ├── .env.example
│   └── package.json
├── assets/
└── README.md (this file)
```

## Prerequisites

- **Node.js** 18+ and npm 9+
- **Rust** 1.70+ (for building Soroban contracts)
- **Soroban CLI** (`soroban` command)
  ```bash
  cargo install soroban-cli --locked
  ```
- **Freighter Wallet**: Install from [freighter.app](https://freighter.app)

## Quick Start

### 1. Install Dependencies

```bash
# Install contract build dependencies
cd contracts && npm install

# Install frontend dependencies
cd ../client && npm install && cd ..
```

### 2. Build and Test Contract

```bash
cd contracts

# Build the contract to WASM
cargo build --target wasm32-unknown-unknown --release

# Run tests
npm test
```

### 3. Deploy Contract to Testnet

```bash
cd contracts

# Copy environment template
cp .env.example .env

# Edit .env with your Stellar secret key from Freighter
# SOROBAN_SECRET_KEY=S...
```

**Getting your Stellar secret key:**
1. Open Freighter extension
2. Click settings (gear icon)
3. Go to Account → Export Secret Key
4. Copy your secret key (starts with 'S')
5. Add to `contracts/.env` as `SOROBAN_SECRET_KEY=S...`

Deploy to testnet:
```bash
npm run deploy
```

The script will output a contract address starting with `C`. **Copy this address.**

### 4. Configure Frontend

```bash
cd ../client

# Create .env file with contract address
echo "VITE_CONTRACT_ADDRESS=CAxxxxxxxxx..." > .env
```

Replace `CAxxxxxxxxx...` with the contract address from step 3.

### 5. Run Frontend Locally

```bash
cd client
npm run dev
```

Open http://localhost:5173 in your browser and connect your Freighter wallet.

## Contract Deployment

### Building the Contract

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

This generates WASM (`target/wasm32-unknown-unknown/release/task_registry.wasm`).

### Stellar Testnet Deployment

1. **Get testnet XLM** (for fees):
   - Visit: https://stellar.org/developers/reference/testnet
   - Fund your Freighter account

2. **Deploy contract**:
   ```bash
   cd contracts
   cp .env.example .env
   # Edit .env with your secret key
   npm run deploy
   ```

3. **Copy contract address** (starts with `C...`) from output

### Network Configuration

**Testnet** (default):
- Network: `Test SDF Network ; September 2015`
- RPC: `https://soroban-testnet.stellar.org:443`

**Mainnet** (production):
Edit `client/src/lib/contract.js` to change `STELLAR_RPC_URL`

## Frontend Deployment (Vercel)

### Prerequisites

- GitHub account with repository pushed
- Vercel account (vercel.com)

### Configuration

`vercel.json` is already configured:

```json
{
  "buildCommand": "npm install --prefix client && npm run build --prefix client",
  "outputDirectory": "client/dist"
}
```

### Deployment Steps

1. Connect your GitHub repo to Vercel
2. Add environment variable:
   - Name: `VITE_CONTRACT_ADDRESS`
   - Value: `CAxxxxxxxxx...` (your contract address)
3. Click Deploy

The app will be live at `https://your-project.vercel.app`

## Testing

### Contract Tests

```bash
cd contracts
npm test
```

Runs Rust tests in `src/lib.rs` using Soroban's test framework.

### Manual Testing

1. Connect Freighter wallet to app
2. Create a task (check status updates)
3. Toggle task completion (verify state changes)
4. Refresh (ensure tasks persist)
5. Check browser console for transaction logs

## Architecture Changes - Solidity to Stellar

| Feature | Solidity/Ethereum | Rust/Stellar Soroban |
|---------|------------------|---------------------|
| Language | Solidity | Rust |
| Platform | Ethereum | Stellar Testnet |
| Wallet | MetaMask | Freighter |
| Integration | ethers.js | @stellar/js-sdk |
| Contract Calls | Direct function calls | Simulate + Sign + Send |
| State Storage | Mappings | Soroban Ledger |
| Testing | Hardhat | Cargo tests |

## Troubleshooting

### "Freighter not found"
```bash
# Install Freighter
# https://freighter.app

# Then refresh the page
```

### "Failed to deploy contract"
- Check Soroban CLI: `soroban --version`
- Update: `cargo install soroban-cli --locked --force`
- Ensure Rust is up to date: `rustup update`

### "Invalid contract address"
- Verify address starts with `C`
- Ensure it's in `client/.env` as `VITE_CONTRACT_ADDRESS=CAxx...`

### "Transaction simulation failed"
- Ensure testnet XLM in Freighter account
- Check contract address is correct
- Review browser console for details

### "Permission denied" from Freighter
- Unlock Freighter wallet
- Grant dApp permissions when prompted
- Refresh page and retry

## Resources

- [Soroban Docs](https://developers.stellar.org/docs/smart-contracts)
- [Stellar JS SDK](https://github.com/stellar/js-stellar-sdk)
- [Freighter Wallet](https://freighter.app)
- [Stellar Testnet](https://stellar.org/developers/reference/testnet)
