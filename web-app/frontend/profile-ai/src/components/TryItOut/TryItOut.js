import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TryItOut.css';

const TryItOut = () => {
    const navigate = useNavigate();

    // State to hold form inputs and errors
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(''); // State for error message

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form submission

        // Reset error message before a new attempt
        setLoginError('');

        try {
            // Making API call to the login endpoint
            const response = await fetch('http://localhost:5001/profileai/web/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            if (response.status === 200) {
                // If login is successful, navigate to homepage
                navigate('/');
            } else {
                // If login failed, show error message
                setLoginError('Incorrect username or password.');
            }
        } catch (error) {
            // If there's a network or server error, show a general error message
            setLoginError('An error occurred. Please try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="relative flex flex-col lg:flex-row justify-center items-center h-screen bg-gray-800 overflow-hidden">
            {/* Background Paper Planes */}
            <div className="paper-plane"></div>
            <div className="paper-plane"></div>
            <div className="paper-plane"></div>
            <div className="paper-plane"></div>
            <div className="paper-plane"></div>

            {/* Content Section */}
            <div className="flex flex-col lg:flex-row items-stretch w-full lg:w-2/3 max-w-6xl bg-gray-800 p-4 lg:p-0 relative z-10">
                {/* Left side - Login form */}
                <div className="w-full lg:w-1/2 bg-gray-900 p-8 shadow-2xl rounded-md flex-grow">
                    <h2 className="text-3xl font-semibold text-white mb-6">Login</h2>

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email or Username
                            </label>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 p-2 block w-full border border-gray-600 rounded-md bg-gray-700 text-white"
                                placeholder="Enter your email or username"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 p-2 block w-full border border-gray-600 rounded-md bg-gray-700 text-white"
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Display login error message */}
                        {loginError && (
                            <p className="text-red-500 text-sm mb-4">{loginError}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
                        >
                            Login
                        </button>
                    </form>

                    {/* Link to Register */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-300">
                            Not registered yet?{' '}
                            <button onClick={() => navigate('/register')} className="register-button">
                                Register now
                            </button>
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-1 border-gray-600 mx-4"></div>

                {/* Right side - Benefits */}
                <div className="w-full lg:w-1/2 bg-gray-900 p-8 shadow-2xl rounded-md flex-grow">
                    <h2 className="text-2xl font-semibold text-white mb-6">Why Register?</h2>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300">
                        <li>Get personalized career insights powered by AI.</li>
                        <li>Access exclusive resources to boost your professional profile.</li>
                        <li>Connect with a community of like-minded professionals.</li>
                        <li>Stay up-to-date with the latest trends in your field.</li>
                        <li>Unlock tools to highlight your unique skills and experiences.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TryItOut;
