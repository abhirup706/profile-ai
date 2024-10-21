import React from 'react';
import logo from '../assets/Logo2.png';

const Header = () => {
    return (
        <header className="bg-gray-900 text-white p-4 fixed w-full top-0 shadow-md z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                <img src={logo} alt="Profile-AI Logo" className="h-12 mr-2" /> {/* Adjust height as needed */}
                {/*<h1 className="text-2xl font-sans">profile.AI</h1>*/}
                </div>
                <nav>
                    <ul className="flex space-x-8 text-lg">
                        <li>
                            <a href="#features" className="hover:text-green-400 transition-colors duration-300">Features</a>
                        </li>
                        <li>
                            <a href="#pricing" className="hover:text-green-400 transition-colors duration-300">Pricing</a>
                        </li>
                        <li>
                            <a href="#community" className="hover:text-green-400 transition-colors duration-300">Community</a>
                        </li>
                        <li>
                            <a href="#blog" className="hover:text-green-400 transition-colors duration-300">Blog</a>
                        </li>
                        <li>
                            <a href="#roadmap" className="hover:text-green-400 transition-colors duration-300">Roadmap</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
