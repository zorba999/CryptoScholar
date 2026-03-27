const hre = require("hardhat");

async function main() {
  console.log("Deploying CryptoScholar to Base Sepolia...");
  const CryptoScholar = await hre.ethers.getContractFactory("CryptoScholar");
  const diploma = await CryptoScholar.deploy();
  await diploma.waitForDeployment();
  console.log("CryptoScholar deployed to:", await diploma.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
