import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { submitOrderToSheet } from '../services/googleSheetsService';
import { initializeGapi, setGapiToken } from '../services/driveService';
import { initializeSheetsApi } from '../services/googleSheetsService';
import {
    isOnline,
    getErrorDetails,
    formatErrorLog,
    retryWithBackoff,
    listenToNetworkStatus,
} from '../utils/errorHandler';
import * as logger from '../utils/logger';

/**
 * Enhanced Custom hook for submitting orders to Google Sheets
 * Handles authentication, validation, submission, retry logic, and user feedback
 * 
 * @returns {Object} Hook utilities
 */
export const useOrderSubmission = () => {
    const { isAuthenticated } = useAuth();
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [errorDetails, setErrorDetails] = useState(null);
    const [submittedOrderId, setSubmittedOrderId] = useState(null);
    const [isOnlineState, setIsOnlineState] = useState(isOnline());
    const [retryCount, setRetryCount] = useState(0);

    // Listen to network status changes
    useEffect(() => {
        const cleanup = listenToNetworkStatus(
            () => {
                setIsOnlineState(true);
                logger.info('Network connection restored');
                addToast('Connection restored', { type: 'success', duration: 3000 });
            },
            () => {
                setIsOnlineState(false);
                logger.warn('Network connection lost');
                addToast('No internet connection', { type: 'error', duration: 5000 });
            }
        );

        return cleanup;
    }, [addToast]);

    /**
     * Submit order to Google Sheets with full error handling and user feedback
     * 
     * @param {Object} orderData - Order form data
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Submission result
     */
    const submitOrder = async (orderData, options = {}) => {
        const {
            showToast = true,
            requireAuth = true,
            onSuccess: customOnSuccess,
            onError: customOnError,
            enableRetry = true,
            ...sheetOptions
        } = options;

        setIsSubmitting(true);
        setError(null);
        setErrorDetails(null);
        setSubmittedOrderId(null);
        setRetryCount(0);

        const startTime = performance.now();
        logger.info('Starting order submission', { orderData: { ...orderData, imageUrl: '[REDACTED]' } });

        try {
            // Check network connectivity first
            if (!isOnline()) {
                const networkError = new Error('No internet connection');
                const details = getErrorDetails(networkError);

                setError(networkError.message);
                setErrorDetails(details);

                logger.error('Submission failed - No network connection', networkError);

                if (showToast) {
                    addToast(details.message, {
                        type: 'error',
                        duration: 5000,
                    });
                }

                if (customOnError) {
                    customOnError(networkError, details);
                }

                return {
                    success: false,
                    error: networkError.message,
                    errorDetails: details,
                    message: details.message,
                };
            }

            // Check authentication if required
            if (requireAuth && !isAuthenticated) {
                const authError = new Error('Please sign in with Google to submit your order');
                const details = getErrorDetails(authError);

                setError(authError.message);
                setErrorDetails(details);

                logger.warn('Submission failed - Not authenticated');

                if (showToast) {
                    addToast(details.message, {
                        type: 'error',
                        duration: 5000,
                    });
                }

                if (customOnError) {
                    customOnError(authError, details);
                }

                return {
                    success: false,
                    requiresAuth: true,
                    error: authError.message,
                    errorDetails: details,
                    message: details.message,
                };
            }

            // Initialize APIs if needed
            try {
                await initializeGapi();
                await initializeSheetsApi();
                logger.debug('APIs initialized successfully');
            } catch (initError) {
                logger.warn('API initialization warning', initError);
                // Continue anyway, might already be initialized
            }

            // Submit order with retry logic
            const submitFn = async (attempt) => {
                if (attempt > 0) {
                    setRetryCount(attempt);
                    logger.info(`Retry attempt ${attempt}`, { orderData });
                }

                return await submitOrderToSheet(orderData, {
                    ...sheetOptions,
                    onSuccess: (successData) => {
                        const duration = performance.now() - startTime;
                        setSubmittedOrderId(successData.orderId);

                        logger.info('Order submitted successfully', {
                            orderId: successData.orderId,
                            duration: `${duration.toFixed(2)}ms`,
                            attempts: attempt + 1,
                        });

                        if (showToast) {
                            addToast(`Order ${successData.orderId} submitted successfully! 🎉`, {
                                type: 'success',
                                duration: 5000,
                            });
                        }

                        if (customOnSuccess) {
                            customOnSuccess(successData);
                        }
                    },
                    onError: (err) => {
                        const details = getErrorDetails(err);
                        setError(err.message);
                        setErrorDetails(details);

                        logger.error('Order submission failed', formatErrorLog(err, { orderData }));

                        if (showToast) {
                            addToast(details.message, {
                                type: 'error',
                                duration: 5000,
                            });
                        }

                        if (customOnError) {
                            customOnError(err, details);
                        }
                    },
                });
            };

            // Execute with retry if enabled
            const result = enableRetry
                ? await retryWithBackoff(submitFn, {
                    maxRetries: 3,
                    initialDelay: 1000,
                    maxDelay: 5000,
                })
                : await submitFn(0);

            return result;

        } catch (err) {
            const duration = performance.now() - startTime;
            logger.error('Unexpected error in submitOrder', formatErrorLog(err, {
                orderData,
                duration: `${duration.toFixed(2)}ms`,
                retries: retryCount,
            }));

            const details = getErrorDetails(err);
            setError(err.message);
            setErrorDetails(details);

            if (showToast) {
                addToast(details.message, {
                    type: 'error',
                    duration: 5000,
                });
            }

            if (customOnError) {
                customOnError(err, details);
            }

            return {
                success: false,
                error: err.message,
                errorDetails: details,
                message: details.message,
            };

        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Retry the last failed submission
     */
    const retrySubmission = async (orderData, options = {}) => {
        logger.info('Manual retry initiated');
        return submitOrder(orderData, options);
    };

    /**
     * Reset the submission state
     */
    const reset = () => {
        setIsSubmitting(false);
        setError(null);
        setErrorDetails(null);
        setSubmittedOrderId(null);
        setRetryCount(0);
        logger.debug('Submission state reset');
    };

    return {
        // State
        isSubmitting,
        error,
        errorDetails,
        submittedOrderId,
        isAuthenticated,
        isOnline: isOnlineState,
        retryCount,

        // Methods
        submitOrder,
        retrySubmission,
        reset,
    };
};

export default useOrderSubmission;
