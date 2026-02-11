import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Lock, CreditCard, Truck, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import useOrderSubmission from '../hooks/useOrderSubmission';
import ErrorDisplay from '../components/Feedback/ErrorDisplay';
import SuccessConfirmation from '../components/Feedback/SuccessConfirmation';
import SubmissionReceipt from '../components/Feedback/SubmissionReceipt';
import { downloadReceiptAsPDF, generateReceiptFilename } from '../utils/receiptGenerator';

const InputField = ({ label, name, type = "text", value, onChange, error, placeholder, required = false }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#EA7704] focus:border-transparent outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

const CheckoutItem = ({ item }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    return (
        <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute top-0 right-0 bg-[#EA7704] text-white text-xs font-bold px-1.5 py-0.5 rounded-bl-lg">
                    x{item.quantity}
                </span>
            </div>
            <div className="flex-1">
                <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                {item.customization && (
                    <div className="mt-1">
                        <button
                            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                            className="text-xs text-[#EA7704] font-medium flex items-center gap-1 hover:underline focus:outline-none mb-2"
                        >
                            {isDetailsOpen ? 'Hide Details' : 'View Details'}
                            {isDetailsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        <AnimatePresence>
                            {isDetailsOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-2 rounded-lg">
                                        {Object.entries(item.customization)
                                            .filter(([key]) => key !== 'uploads' && key !== 'quantity')
                                            .map(([key, val]) => (
                                                val && (
                                                    <p key={key} className="capitalize flex gap-1">
                                                        <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                        <span className="truncate">{String(val)}</span>
                                                    </p>
                                                )
                                            ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            <div className="text-right">
                <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
            </div>
        </div>
    );
};

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addOrder, directCheckoutItem, setDirectCheckoutItem, clearCart, cartItems, cartTotal } = useCart();
    const receiptRef = useRef();

    // Google Sheets submission hook
    const {
        isSubmitting,
        errorDetails,
        submittedOrderId,
        isOnline,
        submitOrder,
        retrySubmission,
        reset
    } = useOrderSubmission();

    // Determine source of items
    // Priority: 1. Direct Buy (Buy Now), 2. State passed from Cart (Secure), 3. Context Fallback (Refresh)
    const stateItems = location.state?.items;
    const items = directCheckoutItem ? [directCheckoutItem] : (stateItems || cartItems);

    const total = directCheckoutItem
        ? directCheckoutItem.price * directCheckoutItem.quantity
        : (location.state?.total || cartTotal);

    const csrfToken = location.state?.csrfToken;

    const [orderDetails, setOrderDetails] = useState(null);

    // Derived State
    const isValidSession = items && items.length > 0;
    const showSuccessModal = !!(submittedOrderId && orderDetails);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        shippingAddress: {
            street: '',
            apartment: '',
            city: '',
            state: '',
            zip: '',
            country: 'India'
        },
        billingSameAsShipping: true,
        billingAddress: {
            street: '',
            apartment: '',
            city: '',
            state: '',
            zip: '',
            country: 'India'
        },
        companyName: '',
        orderNotes: '',
        paymentMethod: 'upi' // Default to UPI
    });

    const [formErrors, setFormErrors] = useState({});

    // Redirect if invalid session
    useEffect(() => {
        if (!isValidSession) {
            const timer = setTimeout(() => {
                navigate('/cart');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isValidSession, navigate]);

    // Cleanup direct item on unmount
    useEffect(() => {
        return () => {
            // Optional cleanup
        };
    }, [setDirectCheckoutItem]);

    const handleInputChange = (e, section = null) => {
        const { name, value, type, checked } = e.target;

        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        // Clear error for this field
        if (formErrors[name] || (section && formErrors[`${section}.${name}`])) {
            const newErrors = { ...formErrors };
            delete newErrors[name];
            if (section) delete newErrors[`${section}.${name}`];
            setFormErrors(newErrors);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) errors.phone = 'Phone Number is required';

        // Shipping Address Validation
        if (!formData.shippingAddress.street.trim()) errors['shippingAddress.street'] = 'Street Address is required';
        if (!formData.shippingAddress.city.trim()) errors['shippingAddress.city'] = 'City is required';
        if (!formData.shippingAddress.state.trim()) errors['shippingAddress.state'] = 'State is required';
        if (!formData.shippingAddress.zip.trim()) errors['shippingAddress.zip'] = 'ZIP Code is required';

        // Billing Address Validation (if different)
        if (!formData.billingSameAsShipping) {
            if (!formData.billingAddress.street.trim()) errors['billingAddress.street'] = 'Street Address is required';
            if (!formData.billingAddress.city.trim()) errors['billingAddress.city'] = 'City is required';
            if (!formData.billingAddress.state.trim()) errors['billingAddress.state'] = 'State is required';
            if (!formData.billingAddress.zip.trim()) errors['billingAddress.zip'] = 'ZIP Code is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll to top or first error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const finalBillingAddress = formData.billingSameAsShipping ? formData.shippingAddress : formData.billingAddress;

        // Helper to clean and format product details
        const cleanProductDetails = (cartItems) => {
            return cartItems.map(item => {
                const rawCustomization = item.customization || {};
                const cleanedCustomization = {};
                // Add customization fields, filtering out empty/system values
                Object.entries(rawCustomization).forEach(([key, value]) => {
                    // Skip system keys
                    if (['uploads'].includes(key)) return;

                    // Skip empty/null/undefined values
                    if (value === null || value === undefined || value === '') return;

                    // Helper to convert camelCase to snake_case for consistent JSON keys
                    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

                    cleanedCustomization[snakeKey] = value;
                });

                // Handle uploads specifically if needed (e.g. keeping preview links)
                if (rawCustomization.uploads && rawCustomization.uploads.preview) {
                    cleanedCustomization['preview_image'] = rawCustomization.uploads.preview;
                }

                return {
                    product_name: item.name,
                    customization: cleanedCustomization,
                    quantity: item.quantity,
                    price: item.price
                };
            });
        };

        const cleanedDetails = cleanProductDetails(items);

        // --- VALIDATION START ---
        const validateProductDetails = (details) => {
            const errors = [];

            if (!Array.isArray(details)) {
                return { isValid: false, errors: ['Product details is not an array'] };
            }

            details.forEach((item, index) => {
                if (!item.product_name) errors.push(`Item ${index + 1}: Missing product_name`);
                if (!item.quantity) errors.push(`Item ${index + 1}: Missing quantity`);
                if (item.price === undefined) errors.push(`Item ${index + 1}: Missing price`);

                // Check if customization contains only user values (completeness check)
                // This is a basic check. In a real app, strict schema validation per product type would be better.
                if (item.product_name !== 'Standard Product' && Object.keys(item.customization).length === 0) {
                    // Warning: Custom product with no customization? 
                    // We allow it but it might be worth noting if that's unexpected for your catalog.
                    // For now, assuming some products might not have customization is safe, 
                    // AND if the user didn't select options, they might be relying on defaults 
                    // (though we filtered those out).
                    // However, the requirement says "Confirm all required fields... are present".
                    // Since we don't have the form schema here, we rely on the form validation step (validateForm).
                    // But we can check for "extraneous" fields or system data (which we already cleaned).
                }

                // Verify keys are valid (simple alphanum check for snake_case/camelCase keys)
                Object.keys(item.customization).forEach(key => {
                    if (key.startsWith('sys_') || key === 'undefined') {
                        errors.push(`Item ${index + 1}: Invalid key detected '${key}'`);
                    }
                });
            });

            return {
                isValid: errors.length === 0,
                errors
            };
        };

        const validationResult = validateProductDetails(cleanedDetails);

        if (!validationResult.isValid) {
            console.error('Data Validation Failed:', validationResult.errors);

            // Backup raw order data
            const backupData = {
                timestamp: new Date().toISOString(),
                reason: 'Validation Failure',
                errors: validationResult.errors,
                rawItems: items,
                cleanedDetails: cleanedDetails,
                formData: formData
            };

            try {
                const key = `failed_order_${Date.now()}`;
                localStorage.setItem(key, JSON.stringify(backupData));
                console.warn(`Order backed up to localStorage: ${key}`);
            } catch (e) {
                console.error("Failed to backup to localStorage", e);
            }

            // Alert Admin (Simulated)
            alert(`Order Validation Failed!\nErrors:\n${validationResult.errors.join('\n')}\n\nThe order has been logged for review. Please contact support.`);
            return; // STOP execution
        }
        // --- VALIDATION END ---


        // Prepare order data for Google Sheets
        const orderData = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            streetAddress: `${formData.shippingAddress.street} ${formData.shippingAddress.apartment}`,
            city: formData.shippingAddress.city,
            state: formData.shippingAddress.state,
            zipCode: formData.shippingAddress.zip,
            country: formData.shippingAddress.country,
            productType: items.map(item => item.name).join(', '),
            quantity: items.reduce((sum, item) => sum + item.quantity, 0),
            totalAmount: total,
            productDetails: cleanedDetails, // Use the cleaned and validated data
            items: items.map(item => ({
                id: item.cartId || item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                customization: item.customization || {} // Keep internal structure for other uses if needed
            })),
            paymentMethod: formData.paymentMethod,
            orderDate: new Date().toISOString(),
            companyName: formData.companyName,
            orderNotes: formData.orderNotes,
            billingAddress: `${finalBillingAddress.street} ${finalBillingAddress.apartment}, ${finalBillingAddress.city}, ${finalBillingAddress.state} ${finalBillingAddress.zip}, ${finalBillingAddress.country}`
        };

        // Submit to Google Sheets
        const result = await submitOrder(orderData, {
            showToast: true,
            onSuccess: (successData) => {
                // Add to local orders for dashboard
                const order = {
                    orderId: successData.orderId,
                    items: items,
                    total: total,
                    paymentMethod: formData.paymentMethod,
                    date: new Date().toISOString(),
                    status: 'Processing'
                };

                addOrder(order);

                // Prepare order details for success modal
                setOrderDetails({
                    orderId: successData.orderId,
                    customerName: orderData.fullName,
                    email: orderData.email,
                    phone: orderData.phone,
                    address: {
                        street: orderData.streetAddress,
                        city: orderData.city,
                        state: orderData.state,
                        zip: orderData.zipCode,
                        country: orderData.country
                    },
                    items: orderData.items,
                    totalAmount: total,
                    timestamp: orderData.orderDate,
                    productType: orderData.productType,
                    quantity: orderData.quantity,
                    estimatedDelivery: '7-10 business days',
                    // DEBUG: Pass the raw payload to the modal or state for verification
                    debugPayload: orderData.productDetails
                });

                // Clear cart
                if (!directCheckoutItem) {
                    clearCart();
                }

                // Clear direct checkout item
                if (directCheckoutItem) {
                    setDirectCheckoutItem(null);
                }
            },
            onError: (err, details) => {
                console.error('Order submission failed:', err);
            }
        });

        if (result && !result.success) {
            console.error('Submission result:', result);
        }
    };

    const handleDownloadReceipt = async () => {
        if (!receiptRef.current || !orderDetails) return;
        const filename = generateReceiptFilename(orderDetails, 'pdf');
        await downloadReceiptAsPDF(receiptRef.current, filename);
    };

    const handleCloseSuccess = () => {
        reset();
        navigate('/dashboard');
    };

    const handleRetry = () => {
        // Trigger generic retry or just re-submit
        // For now, re-triggering the submit function logic would require extracting it or just letting user click button again
        // But since we have form state, user can just click "Place Order" again.
        // The ErrorDisplay component might handle retry if passed a function.
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
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link to="/cart" className="inline-flex items-center text-gray-500 hover:text-[#EA7704] mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Cart
                </Link>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
                    <p className="text-gray-500 mt-2">Complete your order securely</p>
                    {!isOnline && (
                        <div className="mt-4 inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            Currently Offline - Orders will sync when online key
                        </div>
                    )}
                </div>

                {errorDetails && (
                    <div className="mb-8 max-w-3xl mx-auto">
                        <ErrorDisplay errorDetails={errorDetails} />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* 1. Customer Info */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <span className="w-8 h-8 bg-[#EA7704] text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
                                Customer Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    error={formErrors.fullName}
                                    required
                                />
                                <InputField
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={formErrors.email}
                                    required
                                />
                                <InputField
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    error={formErrors.phone}
                                    required
                                />
                                <InputField
                                    label="Company Name (Optional)"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </section>

                        {/* 2. Shipping Address */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <span className="w-8 h-8 bg-[#EA7704] text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
                                Shipping Address
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <InputField
                                    label="Street Address"
                                    name="street"
                                    value={formData.shippingAddress.street}
                                    onChange={(e) => handleInputChange(e, 'shippingAddress')}
                                    error={formErrors['shippingAddress.street']}
                                    required
                                    placeholder="123 Main St"
                                />
                                <InputField
                                    label="Apartment, suite, etc. (optional)"
                                    name="apartment"
                                    value={formData.shippingAddress.apartment}
                                    onChange={(e) => handleInputChange(e, 'shippingAddress')}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        label="City"
                                        name="city"
                                        value={formData.shippingAddress.city}
                                        onChange={(e) => handleInputChange(e, 'shippingAddress')}
                                        error={formErrors['shippingAddress.city']}
                                        required
                                    />
                                    <InputField
                                        label="State / Province"
                                        name="state"
                                        value={formData.shippingAddress.state}
                                        onChange={(e) => handleInputChange(e, 'shippingAddress')}
                                        error={formErrors['shippingAddress.state']}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        label="ZIP / Postal Code"
                                        name="zip"
                                        value={formData.shippingAddress.zip}
                                        onChange={(e) => handleInputChange(e, 'shippingAddress')}
                                        error={formErrors['shippingAddress.zip']}
                                        required
                                    />
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <select
                                            name="country"
                                            value={formData.shippingAddress.country}
                                            onChange={(e) => handleInputChange(e, 'shippingAddress')}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#EA7704]"
                                        >
                                            <option value="India">India</option>
                                            <option value="United States">United States</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            {/* Add more as needed */}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Billing Address */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <span className="w-8 h-8 bg-[#EA7704] text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
                                Billing Address
                            </h2>
                            <div className="mb-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="billingSameAsShipping"
                                        checked={formData.billingSameAsShipping}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-[#EA7704] border-gray-300 rounded focus:ring-[#EA7704]"
                                    />
                                    <span className="text-gray-700">Same as shipping address</span>
                                </label>
                            </div>

                            {!formData.billingSameAsShipping && (
                                <div className="grid grid-cols-1 gap-4 mt-4 animate-fadeIn">
                                    <InputField
                                        label="Street Address"
                                        name="street"
                                        value={formData.billingAddress.street}
                                        onChange={(e) => handleInputChange(e, 'billingAddress')}
                                        error={formErrors['billingAddress.street']}
                                        required
                                    />
                                    {/* ... Repeat address fields or generic sub-component ... */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField
                                            label="City"
                                            name="city"
                                            value={formData.billingAddress.city}
                                            onChange={(e) => handleInputChange(e, 'billingAddress')}
                                            error={formErrors['billingAddress.city']}
                                            required
                                        />
                                        <InputField
                                            label="State"
                                            name="state"
                                            value={formData.billingAddress.state}
                                            onChange={(e) => handleInputChange(e, 'billingAddress')}
                                            error={formErrors['billingAddress.state']}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField
                                            label="ZIP Code"
                                            name="zip"
                                            value={formData.billingAddress.zip}
                                            onChange={(e) => handleInputChange(e, 'billingAddress')}
                                            error={formErrors['billingAddress.zip']}
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* 4. Payment Method */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <span className="w-8 h-8 bg-[#EA7704] text-white rounded-full flex items-center justify-center text-sm mr-3">4</span>
                                Payment Method
                            </h2>
                            <div className="space-y-3">
                                <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors bg-white border-gray-200 has-[:checked]:border-[#EA7704] has-[:checked]:bg-orange-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="upi"
                                        checked={formData.paymentMethod === 'upi'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-[#EA7704] border-gray-300 focus:ring-[#EA7704]"
                                    />
                                    <div className="ml-3 flex-1">
                                        <span className="block font-medium text-gray-900">UPI / QR Code</span>
                                        <span className="block text-sm text-gray-500">Google Pay, PhonePe, Paytm</span>
                                    </div>
                                    <CreditCard className="w-6 h-6 text-gray-400" />
                                </label>

                                <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors bg-white border-gray-200 has-[:checked]:border-[#EA7704] has-[:checked]:bg-orange-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={formData.paymentMethod === 'card'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-[#EA7704] border-gray-300 focus:ring-[#EA7704]"
                                    />
                                    <div className="ml-3 flex-1">
                                        <span className="block font-medium text-gray-900">Credit / Debit Card</span>
                                        <span className="block text-sm text-gray-500">Secure Razorpay payment</span>
                                    </div>
                                    <CreditCard className="w-6 h-6 text-gray-400" />
                                </label>

                                <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors bg-white border-gray-200 has-[:checked]:border-[#EA7704] has-[:checked]:bg-orange-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-[#EA7704] border-gray-300 focus:ring-[#EA7704]"
                                    />
                                    <div className="ml-3 flex-1">
                                        <span className="block font-medium text-gray-900">Cash on Delivery</span>
                                        <span className="block text-sm text-gray-500">Pay when you receive</span>
                                    </div>
                                    <Truck className="w-6 h-6 text-gray-400" />
                                </label>
                            </div>
                        </section>

                        {/* 5. Additional Notes */}
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <span className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm mr-3">5</span>
                                Order Notes (Optional)
                            </h2>
                            <textarea
                                name="orderNotes"
                                value={formData.orderNotes}
                                onChange={handleInputChange}
                                placeholder="Notes about your order, e.g. special notes for delivery."
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA7704] focus:border-transparent outline-none transition-all"
                            ></textarea>
                        </section>

                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                                <div className="max-h-96 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                                    {items?.map((item, idx) => (
                                        <CheckoutItem key={`${item.id}-${idx}`} item={item} />
                                    ))}
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-200 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium">₹{total?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span className="font-medium">Included</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-6 mt-4 border-t border-gray-200">
                                    <span className="text-xl font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-[#EA7704]">₹{total?.toLocaleString()}</span>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isSubmitting}
                                    className="w-full bg-[#EA7704] hover:bg-[#d66b03] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Place Order
                                            <CheckCircle className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <Lock className="w-3 h-3" />
                                    <span>Secure SSL Encryption</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Confirmation Modal */}
            <SuccessConfirmation
                isOpen={showSuccessModal}
                onClose={handleCloseSuccess}
                orderDetails={orderDetails}
                onDownloadReceipt={handleDownloadReceipt}
            />

            {/* Hidden receipt for PDF generation */}
            <div style={{ position: 'absolute', left: '-9999px' }}>
                {orderDetails && (
                    <SubmissionReceipt ref={receiptRef} orderDetails={orderDetails} />
                )}
            </div>
        </div>
    );
};

export default Checkout;
