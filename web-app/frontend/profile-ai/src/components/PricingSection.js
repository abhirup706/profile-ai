import React from 'react';

const PricingSection = () => {
    return (
        <section id="pricing" className="bg-gray-900 py-16 text-white">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12">Pricing</h2>
                <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8">
                    {/* Pricing Plan 1 */}
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-80">
                        <h3 className="text-2xl font-semibold mb-4">Basic</h3>
                        <p className="text-gray-300 mb-6">$10/month</p>
                        <ul className="text-gray-400 space-y-2">
                            <li>AI-powered profile analysis</li>
                            <li>Monthly updates</li>
                            <li>Email support</li>
                        </ul>
                        <a href="#!" className="mt-6 inline-block bg-green-500 py-2 px-4 rounded-lg text-white hover:bg-green-600 transition duration-300">
                            Choose Plan
                        </a>
                    </div>

                    {/* Pricing Plan 2 */}
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-80">
                        <h3 className="text-2xl font-semibold mb-4">Pro</h3>
                        <p className="text-gray-300 mb-6">$30/month</p>
                        <ul className="text-gray-400 space-y-2">
                            <li>All Basic features</li>
                            <li>Weekly updates</li>
                            <li>Priority support</li>
                        </ul>
                        <a href="#!" className="mt-6 inline-block bg-green-500 py-2 px-4 rounded-lg text-white hover:bg-green-600 transition duration-300">
                            Choose Plan
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
