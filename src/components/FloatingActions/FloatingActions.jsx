import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
import Reveal from '../Reveal/Reveal';

const FloatingActions = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
            {/* WhatsApp Button - Always Visible */}
            <a
                href="https://wa.me/919903349695"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Chat with us
                </span>
            </a>

            {/* Back to Top Button */}
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="bg-[#EA7704] hover:bg-[#d66b03] text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 animate-fadeIn"
                    aria-label="Back to top"
                >
                    <ArrowUp className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};

export default FloatingActions;
