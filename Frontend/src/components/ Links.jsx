import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import WalletConnection from './WalletConnection';
import WalletUserDashboard from './WalletUserDasboard';
import SendFunds from './SendFunds';

const Links = () => {
    const [wallet, setWallet] = useState(null);
    const [contractAddress, setContractAddress] = useState('');

    const handleWalletConnect = () => {
        setWallet(window.ethereum);
    };

    const handleCreatewallet = (address) => {
        setContractAddress(address);
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow">
                    <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
                        <div className="flex justify-between items-center">
                            <div className="text-xl font-semibold text-gray-700">
                                <a className="text-xl font-bold text-gray-800 hover:text-gray-700" href="/">DApp</a>
                            </div>
                        </div>
                        <div className="md:flex items-center">
                            <div className="flex flex-col md:flex-row md:mx-6">
                                <a className="my-1 text-gray-700 hover:text-blue-500 md:mx-4 md:my-0" href="/">Home</a>
                                <a className="my-1 text-gray-700 hover:text-blue-500 md:mx-4 md:my-0" href="/wallet-user-dashboard">Dashboard</a>
                                <a className="my-1 text-gray-700 hover:text-blue-500 md:mx-4 md:my-0" href="/send-funds">Send Funds</a>
                            </div>
                        </div>
                    </div>
                </nav>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<WalletConnection onConnect={handleWalletConnect} />}
                    />
                    <Route
                        exact
                        path="/wallet-user-dashboard"
                        element={<WalletUserDashboard wallet={wallet} onContractDeploy={handleCreatewallet} />}
                    />
                    <Route
                        exact
                        path="/send-funds"
                        element={<SendFunds wallet={wallet} onContractDeploy={handleCreatewallet} />}
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default Links;
