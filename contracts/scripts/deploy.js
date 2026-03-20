const { ethers } = require("hardhat");

async function main() {
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
