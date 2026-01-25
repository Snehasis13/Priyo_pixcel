import React from 'react';

const CartSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="max-w-7xl mx-auto">
                <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-10"></div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items Table Skeleton */}
                    <div className="flex-grow">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {/* Header Skeleton */}
                            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 dark:bg-gray-900/50">
                                <div className="col-span-6 h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                <div className="col-span-3 h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
                                <div className="col-span-3 h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
                            </div>

                            {/* Row Skeletons */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-t border-gray-100 dark:border-gray-700">
                                    <div className="col-span-12 md:col-span-6 flex items-center gap-6">
                                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                        <div className="flex-1 space-y-3">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                            <div className="flex gap-3 mt-2">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-6 flex justify-between md:grid md:grid-cols-6 items-center">
                                        <div className="md:col-span-3 flex justify-center">
                                            <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                        </div>
                                        <div className="md:col-span-3 text-right space-y-2">
                                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-auto"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary Skeleton */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6 pb-4 border-b border-gray-200"></div>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-4 border-t border-gray-200 mb-8">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            </div>
                            <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for Loading Message */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-full shadow-2xl flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-[#EA7704] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[#EA7704] font-bold tracking-wider animate-pulse">Please Wait . . .</span>
                </div>
            </div>
        </div>
    );
};

export default CartSkeleton;
