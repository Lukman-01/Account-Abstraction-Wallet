// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './WalletContract.sol';

/// @title WalletContractDeployer
/// @notice Deploys and manages individual WalletContracts
contract WalletContractDeployer {
    /// @dev Struct to store wallet details
    struct Wallet {
        address owner;
        address walletAddress;
    }

    /// @dev Mapping to store the wallet details by owner address
    mapping(address => Wallet) private wallets;

    /// @dev Mapping to map owner address to wallet address
    mapping(address => address) private ownerToWallet;

    /// @notice Emitted when a new wallet is created
    event WalletCreated(address indexed owner, address indexed walletAddress);

    /// @notice Emitted when a transfer occurs between wallets
    event Transfer(address indexed from, address indexed to, uint256 amount);

    /// @notice Creates a new wallet for the caller
    function createWallet() external {
        require(wallets[msg.sender].owner == address(0), "Wallet already exists");

        address newWalletAddress = address(new WalletContract(msg.sender));
        wallets[msg.sender] = Wallet(msg.sender, newWalletAddress);
        ownerToWallet[msg.sender] = newWalletAddress;

        emit WalletCreated(msg.sender, newWalletAddress);
    }

    /// @notice Returns the Ether balance of a specified wallet owner
    /// @param walletOwner The address of the wallet owner
    /// @return The Ether balance of the owner's wallet
    function getBalance(address walletOwner) external view returns (uint256) {
        WalletContract wallet = WalletContract(payable(ownerToWallet[walletOwner]));
        return wallet.getBalance();
    }

    /// @notice Returns the token balance for a specific token of a wallet owner
    /// @param walletOwner The address of the wallet owner
    /// @param tokenAddress The address of the token contract
    /// @return The token balance in the owner's wallet for the specified token
    function getTokenBalance(address walletOwner, address tokenAddress) external view returns (uint256) {
        WalletContract wallet = WalletContract(payable(ownerToWallet[walletOwner]));
        return wallet.getTokenBalance(tokenAddress);
    }

    /// @notice Retrieves the owner address of a specified wallet
    /// @param walletAddress The address of the wallet
    /// @return The owner address of the wallet
    function getWalletOwner(address walletAddress) external view returns (address) {
        return wallets[walletAddress].owner;
    }

    /// @notice Retrieves the wallet address for a specified wallet owner
    /// @param walletOwner The address of the wallet owner
    /// @return The address of the owner's wallet
    function getWalletAddress(address walletOwner) external view returns (address) {
        return ownerToWallet[walletOwner];
    }

    /// @notice Transfers Ether or tokens from one wallet to another
    /// @param fromWalletAddress The address of the sender's wallet
    /// @param toWalletAddress The address of the recipient's wallet
    /// @param token The token address (use address(0) for Ether)
    /// @param amount The amount to transfer
    function transfer(address fromWalletAddress, address toWalletAddress, address token, uint256 amount) external {
        require(wallets[fromWalletAddress].owner != address(0), "Sender wallet does not exist");
        require(wallets[toWalletAddress].owner != address(0), "Receiver wallet does not exist");

        WalletContract fromWallet = WalletContract(payable(fromWalletAddress));
        require(fromWallet.getBalance() >= amount, "Insufficient balance");

        fromWallet.transfer(toWalletAddress, token, amount);
        emit Transfer(fromWalletAddress, toWalletAddress, amount);
    }
}
