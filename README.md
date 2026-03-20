# TaskChain Mini dApp

TaskChain Mini is a full-stack Web3 task manager built for Orange Belt Level 3. It includes a Solidity smart contract, a React frontend, and a tested Hardhat workflow.

## Stack

- Smart contracts: Solidity + Hardhat
- Frontend: React + Vite + ethers.js
- Testing: Hardhat test suite
- UX: transaction progress feedback + short-lived local cache

## What It Does

- Connects a wallet (MetaMask)
- Creates personal tasks on-chain
- Toggles task completion status
- Loads only the connected wallet's tasks
- Shows transaction/loading progress
- Caches reads in localStorage (TTL: 30s)

## Workspace Structure

```text
.
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/ProgressBar.jsx
│   │   └── lib/
│   │       ├── cache.js
│   │       └── contract.js
│   └── package.json
├── contracts/
│   ├── contracts/TaskRegistry.sol
│   ├── scripts/deploy.js
│   ├── test/TaskRegistry.test.js
│   └── package.json
├── assets/
│   ├── demo.mp4
│   ├── test-output.png
│   └── testevidence.png
└── vercel.json
```

## Prerequisites

- Node.js 18+
- npm 9+
- MetaMask browser extension

## Quick Start

### 1. Install Dependencies

```bash
cd contracts && npm install
cd ../client && npm install
```

### 2. Compile and Test Contracts

```bash
cd contracts
npm run compile
npm test
```

### 3. Run Frontend Locally

```bash
cd client
cp .env.example .env
# set VITE_CONTRACT_ADDRESS in .env
npm run dev
```

Open the local URL shown by Vite (usually http://localhost:5173).

## Contract Deployment

### Localhost Deployment

In terminal 1:

```bash
cd contracts
npx hardhat node
```

In terminal 2:

```bash
cd contracts
npm run deploy:local -- --network localhost
```

### Sepolia Deployment

```bash
cd contracts
cp .env.example .env
```

Add these values to contracts/.env:

- RPC_URL
- PRIVATE_KEY

Then deploy:

```bash
cd contracts
npm run deploy:sepolia
```

Copy the deployed contract address into client/.env as VITE_CONTRACT_ADDRESS.

## Frontend Deployment (Vercel)

This repo includes vercel.json configured for client build output.

- Install command: npm install --prefix client
- Build command: npm run build --prefix client
- Output directory: client/dist

Required environment variable on Vercel:

- VITE_CONTRACT_ADDRESS=<your-deployed-contract-address>

If your app shows a missing contract address error, verify the variable and redeploy.

## Test and Demo Evidence

Test screenshot:

![Test Output](assets/test-output.png)

App screenshot:

![App Evidence](assets/testevidence.png)

Demo video:

[Watch Demo Video](assets/demo.mp4)


## Final Links (Update Before Submission)

- Live app: https://taskchainmini.vercel.app/
- Repository: https://github.com/DeepSaha25/TaskChain-Mini
- Demo video: assets/demo.mp4
