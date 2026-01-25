import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
};

const styles = {
    success: 'bg-white border-green-500',
    error: 'bg-white border-red-500',
    info: 'bg-white border-blue-500'
};

const Toast = ({ id, message, type, onClose }) => {
    return (
        <div className={`flex items-center w-full max-w-sm p-4 w-full bg-white rounded-lg shadow-lg border-l-4 ${styles[type]} transform transition-all duration-300 animate-in slide-in-from-right fade-in pointer-events-auto`}>
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <div className="ml-3 text-sm font-normal text-gray-800 break-words flex-1">
                {message}
            </div>
            <button
                onClick={() => onClose(id)}
                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
                aria-label="Close"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
