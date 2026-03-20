require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY_RAW = (process.env.PRIVATE_KEY || "").trim().replace(/^"|"$/g, "");
const RPC_URL = process.env.RPC_URL || "";
const PRIVATE_KEY = PRIVATE_KEY_RAW.replace(/^0x/, "");
const hasValidPrivateKey = /^[0-9a-fA-F]{64}$/.test(PRIVATE_KEY);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: RPC_URL,
      accounts: hasValidPrivateKey ? ["0x" + PRIVATE_KEY] : []
    }
  }
};
