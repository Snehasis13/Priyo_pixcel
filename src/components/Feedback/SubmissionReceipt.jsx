import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Package, Calendar, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';

/**
 * Submission Receipt Component
 * Printable/downloadable receipt for order submission
 */
const SubmissionReceipt = React.forwardRef(({ orderDetails }, ref) => {
    if (!orderDetails) return null;

    const {
        orderId,
        customerName,
        email,
        phone,
        address,
        items = [],
        totalAmount,
        timestamp,
        productType,
        quantity,
        estimatedDelivery = '7-10 business days',
    } = orderDetails;

    const formattedDate = timestamp
        ? new Date(timestamp).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
        : new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });

    return (
        <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div className="border-b-4 border-purple-600 pb-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">PriyoPixcel</h1>
                        <p className="text-gray-600">Premium Customized Products</p>
                        <p className="text-sm text-gray-500 mt-2">
                            support@priyopixcel.com | +91 98765 43210
                        </p>
                    </div>
                    <div className="text-right">
                        {/* QR Code with Order ID */}
                        <QRCodeSVG
                            value={`https://priyopixcel.com/order/${orderId}`}
                            size={100}
                            level="H"
                            includeMargin={true}
                        />
                        <p className="text-xs text-gray-500 mt-1">Scan to track</p>
                    </div>
                </div>
            </div>

            {/* Order Confirmation Badge */}
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                    <h2 className="text-xl font-bold text-green-900">Order Confirmed</h2>
                    <p className="text-green-700 text-sm">Thank you for your order!</p>
                </div>
            </div>

            {/* Order Information */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Order ID */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                    <p className="text-lg font-mono font-bold text-gray-900">{orderId}</p>
                </div>

                {/* Order Date */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Date</p>
                    <p className="text-lg font-semibold text-gray-900">{formattedDate}</p>
                </div>
            </div>

            {/* Customer Details */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    Customer Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Full Name</p>
                        <p className="font-semibold text-gray-900">{customerName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> Email
                        </p>
                        <p className="font-semibold text-gray-900">{email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> Phone
                        </p>
                        <p className="font-semibold text-gray-900">{phone}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Estimated Delivery
                        </p>
                        <p className="font-semibold text-gray-900">{estimatedDelivery}</p>
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            {address && (
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        Shipping Address
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900">
                            {address.street && `${address.street}, `}
                            {address.city && `${address.city}, `}
                            {address.state && `${address.state} `}
                            {address.zip && `- ${address.zip}`}
                        </p>
                        {address.country && (
                            <p className="text-gray-900 mt-1">{address.country}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Order Items */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Order Details</h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                            <th className="text-left p-3 text-sm font-bold text-gray-700">Item</th>
                            <th className="text-center p-3 text-sm font-bold text-gray-700">Quantity</th>
                            <th className="text-right p-3 text-sm font-bold text-gray-700">Price</th>
                            <th className="text-right p-3 text-sm font-bold text-gray-700">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="p-3 text-gray-900">{item.name || productType}</td>
                                    <td className="p-3 text-center text-gray-900">{item.quantity}</td>
                                    <td className="p-3 text-right text-gray-900">₹{item.price?.toLocaleString()}</td>
                                    <td className="p-3 text-right font-semibold text-gray-900">
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="border-b border-gray-200">
                                <td className="p-3 text-gray-900">{productType || 'Custom Product'}</td>
                                <td className="p-3 text-center text-gray-900">{quantity || 1}</td>
                                <td className="p-3 text-right text-gray-900">
                                    ₹{totalAmount ? (totalAmount / (quantity || 1)).toLocaleString() : '0'}
                                </td>
                                <td className="p-3 text-right font-semibold text-gray-900">
                                    ₹{totalAmount?.toLocaleString() || '0'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="bg-purple-50 border-t-2 border-purple-600">
                            <td colSpan="3" className="p-3 text-right font-bold text-gray-900">
                                Total Amount
                            </td>
                            <td className="p-3 text-right font-bold text-purple-600 text-xl">
                                ₹{totalAmount?.toLocaleString() || '0'}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-blue-900 mb-2">Important Information</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                    <li>• Please keep this receipt for your records</li>
                    <li>• You will receive a confirmation email shortly</li>
                    <li>• Estimated delivery: {estimatedDelivery}</li>
                    <li>• For any queries, contact us at support@priyopixcel.com</li>
                    <li>• Quote your Order ID ({orderId}) in all communications</li>
                </ul>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-200 pt-4 mt-6">
                <p className="text-center text-sm text-gray-500">
                    Thank you for choosing PriyoPixcel!
                </p>
                <p className="text-center text-xs text-gray-400 mt-2">
                    This is a computer-generated receipt and does not require a signature.
                </p>
            </div>

            {/* Print-specific styles */}
            <style jsx>{`
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    @page {
                        margin: 1cm;
                    }
                }
            `}</style>
        </div>
    );
});

SubmissionReceipt.displayName = 'SubmissionReceipt';

export default SubmissionReceipt;
