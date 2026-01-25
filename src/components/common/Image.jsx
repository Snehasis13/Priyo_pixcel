import React, { useState } from 'react';

const Image = ({ src, alt, className = '', containerClassName = '', ...props }) => {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const handleError = () => {
        setError(true);
    };

    const handleLoad = () => {
        setLoaded(true);
    };

    // Generic placeholder - Light gray background with an icon or just empty
    const Placeholder = () => (
        <div className={`bg-gray-200 flex items-center justify-center h-full w-full ${className}`} {...props}>
            <span className="text-gray-400 text-xs text-center px-1">Img Err</span>
        </div>
    );

    if (error || !src) {
        return <Placeholder />;
    }

    return (
        <div className={`relative overflow-hidden ${containerClassName || className}`}>
            {/* Blur Placeholder */}
            {!loaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse blur-xl scale-110" />
            )}

            <img
                src={src}
                alt={alt}
                className={`${className} transition-all duration-700 ease-in-out ${loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-lg scale-105'
                    }`}
                onError={handleError}
                onLoad={handleLoad}
                {...props}
            />
        </div>
    );
};

export default Image;
