import React, { useState } from 'react';
import {
    AlertCircle,
    WifiOff,
    Lock,
    AlertTriangle,
    XCircle,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    Mail,
    LogOut,
    ExternalLink
} from 'lucide-react';
import { ErrorSeverity } from '../../utils/errorHandler';

/**
 * Comprehensive Error Display Component
 * Shows detailed error messages with troubleshooting steps
 */
const ErrorDisplay = ({
    errorDetails,
    onRetry,
    onSignIn,
    onSignOut,
    onClose,
    isRetrying = false,
    showDetails = false,
}) => {
    const [expanded, setExpanded] = useState(showDetails);

    if (!errorDetails) return null;

    const {
        title,
        message,
        troubleshooting = [],
        actions = [],
        severity = ErrorSeverity.MEDIUM,
        category,
        canRetry,
        requiresAuth,
        contactSupport,
    } = errorDetails;

    // Icon based on severity/category
    const getIcon = () => {
        if (category === 'NETWORK_ERROR') return <WifiOff className="w-6 h-6" />;
        if (category === 'AUTH_ERROR') return <Lock className="w-6 h-6" />;
        if (severity === ErrorSeverity.CRITICAL) return <XCircle className="w-6 h-6" />;
        if (severity === ErrorSeverity.HIGH) return <AlertCircle className="w-6 h-6" />;
        return <AlertTriangle className="w-6 h-6" />;
    };

    // Color scheme based on severity
    const getColorScheme = () => {
        switch (severity) {
            case ErrorSeverity.CRITICAL:
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    icon: 'text-red-600',
                    title: 'text-red-900',
                    text: 'text-red-700',
                    button: 'bg-red-600 hover:bg-red-700 text-white',
                };
            case ErrorSeverity.HIGH:
                return {
                    bg: 'bg-orange-50',
                    border: 'border-orange-200',
                    icon: 'text-orange-600',
                    title: 'text-orange-900',
                    text: 'text-orange-700',
                    button: 'bg-orange-600 hover:bg-orange-700 text-white',
                };
            case ErrorSeverity.MEDIUM:
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    icon: 'text-yellow-600',
                    title: 'text-yellow-900',
                    text: 'text-yellow-700',
                    button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                };
            default:
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    icon: 'text-blue-600',
                    title: 'text-blue-900',
                    text: 'text-blue-700',
                    button: 'bg-blue-600 hover:bg-blue-700 text-white',
                };
        }
    };

    const colors = getColorScheme();

    return (
        <div className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-6 shadow-lg animate-fadeIn`}>
            {/* Header */}
            <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 ${colors.icon}`}>
                    {getIcon()}
                </div>

                <div className="flex-1">
                    <h3 className={`text-lg font-bold ${colors.title} mb-2`}>
                        {title}
                    </h3>
                    <p className={`${colors.text} mb-4`}>
                        {message}
                    </p>

                    {/* Troubleshooting Steps */}
                    {troubleshooting.length > 0 && (
                        <div className="mb-4">
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className={`flex items-center gap-2 text-sm font-semibold ${colors.title} hover:underline`}
                            >
                                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                Troubleshooting Steps
                            </button>

                            {expanded && (
                                <ul className={`mt-3 space-y-2 text-sm ${colors.text} ml-6`}>
                                    {troubleshooting.map((step, index) => (
                                        <li key={index} className="list-disc">
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        {/* Retry Button */}
                        {(canRetry || actions.includes('retry')) && onRetry && (
                            <button
                                onClick={onRetry}
                                disabled={isRetrying}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${colors.button} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                                {isRetrying ? 'Retrying...' : 'Try Again'}
                            </button>
                        )}

                        {/* Sign In Button */}
                        {(requiresAuth || actions.includes('sign_in')) && onSignIn && (
                            <button
                                onClick={onSignIn}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${colors.button}`}
                            >
                                <Lock className="w-4 h-4" />
                                Sign In with Google
                            </button>
                        )}

                        {/* Sign Out Button */}
                        {actions.includes('sign_out') && onSignOut && (
                            <button
                                onClick={onSignOut}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        )}

                        {/* Contact Support Button */}
                        {(contactSupport || actions.includes('contact_support')) && (
                            <a
                                href="mailto:support@priyopixcel.com?subject=Order Submission Issue"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-white hover:bg-gray-100 text-gray-700 border-2 border-gray-300 transition-all"
                            >
                                <Mail className="w-4 h-4" />
                                Contact Support
                            </a>
                        )}

                        {/* Close Button */}
                        {actions.includes('close') && onClose && (
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg font-semibold bg-white hover:bg-gray-100 text-gray-700 border-2 border-gray-300 transition-all"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Help Link */}
            {contactSupport && (
                <div className={`mt-4 pt-4 border-t ${colors.border}`}>
                    <p className={`text-sm ${colors.text}`}>
                        Need immediate help?{' '}
                        <a
                            href="https://priyopixcel.com/help"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-semibold hover:underline inline-flex items-center gap-1`}
                        >
                            Visit our Help Center
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};

export default ErrorDisplay;
