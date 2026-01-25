import React from 'react';
import { useToast } from '../../context/ToastContext';
import Toast from './Toast';

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
