import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavBar';

const WalletConnection = ({ onConnect }) => {
    const [walletConnected, setWalletConnected] = useState(false);
    const [currentAccount, setCurrentAccount] = useState('');
    const navigate = useNavigate();

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length === 0) {
                    console.error('No account found');
                    // Consider providing user feedback here.
                } else {
                    const account = accounts[0];
                    setCurrentAccount(account);
                    setWalletConnected(true);
                    onConnect(account); // Pass the connected account for further use
                }
            } catch (error) {
                console.error('Error connecting wallet:', error);
                // Consider providing user feedback here.
            }
        } else {
            console.error('No Ethereum wallet found');
            // Consider providing user feedback here.
        }
    };

    const handleNavigateToWalletDashboard = () => navigate('/wallet-user-dashboard');
    const handleNavigateToSendFunds = () => navigate('/send-funds');

    return (
        <div className="bg-slate-800 min-h-screen flex flex-col items-center justify-center p-4">
            {walletConnected && <NavigationBar />}
            <h2 className="text-3xl md:text-4xl text-center text-white font-bold mb-6">
                Account Abstraction Wallets for Tokens
            </h2>
            <div className="w-full max-w-4xl p-6 space-y-4">
                {!walletConnected ? (
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-3 px-6 rounded-lg transition duration-300"
                        onClick={connectWallet}
                    >
                        Connect Ethereum Wallet
                    </button>
                ) : (
                    <div className='grid grid-cols-2 gap-8'>
                        <ActionButton text="Wallet Details" onClick={handleNavigateToWalletDashboard} />
                        <ActionButton text="Fund Transfers" onClick={handleNavigateToSendFunds} />
                        <div className="col-span-2">
                            <p className="text-white text-lg">Connected Account: {currentAccount}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ActionButton = ({ text, onClick }) => (
    <button
        className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xl font-bold py-4 px-6 rounded-lg transition duration-300"
        onClick={onClick}
    >
        {text}
    </button>
);

export default WalletConnection;
