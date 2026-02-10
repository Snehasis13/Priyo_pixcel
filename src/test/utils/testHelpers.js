/**
 * Test Helpers and Mock Data Generators
 * Utilities for testing form submission functionality
 */

/**
 * Generate mock order data
 * @param {Object} overrides - Custom values to override defaults
 * @returns {Object} Mock order data
 */
export const generateMockOrderData = (overrides = {}) => {
    const defaultData = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 9876543210',
        streetAddress: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
        productType: 'Custom Photo Frame',
        quantity: 2,
        customMessage: 'Happy Anniversary!',
        imageUrl: 'https://example.com/image.jpg',
        imageFilename: 'anniversary.jpg',
    };

    return { ...defaultData, ...overrides };
};

/**
 * Generate invalid order data for testing validation
 * @param {string} invalidField - Field to make invalid
 * @returns {Object} Invalid order data
 */
export const generateInvalidOrderData = (invalidField) => {
    const baseData = generateMockOrderData();

    const invalidations = {
        email: { email: 'invalid-email' },
        phone: { phone: '123' }, // Too short
        fullName: { fullName: 'A' }, // Too short
        streetAddress: { streetAddress: 'ABC' }, // Too short
        city: { city: '' }, // Empty
        state: { state: '' }, // Empty
        zipCode: { zipCode: '123' }, // Invalid format
        quantity: { quantity: 0 }, // Below minimum
    };

    return { ...baseData, ...(invalidations[invalidField] || {}) };
};

/**
 * Mock successful Google Sheets API response
 * @param {string} orderId - Order ID
 * @returns {Object} Mock API response
 */
export const mockSuccessResponse = (orderId = 'ORD-20260205-A3F2G') => {
    return {
        result: {
            updates: {
                updatedRange: 'Orders!A2:R2',
                updatedRows: 1,
                updatedColumns: 18,
                updatedCells: 18,
            },
        },
        status: 200,
    };
};

/**
 * Mock API error responses
 * @param {number} statusCode - HTTP status code
 * @returns {Error} Mock error object
 */
export const mockApiError = (statusCode) => {
    const errors = {
        401: new Error('User not authenticated. Please sign in with Google.'),
        403: new Error('Permission denied. Please ensure the sheet is shared with your Google account.'),
        404: new Error('Sheet not found. Please check the VITE_GOOGLE_SHEET_ID in .env'),
        429: new Error('Quota exceeded. Please try again later.'),
        500: new Error('Internal server error'),
    };

    const error = errors[statusCode] || new Error('Unknown error');
    error.status = statusCode;
    return error;
};

/**
 * Mock auth state
 * @param {boolean} isAuthenticated - Authentication status
 * @returns {Object} Mock auth context
 */
export const mockAuthState = (isAuthenticated = true) => {
    return {
        isAuthenticated,
        user: isAuthenticated
            ? {
                email: 'test@example.com',
                name: 'Test User',
                picture: 'https://example.com/avatar.jpg',
            }
            : null,
        signIn: jest.fn(),
        signOut: jest.fn(),
    };
};

/**
 * Mock toast context
 * @returns {Object} Mock toast context
 */
export const mockToastContext = () => {
    return {
        addToast: jest.fn(),
        removeToast: jest.fn(),
        toasts: [],
    };
};

/**
 * Simulate network conditions
 * @param {string} condition - 'online' | 'offline' | 'slow'
 */
export const simulateNetworkCondition = (condition) => {
    const originalOnLine = Object.getOwnPropertyDescriptor(
        Navigator.prototype,
        'onLine'
    );

    switch (condition) {
        case 'offline':
            Object.defineProperty(Navigator.prototype, 'onLine', {
                get: () => false,
                configurable: true,
            });
            window.dispatchEvent(new Event('offline'));
            break;

        case 'online':
            Object.defineProperty(Navigator.prototype, 'onLine', {
                get: () => true,
                configurable: true,
            });
            window.dispatchEvent(new Event('online'));
            break;

        case 'slow':
            // For slow network, you'd need to mock fetch/axios with delays
            console.log('Simulating slow network...');
            break;

        case 'restore':
            if (originalOnLine) {
                Object.defineProperty(Navigator.prototype, 'onLine', originalOnLine);
            }
            break;

        default:
            console.warn(`Unknown network condition: ${condition}`);
    }
};

/**
 * Wait for async operations
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export const wait = (ms = 0) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock gapi client for testing
 * @param {Object} options - Mock options
 * @returns {Object} Mock gapi client
 */
export const mockGapiClient = (options = {}) => {
    const {
        shouldSucceed = true,
        errorStatus = 500,
        delay = 0,
    } = options;

    return {
        sheets: {
            spreadsheets: {
                values: {
                    append: jest.fn(async () => {
                        await wait(delay);

                        if (!shouldSucceed) {
                            const error = mockApiError(errorStatus);
                            throw error;
                        }

                        return mockSuccessResponse();
                    }),
                    get: jest.fn(async () => {
                        await wait(delay);

                        if (!shouldSucceed) {
                            throw mockApiError(errorStatus);
                        }

                        return {
                            result: {
                                values: [
                                    ['Timestamp', 'Order_ID', 'Full_Name', 'Email'],
                                    ['2026-02-05T10:00:00Z', 'ORD-001', 'John Doe', 'john@example.com'],
                                ],
                            },
                        };
                    }),
                },
            },
        },
        getToken: jest.fn(() => ({
            access_token: 'mock-token',
        })),
    };
};

/**
 * Create test wrapper with providers
 * @param {Object} options - Provider options
 * @returns {Function} Wrapper component
 */
export const createTestWrapper = (options = {}) => {
    const {
        authState = mockAuthState(true),
        toastContext = mockToastContext(),
    } = options;

    // This would typically use React Testing Library's wrapper
    // For now, we'll return a simple wrapper function
    return ({ children }) => children;
};

/**
 * Assert validation error
 * @param {Object} result - Validation result
 * @param {string} expectedError - Expected error message (can be partial)
 */
export const assertValidationError = (result, expectedError) => {
    expect(result.isValid).toBe(false);
    expect(result.error).toContain(expectedError);
};

/**
 * Assert no validation error
 * @param {Object} result - Validation result
 */
export const assertNoValidationError = (result) => {
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
};

export default {
    generateMockOrderData,
    generateInvalidOrderData,
    mockSuccessResponse,
    mockApiError,
    mockAuthState,
    mockToastContext,
    simulateNetworkCondition,
    wait,
    mockGapiClient,
    createTestWrapper,
    assertValidationError,
    assertNoValidationError,
};
