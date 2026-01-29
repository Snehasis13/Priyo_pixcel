import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    ChevronRight,
    ChevronLeft,
    User,
    MapPin,
    Palette,
    FileText,
    Upload,
    AlertCircle,
    ShoppingBag,
    Coffee,
    CreditCard,
    Globe,
    QrCode,
    Building2,
    Briefcase,
    Mail,
    Phone,
    Fan,
    Key,
    Images,
    Layers,
    Ruler
} from 'lucide-react';
import ModernFileUpload from '../common/ModernFileUpload';

const ProductCustomizationForm = ({ selectedProduct, onBack, onSubmit, initialValues, isEditing }) => {
    // State Management
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        personalDetails: initialValues?.personalDetails || { fullName: '', email: '', phone: '' },
        addressDetails: initialValues?.addressDetails || { street: '', city: '', state: '', zip: '', country: 'India' },
        productCustomization: initialValues?.productCustomization || {
            message: '', color: '#000000', size: 'M', instructions: '', quantity: 1,
            frameType: 'led-wooden', shape: 'rectangular', orientation: 'portrait', customSize: '', customShape: '',
            mugType: 'standard', handlePosition: 'right',
            cardType: 'standard', companyName: '', jobTitle: '', website: '', includeQRCode: false,
            fanSize: '42cm', displayDuration: '15sec',
            keychainShape: 'rectangular', keychainMaterial: 'acrylic', keychainSize: 'medium',
            wallHangingSize: '12x18', wallHangingMaterial: 'canvas',
        },
        uploads: initialValues?.uploads || { file: null, preview: null }
    });

    // Set initial quantity based on product type ONLY if not editing (to preserve edit qty)
    // Set initial quantity based on product type ONLY if not editing (to preserve edit qty)
    useEffect(() => {
        if (!isEditing) {
            setFormData(prev => ({
                ...prev,
                productCustomization: { ...prev.productCustomization, quantity: 1 }
            }));
        }
    }, [selectedProduct?.id, isEditing]);

    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Total Steps
    const TOTAL_STEPS = 4;

    // Helper: Update Form Data
    const updateFormData = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        // Clear error when user types
        if (errors[`${section}.${field}`]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`${section}.${field}`];
                return newErrors;
            });
        }
    };

    // Helper: Validate Single Field
    const validateField = (section, field, value) => {
        let error = '';
        if (section === 'personalDetails') {
            if (field === 'fullName') {
                if (!value) error = 'Full Name is required';
                else if (value.length < 3) error = 'Name must be at least 3 characters';
            }
            if (field === 'email') {
                if (!value) error = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email is invalid';
            }
            if (field === 'phone') {
                if (!value) error = 'Phone is required';
                else if (value.length < 10) error = 'Phone must be at least 10 digits';
            }
        }
        if (section === 'addressDetails') {
            if (field === 'street' && !value) error = 'Street Address is required';
            if (field === 'city' && !value) error = 'City is required';
            if (field === 'state' && !value) error = 'State is required';
            if (field === 'zip' && !value) error = 'ZIP Code is required';
        }
        return error;
    };

    const handleBlur = (section, field) => {
        const error = validateField(section, field, formData[section][field]);
        setErrors(prev => ({
            ...prev,
            [`${section}.${field}`]: error
        }));
    };

    // Helper: Update File
    const updateFile = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    uploads: { file: file, preview: reader.result }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Helper: Validate Step
    const validateCurrentStep = () => {
        const newErrors = {};
        let isValid = true;

        if (currentStep === 1) { // Personal Details
            if (!formData.personalDetails.fullName) newErrors['personalDetails.fullName'] = 'Full Name is required';
            else if (formData.personalDetails.fullName.length < 3) newErrors['personalDetails.fullName'] = 'Name must be at least 3 characters';

            if (!formData.personalDetails.email) newErrors['personalDetails.email'] = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.personalDetails.email)) newErrors['personalDetails.email'] = 'Email is invalid';

            if (!formData.personalDetails.phone) newErrors['personalDetails.phone'] = 'Phone is required';
            else if (formData.personalDetails.phone.length < 10) newErrors['personalDetails.phone'] = 'Phone must be at least 10 digits';
        } else if (currentStep === 2) { // Address Details
            if (!formData.addressDetails.street) newErrors['addressDetails.street'] = 'Street Address is required';
            if (!formData.addressDetails.city) newErrors['addressDetails.city'] = 'City is required';
            if (!formData.addressDetails.state) newErrors['addressDetails.state'] = 'State is required';
            if (!formData.addressDetails.zip) newErrors['addressDetails.zip'] = 'ZIP Code is required';
        } else if (currentStep === 3) { // Customization
            if (selectedProduct.id === 'tshirts') {
                if (!formData.productCustomization.size) newErrors['productCustomization.size'] = 'Size is required';
            }
            if (selectedProduct.id === 'frames') {
                if (!formData.productCustomization.frameType) newErrors['productCustomization.frameType'] = 'Frame Type is required';
                if (!formData.productCustomization.size) newErrors['productCustomization.size'] = 'Size is required';
                if (formData.productCustomization.size === 'custom' && !formData.productCustomization.customSize) {
                    newErrors['productCustomization.customSize'] = 'Custom Size is required';
                }
                if (!formData.productCustomization.shape) newErrors['productCustomization.shape'] = 'Shape is required';
                if (formData.productCustomization.shape === 'custom' && !formData.productCustomization.customShape) {
                    newErrors['productCustomization.customShape'] = 'Custom Shape is required';
                }
                if (!formData.productCustomization.orientation) newErrors['productCustomization.orientation'] = 'Orientation is required';
            }
            if (selectedProduct.id === 'mugs') {
                if (!formData.productCustomization.mugType) newErrors['productCustomization.mugType'] = 'Mug Type is required';
                if (!formData.productCustomization.size) newErrors['productCustomization.size'] = 'Size is required';
                if (!formData.productCustomization.handlePosition) newErrors['productCustomization.handlePosition'] = 'Handle Position is required';
            }

            if (selectedProduct.id === 'cards') {
                if (!formData.productCustomization.cardType) newErrors['productCustomization.cardType'] = 'Card Type is required';
                if (!formData.productCustomization.companyName) newErrors['productCustomization.companyName'] = 'Company Name is required';
                if (!formData.productCustomization.jobTitle) newErrors['productCustomization.jobTitle'] = 'Job Title is required';
                if (formData.productCustomization.website && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.productCustomization.website)) {
                    newErrors['productCustomization.website'] = 'Invalid URL format';
                }
            }

            if (selectedProduct.id === 'fans') {
                if (!formData.productCustomization.fanSize) newErrors['productCustomization.fanSize'] = 'Fan Size is required';
                if (!formData.productCustomization.displayDuration) newErrors['productCustomization.displayDuration'] = 'Duration is required';
            }
            if (selectedProduct.id === 'keychains') {
                if (!formData.productCustomization.keychainShape) newErrors['productCustomization.keychainShape'] = 'Shape is required';
                if (!formData.productCustomization.keychainMaterial) newErrors['productCustomization.keychainMaterial'] = 'Material is required';
                if (!formData.productCustomization.keychainSize) newErrors['productCustomization.keychainSize'] = 'Size is required';
            }
            if (selectedProduct.id === 'wall-hangings') {
                if (!formData.productCustomization.wallHangingSize) newErrors['productCustomization.wallHangingSize'] = 'Size is required';
                if (!formData.productCustomization.wallHangingMaterial) newErrors['productCustomization.wallHangingMaterial'] = 'Material is required';
                if (!formData.productCustomization.orientation) newErrors['productCustomization.orientation'] = 'Orientation is required';
            }

            const isLogoOptional = selectedProduct.id === 'cards';
            if (!formData.uploads.file && !isLogoOptional) {
                newErrors['uploads.file'] = 'Please upload a design/photo';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        }

        return isValid;
    };

    // Handlers
    const handleNext = () => {
        if (validateCurrentStep()) {
            if (currentStep < TOTAL_STEPS) {
                setCurrentStep(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            onBack(); // Go back to product grid
        }
    };

    const handleJumpToStep = (stepNumber) => {
        // Only allow jumping to completed steps or the immediate next step if valid
        if (stepNumber < currentStep || (stepNumber === currentStep + 1 && validateCurrentStep())) {
            setCurrentStep(stepNumber);
        }
    };

    const handleSubmit = () => {
        console.log("ProductCustomizationForm: handleSubmit called");
        const isValid = validateCurrentStep();
        console.log("ProductCustomizationForm: Validation result:", isValid);
        if (isValid) {
            console.log("ProductCustomizationForm: onsubmit prop present?", !!onSubmit);
            if (onSubmit) {
                onSubmit(formData);
            } else {
                console.log('Form Submitted:', { selectedProduct, formData });
                setIsSubmitted(true);
            }
        } else {
            console.log("ProductCustomizationForm: Validation failed", errors);
        }
    };

    const handleReset = () => {
        setCurrentStep(1);
        setFormData({
            personalDetails: { fullName: '', email: '', phone: '' },
            addressDetails: { street: '', city: '', state: '', zip: '', country: 'India' },
            productCustomization: { message: '', color: '#000000', size: 'M', instructions: '', quantity: 1 },
            uploads: { file: null, preview: null }
        });
        setErrors({});
        setIsSubmitted(false);
    };

    // UI Components
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-8 max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Get Started</h2>
                            <p className="text-gray-500">Please provide your contact details for the order.</p>
                        </div>

                        <div className="space-y-6">
                            {/* Full Name Input */}
                            <div className="relative group">
                                <User className={`absolute left-4 top-4 w-5 h-5 transition-colors duration-300 ${errors['personalDetails.fullName'] ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'
                                    }`} />
                                <input
                                    type="text"
                                    id="fullName"
                                    value={formData.personalDetails.fullName}
                                    onChange={(e) => updateFormData('personalDetails', 'fullName', e.target.value)}
                                    onBlur={() => handleBlur('personalDetails', 'fullName')}
                                    className={`peer block w-full rounded-xl border-2 bg-gray-50 px-4 pl-12 pt-6 pb-2 text-gray-900 font-medium placeholder-transparent focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 ${errors['personalDetails.fullName'] ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                        } ${!errors['personalDetails.fullName'] && formData.personalDetails.fullName.length >= 3 ? 'border-green-500/50' : ''}`}
                                    placeholder="Full Name"
                                />
                                <label
                                    htmlFor="fullName"
                                    className="absolute left-12 top-2 text-xs font-bold uppercase tracking-wider text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-purple-500"
                                >
                                    Full Name
                                </label>
                                {errors['personalDetails.fullName'] && (
                                    <div className="flex items-center gap-1 text-red-500 text-xs mt-2 animate-slideDown">
                                        <AlertCircle size={12} /> {errors['personalDetails.fullName']}
                                    </div>
                                )}
                                {!errors['personalDetails.fullName'] && formData.personalDetails.fullName.length >= 3 && (
                                    <Check className="absolute right-4 top-4 w-5 h-5 text-green-500 animate-scaleIn" />
                                )}
                            </div>

                            {/* Email Input */}
                            <div className="relative group">
                                <div className={`absolute left-4 top-4 w-5 h-5 transition-colors duration-300 ${errors['personalDetails.email'] ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'
                                    }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.personalDetails.email}
                                    onChange={(e) => updateFormData('personalDetails', 'email', e.target.value)}
                                    onBlur={() => handleBlur('personalDetails', 'email')}
                                    className={`peer block w-full rounded-xl border-2 bg-gray-50 px-4 pl-12 pt-6 pb-2 text-gray-900 font-medium placeholder-transparent focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 ${errors['personalDetails.email'] ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                        } ${!errors['personalDetails.email'] && formData.personalDetails.email && /\S+@\S+\.\S+/.test(formData.personalDetails.email) ? 'border-green-500/50' : ''}`}
                                    placeholder="Email Address"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-12 top-2 text-xs font-bold uppercase tracking-wider text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-purple-500"
                                >
                                    Email Address
                                </label>
                                {errors['personalDetails.email'] && (
                                    <div className="flex items-center gap-1 text-red-500 text-xs mt-2 animate-slideDown">
                                        <AlertCircle size={12} /> {errors['personalDetails.email']}
                                    </div>
                                )}
                                {!errors['personalDetails.email'] && formData.personalDetails.email && /\S+@\S+\.\S+/.test(formData.personalDetails.email) && (
                                    <Check className="absolute right-4 top-4 w-5 h-5 text-green-500 animate-scaleIn" />
                                )}
                            </div>

                            {/* Phone Input */}
                            <div className="relative group">
                                <div className={`absolute left-4 top-4 w-5 h-5 transition-colors duration-300 ${errors['personalDetails.phone'] ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'
                                    }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                </div>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.personalDetails.phone}
                                    onChange={(e) => updateFormData('personalDetails', 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    onBlur={() => handleBlur('personalDetails', 'phone')}
                                    className={`peer block w-full rounded-xl border-2 bg-gray-50 px-4 pl-12 pt-6 pb-2 text-gray-900 font-medium placeholder-transparent focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 ${errors['personalDetails.phone'] ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                        } ${!errors['personalDetails.phone'] && formData.personalDetails.phone.length === 10 ? 'border-green-500/50' : ''}`}
                                    placeholder="Phone Number"
                                />
                                <label
                                    htmlFor="phone"
                                    className="absolute left-12 top-2 text-xs font-bold uppercase tracking-wider text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-purple-500"
                                >
                                    Phone Number
                                </label>
                                {errors['personalDetails.phone'] && (
                                    <div className="flex items-center gap-1 text-red-500 text-xs mt-2 animate-slideDown">
                                        <AlertCircle size={12} /> {errors['personalDetails.phone']}
                                    </div>
                                )}
                                {!errors['personalDetails.phone'] && formData.personalDetails.phone.length === 10 && (
                                    <Check className="absolute right-4 top-4 w-5 h-5 text-green-500 animate-scaleIn" />
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8 max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Details</h2>
                            <p className="text-gray-500">Where should we create and ship your masterpiece?</p>
                        </div>

                        <div className="space-y-6">
                            {/* Street Address */}
                            <div className="relative group col-span-2">
                                <MapPin className={`absolute left-4 top-4 w-5 h-5 transition-colors duration-300 ${errors['addressDetails.street'] ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'
                                    }`} />
                                <input
                                    type="text"
                                    id="street"
                                    value={formData.addressDetails.street}
                                    onChange={(e) => updateFormData('addressDetails', 'street', e.target.value)}
                                    onBlur={() => handleBlur('addressDetails', 'street')}
                                    className={`peer block w-full rounded-xl border-2 bg-gray-50 px-4 pl-12 pt-6 pb-2 text-gray-900 font-medium placeholder-transparent focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 ${errors['addressDetails.street'] ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                        } ${!errors['addressDetails.street'] && formData.addressDetails.street.length > 5 ? 'border-green-500/50' : ''}`}
                                    placeholder="Street Address"
                                />
                                <label
                                    htmlFor="street"
                                    className="absolute left-12 top-2 text-xs font-bold uppercase tracking-wider text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-purple-500"
                                >
                                    Street Address
                                </label>
                                {errors['addressDetails.street'] && (
                                    <div className="flex items-center gap-1 text-red-500 text-xs mt-2 animate-slideDown">
                                        <AlertCircle size={12} /> {errors['addressDetails.street']}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* City */}
                                <div className="relative group">
                                    <div className={`absolute left-4 top-4 w-5 h-5 transition-colors duration-300 ${errors['addressDetails.city'] ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'
                                        }`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M17 21v-8.6a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V21" /><path d="M9 21v-6a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v6" /></svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="city"
                                        value={formData.addressDetails.city}
                                        onChange={(e) => updateFormData('addressDetails', 'city', e.target.value)}
                                        onBlur={() => handleBlur('addressDetails', 'city')}
                                        className={`peer block w-full rounded-xl border-2 bg-gray-50 px-4 pl-12 pt-6 pb-2 text-gray-900 font-medium placeholder-transparent focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 ${errors['addressDetails.city'] ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                            }`}
                                        placeholder="City"
                                    />
                                    <label
                                        htmlFor="city"
                                        className="absolute left-12 top-2 text-xs font-bold uppercase tracking-wider text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-purple-500"
                                    >
                                        City
                                    </label>
                                    {errors['addressDetails.city'] && (
                                        <div className="flex items-center gap-1 text-red-500 text-xs mt-2 animate-slideDown">
                                            <AlertCircle size={12} /> {errors['addressDetails.city']}
                                        </div>
                                    )}
                                </div>

                                {/* State */}
                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="state"
                                        value={formData.addressDetails.state}
                                        onChange={(e) => updateFormData('addressDetails', 'state', e.target.value)}
                                        onBlur={() => handleBlur('addressDetails', 'state')}
                                        className={`peer block w-full rounded-xl border-2 bg-gray-50 px-4 pt-6 pb-2 text-gray-900 font-medium placeholder-transparent focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 ${errors['addressDetails.state'] ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                            }`}
                                        placeholder="State"
                                    />
                                    <label
                                        htmlFor="state"
                                        className="absolute left-4 top-2 text-xs font-bold uppercase tracking-wider text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-purple-500"
                                    >
                                        State / Province
                                    </label>
                                    {errors['addressDetails.state'] && (
                                        <div className="flex items-center gap-1 text-red-500 text-xs mt-2 animate-slideDown">
                                            <AlertCircle size={12} /> {errors['addressDetails.state']}
                                        </div>
                                    )}
                                </div>

                                {/* ZIP Code */}
                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="zip"
                                        value={formData.addressDetails.zip}
                                        onChange={(e) => updateFormData('addressDetails', 'zip', e.target.value)}
                                        onBlur={() => handleBlur('addressDetails', 'zip')}
                                        className={`peer block w-full rounded-xl border-2 bg-gray-50 px-4 pt-6 pb-2 text-gray-900 font-medium placeholder-transparent focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 ${errors['addressDetails.zip'] ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                            }`}
                                        placeholder="ZIP Code"
                                    />
                                    <label
                                        htmlFor="zip"
                                        className="absolute left-4 top-2 text-xs font-bold uppercase tracking-wider text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-purple-500"
                                    >
                                        ZIP Code
                                    </label>
                                    {errors['addressDetails.zip'] && (
                                        <div className="flex items-center gap-1 text-red-500 text-xs mt-2 animate-slideDown">
                                            <AlertCircle size={12} /> {errors['addressDetails.zip']}
                                        </div>
                                    )}
                                </div>

                                {/* Country */}
                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="country"
                                        value="India"
                                        readOnly
                                        className="peer block w-full rounded-xl border-2 border-gray-200 bg-gray-100 px-4 pt-6 pb-2 text-gray-500 font-medium cursor-not-allowed"
                                    />
                                    <label
                                        htmlFor="country"
                                        className="absolute left-4 top-2 text-xs font-bold uppercase tracking-wider text-gray-500"
                                    >
                                        Country
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                if (selectedProduct.id === 'frames') {
                    const frameTypes = [
                        { id: 'led-wooden', name: 'LED Wooden Cutout', icon: '🪵' },
                        { id: 'rotating', name: 'Rotating Frame', icon: '🔄' },
                        { id: 'crystal', name: 'Crystal/Glass', icon: '💎' },
                        { id: 'acrylic', name: 'Acrylic Block', icon: '🧊' },
                    ];

                    const sizes = ['4x6', '5x7', '8x10', '11x14', 'custom'];
                    const shapes = ['rectangular', 'square', 'circular', 'heart-shaped', 'custom'];

                    return (
                        <div className="space-y-8 max-w-3xl mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Your Frame</h2>
                                <p className="text-gray-500">Choose the perfect frame styling for your memory.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    {/* Frame Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Frame Type <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {frameTypes.map(type => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => updateFormData('productCustomization', 'frameType', type.id)}
                                                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-2 ${formData.productCustomization.frameType === type.id
                                                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                        : 'border-gray-200 hover:border-purple-200 text-gray-600'
                                                        }`}
                                                >
                                                    <span className="text-2xl">{type.icon}</span>
                                                    {type.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Size & Shape Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-semibold text-gray-700">Size <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <select
                                                    value={formData.productCustomization.size}
                                                    onChange={(e) => updateFormData('productCustomization', 'size', e.target.value)}
                                                    className="appearance-none w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none bg-white font-medium text-gray-700"
                                                >
                                                    <option value="" disabled>Select</option>
                                                    {sizes.map(s => <option key={s} value={s}>{s === 'custom' ? 'Custom Size' : s}"</option>)}
                                                </select>
                                                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-semibold text-gray-700">Shape <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <select
                                                    value={formData.productCustomization.shape}
                                                    onChange={(e) => updateFormData('productCustomization', 'shape', e.target.value)}
                                                    className="appearance-none w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none bg-white font-medium text-gray-700"
                                                >
                                                    <option value="" disabled>Select</option>
                                                    {shapes.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                                </select>
                                                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Conditional Inputs */}
                                    <AnimatePresence>
                                        {formData.productCustomization.size === 'custom' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <label className="text-sm font-semibold text-gray-700">Dimensions (e.g. 20x30 cm)</label>
                                                <input
                                                    type="text"
                                                    value={formData.productCustomization.customSize}
                                                    onChange={(e) => updateFormData('productCustomization', 'customSize', e.target.value)}
                                                    className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
                                                    placeholder="Enter dimensions..."
                                                />
                                            </motion.div>
                                        )}
                                        {formData.productCustomization.shape === 'custom' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden mt-4"
                                            >
                                                <label className="text-sm font-semibold text-gray-700">Describe Shape</label>
                                                <input
                                                    type="text"
                                                    value={formData.productCustomization.customShape}
                                                    onChange={(e) => updateFormData('productCustomization', 'customShape', e.target.value)}
                                                    className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none"
                                                    placeholder="E.g. Star, Hexagon..."
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Orientation */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Orientation <span className="text-red-500">*</span></label>
                                        <div className="flex gap-4">
                                            {['portrait', 'landscape'].map(orient => (
                                                <label key={orient} className={`flex-1 relative cursor-pointer p-4 rounded-xl border-2 transition-all ${formData.productCustomization.orientation === orient
                                                    ? 'border-transparent bg-gradient-to-r from-purple-50 to-blue-50 ring-2 ring-purple-500'
                                                    : 'border-gray-200 hover:border-purple-200'
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name="orientation"
                                                        value={orient}
                                                        checked={formData.productCustomization.orientation === orient}
                                                        onChange={(e) => updateFormData('productCustomization', 'orientation', e.target.value)}
                                                        className="hidden"
                                                    />
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className={`w-8 h-12 border-2 border-gray-400 rounded-sm ${orient === 'landscape' ? 'rotate-90 h-8 w-12' : ''} ${formData.productCustomization.orientation === orient ? 'border-purple-500 bg-purple-200' : ''}`}></div>
                                                        <span className="text-sm font-medium text-gray-700 capitalize">{orient}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <ModernFileUpload
                                            label="Upload Photo for Frame"
                                            uploadedFile={formData.uploads.file}
                                            onFileUpload={updateFile}
                                            onRemove={() => setFormData(prev => ({ ...prev, uploads: { file: null, preview: null } }))}
                                            required={true}
                                            error={errors['uploads.file']}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Message on Frame <span className="text-gray-400 font-normal">(Optional)</span>
                                        </label>
                                        <textarea
                                            value={formData.productCustomization.message}
                                            onChange={(e) => updateFormData('productCustomization', 'message', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none h-32 resize-none"
                                            placeholder="Add a date, name, or short quote..."
                                            maxLength={200}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                if (selectedProduct.id === 'mugs') {
                    return (
                        <div className="space-y-8 max-w-3xl mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Your Mug</h2>
                                <p className="text-gray-500">Create the perfect brew companion.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    {/* Mug Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Mug Type <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['standard', 'magic'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => updateFormData('productCustomization', 'mugType', type)}
                                                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all group relative ${formData.productCustomization.mugType === type
                                                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                        : 'border-gray-200 hover:border-purple-200 text-gray-600'
                                                        }`}
                                                >
                                                    <span className="capitalize block text-base font-bold">{type} Mug</span>
                                                    <span className="text-xs font-normal opacity-70">
                                                        {type === 'standard' ? 'Classic ceramic' : 'Reveals Image when hot'}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Size */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Size <span className="text-red-500">*</span></label>
                                        <div className="flex bg-gray-100 p-1 rounded-xl">
                                            {['11oz', '15oz', '20oz'].map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => updateFormData('productCustomization', 'size', size)}
                                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.productCustomization.size === size
                                                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Handle Position */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Handle Position <span className="text-red-500">*</span></label>
                                        <div className="flex gap-4">
                                            {['left', 'right'].map(pos => (
                                                <label key={pos} className={`flex-1 relative cursor-pointer p-3 rounded-xl border-2 transition-all ${formData.productCustomization.handlePosition === pos
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 hover:border-purple-200'
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        value={pos}
                                                        checked={formData.productCustomization.handlePosition === pos}
                                                        onChange={() => updateFormData('productCustomization', 'handlePosition', pos)}
                                                        className="hidden"
                                                    />
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Coffee
                                                            size={32}
                                                            className={`text-gray-700 transition-transform ${pos === 'left' ? 'scale-x-[-1]' : ''}`}
                                                            strokeWidth={1.5}
                                                        />
                                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{pos} Hand</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Quantity <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-4 bg-gray-50 border-2 border-gray-100 rounded-xl p-2 w-max">
                                            <button
                                                onClick={() => updateFormData('productCustomization', 'quantity', Math.max(1, formData.productCustomization.quantity - 1))}
                                                className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-colors flex items-center justify-center"
                                            >
                                                -
                                            </button>
                                            <span className="text-xl font-bold w-12 text-center text-gray-800">{formData.productCustomization.quantity}</span>
                                            <button
                                                onClick={() => updateFormData('productCustomization', 'quantity', formData.productCustomization.quantity + 1)}
                                                className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 shadow-md shadow-purple-200 font-bold text-white hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <ModernFileUpload
                                            label="Upload Design/Photo"
                                            uploadedFile={formData.uploads.file}
                                            onFileUpload={updateFile}
                                            onRemove={() => setFormData(prev => ({ ...prev, uploads: { file: null, preview: null } }))}
                                            required={true}
                                            error={errors['uploads.file']}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Custom Message <span className="text-gray-400 font-normal">(Optional)</span>
                                        </label>
                                        <textarea
                                            value={formData.productCustomization.message}
                                            onChange={(e) => updateFormData('productCustomization', 'message', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none h-32 resize-none"
                                            placeholder="Add a name, date, or quote..."
                                            maxLength={200}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                if (selectedProduct.id === 'cards') {
                    return (
                        <div className="space-y-8 max-w-4xl mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Design Business Cards</h2>
                                <p className="text-gray-500">Professional details for your professional identity.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Configuration */}
                                <div className="space-y-6">
                                    {/* Card Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Card Type <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { id: 'standard', name: 'Standard Card', desc: 'Premium matte paper' },
                                                { id: 'nfc', name: 'NFC Smart Card', desc: 'Tap to share details (PVC)' },
                                                { id: 'pvc', name: 'PVC ID Card', desc: 'Durable plastic ID style' }
                                            ].map(type => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => updateFormData('productCustomization', 'cardType', type.id)}
                                                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 group ${formData.productCustomization.cardType === type.id
                                                        ? 'border-purple-500 bg-purple-50'
                                                        : 'border-gray-200 hover:border-purple-200'
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-lg ${formData.productCustomization.cardType === type.id ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        <CreditCard size={24} />
                                                    </div>
                                                    <div>
                                                        <span className={`block font-bold ${formData.productCustomization.cardType === type.id ? 'text-purple-900' : 'text-gray-700'}`}>{type.name}</span>
                                                        <span className="text-xs text-gray-500">{type.desc}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quantity (Step 50) */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Quantity <span className="text-red-500">*</span> <span className="text-xs text-gray-400 font-normal">(Min 50)</span>
                                        </label>
                                        <div className="flex items-center gap-4 bg-gray-50 border-2 border-gray-100 rounded-xl p-2 w-max">
                                            <button
                                                onClick={() => updateFormData('productCustomization', 'quantity', Math.max(50, formData.productCustomization.quantity - 50))}
                                                className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-colors flex items-center justify-center"
                                            >
                                                -
                                            </button>
                                            <span className="text-xl font-bold w-16 text-center text-gray-800">{formData.productCustomization.quantity}</span>
                                            <button
                                                onClick={() => updateFormData('productCustomization', 'quantity', formData.productCustomization.quantity + 50)}
                                                className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 shadow-md shadow-purple-200 font-bold text-white hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* QR Code Toggle */}
                                    <div className="space-y-2 pt-2">
                                        <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-purple-200 transition-colors cursor-pointer"
                                            onClick={() => updateFormData('productCustomization', 'includeQRCode', !formData.productCustomization.includeQRCode)}>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                    <QrCode size={20} />
                                                </div>
                                                <div>
                                                    <span className="block font-semibold text-gray-700">Include QR Code</span>
                                                    <span className="text-xs text-gray-500">Link to your website or contact</span>
                                                </div>
                                            </div>
                                            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${formData.productCustomization.includeQRCode ? 'bg-purple-500' : 'bg-gray-300'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${formData.productCustomization.includeQRCode ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Details & Upload */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <ModernFileUpload
                                            label="Upload Logo (Optional)"
                                            uploadedFile={formData.uploads.file}
                                            onFileUpload={updateFile}
                                            onRemove={() => setFormData(prev => ({ ...prev, uploads: { file: null, preview: null } }))}
                                            required={false}
                                            error={errors['uploads.file']}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        {/* Company Name */}
                                        <div className="relative group">
                                            <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.productCustomization.companyName}
                                                onChange={(e) => updateFormData('productCustomization', 'companyName', e.target.value)}
                                                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${errors['productCustomization.companyName'] ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-purple-500'}`}
                                                placeholder="Company Name"
                                            />
                                        </div>

                                        {/* Job Title */}
                                        <div className="relative group">
                                            <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.productCustomization.jobTitle}
                                                onChange={(e) => updateFormData('productCustomization', 'jobTitle', e.target.value)}
                                                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${errors['productCustomization.jobTitle'] ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-purple-500'}`}
                                                placeholder="Job Title"
                                            />
                                        </div>

                                        {/* Website */}
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.productCustomization.website}
                                                onChange={(e) => updateFormData('productCustomization', 'website', e.target.value)}
                                                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${errors['productCustomization.website'] ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-purple-500'}`}
                                                placeholder="Website URL (e.g. www.example.com)"
                                            />
                                            {errors['productCustomization.website'] && <p className="text-red-500 text-xs mt-1 ml-1">{errors['productCustomization.website']}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                if (selectedProduct.id === 'fans') {
                    return (
                        <div className="space-y-8 max-w-3xl mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure 3D Hologram</h2>
                                <p className="text-gray-500">Bring your brand to life with floating 3D visuals.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Fan Size <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {['42cm', '50cm', '65cm'].map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => updateFormData('productCustomization', 'fanSize', size)}
                                                    className={`p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${formData.productCustomization.fanSize === size
                                                        ? 'border-emerald-500 bg-emerald-50'
                                                        : 'border-gray-200 hover:border-emerald-200'
                                                        }`}
                                                >
                                                    <span className={`font-bold ${formData.productCustomization.fanSize === size ? 'text-emerald-700' : 'text-gray-700'}`}>{size} Diameter</span>
                                                    <Fan className={`w-5 h-5 ${formData.productCustomization.fanSize === size ? 'text-emerald-500' : 'text-gray-400'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Display Duration <span className="text-red-500">*</span></label>
                                        <div className="flex gap-2">
                                            {['15sec', '30sec', '60sec'].map(dur => (
                                                <button
                                                    key={dur}
                                                    onClick={() => updateFormData('productCustomization', 'displayDuration', dur)}
                                                    className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${formData.productCustomization.displayDuration === dur
                                                        ? 'border-emerald-500 bg-emerald-500 text-white'
                                                        : 'border-gray-200 text-gray-600 hover:border-emerald-200'
                                                        }`}
                                                >
                                                    {dur}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <ModernFileUpload
                                            label="Upload Video/GIF (Max 20MB)"
                                            uploadedFile={formData.uploads.file}
                                            onFileUpload={updateFile}
                                            onRemove={() => setFormData(prev => ({ ...prev, uploads: { file: null, preview: null } }))}
                                            required={true}
                                            error={errors['uploads.file']}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Custom Message</label>
                                        <textarea
                                            value={formData.productCustomization.message}
                                            onChange={(e) => updateFormData('productCustomization', 'message', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 outline-none h-32 resize-none"
                                            placeholder="Instructions for the 3D effect..."
                                            maxLength={200}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                if (selectedProduct.id === 'keychains') {
                    return (
                        <div className="space-y-8 max-w-3xl mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Keychain</h2>
                                <p className="text-gray-500">Carry your memories everywhere.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Shape <span className="text-red-500">*</span></label>
                                            <select
                                                value={formData.productCustomization.keychainShape}
                                                onChange={(e) => updateFormData('productCustomization', 'keychainShape', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-500 outline-none"
                                            >
                                                {['rectangular', 'circular', 'heart', 'custom'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Size <span className="text-red-500">*</span></label>
                                            <select
                                                value={formData.productCustomization.keychainSize}
                                                onChange={(e) => updateFormData('productCustomization', 'keychainSize', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-500 outline-none"
                                            >
                                                <option value="small">Small (2")</option>
                                                <option value="medium">Medium (3")</option>
                                                <option value="large">Large (4")</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Material <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: 'acrylic', name: 'Acrylic', bg: 'bg-blue-50' },
                                                { id: 'metal', name: 'Metal', bg: 'bg-gray-100' },
                                                { id: 'wood', name: 'Wood', bg: 'bg-orange-50' }
                                            ].map(mat => (
                                                <button
                                                    key={mat.id}
                                                    onClick={() => updateFormData('productCustomization', 'keychainMaterial', mat.id)}
                                                    className={`p-2 rounded-xl border-2 text-center transition-all ${formData.productCustomization.keychainMaterial === mat.id
                                                        ? 'border-yellow-500 ring-1 ring-yellow-500 ' + mat.bg
                                                        : 'border-gray-200 hover:border-yellow-200'
                                                        }`}
                                                >
                                                    <span className="text-sm font-semibold">{mat.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Quantity</label>
                                        <div className="flex items-center gap-4 bg-gray-50 border-2 border-gray-100 rounded-xl p-2 w-max">
                                            <button
                                                onClick={() => updateFormData('productCustomization', 'quantity', Math.max(1, formData.productCustomization.quantity - 1))}
                                                className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 hover:text-yellow-600 transition-colors flex items-center justify-center"
                                            >
                                                -
                                            </button>
                                            <span className="text-xl font-bold w-12 text-center text-gray-800">{formData.productCustomization.quantity}</span>
                                            <button
                                                onClick={() => updateFormData('productCustomization', 'quantity', formData.productCustomization.quantity + 1)}
                                                className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 shadow-md shadow-orange-200 font-bold text-white hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <ModernFileUpload
                                            label="Upload Image"
                                            uploadedFile={formData.uploads.file}
                                            onFileUpload={updateFile}
                                            onRemove={() => setFormData(prev => ({ ...prev, uploads: { file: null, preview: null } }))}
                                            required={true}
                                            error={errors['uploads.file']}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Message (Optional)</label>
                                        <textarea
                                            value={formData.productCustomization.message}
                                            onChange={(e) => updateFormData('productCustomization', 'message', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-500 outline-none h-32 resize-none"
                                            maxLength={200}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                if (selectedProduct.id === 'wall-hangings') {
                    return (
                        <div className="space-y-8 max-w-3xl mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Wall Decor Customization</h2>
                                <p className="text-gray-500">Transform your walls with personalized art.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Size <span className="text-red-500">*</span></label>
                                        <select
                                            value={formData.productCustomization.wallHangingSize}
                                            onChange={(e) => updateFormData('productCustomization', 'wallHangingSize', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-fuchsia-500 outline-none"
                                        >
                                            <option value="" disabled>Select Dimensions</option>
                                            {['12x18', '16x20', '20x30', '24x36', 'custom'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Material <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Canvas', 'Acrylic', 'Wood', 'Metal'].map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => updateFormData('productCustomization', 'wallHangingMaterial', m.toLowerCase())}
                                                    className={`p-3 rounded-xl border-2 font-medium transition-all ${formData.productCustomization.wallHangingMaterial === m.toLowerCase()
                                                        ? 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700'
                                                        : 'border-gray-200 hover:border-fuchsia-200'
                                                        }`}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Orientation <span className="text-red-500">*</span></label>
                                        <div className="flex gap-4">
                                            {['portrait', 'landscape'].map(orient => (
                                                <label key={orient} className={`flex-1 cursor-pointer p-4 rounded-xl border-2 transition-all ${formData.productCustomization.orientation === orient
                                                    ? 'border-fuchsia-500 bg-fuchsia-50'
                                                    : 'border-gray-200 hover:border-fuchsia-200'
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name="orientation-wall"
                                                        value={orient}
                                                        checked={formData.productCustomization.orientation === orient}
                                                        onChange={(e) => updateFormData('productCustomization', 'orientation', e.target.value)}
                                                        className="hidden"
                                                    />
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className={`border-2 border-gray-400 bg-white ${orient === 'landscape' ? 'w-10 h-6' : 'w-6 h-10'}`}></div>
                                                        <span className="capitalize font-medium text-sm">{orient}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <ModernFileUpload
                                            label="Upload Photo"
                                            uploadedFile={formData.uploads.file}
                                            onFileUpload={updateFile}
                                            onRemove={() => setFormData(prev => ({ ...prev, uploads: { file: null, preview: null } }))}
                                            required={true}
                                            error={errors['uploads.file']}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Custom Message</label>
                                        <textarea
                                            value={formData.productCustomization.message}
                                            onChange={(e) => updateFormData('productCustomization', 'message', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-fuchsia-500 outline-none h-32 resize-none"
                                            maxLength={200}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                const colors = [
                    { name: 'White', value: '#FFFFFF', class: 'bg-white border-gray-200' },
                    { name: 'Black', value: '#000000', class: 'bg-black border-black' },
                    { name: 'Red', value: '#EF4444', class: 'bg-red-500 border-red-500' },
                    { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500 border-blue-500' },
                    { name: 'Green', value: '#22C55E', class: 'bg-green-500 border-green-500' },
                    { name: 'Yellow', value: '#EAB308', class: 'bg-yellow-500 border-yellow-500' },
                    { name: 'Pink', value: '#EC4899', class: 'bg-pink-500 border-pink-500' },
                    { name: 'Gray', value: '#6B7280', class: 'bg-gray-500 border-gray-500' },
                ];

                return (
                    <div className="space-y-8 max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Your T-Shirt</h2>
                            <p className="text-gray-500">Make it truly yours with our customization options.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Size Selection */}
                                <div className="space-y-2 relative group">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Size <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.productCustomization.size}
                                            onChange={(e) => updateFormData('productCustomization', 'size', e.target.value)}
                                            className={`appearance-none w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-900 font-medium focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all cursor-pointer ${errors['productCustomization.size'] ? 'border-red-500' : 'border-gray-200'
                                                }`}
                                        >
                                            <option value="" disabled>Select Size</option>
                                            {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronRight className="rotate-90 w-5 h-5" />
                                        </div>
                                    </div>
                                    {errors['productCustomization.size'] && (
                                        <p className="text-red-500 text-xs flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors['productCustomization.size']}
                                        </p>
                                    )}
                                </div>

                                {/* Color Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Color <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => updateFormData('productCustomization', 'color', color.value)}
                                                className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${color.class} ${formData.productCustomization.color === color.value
                                                    ? 'ring-4 ring-purple-500 ring-offset-2 scale-110'
                                                    : 'hover:scale-110 hover:shadow-md'
                                                    }`}
                                                title={color.name}
                                                aria-label={`Select ${color.name} color`}
                                            >
                                                {formData.productCustomization.color === color.value && (
                                                    <Check size={16} className={color.name === 'White' || color.name === 'Yellow' ? 'text-black' : 'text-white'} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-4 bg-gray-50 border-2 border-gray-100 rounded-xl p-2 w-max">
                                        <button
                                            onClick={() => updateFormData('productCustomization', 'quantity', Math.max(1, formData.productCustomization.quantity - 1))}
                                            className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-colors flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span className="text-xl font-bold w-12 text-center text-gray-800">{formData.productCustomization.quantity}</span>
                                        <button
                                            onClick={() => updateFormData('productCustomization', 'quantity', formData.productCustomization.quantity + 1)}
                                            className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 shadow-md shadow-purple-200 font-bold text-white hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* File Upload */}
                                <div className="space-y-2">
                                    <ModernFileUpload
                                        label="Upload Design/Photo"
                                        uploadedFile={formData.uploads.file}
                                        onFileUpload={updateFile}
                                        onRemove={() => setFormData(prev => ({ ...prev, uploads: { file: null, preview: null } }))}
                                        required={true}
                                        error={errors['uploads.file']}
                                    />
                                </div>

                                {/* Custom Message */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Custom Message <span className="text-gray-400 font-normal">(Optional)</span>
                                        </label>
                                        <span className={`text-xs font-medium ${(formData.productCustomization.message?.length || 0) > 180 ? 'text-red-500' : 'text-gray-400'
                                            }`}>
                                            {formData.productCustomization.message?.length || 0}/200
                                        </span>
                                    </div>
                                    <textarea
                                        value={formData.productCustomization.message}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 200) {
                                                updateFormData('productCustomization', 'message', e.target.value);
                                            }
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all h-32 resize-none"
                                        placeholder="Add a name, quote, or special message..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="text-purple-600" /> Review Order
                        </h2>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-sm">
                            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedProduct?.name}</h3>
                                    <p className="text-gray-500">Customized Order</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-purple-600">Quantity: {formData.productCustomization.quantity}</p>
                                    <p className="text-xl font-bold text-gray-900 mt-1">
                                        ₹{(599 * formData.productCustomization.quantity).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500">Unit Price: ₹599</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Personal Details</h4>
                                        <button onClick={() => handleJumpToStep(1)} className="text-purple-600 text-xs hover:underline">Edit</button>
                                    </div>
                                    <div className="space-y-1 text-gray-600 bg-white p-4 rounded-xl border border-gray-100">
                                        <p><span className="font-semibold">Name:</span> {formData.personalDetails.fullName}</p>
                                        <p><span className="font-semibold">Email:</span> {formData.personalDetails.email}</p>
                                        <p><span className="font-semibold">Phone:</span> {formData.personalDetails.phone}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Shipping Address</h4>
                                        <button onClick={() => handleJumpToStep(2)} className="text-purple-600 text-xs hover:underline">Edit</button>
                                    </div>
                                    <div className="space-y-1 text-gray-600 bg-white p-4 rounded-xl border border-gray-100">
                                        <p>{formData.addressDetails.street}</p>
                                        <p>{formData.addressDetails.city}, {formData.addressDetails.state} {formData.addressDetails.zip}</p>
                                        <p>{formData.addressDetails.country}</p>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Customization</h4>
                                        <button onClick={() => handleJumpToStep(3)} className="text-purple-600 text-xs hover:underline">Edit</button>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4">
                                        {formData.uploads.preview && (
                                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                                <img src={formData.uploads.preview} alt="Upload" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-1 text-gray-600">
                                            <p><span className="font-semibold">Size:</span> {formData.productCustomization.size}</p>
                                            {formData.productCustomization.message && <p><span className="font-semibold">Message:</span> "{formData.productCustomization.message}"</p>}
                                            {formData.productCustomization.instructions && <p><span className="font-semibold">Instructions:</span> {formData.productCustomization.instructions}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-purple-50 text-purple-800 rounded-xl text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>Please double check your details. Custom products cannot be returned once printed. By clicking "Place Order", you agree to our terms and conditions.</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // Render Success View
    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center py-16 px-4 bg-white/80 backdrop-blur rounded-3xl shadow-xl mt-8"
            >
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Check size={48} strokeWidth={3} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    Thank you {formData.personalDetails.fullName}, for your order. We will start crafting your custom {selectedProduct?.name} right away.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onBack}
                        className="px-8 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Return Home
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-8 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                    >
                        Create Another
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full">
            {/* Progress Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        Step {currentStep} of {TOTAL_STEPS}
                    </h2>
                    <span className="text-sm font-bold text-purple-600">{Math.round((currentStep / TOTAL_STEPS) * 100)}% Completed</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
                {/* Dots Indicator */}
                <div className="flex justify-center gap-3 mt-4">
                    {[1, 2, 3, 4].map((step) => (
                        <button
                            key={step}
                            onClick={() => handleJumpToStep(step)}
                            className={`transition-all duration-300 rounded-full ${step === currentStep ? 'w-8 h-2.5 bg-purple-600'
                                : step < currentStep ? 'w-2.5 h-2.5 bg-green-500'
                                    : 'w-2.5 h-2.5 bg-gray-300'
                                }`}
                            aria-label={`Go to step ${step}`}
                        />
                    ))}
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/50">
                <div className="p-6 md:p-10 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer / Navigation */}
                <div className="bg-gray-50/50 border-t border-gray-100 p-6 md:p-8 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"
                    >
                        <ChevronLeft size={20} />
                        {currentStep === 1 ? 'Back to Products' : 'Back'}
                    </button>

                    <button
                        onClick={currentStep === TOTAL_STEPS ? handleSubmit : handleNext}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 ${currentStep === TOTAL_STEPS
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-200'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-purple-200'
                            }`}
                    >
                        {currentStep === TOTAL_STEPS ? (
                            <>{isEditing ? 'Update Cart' : 'Place Order'} <ShoppingBag size={20} /></>
                        ) : (
                            <>Next Step <ChevronRight size={20} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCustomizationForm;
