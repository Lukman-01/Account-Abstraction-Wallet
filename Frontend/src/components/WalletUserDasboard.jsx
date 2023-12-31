import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletContractDeployer from '../contractsAbis/WalletContractDeployer.json';
import WalletContract from '../contractsAbis/WalletContract.json';
import NavigationBar from './NavBar';
import PolygonMumbaiContract from '../contractsAbis/PolygonMumbaiContract.json';
import CustomTokenContractABI from '../contractsAbis/CustomToken.json';


const WalletUserDashboard = ({wallet}) => {
  const ethTokenAddress = ethers.constants.AddressZero;
  const maticTokenAddress = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'; // the actual address of Polygon Mumbai Matic token
  const customTokenAddress = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8';
  const walletContractDeployerAddress = '0x1d87Db81f81F2A20F1Bf90B72E0d4ff6F2b2cD37';
  const [customTokenBalance, setCustomTokenBalance] = useState('0');
  const [ethBalance, setEthBalance] = useState('0');
  const [maticBalance, setMaticBalance] = useState('0');
  const [walletAddress, setWalletAddress] = useState('');
  //const [error, setError] = useState('');

  useEffect(() => {
    loadWallet();
  }, []);

  async function loadWallet() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Creating a new instance of the WalletContractDeployer
      const walletContractDeployer = new ethers.Contract(
        walletContractDeployerAddress,
        WalletContractDeployer.abi,
        signer
      );

      // Retrieving the user's wallet address using the getWalletAddress function in WalletContractDeployer.sol
      const userWalletAddress = await walletContractDeployer.getWalletAddress(signer.getAddress());

      if (userWalletAddress !== ethers.constants.AddressZero) {
        setWalletAddress(userWalletAddress);

        // Creating a new instance of the WalletContract
        const walletContract = new ethers.Contract(
          userWalletAddress,
          WalletContract.abi,
          signer
        );

        // Create a new instance of the custom token contract
        const customTokenContract = new ethers.Contract(
          customTokenAddress,
          CustomTokenContractABI,
          signer
        );

        // Get the wallet custom token balance
        // console.log(userWalletAddress);
        // const customTokenBalance = await customTokenContract.balanceOf(userWalletAddress);
        // setCustomTokenBalance(customTokenBalance.toString());

        // Get the wallet ETH balance
        const ethBalance = await walletContract.getBalance();
        console.log(ethBalance.toString());
        setEthBalance(ethBalance.toString());

        // Create a new instance of the Matic token contract
        const maticTokenContract = new ethers.Contract(maticTokenAddress, PolygonMumbaiContract.abi, signer);

        // Get the wallet Matic balance
        // const maticBalance = await maticTokenContract.balanceOf(userWalletAddress);
        // setMaticBalance(maticBalance.toString());
      }
    } catch (error) {
      console.error(error);
    }
  }


  async function createWallet() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Creating a new instance of the WalletContractDeployer
      const walletContractDeployer = new ethers.Contract(
        walletContractDeployerAddress,
        WalletContractDeployer.abi,
        signer
      );

      // Calling the createWallet function in the WalletContractDeployer
      await walletContractDeployer.createWallet();

      // Reload wallet data
      await loadWallet();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center p-4">
      <NavigationBar />
      <div className="w-full max-w-4xl p-6 space-y-4">
        <h2 className="text-3xl md:text-4xl text-center text-white font-bold mb-6">
          User Dashboard
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {walletAddress !== '' ? (
            <div>
              <h3 className="text-blue-600 text-lg font-bold mb-2">Wallet Address:</h3>
              <p className="text-gray-700 mb-4">{walletAddress}</p>
              <h3 className="text-blue-600 text-lg font-bold mb-2">ETH Balance:</h3>
              <p className="text-gray-700 mb-4">{ethBalance} ETH</p>
              {/* <h3 className="text-blue-600 text-lg font-bold mb-2">Matic Balance:</h3>
              <p className="text-gray-700 mb-4">{maticBalance} Matic</p>
              <h3 className="text-blue-600 text-lg font-bold mb-2">CUSTOM Balance:</h3>
              <p className="text-gray-700 mb-4">{customTokenBalance} CSTM</p> */}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-700 mb-4">You don't have a wallet yet.</p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                onClick={createWallet}
              >
                Create Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletUserDashboard;
