import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <aside className="fixed top-0 left-0 h-screen bg-gray-900 text-white w-64 p-4 z-10 shadow-lg">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-blue-500">My DApp</h2>
                <button
                    className="text-white p-2 rounded focus:outline-none focus:bg-gray-800 sm:hidden"
                    onClick={handleMenuToggle}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>
            <nav className={`${isMenuOpen ? 'block' : 'hidden'} sm:block mt-4`}>
                <NavLink to="/" text="Home" active={location.pathname === '/'} />
                <NavLink to="/wallet-user-dashboard" text="Visit Dashboard" active={location.pathname === '/wallet-user-dashboard'} />
                <NavLink to="/send-funds" text="Instant Transfers" active={location.pathname === '/send-funds'} />
            </nav>
        </aside>
    );
};

const NavLink = ({ to, text, active }) => (
    <li className={`mt-2 ${active ? 'bg-blue-600' : ''} rounded-md`}>
        <Link to={to} className="block p-2 hover:bg-blue-700 rounded-md transition duration-300">
            {text}
        </Link>
    </li>
);

export default Sidebar;
