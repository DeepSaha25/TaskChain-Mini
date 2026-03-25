#!/usr/bin/env node

/**
 * Soroban Contract Deployment Script
 * Deploys the TaskRegistry contract to Stellar testnet
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
require("dotenv").config();

async function deploy() {
  const secretKey = (process.env.SOROBAN_SECRET_KEY || "").trim();
  const rpcUrl = process.env.SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org:443";
  const networkPassphrase = process.env.SOROBAN_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";

  if (!secretKey) {
    console.error(
      "ERROR: SOROBAN_SECRET_KEY not set in .env\n" +
      "Please add your Stellar secret key to contracts/.env"
    );
    process.exit(1);
  }

  console.log("Building Soroban contract...");
  const buildResult = spawnSync("soroban", ["contract", "build"], {
    cwd: __dirname,
    stdio: "inherit"
  });

  if (buildResult.status !== 0) {
    console.error("Contract build failed");
    process.exit(1);
  }

  const wasmPath = path.join(__dirname, "target", "wasm32-unknown-unknown", "release", "task_registry.wasm");
  if (!fs.existsSync(wasmPath)) {
    console.error(`WASM file not found at ${wasmPath}`);
    process.exit(1);
  }

  console.log("Deploying contract to Stellar testnet...");
  
  const deployResult = spawnSync("soroban", [
    "contract",
    "deploy",
    "--wasm",
    wasmPath,
    "--source",
    "default",
    "--network",
    "testnet"
  ], {
    cwd: __dirname,
    stdio: "inherit",
    env: {
      ...process.env,
      SOROBAN_SECRET_KEY: secretKey,
      SOROBAN_RPC_URL: rpcUrl,
      SOROBAN_NETWORK_PASSPHRASE: networkPassphrase
    }
  });

  if (deployResult.status !== 0) {
    console.error("Contract deployment failed");
    process.exit(1);
  }

  console.log("\n✅ Contract deployed successfully!");
  console.log("\nNext steps:");
  console.log("1. Copy the contract address from above");
  console.log("2. Add it to client/.env as VITE_CONTRACT_ADDRESS");
  console.log("3. Run: cd ../client && npm run dev");
}

deploy().catch((error) => {
  console.error(error);
  process.exit(1);
});
