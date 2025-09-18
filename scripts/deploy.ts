import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Starting EcoHunt deployment to Zora...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  // Deploy GreenToken
  console.log("\n🪙 Deploying GreenToken...");
  const GreenToken = await ethers.getContractFactory("GreenToken");
  const greenToken = await GreenToken.deploy(deployer.address);
  await greenToken.waitForDeployment();
  const greenTokenAddress = await greenToken.getAddress();
  console.log("✅ GreenToken deployed to:", greenTokenAddress);
  
  // Deploy EcoNFT
  console.log("\n🖼️ Deploying EcoNFT...");
  const EcoNFT = await ethers.getContractFactory("EcoNFT");
  const ecoNFT = await EcoNFT.deploy(deployer.address);
  await ecoNFT.waitForDeployment();
  const ecoNFTAddress = await ecoNFT.getAddress();
  console.log("✅ EcoNFT deployed to:", ecoNFTAddress);
  
  // Deploy EcoHuntCore
  console.log("\n🎯 Deploying EcoHuntCore...");
  const EcoHuntCore = await ethers.getContractFactory("EcoHuntCore");
  const ecoHuntCore = await EcoHuntCore.deploy(
    greenTokenAddress,
    ecoNFTAddress,
    deployer.address
  );
  await ecoHuntCore.waitForDeployment();
  const ecoHuntCoreAddress = await ecoHuntCore.getAddress();
  console.log("✅ EcoHuntCore deployed to:", ecoHuntCoreAddress);
  
  // Setup permissions
  console.log("\n🔐 Setting up permissions...");
  
  // Add EcoHuntCore as validator for GreenToken
  const addValidatorTx = await greenToken.addValidator(ecoHuntCoreAddress);
  await addValidatorTx.wait();
  console.log("✅ EcoHuntCore added as GreenToken validator");
  
  // Transfer EcoNFT ownership to EcoHuntCore
  const transferOwnershipTx = await ecoNFT.transferOwnership(ecoHuntCoreAddress);
  await transferOwnershipTx.wait();
  console.log("✅ EcoNFT ownership transferred to EcoHuntCore");
  
  // Save deployment info
  const deploymentInfo = {
    network: "zora",
    chainId: 7777777,
    deployer: deployer.address,
    contracts: {
      GreenToken: greenTokenAddress,
      EcoNFT: ecoNFTAddress,
      EcoHuntCore: ecoHuntCoreAddress,
    },
    deployedAt: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };
  
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(deploymentsDir, "zora-deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  // Update contract addresses in frontend
  const addressesPath = path.join(__dirname, "../src/contracts/addresses.ts");
  const addressesContent = `export const CONTRACT_ADDRESSES = {
  // Zora Network Contract Addresses
  ZORA_MAINNET: {
    GREEN_TOKEN: '${greenTokenAddress}',
    ECO_NFT: '${ecoNFTAddress}',
    ECO_HUNT_CORE: '${ecoHuntCoreAddress}',
  },
  ZORA_TESTNET: {
    GREEN_TOKEN: '0x...',
    ECO_NFT: '0x...',
    ECO_HUNT_CORE: '0x...',
  }
} as const

export const NETWORK_CONFIG = {
  ZORA_MAINNET: {
    chainId: 7777777,
    name: 'Zora',
    currency: 'ETH',
    rpcUrl: 'https://rpc.zora.energy',
    blockExplorer: 'https://explorer.zora.energy',
  },
  ZORA_TESTNET: {
    chainId: 999999999,
    name: 'Zora Testnet',
    currency: 'ETH', 
    rpcUrl: 'https://testnet.rpc.zora.energy',
    blockExplorer: 'https://testnet.explorer.zora.energy',
  }
} as const

export const getContractAddress = (contract: keyof typeof CONTRACT_ADDRESSES.ZORA_MAINNET, isTestnet = false) => {
  return isTestnet 
    ? CONTRACT_ADDRESSES.ZORA_TESTNET[contract]
    : CONTRACT_ADDRESSES.ZORA_MAINNET[contract]
}`;
  
  fs.writeFileSync(addressesPath, addressesContent);
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📄 Deployment info saved to deployments/zora-deployment.json");
  console.log("🔗 Contract addresses updated in src/contracts/addresses.ts");
  console.log("\n📋 Summary:");
  console.log("├── GreenToken:", greenTokenAddress);
  console.log("├── EcoNFT:", ecoNFTAddress);
  console.log("└── EcoHuntCore:", ecoHuntCoreAddress);
  console.log("\n🌐 Explorer URLs:");
  console.log("├── GreenToken: https://explorer.zora.energy/address/" + greenTokenAddress);
  console.log("├── EcoNFT: https://explorer.zora.energy/address/" + ecoNFTAddress);
  console.log("└── EcoHuntCore: https://explorer.zora.energy/address/" + ecoHuntCoreAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });