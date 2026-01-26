import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, Loader2 } from 'lucide-react';

const QuantitySelector = ({
    initialQuantity,
    onUpdate,
    min = 1,
    max = 99,
    debounceMs = 500
}) => {
    const [localQuantity, setLocalQuantity] = useState(initialQuantity);
    const [isUpdating, setIsUpdating] = useState(false);
    const debounceTimerRef = useRef(null);

    // Sync specific prop changes if needed, but mainly we trust local state until confirmed
    useEffect(() => {
        setLocalQuantity(initialQuantity);
    }, [initialQuantity]);

    const triggerUpdate = (newVal) => {
        setIsUpdating(true);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(async () => {
            try {
                await onUpdate(newVal);
            } finally {
                setIsUpdating(false);
            }
        }, debounceMs);
    };

    const handleDecrease = () => {
        if (localQuantity > min) {
            const newVal = localQuantity - 1;
            setLocalQuantity(newVal);
            triggerUpdate(newVal);
        }
    };

    const handleIncrease = () => {
        if (localQuantity < max) {
            const newVal = localQuantity + 1;
            setLocalQuantity(newVal);
            triggerUpdate(newVal);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        // Allow empty string for typing experience
        if (val === '') {
            setLocalQuantity('');
            return;
        }

        const numVal = parseInt(val, 10);
        if (!isNaN(numVal)) {
            setLocalQuantity(numVal);
            // Debounce update for typing
            if (numVal >= min && numVal <= max) {
                triggerUpdate(numVal);
            }
        }
    };

    const handleBlur = () => {
        // Validation on blur
        let finalVal = localQuantity;
        if (localQuantity === '' || localQuantity < min) {
            finalVal = min;
        } else if (localQuantity > max) {
            finalVal = max;
        }

        if (finalVal !== localQuantity) {
            setLocalQuantity(finalVal);
            triggerUpdate(finalVal);
        }
    };

    return (
        <div className="flex items-center bg-gray-100 rounded-full px-1 py-1 shadow-inner relative group">
            <button
                onClick={handleDecrease}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 shadow-sm hover:text-[#EA7704] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                disabled={localQuantity <= min || isUpdating}
                aria-label="Decrease quantity"
            >
                <Minus className="w-3 h-3" />
            </button>

            <div className="relative w-12 flex justify-center">
                {isUpdating ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-[#EA7704] animate-spin" />
                    </div>
                ) : (
                    <input
                        type="text"
                        value={localQuantity}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="w-full text-center bg-transparent font-bold text-gray-900 border-none focus:ring-0 p-0 text-sm"
                        aria-label="Quantity input"
                    />
                )}
            </div>

            <button
                onClick={handleIncrease}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 shadow-sm hover:text-[#EA7704] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                disabled={localQuantity >= max || isUpdating}
                aria-label="Increase quantity"
            >
                <Plus className="w-3 h-3" />
            </button>
        </div>
    );
};

export default QuantitySelector;
