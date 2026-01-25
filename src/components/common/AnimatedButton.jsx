import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const AnimatedButton = ({
    children,
    onClick,
    disabled = false,
    loading = false,
    className = '',
    variant = 'primary', // primary, secondary, danger, ghost
    type = 'button'
}) => {

    // Base styles
    const baseStyles = "relative flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 overflow-hidden";

    const variants = {
        primary: "bg-[#EA7704] text-white hover:bg-[#d66b03] focus:ring-orange-500 shadow-lg hover:shadow-orange-500/30",
        secondary: "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
        danger: "bg-white text-red-500 border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-gray-800 focus:ring-red-500",
        ghost: "bg-transparent text-gray-500 hover:text-[#EA7704] hover:bg-orange-50 dark:hover:bg-gray-800"
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            whileHover={!disabled && !loading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
            initial={false}
        >
            {/* Ripple/Highlight effect container could go here */}

            <motion.div
                className="flex items-center justify-center gap-2 w-full"
                animate={loading ? { opacity: 0.8 } : { opacity: 1 }}
            >
                {loading && <LoadingSpinner size="sm" color="currentColor" />}
                {children}
            </motion.div>
        </motion.button>
    );
};

export default AnimatedButton;
