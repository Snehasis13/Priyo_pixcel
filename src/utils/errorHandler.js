/**
 * Centralized Error Handling Utility
 * Provides error categorization, user-friendly messages, and troubleshooting steps
 */

// Error Categories
export const ErrorCategory = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    AUTH_ERROR: 'AUTH_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    API_ERROR: 'API_ERROR',
    SHEET_ERROR: 'SHEET_ERROR',
    SYSTEM_ERROR: 'SYSTEM_ERROR',
};

// Error Severity Levels
export const ErrorSeverity = {
    LOW: 'LOW',           // User can continue, minor issue
    MEDIUM: 'MEDIUM',     // User action needed
    HIGH: 'HIGH',         // Blocks progress
    CRITICAL: 'CRITICAL', // System failure
};

/**
 * Check if the browser is online
 */
export const isOnline = () => {
    return navigator.onLine;
};

/**
 * Categorize error based on error object
 * @param {Error} error - Error object
 * @returns {string} Error category
 */
export const categorizeError = (error) => {
    if (!error) return ErrorCategory.SYSTEM_ERROR;

    const errorMessage = error.message?.toLowerCase() || '';
    const errorStatus = error.status;

    // Network errors
    if (!isOnline() || errorMessage.includes('network') || errorMessage.includes('offline')) {
        return ErrorCategory.NETWORK_ERROR;
    }

    // Authentication errors
    if (
        errorStatus === 401 ||
        errorMessage.includes('not authenticated') ||
        errorMessage.includes('sign in') ||
        errorMessage.includes('authorization')
    ) {
        return ErrorCategory.AUTH_ERROR;
    }

    // Validation errors
    if (
        errorStatus === 400 ||
        errorMessage.includes('validation') ||
        errorMessage.includes('invalid') ||
        errorMessage.includes('required')
    ) {
        return ErrorCategory.VALIDATION_ERROR;
    }

    // Google Sheets API specific errors
    if (errorStatus === 403) {
        return ErrorCategory.API_ERROR; // Permission denied
    }

    if (errorStatus === 404) {
        return ErrorCategory.SHEET_ERROR; // Sheet not found
    }

    if (errorStatus === 429) {
        return ErrorCategory.API_ERROR; // Quota exceeded
    }

    // Sheet configuration errors
    if (
        errorMessage.includes('sheet') &&
        (errorMessage.includes('not configured') || errorMessage.includes('not found'))
    ) {
        return ErrorCategory.SHEET_ERROR;
    }

    // Default to system error
    return ErrorCategory.SYSTEM_ERROR;
};

/**
 * Get user-friendly error message with troubleshooting steps
 * @param {Error} error - Error object
 * @returns {Object} { title, message, troubleshooting, actions, severity, category }
 */
export const getErrorDetails = (error) => {
    const category = categorizeError(error);
    const errorMessage = error.message || 'An unexpected error occurred';
    const errorStatus = error.status;

    const errorDetails = {
        category,
        severity: ErrorSeverity.MEDIUM,
        canRetry: false,
        requiresAuth: false,
        contactSupport: false,
    };

    switch (category) {
        case ErrorCategory.NETWORK_ERROR:
            return {
                ...errorDetails,
                title: 'No Internet Connection',
                message: 'Unable to connect to the internet. Please check your network connection and try again.',
                troubleshooting: [
                    'Check your WiFi or mobile data connection',
                    'Try loading another website to verify connectivity',
                    'If you\'re on WiFi, try switching to mobile data',
                    'Your order draft is saved and will be submitted when connection is restored',
                ],
                actions: ['retry', 'save_draft'],
                severity: ErrorSeverity.HIGH,
                canRetry: true,
            };

        case ErrorCategory.AUTH_ERROR:
            return {
                ...errorDetails,
                title: 'Authentication Required',
                message: 'You need to sign in with Google to submit your order.',
                troubleshooting: [
                    'Click the "Sign In with Google" button in the top right',
                    'Allow PriyoPixcel to access your Google account',
                    'Return to this page and try submitting again',
                ],
                actions: ['sign_in', 'close'],
                severity: ErrorSeverity.HIGH,
                requiresAuth: true,
            };

        case ErrorCategory.VALIDATION_ERROR:
            return {
                ...errorDetails,
                title: 'Incomplete Information',
                message: errorMessage,
                troubleshooting: [
                    'Review the highlighted fields above',
                    'Ensure all required information is provided',
                    'Check that email and phone formats are correct',
                ],
                actions: ['close'],
                severity: ErrorSeverity.MEDIUM,
            };

        case ErrorCategory.API_ERROR:
            if (errorStatus === 429) {
                return {
                    ...errorDetails,
                    title: 'High Traffic Detected',
                    message: 'We\'re experiencing high traffic right now. Your order will be submitted automatically in a moment.',
                    troubleshooting: [
                        'Please wait 1-2 minutes',
                        'We\'ll automatically retry your submission',
                        'Don\'t close this window',
                    ],
                    actions: ['auto_retry', 'manual_retry'],
                    severity: ErrorSeverity.MEDIUM,
                    canRetry: true,
                };
            } else if (errorStatus === 403) {
                return {
                    ...errorDetails,
                    title: 'Permission Issue',
                    message: 'There\'s a permissions issue with our order system.',
                    troubleshooting: [
                        'Try signing out and signing back in',
                        'If that doesn\'t work, contact our support team',
                        'We can manually process your order',
                    ],
                    actions: ['sign_out', 'contact_support'],
                    severity: ErrorSeverity.HIGH,
                    contactSupport: true,
                };
            }
            return {
                ...errorDetails,
                title: 'Service Error',
                message: 'Our order system is experiencing issues. Please try again.',
                troubleshooting: [
                    'Wait a moment and try again',
                    'If the problem persists, contact support',
                ],
                actions: ['retry', 'contact_support'],
                severity: ErrorSeverity.HIGH,
                canRetry: true,
                contactSupport: true,
            };

        case ErrorCategory.SHEET_ERROR:
            return {
                ...errorDetails,
                title: 'Configuration Error',
                message: 'We\'re experiencing a configuration issue. Our team has been notified.',
                troubleshooting: [
                    'Please try again in a few minutes',
                    'If the problem persists, contact us at support@priyopixcel.com',
                    'Include your order details in your message',
                ],
                actions: ['retry', 'contact_support'],
                severity: ErrorSeverity.CRITICAL,
                canRetry: true,
                contactSupport: true,
            };

        case ErrorCategory.SYSTEM_ERROR:
        default:
            return {
                ...errorDetails,
                title: 'Unexpected Error',
                message: errorMessage || 'An unexpected error occurred. Please try again.',
                troubleshooting: [
                    'Refresh the page and try again',
                    'Clear your browser cache if the issue persists',
                    'Try using a different browser',
                    'Contact support if you continue to experience issues',
                ],
                actions: ['retry', 'contact_support'],
                severity: ErrorSeverity.HIGH,
                canRetry: true,
                contactSupport: true,
            };
    }
};

/**
 * Format error for logging
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 * @returns {Object} Formatted error log
 */
export const formatErrorLog = (error, context = {}) => {
    return {
        timestamp: new Date().toISOString(),
        category: categorizeError(error),
        message: error.message,
        stack: error.stack,
        status: error.status,
        context,
        userAgent: navigator.userAgent,
        online: isOnline(),
    };
};

/**
 * Retry handler with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Result of function
 */
export const retryWithBackoff = async (
    fn,
    options = {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        backoffFactor: 2,
    }
) => {
    const { maxRetries, initialDelay, maxDelay, backoffFactor } = options;
    let lastError;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn(attempt);
        } catch (error) {
            lastError = error;

            // Don't retry certain errors
            const category = categorizeError(error);
            if (
                category === ErrorCategory.VALIDATION_ERROR ||
                category === ErrorCategory.AUTH_ERROR ||
                category === ErrorCategory.SHEET_ERROR
            ) {
                throw error;
            }

            // Check if we're out of retries
            if (attempt === maxRetries) {
                throw error;
            }

            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, delay));

            // Increase delay for next attempt (exponential backoff)
            delay = Math.min(delay * backoffFactor, maxDelay);
        }
    }

    throw lastError;
};

/**
 * Network status listener
 * @param {Function} onOnline - Callback when online
 * @param {Function} onOffline - Callback when offline
 * @returns {Function} Cleanup function
 */
export const listenToNetworkStatus = (onOnline, onOffline) => {
    const handleOnline = () => {
        if (onOnline) onOnline();
    };

    const handleOffline = () => {
        if (onOffline) onOffline();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Return cleanup function
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
};

export default {
    ErrorCategory,
    ErrorSeverity,
    isOnline,
    categorizeError,
    getErrorDetails,
    formatErrorLog,
    retryWithBackoff,
    listenToNetworkStatus,
};
