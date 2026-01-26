import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Heart } from 'lucide-react';
import Reveal from '../components/Reveal/Reveal';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CartSkeleton from '../components/Cart/CartSkeleton';
import LoadingSpinner from '../components/common/LoadingSpinner';

import Image from '../components/common/Image';
import CheckoutModal from '../components/Cart/CheckoutModal';
import SessionTimeoutModal from '../components/Cart/SessionTimeoutModal';
import CartItem from '../components/Cart/CartItem';
import AnimatedButton from '../components/common/AnimatedButton';
import PriceTicker from '../components/common/PriceTicker';

const Cart = () => {
    const navigate = useNavigate();
    const {
        cartItems,
        wishlistItems,
        updateQuantity,
        updateItemQuantity,
        removeFromCart,
        addToWishlist,
        moveToCart,
        removeFromWishlist,
        cartTotal,
        cartSavings,
        isLoading,
        validateCartWithServer,
        showSessionWarning,
        extendSession,
        SESSION_TIMEOUT,
        lastActivity
    } = useCart();
    const { addToast } = useToast();
    const [processingItem, setProcessingItem] = useState(null); // stores ID of item being processed
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    const handleAction = async (id, action, actionType = 'default') => {
        if (processingItem) return; // Prevent double clicks
        setProcessingItem(id);

        // Optimistic update - no delay needed for actions that feel "instant"
        // ex: remove, save for later. 
        // We still keep the async structure in case we want to add back API calls later.

        await action();
        setProcessingItem(null);
    };

    const validateCart = () => {
        // Mock validation logic
        for (const item of cartItems) {
            if (item.quantity > 10) { // Example limit
                addToast(`Limit 10 per item. Please reduce quantity for ${item.name}`, 'error');
                return false;
            }
        }
        return true;
    };

    const handleCheckoutClick = async () => {
        if (cartItems.length === 0) {
            addToast("Your cart is empty", 'error');
            return;
        }

        // Local Validation
        if (!validateCart()) return;

        // Server Validation (Price Protection)
        setIsCheckingOut(true);
        const isValid = await validateCartWithServer();
        setIsCheckingOut(false);

        if (isValid) {
            setShowCheckoutModal(true);
        }
    };

    const handleConfirmCheckout = async () => {
        setIsCheckingOut(true);
        // Simulate CSRF/Security check setup
        await new Promise(resolve => setTimeout(resolve, 800));

        const csrfToken = Math.random().toString(36).substring(7);

        navigate('/checkout', {
            state: {
                items: cartItems,
                total: cartTotal,
                csrfToken
            }
        });
        setIsCheckingOut(false);
    };

    if (isLoading) {
        return <CartSkeleton />;
    }

    // Derived state for display
    const subtotal = cartTotal;
    const savings = cartSavings;
    const shipping = subtotal > 2000 ? 0 : 100;
    const total = subtotal + shipping;

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </motion.div>
                </motion.div>
                <Reveal animation="fadeInUp">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <div className="flex justify-center">
                        <Link to="/">
                            <AnimatedButton variant="primary" className="px-8 py-3 rounded-full">
                                Start Shopping
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </AnimatedButton>
                        </Link>
                    </div>
                </Reveal>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Reveal animation="fadeInDown">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
                        Shopping <span className="text-[#EA7704]">Cart</span>
                        <span className="ml-4 text-lg font-medium text-gray-500">
                            ({cartItems.length} items)
                        </span>
                    </h1>
                </Reveal>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items Table */}
                    <div className="flex-grow">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Table Headers */}
                            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                <div className="col-span-6">Items</div>
                                <div className="col-span-3 text-center">Quantity</div>
                                <div className="col-span-3 text-right">Amount</div>
                            </div>

                            {/* Cart Items */}
                            <div className="divide-y divide-gray-100">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {cartItems.map((item) => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            onUpdateQuantity={updateItemQuantity}
                                            onRemove={(id, name) => handleAction(id, () => removeFromCart(id, name))}
                                            onSaveForLater={(id) => handleAction(id, () => addToWishlist(item))}
                                            processingItem={processingItem}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        <Reveal animation="fadeIn">
                            <Link to="/" className="inline-flex items-center text-[#EA7704] hover:text-[#d66b03] font-semibold mt-6 group">
                                <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                                Continue Shopping
                            </Link>
                        </Reveal>
                    </div>



                    {/* Order Summary */}
                    <div className="lg:w-96 flex-shrink-0">
                        <Reveal animation="slideInRight">
                            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 sticky top-24 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping Estimate</span>
                                        <span className={`font-semibold ${shipping === 0 ? 'text-green-500' : 'text-gray-900'}`}>
                                            {shipping === 0 ? 'Free' : `₹${shipping}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Tax Estimate (18%)</span>
                                        <span className="font-semibold text-gray-900">Included</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-4 border-t border-gray-200 mb-8">
                                    <span className="text-lg font-bold text-gray-900">Order Total</span>
                                    <PriceTicker price={total} className="text-2xl font-bold text-[#EA7704]" />
                                </div>

                                <AnimatedButton
                                    variant="primary"
                                    onClick={handleCheckoutClick}
                                    loading={isCheckingOut}
                                    className="w-full py-4 text-lg font-bold"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </AnimatedButton>

                                <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>Secure Checkout</span>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* Wishlist Preview Section */}
                {wishlistItems.length > 0 && (
                    <div className="mt-16 border-t border-gray-200 pt-12">
                        <Reveal animation="fadeInUp">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Your Wishlist ({wishlistItems.length})
                                </h2>
                                <Link to="/wishlist" className="text-[#EA7704] font-medium hover:underline flex items-center">
                                    View Full Wishlist <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </Reveal>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlistItems.slice(0, 3).map((item, index) => (
                                <Reveal key={item.id} animation="fadeInUp" delay={`delay-${index * 100}`}>
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                        <div className="aspect-video w-full overflow-hidden relative group">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 mb-1 truncate">
                                                {item.name}
                                            </h3>
                                            <p className="text-[#EA7704] font-bold mb-4">
                                                ₹{item.price.toLocaleString()}
                                            </p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleAction(item.id, () => moveToCart(item.id))}
                                                    disabled={processingItem === item.id}
                                                    className={`flex-1 bg-gray-100 hover:bg-[#EA7704] hover:text-white text-gray-900 font-medium py-2 px-4 rounded-lg transition-all text-sm flex items-center justify-center gap-2 ${processingItem === item.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    {processingItem === item.id ? <LoadingSpinner size="xs" /> : null}
                                                    {processingItem === item.id ? 'Moving...' : 'Move to Cart'}
                                                </button>
                                                <button
                                                    onClick={() => handleAction(item.id, () => removeFromWishlist(item.id, item.name))}
                                                    disabled={processingItem === item.id}
                                                    className={`p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors bg-transparent border border-gray-200 ${processingItem === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {processingItem === item.id ? <LoadingSpinner size="xs" color="text-red-500" /> : <Trash2 className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                onConfirm={handleConfirmCheckout}
                cartItems={cartItems}
                total={cartTotal}
                isLoading={isCheckingOut}
            />

            <SessionTimeoutModal
                isOpen={showSessionWarning}
                onExtend={extendSession}
                onLeave={() => navigate('/')}
                timeLeft={SESSION_TIMEOUT - (Date.now() - lastActivity)}
            />
        </div>
    );
};

export default Cart;
