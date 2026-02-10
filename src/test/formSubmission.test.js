/**
 * Form Submission Integration Tests
 * Test all 7 scenarios: success, invalid data, network offline, unauth, 404, 429, 403
 */

import {
    generateMockOrderData,
    generateInvalidOrderData,
    mockApiError,
    mockAuthState,
    mockToastContext,
    simulateNetworkCondition,
    wait,
} from './utils/testHelpers';
import { submitOrderToSheet } from '../services/googleSheetsService';
import { categorizeError, getErrorDetails, ErrorCategory } from '../utils/errorHandler';

// Mock the gapi client
jest.mock('gapi-script', () => ({
    gapi: {
        client: {
            getToken: jest.fn(() => ({ access_token: 'mock-token' })),
            sheets: {
                spreadsheets: {
                    values: {
                        append: jest.fn(),
                    },
                },
            },
            load: jest.fn(() => Promise.resolve()),
        },
    },
}));

describe('Form Submission - All Scenarios', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Restore network conditions
        simulateNetworkCondition('restore');
    });

    /**
     * SCENARIO 1: Successful Submission
     */
    describe('Scenario 1: Successful Submission', () => {
        test('should submit valid order successfully', async () => {
            const orderData = generateMockOrderData();
            const mockOnSuccess = jest.fn();
            const mockOnError = jest.fn();

            // Mock successful API response
            const { gapi } = require('gapi-script');
            gapi.client.sheets.spreadsheets.values.append.mockResolvedValue({
                result: {
                    updates: {
                        updatedRange: 'Orders!A2:R2',
                    },
                },
            });

            const result = await submitOrderToSheet(orderData, {
                onSuccess: mockOnSuccess,
                onError: mockOnError,
            });

            // Assertions
            expect(result.success).toBe(true);
            expect(result.orderId).toBeTruthy();
            expect(result.orderId).toMatch(/^ORD-\d{8}-[A-Z0-9]{5}$/);
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnError).not.toHaveBeenCalled();
            expect(gapi.client.sheets.spreadsheets.values.append).toHaveBeenCalled();
        });

        test('should generate unique order IDs', async () => {
            const orderData = generateMockOrderData();

            const { gapi } = require('gapi-script');
            gapi.client.sheets.spreadsheets.values.append.mockResolvedValue({
                result: { updates: { updatedRange: 'Orders!A2:R2' } },
            });

            const result1 = await submitOrderToSheet(orderData);
            const result2 = await submitOrderToSheet(orderData);

            expect(result1.orderId).not.toBe(result2.orderId);
        });

        test('should include timestamp in submission', async () => {
            const orderData = generateMockOrderData();

            const { gapi } = require('gapi-script');
            gapi.client.sheets.spreadsheets.values.append.mockResolvedValue({
                result: { updates: { updatedRange: 'Orders!A2:R2' } },
            });

            await submitOrderToSheet(orderData);

            const callArgs = gapi.client.sheets.spreadsheets.values.append.mock.calls[0];
            const submittedData = callArgs[1].values[0];

            // First column should be timestamp
            const timestamp = submittedData[0];
            expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        });
    });

    /**
     * SCENARIO 2: Invalid Data
     */
    describe('Scenario 2: Invalid Data Submission', () => {
        test('should reject order with missing full name', async () => {
            const orderData = generateInvalidOrderData('fullName');

            const result = await submitOrderToSheet(orderData);

            expect(result.success).toBe(false);
            expect(result.errors).toBeTruthy();
            expect(result.message).toContain('name');
        });

        test('should reject order with invalid email', async () => {
            const orderData = generateInvalidOrderData('email');

            const result = await submitOrderToSheet(orderData);

            expect(result.success).toBe(false);
            expect(result.message).toContain('email');
        });

        test('should reject order with invalid phone', async () => {
            const orderData = generateInvalidOrderData('phone');

            const result = await submitOrderToSheet(orderData);

            expect(result.success).toBe(false);
            expect(result.message).toContain('phone');
        });

        test('should reject order with missing address fields', async () => {
            const orderData = generateMockOrderData({
                streetAddress: '',
                city: '',
                state: '',
            });

            const result = await submitOrderToSheet(orderData);

            expect(result.success).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        test('should reject order with invalid quantity', async () => {
            const orderData = generateInvalidOrderData('quantity');

            const result = await submitOrderToSheet(orderData);

            expect(result.success).toBe(false);
            expect(result.message).toContain('quantity');
        });
    });

    /**
     * SCENARIO 3: Network Disconnected
     */
    describe('Scenario 3: Network Disconnected', () => {
        test('should detect offline status', () => {
            simulateNetworkCondition('offline');

            expect(navigator.onLine).toBe(false);
        });

        test('should categorize network errors correctly', () => {
            simulateNetworkCondition('offline');

            const error = new Error('Network request failed');
            const category = categorizeError(error);

            expect(category).toBe(ErrorCategory.NETWORK_ERROR);
        });

        test('should provide network error details', () => {
            simulateNetworkCondition('offline');

            const error = new Error('Failed to fetch');
            const errorDetails = getErrorDetails(error);

            expect(errorDetails.title).toContain('Internet');
            expect(errorDetails.troubleshooting.length).toBeGreaterThan(0);
            expect(errorDetails.canRetry).toBe(true);
        });

        test('should handle network error during submission', async () => {
            const orderData = generateMockOrderData();

            const { gapi } = require('gapi-script');
            gapi.client.sheets.spreadsheets.values.append.mockRejectedValue(
                new Error('Network request failed')
            );

            const result = await submitOrderToSheet(orderData);

            expect(result.success).toBe(false);
            expect(result.message).toBeTruthy();
        });
    });

    /**
     * SCENARIO 4: Unauthenticated User
     */
    describe('Scenario 4: Unauthenticated User', () => {
        test('should detect missing authentication token', async () => {
            const orderData = generateMockOrderData();

            const { gapi } = require('gapi-script');
            gapi.client.getToken.mockReturnValue(null);

            gapi.client.sheets.spreadsheets.values.append.mockRejectedValue(
                mockApiError(401)
            );

            const result = await submitOrderToSheet(orderData);

            expect(result.success).toBe(false);
        });

        test('should categorize auth errors correctly', () => {
            const error = mockApiError(401);
            const category = categorizeError(error);

            expect(category).toBe(ErrorCategory.AUTH_ERROR);
        });

        test('should provide auth error details with sign-in action', () => {
            const error = mockApiError(401);
            const errorDetails = getErrorDetails(error);

            expect(errorDetails.title).toContain('Authentication');
            expect(errorDetails.requiresAuth).toBe(true);
            expect(errorDetails.actions).toContain('sign_in');
        });
    });

    /**
     * SCENARIO 5: Sheet ID Not Found (404)
     */
    describe('Scenario 5: Sheet Not Found (404)', () => {
        test('should handle 404 error gracefully', async () => {
            const orderData = generateMockOrderData();

            const { gapi } = require('gapi-script');
            gapi.client.sheets.spreadsheets.values.append.mockRejectedValue(
                mockApiError(404)
            );

            const result = await submitOrderToSheet(orderData);

            expect(result.success).toBe(false);
            expect(result.message).toContain('not found');
        });

        test('should categorize 404 as sheet error', () => {
            const error = mockApiError(404);
            const category = categorizeError(error);

            expect(category).toBe(ErrorCategory.SHEET_ERROR);
        });

        test('should provide configuration error details', () => {
            const error = mockApiError(404);
            const errorDetails = getErrorDetails(error);

            expect(errorDetails.title).toContain('Configuration');
            expect(errorDetails.contactSupport).toBe(true);
            expect(errorDetails.severity).toBe('CRITICAL');
        });
    });

    /**
     * SCENARIO 6: API Quota Exceeded (429)
     */
    describe('Scenario 6: API Quota Exceeded (429)', () => {
        test('should handle quota exceeded error', async () => {
            const orderData = generateMockOrderData();

            const { gapi } = require('gapi-script');
            gapi.client.sheets.spreadsheets.values.append.mockRejectedValue(
                mockApiError(429)
            );

            const result = await submitOrderToSheet(orderData);

            expect(result.success).toBe(false);
            expect(result.message).toContain('traffic' || 'quota' || 'try again');
        });

        test('should categorize 429 as API error', () => {
            const error = mockApiError(429);
            const category = categorizeError(error);

            expect(category).toBe(ErrorCategory.API_ERROR);
        });

        test('should provide auto-retry action for quota errors', () => {
            const error = mockApiError(429);
            const errorDetails = getErrorDetails(error);

            expect(errorDetails.canRetry).toBe(true);
            expect(errorDetails.actions).toContain('auto_retry');
        });
    });

    /**
     * SCENARIO 7: Permission Denied (403)
     */
    describe('Scenario 7: Permission Denied (403)', () => {
        test('should handle permission denied error', async () => {
            const orderData = generateMockOrderData();

            const { gapi } = require('gapi-script');
            gapi.client.sheets.spreadsheets.values.append.mockRejectedValue(
                mockApiError(403)
            );

            const result = await submitOrderToSheet(orderData);

            expect(result.success).toBe(false);
            expect(result.message).toContain('permission' || 'Permission');
        });

        test('should categorize 403 as API error', () => {
            const error = mockApiError(403);
            const category = categorizeError(error);

            expect(category).toBe(ErrorCategory.API_ERROR);
        });

        test('should provide sign-out action for permission errors', () => {
            const error = mockApiError(403);
            const errorDetails = getErrorDetails(error);

            expect(errorDetails.contactSupport).toBe(true);
            expect(errorDetails.actions).toContain('sign_out');
        });
    });

    /**
     * ADDITIONAL TESTS
     */
    describe('Additional Edge Cases', () => {
        test('should handle timeout errors', async () => {
            const orderData = generateMockOrderData();

            const { gapi } = require('gapi-script');
            gapi.client.sheets.spreadsheets.values.append.mockRejectedValue(
                new Error('Request timeout')
            );

            const result = await submitOrderToSheet(orderData);

            expect(result.success).toBe(false);
        });

        test('should handle malformed responses', async () => {
            const orderData = generateMockOrderData();

            const { gapi } = require('gapi-script');
            gapi.client.sheets.spreadsheets.values.append.mockResolvedValue(null);

            const result = await submitOrderToSheet(orderData);

            // Should still return a result (even if success is determined differently)
            expect(result).toBeTruthy();
        });

        test('should sanitize user input', async () => {
            const orderData = generateMockOrderData({
                fullName: '<script>alert("xss")</script>John Doe',
                customMessage: '<img src=x onerror=alert(1)>Happy Birthday!',
            });

            const { gapi } = require('gapi-script');
            gapi.client.sheets.spreadsheets.values.append.mockResolvedValue({
                result: { updates: { updatedRange: 'Orders!A2:R2' } },
            });

            await submitOrderToSheet(orderData);

            const callArgs = gapi.client.sheets.spreadsheets.values.append.mock.calls[0];
            const submittedData = callArgs[1].values[0];

            // Check that script tags were not submitted
            const fullNameIndex = 4; // Full_Name is 5th column (index 4)
            expect(submittedData[fullNameIndex]).not.toContain('<script>');
        });
    });
});
