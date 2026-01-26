import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import Reveal from '../components/Reveal/Reveal';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { items, total, csrfToken } = location.state || {};
    const [isValidSession, setIsValidSession] = useState(true);
    const { addOrder } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Mock Session Validation
        if (!location.state || !csrfToken) {
            setIsValidSession(false);
            const timer = setTimeout(() => {
                navigate('/cart');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [location.state, csrfToken, navigate]);

    const handlePlaceOrder = async () => {
        setIsProcessing(true);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const order = {
            items: items,
            total: total,
            paymentMethod: 'Demo Payment'
        };

        addOrder(order);
        setIsProcessing(false);
        navigate('/dashboard'); // Go to dashboard to see new order count
    };

    if (!isValidSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Session</h2>
                    <p className="text-gray-500">Redirecting back to cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/cart" className="inline-flex items-center text-gray-500 hover:text-[#EA7704] mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Cart
                </Link>

                <Reveal animation="fadeInDown">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <ShieldCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                            Secure Checkout
                        </h1>
                        <p className="text-gray-500">Complete your purchase securely.</p>
                    </div>
                </Reveal>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">Order Review</h2>
                    <div className="space-y-4 mb-8">
                        {items?.map(item => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <span className="text-lg font-bold text-gray-900">Total to Pay</span>
                        <span className="text-2xl font-bold text-[#EA7704]">₹{total?.toLocaleString()}</span>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-blue-700 mb-6">
                        <p><strong>Note:</strong> This is a demo checkout page. No real payment processing will occur.</p>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="w-full flex justify-center py-4 px-6 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                    >
                        {isProcessing ? "Processing Order..." : `Pay ₹${total?.toLocaleString()}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
