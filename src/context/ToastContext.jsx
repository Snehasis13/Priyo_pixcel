import React, { createContext, useContext, useState, useCallback, isValidElement, cloneElement } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((content, options = {}) => {
        const id = Date.now() + Math.random();
        const {
            type = 'info',
            duration = 3000,
            position = 'top-center',
            autoDismiss = true
        } = typeof options === 'string' ? { type: options } : options; // Backward compatibility for (msg, type)

        const newToast = {
            id,
            content,
            type,
            position,
            autoDismiss
        };

        setToasts((prev) => [...prev, newToast]);

        if (autoDismiss) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const getPositionClasses = (position) => {
        switch (position) {
            case 'top-right':
                return 'top-4 right-4 items-end';
            case 'top-center':
                return 'top-4 left-1/2 transform -translate-x-1/2 items-center';
            case 'bottom-right':
                return 'bottom-4 right-4 items-end';
            default:
                return 'top-4 left-1/2 transform -translate-x-1/2 items-center';
        }
    };

    // Group toasts by position to render in correct containers
    const renderToasts = (position) => {
        const positionToasts = toasts.filter(t => t.position === position);
        if (positionToasts.length === 0) return null;

        const isBottom = position.includes('bottom');
        const animationClass = isBottom ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2';

        return (
            <div className={`fixed z-50 flex flex-col gap-2 ${getPositionClasses(position)}`}>
                {positionToasts.map((toast) => (
                    <div key={toast.id} className={`animate-in fade-in ${animationClass} duration-300`}>
                        {/* If content is a React element/component, render it with injected onClose */}
                        {isValidElement(toast.content) ? (
                            <div className="relative">
                                {cloneElement(toast.content, {
                                    onClose: () => removeToast(toast.id)
                                })}
                            </div>
                        ) : (
                            /* Default String Toast */
                            <div className={`
                                px-6 py-3 rounded-full shadow-lg text-white font-medium flex items-center gap-2
                                ${toast.type === 'success' ? 'bg-green-500' :
                                    toast.type === 'error' ? 'bg-red-500' :
                                        'bg-gray-800'}
                            `}>
                                <span>{toast.content}</span>
                                {!toast.autoDismiss && (
                                    <button onClick={() => removeToast(toast.id)} className="ml-2 hover:text-gray-200">
                                        ×
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            {renderToasts('top-center')}
            {renderToasts('top-right')}
            {renderToasts('bottom-right')}
        </ToastContext.Provider>
    );
};
