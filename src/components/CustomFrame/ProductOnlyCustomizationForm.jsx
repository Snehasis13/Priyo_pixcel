import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    ChevronRight,
    ChevronLeft,
    Fan,
    Key,
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
    Briefcase
} from 'lucide-react';
import ModernFileUpload from '../common/ModernFileUpload';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductOnlyCustomizationForm = ({ selectedProduct, customizationCategory, onBack, onSubmit }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Determine the category to use for logic (fallback to id if not provided, for generic usage)
    const activeCategory = customizationCategory || selectedProduct?.id;

    // State Management
    const [formData, setFormData] = useState({
        productCustomization: {
            message: '', color: '#000000', size: 'M', instructions: '', quantity: 1,
            frameType: 'led-wooden', shape: 'rectangular', orientation: 'portrait', customSize: '', customShape: '',
            mugType: 'standard', handlePosition: 'right',
            cardType: 'standard', companyName: '', jobTitle: '', website: '', includeQRCode: false,
            fanSize: '42cm', displayDuration: '15sec',
            keychainShape: 'rectangular', keychainMaterial: 'acrylic', keychainSize: 'medium',
            wallHangingSize: '12x18', wallHangingMaterial: 'canvas',
        },
        uploads: { file: null, preview: null }
    });

    const [errors, setErrors] = useState({});

    // Set initial quantity based on product type
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            productCustomization: { ...prev.productCustomization, quantity: 1 }
        }));
    }, [activeCategory]);

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

    // Helper: Validate Form
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (activeCategory === 'tshirts') {
            if (!formData.productCustomization.size) newErrors['productCustomization.size'] = 'Size is required';
        }
        if (activeCategory === 'frames') {
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
        if (activeCategory === 'mugs') {
            if (!formData.productCustomization.mugType) newErrors['productCustomization.mugType'] = 'Mug Type is required';
            if (!formData.productCustomization.size) newErrors['productCustomization.size'] = 'Size is required';
            if (!formData.productCustomization.handlePosition) newErrors['productCustomization.handlePosition'] = 'Handle Position is required';
        }

        if (activeCategory === 'cards') {
            if (!formData.productCustomization.cardType) newErrors['productCustomization.cardType'] = 'Card Type is required';
            if (!formData.productCustomization.companyName) newErrors['productCustomization.companyName'] = 'Company Name is required';
            if (!formData.productCustomization.jobTitle) newErrors['productCustomization.jobTitle'] = 'Job Title is required';
            if (formData.productCustomization.website && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.productCustomization.website)) {
                newErrors['productCustomization.website'] = 'Invalid URL format';
            }
        }

        if (activeCategory === 'fans') {
            if (!formData.productCustomization.fanSize) newErrors['productCustomization.fanSize'] = 'Fan Size is required';
            if (!formData.productCustomization.displayDuration) newErrors['productCustomization.displayDuration'] = 'Duration is required';
        }
        if (activeCategory === 'keychains') {
            if (!formData.productCustomization.keychainShape) newErrors['productCustomization.keychainShape'] = 'Shape is required';
            if (!formData.productCustomization.keychainMaterial) newErrors['productCustomization.keychainMaterial'] = 'Material is required';
            if (!formData.productCustomization.keychainSize) newErrors['productCustomization.keychainSize'] = 'Size is required';
        }
        if (activeCategory === 'wall-hangings') {
            if (!formData.productCustomization.wallHangingSize) newErrors['productCustomization.wallHangingSize'] = 'Size is required';
            if (!formData.productCustomization.wallHangingMaterial) newErrors['productCustomization.wallHangingMaterial'] = 'Material is required';
            if (!formData.productCustomization.orientation) newErrors['productCustomization.orientation'] = 'Orientation is required';
        }

        const isLogoOptional = activeCategory === 'cards';
        if (!formData.uploads.file && !isLogoOptional) {
            newErrors['uploads.file'] = 'Please upload a design/photo';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        }

        return isValid;
    };

    const calculatePrice = (product, data) => {
        let base = product.price || 599; // Default fallback
        // Price logic could be category specific here, but using base for now
        return base;
    };

    const handleAddToCart = () => {
        if (validateForm()) {
            if (typeof onSubmit === 'function') {
                onSubmit(formData);
                return;
            }

            const finalProduct = {
                ...selectedProduct,
                price: calculatePrice(selectedProduct, formData),
                image: formData.uploads.preview || selectedProduct.image,
                customization: {
                    ...formData.productCustomization,
                    uploads: formData.uploads
                    // Store the customization category too if needed for later reference
                },
                customizationCategory: activeCategory, // Helpful for re-editing
                quantity: formData.productCustomization.quantity,
                isCustom: true
            };

            addToCart(finalProduct);
            navigate('/cart');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Render Logic
    const renderCustomizationFields = () => {
        if (activeCategory === 'frames') {
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
                                    {errors['productCustomization.size'] && <p className="text-red-500 text-xs mt-1">{errors['productCustomization.size']}</p>}
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
                                    {errors['productCustomization.shape'] && <p className="text-red-500 text-xs mt-1">{errors['productCustomization.shape']}</p>}
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
                                        {errors['productCustomization.customSize'] && <p className="text-red-500 text-xs mt-1">{errors['productCustomization.customSize']}</p>}
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
                                        {errors['productCustomization.customShape'] && <p className="text-red-500 text-xs mt-1">{errors['productCustomization.customShape']}</p>}
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
        if (activeCategory === 'mugs') {
            return (
                <div className="space-y-8 max-w-3xl mx-auto">
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
                            {renderQuantitySelector()}
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

        if (activeCategory === 'cards') {
            return (
                <div className="space-y-8 max-w-4xl mx-auto">
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

                            {/* Quantity (Bulk) */}
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

        if (activeCategory === 'fans') {
            return (
                <div className="space-y-8 max-w-3xl mx-auto">
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
                            {renderQuantitySelector()}
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

        if (activeCategory === 'keychains') {
            return (
                <div className="space-y-8 max-w-3xl mx-auto">
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

                            {renderQuantitySelector()}
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

        if (activeCategory === 'wall-hangings') {
            return (
                <div className="space-y-8 max-w-3xl mx-auto">
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
                            {renderQuantitySelector()}
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

        // T-Shirts (Default or specific)
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

                        {renderQuantitySelector()}
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
    };

    const renderQuantitySelector = () => (
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
    );

    return (
        <div className="w-full">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/50">
                <div className="p-6 md:p-10 min-h-[400px]">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize {selectedProduct.name}</h2>
                        <p className="text-gray-500">Design it your way.</p>
                    </div>
                    {renderCustomizationFields()}
                </div>

                {/* Footer */}
                <div className="bg-gray-50/50 border-t border-gray-100 p-6 md:p-8 flex justify-between items-center">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>

                    <button
                        onClick={handleAddToCart}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 bg-gradient-to-r from-purple-600 to-blue-600 shadow-purple-200"
                    >
                        Add to Cart <ShoppingBag size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductOnlyCustomizationForm;
