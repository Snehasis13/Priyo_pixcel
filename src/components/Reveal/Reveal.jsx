import React from 'react';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const Reveal = ({ children, animation = 'animate-slide-up', delay = '', className = '' }) => {
    const [ref, isVisible] = useScrollAnimation(0.1);

    // Map animation props to actual CSS classes defined in index.css
    const animationClass = {
        'slideInUp': 'slide-in-from-bottom',
        'slideInDown': 'slide-in-from-top',
        'slideInLeft': 'slide-in-from-left',
        'slideInRight': 'slide-in-from-right',
        'fadeIn': 'fade-in',
        'bounceInUp': 'bounce-in-up'
    }[animation] || 'slide-in-from-bottom';

    return (
        <div
            ref={ref}
            className={`w-full transition-opacity duration-1000 ${className} ${isVisible ? `opacity-100 animate-in ${animationClass} ${delay}` : 'opacity-0'}`}
        >
            {children}
        </div>
    );
};

export default Reveal;
