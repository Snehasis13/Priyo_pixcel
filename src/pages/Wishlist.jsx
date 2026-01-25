import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Share2, Heart } from 'lucide-react';
import Reveal from '../components/Reveal/Reveal';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Image from '../components/common/Image';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Wishlist = () => {
    const { wishlistItems, moveToCart, removeFromWishlist, moveAllToCart, isLoading } = useCart();
    const { addToast } = useToast();
    const [processingItem, setProcessingItem] = useState(null);

    const handleAction = async (id, action) => {
        if (processingItem) return;
        setProcessingItem(id);
        await action();
        setProcessingItem(null);
    };

    const handleShare = () => {
        // Mock share functionality
        navigator.clipboard.writeText(window.location.href);
        addToast("Wishlist link copied to clipboard!", "success");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center">
                <LoadingSpinner size="lg" color="text-[#EA7704]" />
            </div>
        );
    }

    if (!wishlistItems || wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
                <Reveal animation="fadeInUp">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <Heart className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Wishlist is Empty</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Save items you love here to buy later.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-8 py-3 bg-[#EA7704] text-white font-bold rounded-full hover:bg-[#d66b03] transition-colors"
                    >
                        Start Shopping
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </Reveal>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <Reveal animation="fadeInDown">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            My <span className="text-[#EA7704]">Wishlist</span>
                            <span className="ml-4 text-lg font-medium text-gray-500">
                                ({wishlistItems.length} items)
                            </span>
                        </h1>
                    </Reveal>

                    <Reveal animation="fadeInDown" delay="delay-100">
                        <div className="flex gap-3">
                            <button
                                onClick={handleShare}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                            <button
                                onClick={() => moveAllToCart()}
                                className="px-6 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 font-medium"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Move all to Cart
                            </button>
                        </div>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((item, index) => (
                        <Reveal key={item.id} animation="fadeInUp" delay={`delay-${index * 100}`}>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                                    <button
                                        onClick={() => handleAction(item.id, () => removeFromWishlist(item.id, item.name))}
                                        className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate text-lg">
                                        {item.name}
                                    </h3>
                                    <p className="text-[#EA7704] font-bold mb-4 text-xl">
                                        ₹{item.price.toLocaleString()}
                                    </p>
                                    <button
                                        onClick={() => handleAction(item.id, () => moveToCart(item.id))}
                                        disabled={processingItem === item.id}
                                        className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-[#EA7704] hover:text-white text-gray-900 dark:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        {processingItem === item.id ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                Moving...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-4 h-4" />
                                                Move to Cart
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
