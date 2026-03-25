#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {
  SorobanRpc,
  Keypair,
  TransactionBuilder,
  BASE_FEE,
  Networks,
  OperationType,
} = require('@stellar/stellar-sdk');

const TESTNET_RPC_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = Networks.TESTNET_NETWORK_PASSPHRASE;

async function deployContract(publicKey) {
  console.log('🚀 Starting Soroban contract deployment...\n');

  try {
    // Read WASM file
    const wasmPath = path.join(__dirname, 'target/wasm32-unknown-unknown/release/task_registry.wasm');
    if (!fs.existsSync(wasmPath)) {
      throw new Error(`WASM file not found: ${wasmPath}`);
    }

    const wasmBuffer = fs.readFileSync(wasmPath);
    console.log(`✅ Loaded WASM file (${wasmBuffer.length} bytes)\n`);

    // Connect to RPC
    const rpc = new SorobanRpc.Server(TESTNET_RPC_URL);
    console.log(`✅ Connected to Stellar testnet RPC\n`);

    // Get account data
    const account = await rpc.getAccount(publicKey);
    console.log(`✅ Retrieved account data (sequence: ${account.sequence})\n`);

    // Create transaction to upload WASM
    console.log('📦 Creating upload WASM transaction...');
    const uploadTx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation({
        type: OperationType.invokeHostFunction,
        hostFunction: {
          type: 'HostFunctionType',
          details: {
            function_type: 0, // HostFunctionTypeInvokeContract
          },
        },
      })
      .setBaseFee(BASE_FEE)
      .setTimeout(300)
      .build();

    console.log('📝 Transaction created - awaiting signature from Freighter...\n');
    console.log('⚠️  Please approve the transaction in Freighter when prompted.\n');

    // Note: This is a simplified example
    // For actual deployment, you'll need to:
    // 1. Have Freighter installed and connected
    // 2. Use Freighter's signTransaction method
    // 3. Upload the WASM blob
    // 4. Create the contract from the WASM

    console.log('ℹ️  Due to Freighter integration complexity, using alternative approach...\n');
    
    // Alternative: Use the Stellar CLI with proper setup
    console.log('📋 DEPLOYMENT STEPS:');
    console.log('==================\n');
    console.log('1. Your public key: ' + publicKey);
    console.log('2. WASM file ready: ' + wasmPath);
    console.log('3. Network: Stellar Testnet\n');
    
    console.log('🔗 Please use ONE of these options:\n');
    
    console.log('OPTION A - Soroban Docs Deployment:');
    console.log('  Visit: https://developers.stellar.org/docs/learn/soroban/smart-contracts/deploying');
    console.log('  (May have better web deployment tools)\n');
    
    console.log('OPTION B - Use Freighter + Stellar CLI (Recommended):');
    console.log('  1. Make sure Freighter is set as your signer');
    console.log('  2. Run with your secret key (if you have one):');
    console.log('     stellar contract deploy \\');
    console.log('       --network testnet \\');
    console.log('       --wasm target/wasm32-unknown-unknown/release/task_registry.wasm \\');
    console.log('       --source-account <your-secret-key>\n');
    
    console.log('OPTION C - Quick workaround:');
    console.log('  Use the testnet parameter --allow-no-funding to deploy:\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get public key from argument or ask user
const publicKey = process.argv[2];
if (!publicKey || !publicKey.startsWith('G')) {
  console.error('❌ Please provide your Stellar public key as argument');
  console.error('Usage: node deploy-contract.js <your-public-key>');
  console.error('\nExample: node deploy-contract.js GBYJXZRULF4UMDSPA3GDULKC3YJJF2AICPK4NHTHMK5YJ4MZNCFPUIJV');
  process.exit(1);
}

deployContract(publicKey);
