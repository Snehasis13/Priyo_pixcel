import React from 'react';
import { ShoppingBag, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartNotification = ({ product, cartCount, onClose, onViewCart }) => {
    return (
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden pointer-events-auto ring-1 ring-black/5">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-500 font-medium text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    Added to cart
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex gap-4">
                    <div className="w-16 h-16 flex-shrink-0 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-2">
                            {product.name}
                        </h4>
                        {product.variant && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {product.variant}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Cart has {cartCount} item{cartCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                        onClick={onClose}
                        className="py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EA7704]"
                    >
                        Continue
                    </button>
                    <Link
                        to="/cart"
                        onClick={onClose}
                        className="flex items-center justify-center gap-1 py-2 px-3 text-sm font-medium text-white bg-[#EA7704] hover:bg-[#d66b03] rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EA7704]"
                    >
                        View Cart
                        <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartNotification;
