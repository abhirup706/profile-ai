import React from 'react';

const HeroSection = () => {
    return (
        <section className="bg-black h-screen flex flex-col justify-center items-center text-center">
            <h1 className="text-white text-5xl md:text-7xl font-extrabold mb-4">
                Welcome to Profile-AI
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8">
                Create the perfect profile with AI-powered insights.
            </p>
            <a href="#features" className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300">
                Get Started
            </a>
        </section>
    );
};

export default HeroSection;
