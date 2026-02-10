import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, Download, Mail, X, Package, Calendar, MapPin, Phone } from 'lucide-react';
import Confetti from '../common/Confetti';

/**
 * Success Confirmation Modal
 * Shows order confirmation with details and receipt download
 */
const SuccessConfirmation = ({
    isOpen,
    onClose,
    orderDetails,
    onDownloadReceipt,
    onSendEmail,
}) => {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowConfetti(true);
            // Stop confetti after 3 seconds
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen || !orderDetails) return null;

    const {
        orderId,
        customerName,
        email,
        phone,
        address,
        items = [],
        totalAmount,
        estimatedDelivery = '7-10 business days',
        timestamp,
    } = orderDetails;

    return createPortal(
        <>
            {/* Confetti Effect */}
            {showConfetti && <Confetti />}

            {/* Modal Overlay */}
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-fadeInUp max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-full">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Order Confirmed!</h2>
                                <p className="text-green-100">Your order has been successfully placed</p>
                            </div>
                        </div>

                        {/* Order ID Badge */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 inline-block">
                            <p className="text-xs text-green-100 uppercase tracking-wider mb-1">Order ID</p>
                            <p className="text-xl font-mono font-bold">{orderId}</p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                        {/* Success Message */}
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm">
                                🎉 <strong>Thank you for your order!</strong> We've received your order and will start processing it shortly.
                                You'll receive a confirmation email at <strong>{email}</strong>.
                            </p>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-6">
                            {/* Delivery Information */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-purple-600" />
                                    Delivery Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                    Estimated Delivery
                                                </p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {estimatedDelivery}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                                    Shipping Address
                                                </p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {address?.city}, {address?.state}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    Customer Details
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Name:</span>
                                        <span className="font-semibold text-gray-900">{customerName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-semibold text-gray-900">{email}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Phone:</span>
                                        <span className="font-semibold text-gray-900">{phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            {items.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                                        Order Items
                                    </h3>
                                    <div className="space-y-3">
                                        {items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-4 bg-gray-50 rounded-lg p-3"
                                            >
                                                {item.image && (
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{item.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Qty: {item.quantity} × ₹{item.price}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Total Amount */}
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-bold text-purple-600">
                                        ₹{totalAmount?.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-bold text-blue-900 mb-2">What's Next?</h4>
                                <ul className="space-y-1 text-sm text-blue-800">
                                    <li>✓ You'll receive a confirmation email shortly</li>
                                    <li>✓ We'll send tracking information once your order ships</li>
                                    <li>✓ Expected delivery: {estimatedDelivery}</li>
                                    <li>✓ Need help? Contact us at support@priyopixcel.com</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 flex-shrink-0">
                        {onDownloadReceipt && (
                            <button
                                onClick={onDownloadReceipt}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all"
                            >
                                <Download className="w-5 h-5" />
                                Download Receipt
                            </button>
                        )}
                        {onSendEmail && (
                            <button
                                onClick={onSendEmail}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold rounded-xl transition-all"
                            >
                                <Mail className="w-5 h-5" />
                                Email Receipt
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold rounded-xl transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default SuccessConfirmation;
