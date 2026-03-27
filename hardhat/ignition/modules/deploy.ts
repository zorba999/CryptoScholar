import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CryptoScholarModule = buildModule("CryptoScholarModule", (m) => {
  const diploma = m.contract("CryptoScholar", []);
  return { diploma };
});

export default CryptoScholarModule;
