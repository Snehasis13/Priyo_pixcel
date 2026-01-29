import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, Edit3, User, MapPin, Mail, Phone, Building2, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const CheckoutModal = ({ isOpen, onClose, onConfirm, cartItems, total, isLoading }) => {
    const [step, setStep] = useState('summary'); // 'summary' | 'details'
    const [formData, setFormData] = useState({
        personalDetails: { fullName: '', email: '', phone: '' },
        addressDetails: { street: '', city: '', state: '', zip: '', country: 'India' }
    });
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors = {};
        const { personalDetails, addressDetails } = formData;

        if (!personalDetails.fullName) newErrors.fullName = 'Full Name is required';
        if (!personalDetails.email) newErrors.email = 'Email is required';
        if (!personalDetails.phone) newErrors.phone = 'Phone is required';

        if (!addressDetails.street) newErrors.street = 'Street Address is required';
        if (!addressDetails.city) newErrors.city = 'City is required';
        if (!addressDetails.state) newErrors.state = 'State is required';
        if (!addressDetails.zip) newErrors.zip = 'ZIP Code is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 'summary') {
            setStep('details');
        } else {
            if (validateForm()) {
                onConfirm(formData);
            }
        }
    };

    const updateFormData = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-fadeInUp max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {step === 'summary' ? 'Order Summary' : 'Shipping Details'}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {step === 'summary' ? 'Review your items' : 'Where should we send this?'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    {step === 'summary' ? (
                        <>
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                                    <span className="font-bold text-lg text-gray-900">Total</span>
                                    <span className="font-bold text-xl text-[#EA7704]">₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            {/* Personal Details */}
                            <div className="space-y-4">
                                <h3 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                                    <User className="w-4 h-4 mr-2 text-purple-600" /> Personal Details
                                </h3>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.personalDetails.fullName}
                                                onChange={(e) => updateFormData('personalDetails', 'fullName', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-2 text-sm border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={formData.personalDetails.email}
                                                    onChange={(e) => updateFormData('personalDetails', 'email', e.target.value)}
                                                    className={`w-full pl-10 pr-4 py-2 text-sm border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={formData.personalDetails.phone}
                                                    onChange={(e) => updateFormData('personalDetails', 'phone', e.target.value)}
                                                    className={`w-full pl-10 pr-4 py-2 text-sm border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="space-y-4">
                                <h3 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                                    <MapPin className="w-4 h-4 mr-2 text-purple-600" /> Shipping Address
                                </h3>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Street Address</label>
                                        <input
                                            type="text"
                                            value={formData.addressDetails.street}
                                            onChange={(e) => updateFormData('addressDetails', 'street', e.target.value)}
                                            className={`w-full px-4 py-2 text-sm border ${errors.street ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
                                            placeholder="123 Main St, Apt 4B"
                                        />
                                        {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                value={formData.addressDetails.city}
                                                onChange={(e) => updateFormData('addressDetails', 'city', e.target.value)}
                                                className={`w-full px-4 py-2 text-sm border ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
                                                placeholder="Mumbai"
                                            />
                                            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                                            <input
                                                type="text"
                                                value={formData.addressDetails.state}
                                                onChange={(e) => updateFormData('addressDetails', 'state', e.target.value)}
                                                className={`w-full px-4 py-2 text-sm border ${errors.state ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
                                                placeholder="Maharashtra"
                                            />
                                            {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">ZIP Code</label>
                                            <input
                                                type="text"
                                                value={formData.addressDetails.zip}
                                                onChange={(e) => updateFormData('addressDetails', 'zip', e.target.value)}
                                                className={`w-full px-4 py-2 text-sm border ${errors.zip ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
                                                placeholder="400001"
                                            />
                                            {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={formData.addressDetails.country}
                                                    readOnly
                                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 flex-shrink-0">
                    {step === 'details' && (
                        <button
                            onClick={() => setStep('summary')}
                            className="px-4 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white transition-all"
                        >
                            Back
                        </button>
                    )}
                    {step === 'summary' && (
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white hover:shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Cart
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-[#EA7704] hover:bg-[#d66b03] text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner size="sm" color="text-white" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>{step === 'summary' ? 'Confirm & Continue' : 'Proceed to Pay'}</span>
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
