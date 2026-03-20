# Level 3 Orange Belt - ![alt text](image.png)dApp

A complete end-to-end mini dApp submission built with:
- Smart contract: Solidity + Hardhat
- Frontend: React + Vite + ethers.js
- Tests: Hardhat test suite (4 tests)
- UX quality: loading states, transaction progress indicator, and local caching

## Features

- Connect wallet (MetaMask)
- Create personal tasks on-chain
- Toggle task status (done/pending)
- Fetch only your task IDs and details
- Transaction loading state + animated progress bar
- Basic cache layer with `localStorage` + TTL (30s)

## Project Structure

```text
.
├── contracts
│   ├── contracts/TaskRegistry.sol
│   ├── test/TaskRegistry.test.js
│   ├── scripts/deploy.js
│   └── hardhat.config.js
└── client
    ├── src/App.jsx
    ├── src/lib/cache.js
    └── src/components/ProgressBar.jsx
```

## Prerequisites

- Node.js 18+
- npm 9+
- MetaMask browser extension

## 1. Smart Contract Setup

```bash
cd contracts
npm install
npm run compile
npm test
```

### Deploy locally

```bash
npx hardhat node
# new terminal
cd contracts
npm run deploy:local -- --network localhost
```

### Deploy to Sepolia

1. Copy env template:

```bash
cd contracts
cp .env.example .env
```

2. Fill values in `.env`:
- `RPC_URL`
- `PRIVATE_KEY`

3. Deploy:

```bash
npm run deploy:sepolia
```

## 2. Frontend Setup

1. Copy frontend env:

```bash
cd client
cp .env.example .env
```

2. Set `VITE_CONTRACT_ADDRESS` to deployed contract address.

3. Start app:

```bash
npm install
npm run dev
```

4. Open URL shown by Vite (usually `http://localhost:5173`).

## Testing Evidence (3+ tests)

Run:

```bash
cd contracts
npm test
```

Expected: at least 3 tests pass. This project includes 4 passing tests.

Screenshot requirement:
- Capture your terminal after `npm test`
- Save screenshot in repository, for example: `assets/test-output.png`
- Add image markdown below:

```md
![Test Output](assets/test-output.png)
```

## Submission Checklist Mapping

- [x] Mini-dApp fully functional
- [x] Minimum 3 tests passing (4 included)
- [x] README complete
- [ ] Demo video recorded (add your link)
- [ ] Minimum 3+ meaningful commits (perform during your development flow)

## Required Links (Add Before Submission)

- Live demo: `https://your-deployment-url.vercel.app`
- Demo video (1 minute): `https://youtube.com/your-demo-link`
- Public repository: `https://github.com/your-username/your-repo`

## Deploy-Ready Environment Checklist (Sepolia + Vercel)

Use this checklist right before deployment.

### Sepolia (contracts)

- [ ] `contracts/.env` created from `.env.example`
- [ ] `RPC_URL` is set to a working Sepolia RPC endpoint
- [ ] `PRIVATE_KEY` is set (no `0x` prefix)
- [ ] Deployer wallet funded with Sepolia ETH
- [ ] Contract deployment command succeeds:

```bash
cd contracts
npm run deploy:sepolia
```

- [ ] Deployed contract address copied for frontend env

### Vercel (frontend)

- [ ] Vercel project created with root directory set to `client`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable added in Vercel:
    - `VITE_CONTRACT_ADDRESS=<your-sepolia-contract-address>`
- [ ] Redeploy triggered after setting environment variable
- [ ] Live URL loads and wallet actions work (connect/create/toggle/refresh)

### Post-deploy sanity checks

- [ ] Create a new task from deployed app
- [ ] Toggle task completion
- [ ] Confirm transaction on Sepolia explorer
- [ ] Update README live demo link with final URL

## Recommended Commit Plan (3+ meaningful commits)

1. `feat(contract): add TaskRegistry contract and deployment script`
2. `test(contract): add TaskRegistry hardhat tests`
3. `feat(frontend): build wallet-connected task manager UI with caching and loading states`
4. `docs: add complete Orange Belt submission README`

## Deployment

### Frontend on Vercel (recommended)

- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_CONTRACT_ADDRESS`

### Alternative: Netlify

- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `client/dist`

## Contract Notes

`TaskRegistry` enforces ownership:
- Only task owner can toggle its completion state
- Task IDs are tracked per owner
- Public getter returns task details by ID

## Demo Video Script (1 minute)

1. Show wallet connection
2. Create a task and wait for confirmation progress
3. Refresh and show cached load behavior
4. Toggle task state
5. Show test command and passing output
6. Show README links section
