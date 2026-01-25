import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const CollapsibleSection = ({ title, children, defaultOpen = true, stepNumber, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // On desktop, force open (or ignore collapse logic effectively)
    const shouldBeOpen = !isMobile ? true : isOpen;

    return (
        <div className="mb-8 border-b border-gray-100 pb-6 md:border-none md:pb-0 last:border-none">
            <button
                onClick={() => setIsMobile(prev => setIsMobile(prev))} // Force re-render/logic check if needed, but mainly we toggle isOpen
                // Actually, on desktop we don't want it to toggle.
                // On mobile, click toggles.
                onClickCapture={(e) => {
                    if (isMobile) {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
                className={`w-full flex items-center justify-between text-left group ${!isMobile ? 'cursor-default' : 'cursor-pointer'}`}
            >
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {stepNumber && (
                        <span className="bg-[#EA7704] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                            {stepNumber}
                        </span>
                    )}
                    {title}
                </h3>
                {isMobile && (
                    <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                )}
            </button>

            <AnimatePresence initial={false}>
                {shouldBeOpen && (
                    <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto", marginTop: 16 },
                            collapsed: { opacity: 0, height: 0, marginTop: 0 }
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollapsibleSection;
