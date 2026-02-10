import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Heart, ShoppingBag, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import QuantitySelector from '../QuantitySelector/QuantitySelector';
import Image from '../common/Image';
import AnimatedButton from '../common/AnimatedButton';
import PriceTicker from '../common/PriceTicker';
import LoadingSpinner from '../common/LoadingSpinner';

const CartItem = ({
    item,
    onUpdateQuantity,
    onRemove,
    onSaveForLater,
    onMoveToCart,
    onCustomize,
    processingItem,
    isWishlist = false
}) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Animation variants
    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, x: -50, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }
    };

    return (
        <motion.div
            layout
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="group bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 hover:shadow-lg transition-shadow"
        >
            <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center">

                {/* Product Section (Col Span 6) */}
                <div className="md:col-span-6 flex gap-4 sm:gap-6">
                    {/* Image */}
                    <div className="w-24 h-24 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                        <Image
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between md:justify-center">
                        <div>
                            <div className="flex justify-between md:block items-start">
                                <h3 className="font-bold text-gray-900 mb-1 truncate text-lg pr-4">
                                    {item.name}
                                </h3>
                                {/* Mobile Only Price Ticker */}
                                <div className="md:hidden">
                                    <PriceTicker price={item.price * item.quantity} className="text-lg font-bold text-[#EA7704]" />
                                </div>
                            </div>
                            {item.variant && (
                                <p className="text-sm text-gray-500 mt-1">{item.variant}</p>
                            )}

                            {/* Validation Error Display */}
                            {item.isValid === false && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-sm text-red-600">
                                    <span className="font-bold">⚠️ Issue:</span> {item.validationError || "Invalid item"}
                                </div>
                            )}

                            {/* Display Customization Summary if exists */}
                            {/* Display Customization Summary if exists */}
                            {item.customization && (
                                <div className="mt-2">
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
                                                <div className="text-xs text-purple-600 space-y-1 bg-purple-50 p-2 rounded-lg">
                                                    {Object.entries(item.customization).map(([key, value]) => {
                                                        if (key === 'uploads') return null; // Skip uploads object
                                                        if (!value) return null; // Skip empty values
                                                        return (
                                                            <div key={key} className="flex gap-1">
                                                                <span className="font-semibold capitalize text-purple-800">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                                <span className="text-purple-900 truncate">
                                                                    {key === 'color' ? (
                                                                        <span className="inline-block w-4 h-4 rounded-full border border-gray-200 align-middle ml-1" style={{ backgroundColor: value }} title={value}></span>
                                                                    ) : (
                                                                        value.toString()
                                                                    )}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Mobile Only Unit Price */}
                            <p className="text-xs text-gray-400 mt-1 md:hidden">
                                Unit Price: ₹{item.price}
                            </p>

                            {/* Actions (Desktop: Below details, Mobile: Bottom row) */}
                            <div className="hidden md:flex gap-3 mt-3">
                                {isWishlist ? (
                                    <>
                                        <AnimatedButton
                                            variant="ghost"
                                            onClick={() => onMoveToCart(item.id)}
                                            loading={processingItem === item.id}
                                            className="text-xs px-2 py-1 h-8"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Move
                                        </AnimatedButton>
                                        <AnimatedButton
                                            variant="ghost"
                                            onClick={() => onRemove(item.id, item.name)}
                                            loading={processingItem === item.id}
                                            className="text-xs px-2 py-1 text-red-500 h-8"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </AnimatedButton>
                                    </>
                                ) : (
                                    <>
                                        {/* Customize Button */}
                                        <button
                                            onClick={() => onCustomize(item)}
                                            className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 transition-colors bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg"
                                        >
                                            <Edit className="w-3 h-3" /> Customize
                                        </button>

                                        <button
                                            onClick={() => onRemove(item.id, item.name)}
                                            className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors ml-2"
                                        >
                                            <Trash2 className="w-3 h-3" /> Remove
                                        </button>
                                        <button
                                            onClick={() => onSaveForLater(item.id)}
                                            className="text-xs text-gray-500 hover:text-[#EA7704] font-medium flex items-center gap-1 transition-colors ml-4"
                                        >
                                            <Heart className="w-3 h-3" /> Save
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quantity Section (Col Span 3) - Centered */}
                <div className="hidden md:flex md:col-span-3 justify-center">
                    {!isWishlist && (
                        <QuantitySelector
                            initialQuantity={item.quantity}
                            onUpdate={(val) => onUpdateQuantity(item.id, val)}
                        />
                    )}
                </div>

                {/* Total Section (Col Span 3) - Right Aligned */}
                <div className="hidden md:flex md:col-span-3 flex-col items-end text-right">
                    <PriceTicker price={item.price * item.quantity} className="text-lg font-bold text-[#EA7704]" />
                    <p className="text-xs text-gray-400 mt-1">₹{item.price} / item</p>
                </div>

                {/* Mobile Bottom Row (Qty + Actions) */}
                <div className="flex md:hidden flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 w-full">
                    {!isWishlist && (
                        <QuantitySelector
                            initialQuantity={item.quantity}
                            onUpdate={(val) => onUpdateQuantity(item.id, val)}
                        />
                    )}
                    <div className="flex gap-2">
                        {/* Mobile Actions Logic */}
                        {!isWishlist && (
                            <>
                                <AnimatedButton variant="secondary" onClick={() => onCustomize(item)} className="text-xs px-3 py-2 flex-1 text-purple-600 bg-purple-50 border-purple-100"><Edit className="w-4 h-4" /> Edit</AnimatedButton>
                                <AnimatedButton variant="danger" onClick={() => onRemove(item.id, item.name)} className="text-xs px-3 py-2 flex-1"><Trash2 className="w-4 h-4" /> Remove</AnimatedButton>
                                <AnimatedButton variant="ghost" onClick={() => onSaveForLater(item.id)} className="text-xs px-3 py-2 flex-1"><Heart className="w-4 h-4" /> Save</AnimatedButton>
                            </>
                        )}
                        {isWishlist && (
                            <>
                                <AnimatedButton variant="primary" onClick={() => onMoveToCart(item.id)} className="text-xs px-3 py-2 flex-1"><ShoppingBag className="w-4 h-4" /> Move</AnimatedButton>
                                <AnimatedButton variant="danger" onClick={() => onRemove(item.id, item.name)} className="text-xs px-3 py-2 flex-1"><Trash2 className="w-4 h-4" /></AnimatedButton>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;
