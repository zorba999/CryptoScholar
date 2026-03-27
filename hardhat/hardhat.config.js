require("@nomicfoundation/hardhat-ethers");
require("dotenv").config({ path: "../backend/.env" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    base_sepolia: {
      url: "https://sepolia.base.org",
      accounts: process.env.OPENGRADIENT_PRIVATE_KEY ? [process.env.OPENGRADIENT_PRIVATE_KEY] : [],
    },
  },
};
