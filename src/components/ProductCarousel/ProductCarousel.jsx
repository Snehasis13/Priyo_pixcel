import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Image from '../common/Image';

const ProductCarousel = ({ textConfig }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right

    const products = [
        {
            id: 1,
            name: "Rotating Floating Frame",
            price: 1499,
            image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1000&auto=format&fit=crop",
            tag: "Bestseller"
        },
        {
            id: 2,
            name: "LED Wooden Frame",
            price: 1999,
            image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=1000&auto=format&fit=crop",
            tag: "New Arrival"
        },
        {
            id: 3,
            name: "Premium Acrylic Block",
            price: 1299,
            image: "https://images.unsplash.com/photo-1544207943-2163b2849b3c?q=80&w=1000&auto=format&fit=crop",
            tag: "Trending"
        },
        {
            id: 4,
            name: "3D Crystal Cube",
            price: 2499,
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
            tag: "Premium"
        }
    ];

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.8
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300, // Inverse of enter
            opacity: 0,
            scale: 0.8
        })
    };

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % products.length);
    }, [products.length]);

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    useEffect(() => {
        if (!isHovered) {
            const timer = setInterval(() => {
                nextSlide();
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [isHovered, nextSlide]);

    // Position mapping
    const getPositionClass = (pos) => {
        switch (pos) {
            case 'top': return 'top-8 left-1/2 -translate-x-1/2';
            case 'bottom': return 'bottom-8 left-1/2 -translate-x-1/2';
            case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
            default: return 'bottom-8 left-1/2 -translate-x-1/2';
        }
    };

    return (
        <div
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-white group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-full h-full relative bg-gray-50 flex items-center justify-center overflow-hidden rounded-2xl">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute w-full h-full"
                    >
                        <Image
                            src={products[currentIndex].image}
                            alt={products[currentIndex].name}
                            className="w-full h-full object-cover"
                        />

                        {/* Text Overlay */}
                        {textConfig && textConfig.content && (
                            <div
                                className={`absolute z-20 w-3/4 text-center break-words pointer-events-none ${getPositionClass(textConfig.position)}`}
                                style={{
                                    fontFamily: textConfig.font,
                                    fontSize: `${textConfig.size}px`,
                                    color: textConfig.color,
                                    textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
                                }}
                            >
                                {textConfig.content}
                            </div>
                        )}

                        {/* Overlay Effect */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                        {/* Quick View Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                            <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                                <Eye className="w-5 h-5 text-[#EA7704]" />
                                Quick View
                            </div>
                        </div>

                    </motion.div>
                </AnimatePresence>

                {/* Tags */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#EA7704] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
                        {products[currentIndex].tag}
                    </span>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 shadow-md transform -translate-x-10 group-hover:translate-x-0 transition-transform duration-300 z-20 focus:outline-none"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 shadow-md transform translate-x-10 group-hover:translate-x-0 transition-transform duration-300 z-20 focus:outline-none"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Product Info Bar */}
            <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-md p-4 border-t border-gray-100 z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                            {products[currentIndex].name}
                        </h3>
                        <p className="text-gray-500 text-xs mt-1">Free Shipping • High-Quality Material</p>
                    </div>
                    <div className="text-right">
                        <span className="block text-[#EA7704] font-extrabold text-xl">
                            ₹{products[currentIndex].price}
                        </span>
                    </div>
                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-3">
                    {products.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > currentIndex ? 1 : -1);
                                setCurrentIndex(idx);
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-[#EA7704] w-6' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCarousel;
