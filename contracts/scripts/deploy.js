const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error(
      "No deployer signer available. Check contracts/.env: RPC_URL must be valid and PRIVATE_KEY must be a 64-hex private key (without 0x), not a wallet address."
    );
  }

  const Factory = await ethers.getContractFactory("TaskRegistry");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TaskRegistry deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
