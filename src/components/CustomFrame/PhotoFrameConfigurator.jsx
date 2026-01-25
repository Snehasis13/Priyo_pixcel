import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, Check, ChevronRight, ChevronUp, Star, Lightbulb, Box, Hexagon, Circle, Heart, Square, Type, Palette, AlignLeft, AlignCenter, AlignRight, X, Clock, Shield } from 'lucide-react';
import Image from '../common/Image';
import AnimatedButton from '../common/AnimatedButton';
import Reveal from '../Reveal/Reveal';
import ProductCarousel from '../ProductCarousel/ProductCarousel';
import ImageUpload from './ImageUpload';
import CollapsibleSection from '../common/CollapsibleSection';

const PhotoFrameConfigurator = () => {
    // State
    const [selectedSize, setSelectedSize] = useState('8x10');
    const [selectedColor, setSelectedColor] = useState('Black');
    const [selectedMaterial, setSelectedMaterial] = useState('Wood');
    const [selectedShape, setSelectedShape] = useState('Rectangle');
    const [withLed, setWithLed] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showCareInfo, setShowCareInfo] = useState(false);
    const [showMobileDetails, setShowMobileDetails] = useState(false);

    // Text State
    const [textContent, setTextContent] = useState('');
    const [textFont, setTextFont] = useState('Inter, sans-serif');
    const [textSize, setTextSize] = useState(24);
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [textPosition, setTextPosition] = useState('bottom');

    // Data Config
    const sizes = [
        { id: '4x6', label: '4" x 6"', price: 499 },
        { id: '5x7', label: '5" x 7"', price: 699 },
        { id: '6x8', label: '6" x 8"', price: 799 },
        { id: '8x10', label: '8" x 10"', price: 999 },
        { id: '11x14', label: '11" x 14"', price: 1599 },
        { id: '12x18', label: '12" x 18"', price: 1999 },
        { id: 'A4', label: 'A4 Standard', price: 1299 },
    ];

    const materials = [
        { id: 'Wood', label: 'Premium Wood', priceMod: 0, desc: 'Classic & Durable' },
        { id: 'Acrylic', label: 'Clear Acrylic', priceMod: 200, desc: 'Modern Glass-like' },
        { id: 'Metal', label: 'Sleek Metal', priceMod: 300, desc: 'Industrial Chic' },
        { id: 'Crystal', label: 'Crystal Glass', priceMod: 500, desc: 'Luxury Finish' },
    ];

    const shapes = [
        { id: 'Rectangle', label: 'Rectangle', icon: Box },
        { id: 'Square', label: 'Square', icon: Square },
        { id: 'Circle', label: 'Circle', icon: Circle },
        { id: 'Polygon', label: 'Polygon', icon: Hexagon },
        { id: 'Heart', label: 'Heart', icon: Heart },
    ];

    const colors = [
        { id: 'Black', hex: '#000000', label: 'Classic Black' },
        { id: 'White', hex: '#FFFFFF', label: 'Modern White', border: true },
        { id: 'Wood', hex: '#8B4513', label: 'Natural Wood' },
        { id: 'Gold', hex: '#FFD700', label: 'Premium Gold' },
        { id: 'Silver', hex: '#C0C0C0', label: 'Sleek Silver' },
        { id: 'RoseGold', hex: '#B76E79', label: 'Rose Gold' },
    ];

    // Text Configs
    const fonts = [
        { id: 'Inter, sans-serif', label: 'Modern Sans' },
        { id: 'Playfair Display, serif', label: 'Elegant Serif' },
        { id: 'Caveat, cursive', label: 'Handwritten' },
        { id: 'Courier Prime, monospace', label: 'Typewriter' },
    ];

    const textColors = [
        { id: 'White', hex: '#FFFFFF' },
        { id: 'Black', hex: '#000000' },
        { id: 'Gold', hex: '#FFD700' },
        { id: 'Silver', hex: '#C0C0C0' },
    ];

    // Pricing Logic
    const basePrice = sizes.find(s => s.id === selectedSize)?.price || 0;
    const materialPrice = materials.find(m => m.id === selectedMaterial)?.priceMod || 0;
    const ledPrice = withLed ? 250 : 0;
    const totalPrice = basePrice + materialPrice + ledPrice;

    return (
        <div className="bg-gray-50 pb-32 md:pb-20 scroll-smooth">
            {/* Warning Banner */}
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 md:mb-8 mx-auto max-w-7xl shadow-sm rounded-r-lg" role="alert">
                <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <p className="font-medium text-sm md:text-base">
                        Customized products cannot be returned. Please verify all details below.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <Reveal>
                    <div className="mb-8 md:mb-12">
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
                            Customize Your <span className="text-[#EA7704]">Memory</span>
                        </h1>
                        <p className="text-gray-600 max-w-2xl text-sm md:text-lg">
                            Create a personalized photo frame. Choose your size, frame style, and upload your photo.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Left Column: Image Preview / Carousel */}
                    <div className="lg:col-span-7">
                        <div className="sticky top-24 space-y-6">
                            {/* Product Carousel with Text Overlay */}
                            <ProductCarousel
                                textConfig={{
                                    content: textContent,
                                    font: textFont,
                                    size: textSize,
                                    color: textColor,
                                    position: textPosition
                                }}
                            />

                            {/* Features */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-4">
                                {[
                                    { text: "Premium Finish", icon: Star },
                                    { text: "HD Glass", icon: Star },
                                    { text: "Easy Mounting", icon: Star },
                                    { text: "Safe Packaging", icon: Star }
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-gray-600 bg-white p-2 md:p-3 rounded-lg shadow-sm border border-gray-100">
                                        <feature.icon className="w-3 h-3 md:w-4 md:h-4 text-[#EA7704]" />
                                        <span className="font-medium">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Customization Form */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-xl border border-gray-100">

                            {/* 1. Size Selection */}
                            <CollapsibleSection title="Select Size" stepNumber="1" defaultOpen={true}>
                                <div className="relative pt-2">
                                    <select
                                        value={selectedSize}
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                        className="w-full appearance-none bg-white border border-gray-300 text-gray-900 text-base md:text-lg rounded-xl focus:ring-[#EA7704] focus:border-[#EA7704] block w-full p-3 md:p-4 pr-8 font-semibold shadow-sm transition-all"
                                    >
                                        {sizes.map((size) => (
                                            <option key={size.id} value={size.id}>
                                                {size.label} - ₹{size.price}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 pt-2">
                                        <ChevronRight className="w-5 h-5 rotate-90" />
                                    </div>
                                </div>
                            </CollapsibleSection>

                            {/* 2. Material Selection */}
                            <CollapsibleSection title="Material" stepNumber="2" defaultOpen={false}>
                                <div className="pt-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                                            <Info className="w-3 h-3" /> Material Options
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {materials.map((material) => (
                                            <button
                                                key={material.id}
                                                onClick={() => setSelectedMaterial(material.id)}
                                                className={`p-3 rounded-xl border-2 text-left transition-all ${selectedMaterial === material.id
                                                    ? 'border-[#EA7704] bg-orange-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`font-bold text-sm md:text-base ${selectedMaterial === material.id ? 'text-[#EA7704]' : 'text-gray-900'}`}>{material.label}</span>
                                                    {material.priceMod > 0 && <span className="text-[10px] md:text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">+₹{material.priceMod}</span>}
                                                </div>
                                                <p className="text-[10px] md:text-xs text-gray-500">{material.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CollapsibleSection>

                            {/* 3. Shape Selection */}
                            <CollapsibleSection title="Shape" stepNumber="3" defaultOpen={false}>
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide pt-2">
                                    {shapes.map((shape) => (
                                        <button
                                            key={shape.id}
                                            onClick={() => setSelectedShape(shape.id)}
                                            className={`flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 flex-shrink-0 transition-all ${selectedShape === shape.id
                                                ? 'border-[#EA7704] bg-orange-50 text-[#EA7704]'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-500'
                                                }`}
                                        >
                                            <shape.icon className="w-6 h-6 md:w-8 md:h-8 mb-1" strokeWidth={1.5} />
                                            <span className="text-[10px] md:text-xs font-medium">{shape.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </CollapsibleSection>

                            {/* 4. Frame Color */}
                            <CollapsibleSection title="Frame Color" stepNumber="4" defaultOpen={false}>
                                <div className="pt-2">
                                    <div className="flex flex-wrap gap-3 md:gap-4">
                                        {colors.map((color) => (
                                            <button
                                                key={color.id}
                                                disabled={selectedMaterial === 'Crystal'}
                                                onClick={() => setSelectedColor(color.id)}
                                                className={`group relative p-1 rounded-full border-2 transition-all ${selectedColor === color.id && selectedMaterial !== 'Crystal' ? 'border-[#EA7704]' : 'border-transparent'
                                                    } ${selectedMaterial === 'Crystal' ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                                title={color.label}
                                            >
                                                <div
                                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full shadow-sm ${color.border ? 'border border-gray-200' : ''}`}
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                                {selectedColor === color.id && selectedMaterial !== 'Crystal' && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Check className={`w-4 h-4 ${['White', 'Gold', 'Silver', 'RoseGold'].includes(color.id) ? 'text-black' : 'text-white'}`} />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedMaterial === 'Crystal' && (
                                        <p className="text-xs text-gray-400 mt-2">Colors not available for Crystal material</p>
                                    )}
                                </div>
                            </CollapsibleSection>

                            {/* 5. LED Options */}
                            <CollapsibleSection title="Add LED Lighting?" stepNumber="5" defaultOpen={false}>
                                <div className="pt-2">
                                    <div className="mb-3 text-xs text-gray-500 flex items-center gap-1">
                                        <Info className="w-3 h-3" /> Warm white LED backlight powered by USB.
                                    </div>
                                    <div className="flex gap-4">
                                        <label className={`flex-1 flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${!withLed ? 'border-[#EA7704] bg-white' : 'border-transparent hover:bg-white'}`}>
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="led"
                                                    checked={!withLed}
                                                    onChange={() => setWithLed(false)}
                                                    className="w-4 h-4 text-[#EA7704] focus:ring-[#EA7704]"
                                                />
                                                <span className="ml-2 font-medium text-gray-700 text-sm md:text-base">No LED</span>
                                            </div>
                                        </label>
                                        <label className={`flex-1 flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${withLed ? 'border-[#EA7704] bg-white' : 'border-transparent hover:bg-white'}`}>
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="led"
                                                    checked={withLed}
                                                    onChange={() => setWithLed(true)}
                                                    className="w-4 h-4 text-[#EA7704] focus:ring-[#EA7704]"
                                                />
                                                <span className="ml-2 font-medium text-gray-700 text-sm md:text-base">Yes</span>
                                            </div>
                                            <span className="text-[10px] md:text-xs bg-[#EA7704] text-white px-1.5 py-0.5 rounded font-bold">+₹250</span>
                                        </label>
                                    </div>
                                </div>
                            </CollapsibleSection>

                            {/* 6. Photo Upload */}
                            <CollapsibleSection title="Upload Photo" stepNumber="6" defaultOpen={true}>
                                <div className="pt-2">
                                    <ImageUpload onFilesChange={(files) => setUploadedFiles(files)} />
                                </div>
                            </CollapsibleSection>

                            {/* 7. Custom Text */}
                            <CollapsibleSection title="Add Custom Message" stepNumber="7" defaultOpen={false}>
                                <div className="space-y-4 pt-2">
                                    <div className="relative">
                                        <textarea
                                            value={textContent}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 50) setTextContent(e.target.value);
                                            }}
                                            placeholder="Enter your message here (e.g. Happy Birthday)"
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#EA7704] focus:border-transparent outline-none transition-all resize-none text-base"
                                        />
                                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                            {textContent.length}/50
                                        </div>
                                    </div>

                                    {textContent.length > 0 && (
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            {/* Simplified Controls for Mobile */}
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Size</label>
                                                    <input
                                                        type="range"
                                                        min="12"
                                                        max="60"
                                                        value={textSize}
                                                        onChange={(e) => setTextSize(parseInt(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 rounded-lg accent-[#EA7704]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Color</label>
                                                    <div className="flex gap-2">
                                                        {textColors.map((color) => (
                                                            <button
                                                                key={color.id}
                                                                onClick={() => setTextColor(color.hex)}
                                                                className={`w-6 h-6 rounded-full border ${textColor === color.hex ? 'border-[#EA7704] ring-1 ring-[#EA7704]' : 'border-gray-300'}`}
                                                                style={{ backgroundColor: color.hex }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CollapsibleSection>

                            {/* Desktop Footer (Hidden on Mobile) */}
                            <div className="hidden lg:block border-t border-gray-100 pt-6 space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="text-gray-600 font-medium block">Total Price:</span>
                                        <p className="text-xs text-gray-400">Includes {selectedMaterial} finish {withLed ? '+ LED' : ''}</p>
                                    </div>
                                    <span className="text-3xl font-extrabold text-gray-900">₹{totalPrice}</span>
                                </div>

                                <AnimatedButton
                                    onClick={() => setShowConfirmation(true)}
                                    variant="primary"
                                    className="w-full py-4 text-lg font-bold rounded-xl shadow-lg shadow-orange-500/30"
                                >
                                    Proceed to Buy
                                </AnimatedButton>

                                <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>Est. Delivery: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => setShowCareInfo(true)}
                                        className="flex items-center gap-1 hover:text-[#EA7704] transition-colors underline"
                                    >
                                        <Shield className="w-3 h-3" />
                                        Care Instructions
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 pb-safe">
                <div className="flex gap-3 max-w-7xl mx-auto">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Total Price</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">₹{totalPrice}</span>
                            <button
                                onClick={() => setShowMobileDetails(!showMobileDetails)}
                                className="text-xs text-[#EA7704] font-medium flex items-center"
                            >
                                Details <ChevronUp className={`w-3 h-3 transition-transform ${showMobileDetails ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>
                    <AnimatedButton
                        onClick={() => setShowConfirmation(true)}
                        variant="primary"
                        className="flex-1 py-3 px-6 text-base font-bold rounded-xl shadow-lg shadow-orange-500/30"
                    >
                        Proceed
                    </AnimatedButton>
                </div>

                {/* Mobile Bottom Sheet (Details) */}
                <AnimatePresence>
                    {showMobileDetails && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-gray-50 overflow-hidden border-t border-dashed border-gray-200"
                        >
                            <div className="p-4 space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Base Size ({sizes.find(s => s.id === selectedSize)?.label})</span>
                                    <span>₹{basePrice}</span>
                                </div>
                                {materialPrice > 0 && (
                                    <div className="flex justify-between">
                                        <span>Material ({selectedMaterial})</span>
                                        <span>+₹{materialPrice}</span>
                                    </div>
                                )}
                                {withLed && (
                                    <div className="flex justify-between">
                                        <span>LED Light</span>
                                        <span>+₹{ledPrice}</span>
                                    </div>
                                )}
                                <div className="text-xs text-gray-400 pt-2 border-t border-gray-200 mt-2">
                                    Est. Delivery: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowConfirmation(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-lg z-10 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0">
                                <h3 className="text-xl font-bold text-gray-900">Confirm Order Details</h3>
                                <button onClick={() => setShowConfirmation(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex gap-4">
                                    {uploadedFiles.length > 0 ? (
                                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                            <img src={uploadedFiles[0].preview} alt="Chosen" className="w-full h-full object-cover" loading="lazy" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 text-center p-1">
                                            No Image Uploaded
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-1 text-sm">
                                        <p><span className="font-semibold text-gray-500 w-20 inline-block">Size:</span> {sizes.find(s => s.id === selectedSize)?.label}</p>
                                        <p><span className="font-semibold text-gray-500 w-20 inline-block">Material:</span> {selectedMaterial}</p>
                                        <p><span className="font-semibold text-gray-500 w-20 inline-block">Color:</span> {selectedColor}</p>
                                        <p><span className="font-semibold text-gray-500 w-20 inline-block">LED:</span> {withLed ? 'Yes' : 'No'}</p>
                                    </div>
                                </div>

                                {textContent && (
                                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                                        <p className="text-xs font-bold text-[#EA7704] uppercase mb-1">Custom Message:</p>
                                        <p className="text-gray-800 italic">"{textContent}"</p>
                                    </div>
                                )}

                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-sm text-yellow-800 flex gap-3">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    <p>I confirm that the spelling, dates, and photo quality are correct. I understand that custom products cannot be returned.</p>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 grid grid-cols-2 gap-4 sticky bottom-0 bg-white">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Edit Details
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Added to Cart!');
                                        setShowConfirmation(false);
                                    }}
                                    className="px-4 py-3 rounded-xl bg-[#EA7704] text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                                >
                                    Confirm & Add
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Care Info Modal */}
            <AnimatePresence>
                {showCareInfo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowCareInfo(false)}
                        />
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-md z-10 overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900">Care Instructions</h3>
                                <button onClick={() => setShowCareInfo(false)}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <div className="p-6 text-sm text-gray-600 space-y-3">
                                <p>• Clean with a soft, dry lint-free cloth.</p>
                                <p>• Avoid using harsh chemicals or abrasive cleaners.</p>
                                <p>• Keep away from direct sunlight to prevent fading.</p>
                                <p>• Handle with care to avoid scratches on the {selectedMaterial === 'Acrylic' ? 'acrylic' : 'surface'}.</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PhotoFrameConfigurator;
