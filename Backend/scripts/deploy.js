const hre = require("hardhat");

async function main() {
  // Retrieve the accounts from Hardhat's Ethereum provider
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the WalletContractDeployer
  const WalletContractDeployer = await hre.ethers.getContractFactory("WalletContractDeployer");
  const walletContractDeployer = await WalletContractDeployer.deploy();
  await walletContractDeployer.deployed();
  console.log("WalletContractDeployer deployed to:", walletContractDeployer.address);

  // Using the WalletContractDeployer to create a new WalletContract
  const createWalletTx = await walletContractDeployer.createWallet();
  await createWalletTx.wait();

  // Retrieving the address of the newly created WalletContract
  const walletAddress = await walletContractDeployer.getWalletAddress(deployer.address);
  console.log("New WalletContract deployed to:", walletAddress);

  // Deploy the CustomToken
  const CustomToken = await hre.ethers.getContractFactory("CustomToken");
  const customToken = await CustomToken.deploy("MyToken", "MTK", 1000000);
  await customToken.deployed();
  console.log("CustomToken deployed to:", customToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// Deploying contracts with the account: 0x40feacdeee6f017fA2Bc1a8FB38b393Cf9022d71
// WalletContractDeployer deployed to: 0x1d87Db81f81F2A20F1Bf90B72E0d4ff6F2b2cD37
// New WalletContract deployed to: 0x08403a34E91a65Bd6AAbFE3906f6F974dfDddE09
// CustomToken deployed to: 0xd071e116640Cc78450cE8d8878cA5e43400B9408