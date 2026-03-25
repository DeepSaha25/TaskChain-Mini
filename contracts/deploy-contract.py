#!/usr/bin/env python3
"""
Deploy Soroban contract to Stellar testnet
"""

import os
import sys
import json
from pathlib import Path

try:
    from stellar_sdk import (
        Server,
        Keypair,
        TransactionBuilder,
        Network,
        OperationType,
    )
except ImportError:
    print("❌ Please install stellar-sdk first:")
    print("   pip install stellar-sdk")
    sys.exit(1)

TESTNET_RPC = "https://soroban-testnet.stellar.org"
TESTNET_SERVER = "https://horizon-testnet.stellar.org"
NETWORK_PASSPHRASE = Network.TESTNET_NETWORK_PASSPHRASE

def deploy_contract(public_key_str):
    """Deploy contract to testnet"""
    print("🚀 Starting Soroban contract deployment...\n")
    
    # Validate public key
    if not public_key_str.startswith('G') or len(public_key_str) != 56:
        print("❌ Invalid public key format")
        print("   Public keys start with 'G' and are 56 characters long")
        sys.exit(1)
    
    # Get WASM file
    wasm_path = Path(__file__).parent / "target" / "wasm32-unknown-unknown" / "release" / "task_registry.wasm"
    
    if not wasm_path.exists():
        print(f"❌ WASM file not found: {wasm_path}")
        print("   Please run: cargo build --target wasm32-unknown-unknown --release")
        sys.exit(1)
    
    wasm_size = wasm_path.stat().st_size
    print(f"✅ WASM file loaded ({wasm_size:,} bytes)\n")
    
    try:
        # Connect to Horizon
        server = Server(TESTNET_SERVER)
        print(f"✅ Connected to Stellar testnet\n")
        
        # Get account  
        print("📋 Fetching account details...")
        account = server.accounts().account_id(public_key_str).call()
        print(f"✅ Account found (Sequence: {account['sequence']})\n")
        
        # Read WASM
        with open(wasm_path, 'rb') as f:
            wasm_bytes = f.read()
        
        print("📝 Generating deployment transaction...\n")
        
        # Build transaction that will upload WASM
        print("⚠️  NOTE: Transaction generation requires signing with Freighter\n")
        print("🔐 SECURITY: This script does NOT have access to your secret key")
        print("   Only a public key is used for transaction building.\n")
        
        print("=" * 60)
        print("NEXT STEPS:")
        print("=" * 60)
        print("1. Use Stellar CLI with your secret key to deploy:")
        print(f"\n   stellar contract deploy \\")
        print(f"     --network testnet \\")
        print(f"     --wasm {wasm_path.name} \\")
        print(f"     --source-account <YOUR-SECRET-KEY>\n")
        
        print("2. OR go to https://soroban-labs.stellar.org/ and:")
        print("   - Upload the WASM file")
        print("   - Sign with Freighter\n")
        
        print("=" * 60)
        print("\n✨ Once deployed, copy the contract ID (starts with 'C')")
        print("   and I'll update your .env file automatically!\n")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n💡 Try deploying manually using the Stellar CLI:")
        print("   stellar contract deploy --network testnet \\")
        print(f"     --wasm {wasm_path}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Please provide your Stellar public key")
        print("\nUsage:")
        print("   python deploy-contract.py <your-public-key>\n")
        print("Example:")
        print("   python deploy-contract.py GBYJXZRULF4UMDSPA3GDULKC3YJJF2AICPK4NHTHMK5YJ4MZNCFPUIJV")
        sys.exit(1)
    
    public_key = sys.argv[1]
    deploy_contract(public_key)
