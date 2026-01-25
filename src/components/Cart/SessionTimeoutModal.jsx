import React from 'react';
import { createPortal } from 'react-dom';
import { Clock, RefreshCw, LogOut } from 'lucide-react';

const SessionTimeoutModal = ({ isOpen, onExtend, onLeave, timeLeft }) => {
    if (!isOpen) return null;

    // Convert timeLeft (ms) to minutes and seconds
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 transform transition-all animate-bounce-slow">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4 relative">
                        <Clock className="w-8 h-8 text-[#EA7704] animate-pulse" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                        </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Session Expiring Soon
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        For your security, your cart session will expire in <span className="font-bold text-[#EA7704]">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>. Do you want to continue shopping?
                    </p>

                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onLeave}
                            className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Leave
                        </button>
                        <button
                            onClick={onExtend}
                            className="flex-1 px-4 py-3 bg-[#EA7704] hover:bg-[#d66b03] text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Extend Session
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SessionTimeoutModal;
