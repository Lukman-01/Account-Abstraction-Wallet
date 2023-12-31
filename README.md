# Ethereum Account Abstraction Wallet DApp

This repository features a decentralized application (DApp) focused on an Ethereum smart contract wallet for users, utilizing the concept of account abstraction. Built with Solidity, React, and powered by Vite, the DApp provides a seamless interface for users to manage Ether and ERC20 tokens on the Ethereum blockchain. The application emphasizes ease of use, security, and flexibility in wallet management through account abstraction.

## Description

The DApp is comprised of two main components:

1. **Smart Contracts (Solidity):**
   - `WalletContractDeployer`: Manages the creation and supervision of individual wallet contracts.
   - `WalletContract`: Facilitates the management of Ether and ERC20 token balances and transactions. Incorporates account abstraction principles for enhanced user experience and security.
   - `CustomToken`: Demonstrates interactions with ERC20 tokens.

2. **Frontend (React):**
   - Developed using React and styled with Tailwind CSS, providing a user-friendly interface for blockchain interactions.
   - Includes components like `WalletUserDashboard` for wallet information display and `SendFunds` for executing fund transfers.

The DApp operates on the Ethereum testnet, showcasing the ability to interact with deployed smart contracts.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js and npm.
- A Web3 wallet like MetaMask in your browser.

### Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Lukman-01/Account-Abstraction-Wallet.git]
   ```

2. **Install dependencies:**
   In the project directory, execute:
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   This will launch the Vite development server, making the app available at `http://localhost:5173`.

### Interacting with the DApp

1. **Accessing the Dashboard:**
   - Open your web browser and go to `http://localhost:5173`.
   - Connect your MetaMask or another Web3 wallet.

2. **Utilizing Wallet Functions:**
   - Click "Create Wallet" to initiate a new wallet.
   - Navigate the interface to view balances and send funds.

### Deploying Smart Contracts

- Update `hardhat.config.js` with your desired network configurations for deploying the smart contracts to a testnet or mainnet. This project uses Sepolia.

## Authors
Abdulyekeen Lukman
oyeniyifortunate@gmail.com

## License

This project is under the MIT License - see the LICENSE.md file for details.