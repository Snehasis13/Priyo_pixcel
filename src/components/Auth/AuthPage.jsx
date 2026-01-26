import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('signin');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Welcome to PriyoPixcel
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {activeTab === 'signin' ? "Sign in to your account" : "Create a new account"}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    {/* Tabs Container */}
                    <div className="relative border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
                            {['signin', 'signup'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                    relative z-10 whitespace-nowrap py-4 px-1 font-medium text-sm w-1/2 text-center transition-colors duration-200
                    ${activeTab === tab ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'}
                  `}
                                >
                                    {tab === 'signin' ? 'Sign In' : 'Sign Up'}

                                    {/* Sliding Underline/Background */}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    {/* Optional: Add a light background fill if desired, but user specifically asked for "purple goes to that button" */}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTabBg"
                                            className="absolute inset-0 bg-purple-50 rounded-t-md -z-10"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content with Animation */}
                    <div className="relative overflow-hidden">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: activeTab === 'signin' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: activeTab === 'signin' ? 20 : -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'signin' ? <SignIn /> : <SignUp />}
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthPage;
