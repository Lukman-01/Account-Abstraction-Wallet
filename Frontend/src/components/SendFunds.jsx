import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletContractDeployer from '../contractsAbis/WalletContractDeployer.json';
import WalletContract from '../contractsAbis/WalletContract.json';
import NavigationBar from './NavBar.jsx';
import CustomTokenContractABI from '../contractsAbis/CustomToken.json';
import PolygonMumbaiContractABI from '../contractsAbis/PolygonMumbaiContract.json';

const SendFunds = ({ wallet }) => {
  const ethTokenAddress = ethers.constants.AddressZero;
  const maticTokenAddress = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'; // the actual address of Polygon Mumbai Matic token
  const customTokenAddress = '0xd071e116640Cc78450cE8d8878cA5e43400B9408';
  const walletContractDeployerAddress = '0x1d87Db81f81F2A20F1Bf90B72E0d4ff6F2b2cD37';
  const [customTokenBalance, setCustomTokenBalance] = useState('0');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [maticBalance, setMaticBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    loadWallet();
  }, []);

  async function loadWallet() {
    try {
      const provider = new ethers.providers.Web3Provider(wallet);
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
        const customTokenBalance = await customTokenContract.balanceOf(userWalletAddress);
        setCustomTokenBalance(customTokenBalance.toString());
  
        // Getting the wallet ADESCOIN ETH balance
        const ethBalance = await walletContract.getBalance();
        setBalance(ethBalance.toString());
  
        // Creating a new instance of the Matic token contract
        const maticTokenContract = new ethers.Contract(
          maticTokenAddress,
          PolygonMumbaiContractABI,
          signer
        );
  
        // Getting the wallet Matic balance
        const maticBalance = await maticTokenContract.tokenBalances(userWalletAddress, maticTokenAddress); // Update this line
        setMaticBalance(maticBalance.toString());
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  async function sendFunds() {
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
        // Creating a new instance of the WalletContract
        const walletContract = new ethers.Contract(
          userWalletAddress,
          WalletContract.abi,
          signer
        );

        // To send funds
        await walletContract.transfer(toAddress, ethers.constants.AddressZero, amount);

        // Reload the wallet data
        await loadWallet();

        // Clear input fields
        setToAddress('');
        setAmount('');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center p-4">
      <NavigationBar />
      <div className="w-full max-w-4xl p-6 space-y-4">
        <h2 className="text-3xl md:text-4xl text-center text-white font-bold mb-6">
          Send Funds
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-blue-600 text-lg font-bold mb-2">Wallet Address:</h3>
          <p className="text-gray-700 mb-4">{walletAddress}</p>
          <h3 className="text-blue-600 text-lg font-bold mb-2">ETH Balance:</h3>
          <p className="text-gray-700 mb-4">{balance} ETH</p>
          <h3 className="text-blue-600 text-lg font-bold mb-2">Matic Balance:</h3>
          <p className="text-gray-700 mb-4">{maticBalance} Matic</p>
          <h3 className="text-blue-600 text-lg font-bold mb-2">CUSTOM Balance:</h3>
          <p className="text-gray-700 mb-4">{customTokenBalance} CSTM</p>

          <div className="mt-4">
            <h3 className="text-blue-600 text-lg font-bold mb-2">Send Funds</h3>
            <label htmlFor="toAddress" className="text-gray-700 mb-2 block">To Address:</label>
            <input
              type="text"
              id="toAddress"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
            />
            <label htmlFor="amount" className="text-gray-700 mb-2 block">Amount:</label>
            <input
              type="text"
              id="amount"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              onClick={sendFunds}
            >
              Send Funds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendFunds;
