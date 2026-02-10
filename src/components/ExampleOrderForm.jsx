import { useState } from 'react';
import { useOrderSubmission } from '../hooks/useOrderSubmission';
import GoogleSignInButton from '../components/Auth/GoogleSignInButton';

/**
 * Example Order Form Component
 * Demonstrates how to use the submitOrderToSheet function with full features
 */
const ExampleOrderForm = () => {
    const {
        isSubmitting,
        error,
        submittedOrderId,
        isAuthenticated,
        submitOrder,
        reset
    } = useOrderSubmission();

    const [formData, setFormData] = useState({
        // Customer Information
        fullName: '',
        email: '',
        phone: '',

        // Address
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',

        // Order Details
        productType: 'Photo Frame',
        quantity: 1,

        // Optional fields
        imageUrl: '',
        imageFilename: '',
        customMessage: '',
        specialInstructions: '',

        // Product details (can be an object)
        productDetails: {
            size: '',
            frameColor: '',
            material: '',
        },
    });

    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProductDetailChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            productDetails: {
                ...prev.productDetails,
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check authentication
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        // Submit order
        const result = await submitOrder(formData, {
            sheetRange: 'Orders!A:R', // Customize your sheet range
            showToast: true,
            onSuccess: (data) => {
                console.log('Order submitted!', data);
                // Clear form or redirect
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    streetAddress: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: 'India',
                    productType: 'Photo Frame',
                    quantity: 1,
                    imageUrl: '',
                    imageFilename: '',
                    customMessage: '',
                    specialInstructions: '',
                    productDetails: { size: '', frameColor: '', material: '' },
                });
            },
            onError: (err) => {
                console.error('Submission failed:', err);
            },
        });

        console.log('Submission result:', result);
    };

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
        // Auto-submit after authentication
        handleSubmit({ preventDefault: () => { } });
    };

    // Show auth modal if needed
    if (showAuthModal) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                    <h2 className="text-2xl font-bold mb-4">Sign in Required</h2>
                    <p className="text-gray-600 mb-6">
                        Please sign in with Google to submit your order securely.
                    </p>
                    <GoogleSignInButton
                        onSuccess={handleAuthSuccess}
                        redirectToDashboard={false}
                        buttonText="Sign in to Continue"
                    />
                    <button
                        onClick={() => setShowAuthModal(false)}
                        className="mt-4 w-full py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    // Success message
    if (submittedOrderId) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl font-bold text-green-600 mb-2">Order Submitted!</h2>
                    <p className="text-xl text-gray-700 mb-4">
                        Your order ID is: <span className="font-mono font-bold">{submittedOrderId}</span>
                    </p>
                    <p className="text-gray-600 mb-6">
                        We'll process your order shortly and send you a confirmation email.
                    </p>
                    <button
                        onClick={reset}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Submit Another Order
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6">Order Form</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Information Section */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name="streetAddress"
                                    value={formData.streetAddress}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="123 Main Street"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Mumbai"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Maharashtra"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ZIP Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="400001"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order Details Section */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Type *
                                </label>
                                <select
                                    name="productType"
                                    value={formData.productType}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Photo Frame">Photo Frame</option>
                                    <option value="Canvas Print">Canvas Print</option>
                                    <option value="Photo Album">Photo Album</option>
                                    <option value="Custom Print">Custom Print</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    min="1"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Size
                                </label>
                                <input
                                    type="text"
                                    value={formData.productDetails.size}
                                    onChange={(e) => handleProductDetailChange('size', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="8x10 inches"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Frame Color
                                </label>
                                <input
                                    type="text"
                                    value={formData.productDetails.frameColor}
                                    onChange={(e) => handleProductDetailChange('frameColor', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Material
                                </label>
                                <input
                                    type="text"
                                    value={formData.productDetails.material}
                                    onChange={(e) => handleProductDetailChange('material', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Wood"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Optional Information */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Custom Message
                                </label>
                                <textarea
                                    name="customMessage"
                                    value={formData.customMessage}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Add a custom message to be printed..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Special Instructions
                                </label>
                                <textarea
                                    name="specialInstructions"
                                    value={formData.specialInstructions}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Any special requests or instructions..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Submitting Order...
                                </span>
                            ) : (
                                'Submit Order'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData({
                                fullName: '',
                                email: '',
                                phone: '',
                                streetAddress: '',
                                city: '',
                                state: '',
                                zipCode: '',
                                country: 'India',
                                productType: 'Photo Frame',
                                quantity: 1,
                                imageUrl: '',
                                imageFilename: '',
                                customMessage: '',
                                specialInstructions: '',
                                productDetails: { size: '', frameColor: '', material: '' },
                            })}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Authentication Status */}
                    {!isAuthenticated && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-start gap-3">
                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p>
                                You'll need to sign in with Google to submit your order.
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ExampleOrderForm;
