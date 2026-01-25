import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PriceTicker = ({ price, currency = '₹', className = '' }) => {
    const [displayPrice, setDisplayPrice] = useState(price);
    const [direction, setDirection] = useState(0); // 1 = up (orange), -1 = down (green)
    const prevPrice = useRef(price);

    useEffect(() => {
        if (price !== prevPrice.current) {
            if (price > prevPrice.current) {
                setDirection(1);
            } else {
                setDirection(-1);
            }
            setDisplayPrice(price);
            prevPrice.current = price;

            // Reset color after animation
            const timer = setTimeout(() => setDirection(0), 1000);
            return () => clearTimeout(timer);
        }
    }, [price]);

    const colorClass = direction === 1
        ? "text-orange-600 dark:text-orange-400"
        : direction === -1
            ? "text-green-600 dark:text-green-400"
            : "";

    return (
        <div className={`flex items-baseline overflow-hidden ${className}`}>
            <span className="mr-0.5">{currency}</span>
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={displayPrice}
                    initial={{ y: direction * 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: direction * -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`font-bold inline-block ${colorClass} transition-colors duration-500`}
                >
                    {displayPrice.toLocaleString()}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};

export default PriceTicker;
