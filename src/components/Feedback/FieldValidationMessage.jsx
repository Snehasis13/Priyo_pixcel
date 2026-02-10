import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

/**
 * Field Validation Message Component
 * Shows inline validation feedback for form fields
 */
const FieldValidationMessage = ({
    error,
    success,
    info,
    className = '',
}) => {
    if (!error && !success && !info) return null;

    const getStyles = () => {
        if (error) {
            return {
                container: 'text-red-600 bg-red-50 border-red-200',
                icon: <AlertCircle className="w-4 h-4" />,
            };
        }
        if (success) {
            return {
                container: 'text-green-600 bg-green-50 border-green-200',
                icon: <CheckCircle className="w-4 h-4" />,
            };
        }
        if (info) {
            return {
                container: 'text-blue-600 bg-blue-50 border-blue-200',
                icon: <Info className="w-4 h-4" />,
            };
        }
    };

    const styles = getStyles();
    const message = error || success || info;

    return (
        <div
            className={`flex items-start gap-2 text-xs mt-1 p-2 rounded border ${styles.container} ${className} animate-fadeIn`}
            role="alert"
            aria-live="polite"
        >
            {styles.icon}
            <span>{message}</span>
        </div>
    );
};

export default FieldValidationMessage;
