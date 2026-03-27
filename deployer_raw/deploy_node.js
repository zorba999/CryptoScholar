const solc = require('solc');
const { ethers } = require('ethers');
const fs = require('fs');
require('dotenv').config({ path: '../backend/.env' });

const contractSource = fs.readFileSync('CryptoScholarStandalone.sol', 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'CryptoScholarStandalone.sol': {
      content: contractSource,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

console.log("Compiling contract...");
const output = JSON.parse(solc.compile(JSON.stringify(input)));
if(output.errors && output.errors.filter(e => e.severity === 'error').length > 0) {
    console.error("Compilation errors:", output.errors);
    process.exit(1);
}

const contractDetails = output.contracts['CryptoScholarStandalone.sol']['CryptoScholar'];
const abi = contractDetails.abi;
const bytecode = contractDetails.evm.bytecode.object;

async function deploy() {
  console.log("Deploying securely with Ethers + Solc using your OpenGradient Private Key on Base Sepolia...");
  const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
  const wallet = new ethers.Wallet(process.env.OPENGRADIENT_PRIVATE_KEY, provider);
  
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  console.log("Waiting for deployment confirmation...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log("DONE! Address:", address);
  
  // Save the address to a file so Python can use it later
  fs.writeFileSync('../backend/contract_address.txt', address);
  fs.writeFileSync('../backend/contract_abi.json', JSON.stringify(abi));
}

deploy().catch(console.error);
