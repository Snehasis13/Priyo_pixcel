import React from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, Edit3 } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const CheckoutModal = ({ isOpen, onClose, onConfirm, cartItems, total, isLoading }) => {
    if (!isOpen) return null;

    // Use portal to render at root level to avoid z-index issues
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-fadeInUp">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
                        Please review your items before proceeding to secure checkout.
                    </p>

                    <div className="space-y-4 mb-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Subtotal</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Shipping</span>
                            <span className="text-green-500">Free</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Tax (Calculated at next step)</span>
                            <span>--</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600 mt-2">
                            <span className="font-bold text-lg text-gray-900 dark:text-white">Total</span>
                            <span className="font-bold text-xl text-[#EA7704]">₹{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Cart
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-[#EA7704] hover:bg-[#d66b03] text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner size="sm" color="text-white" />
                                <span>Redirecting...</span>
                            </>
                        ) : (
                            <>
                                <span>Confirm & Continue</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CheckoutModal;
