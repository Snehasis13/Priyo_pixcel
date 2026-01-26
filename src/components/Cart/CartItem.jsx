import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Heart, ShoppingBag } from 'lucide-react';
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
    processingItem,
    isWishlist = false
}) => {

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
                                        <button
                                            onClick={() => onRemove(item.id, item.name)}
                                            className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
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
                    <div className="flex gap-3">
                        {/* Mobile Actions Logic (Same as before) */}
                        {!isWishlist && (
                            <>
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
