import { gapi } from 'gapi-script';
import { uploadImageToDrive } from './driveService';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;

// Discovery doc for Sheets API
const SHEETS_DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

/**
 * Initialize Google Sheets API
 * Must be called after GAPI is initialized and token is set
 */
export const initializeSheetsApi = async () => {
    try {
        // Load Sheets API if not already loaded
        if (!gapi.client.sheets) {
            await gapi.client.load('sheets', 'v4');
        }
        return true;
    } catch (error) {
        console.error('Error loading Sheets API:', error);
        throw new Error('Failed to initialize Google Sheets API');
    }
};

/**
 * Append a row of data to a Google Sheet
 * @param {string[]} values - Array of values to append as a row
 * @param {string} range - Sheet range (e.g., 'Sheet1!A:Z')
 * @param {string} sheetId - Optional sheet ID, defaults to env variable
 */
export const appendToSheet = async (values, range = 'Sheet1!A:Z', sheetId = SHEET_ID) => {
    try {
        // Validate inputs
        if (!values || values.length === 0) {
            throw new Error('No values provided to append');
        }

        if (!sheetId || sheetId === 'your_sheet_id_here') {
            throw new Error('Google Sheet ID not configured. Please set VITE_GOOGLE_SHEET_ID in .env');
        }

        // Ensure Sheets API is loaded
        await initializeSheetsApi();

        // Check if user is authenticated
        const token = gapi.client.getToken();
        if (!token || !token.access_token) {
            throw new Error('User not authenticated. Please sign in with Google.');
        }

        // Prepare the request
        const params = {
            spreadsheetId: sheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
        };

        const valueRangeBody = {
            values: [values], // Wrap in array since we're appending one row
        };

        // Make API call
        const response = await gapi.client.sheets.spreadsheets.values.append(
            params,
            valueRangeBody
        );

        return response.result;
    } catch (error) {
        console.error('Error appending to sheet:', error);

        // Provide user-friendly error messages
        if (error.status === 403) {
            throw new Error('Permission denied. Please ensure the sheet is shared with your Google account.');
        } else if (error.status === 404) {
            throw new Error('Sheet not found. Please check the VITE_GOOGLE_SHEET_ID in .env');
        } else if (error.status === 429) {
            throw new Error('Quota exceeded. Please try again later.');
        }

        throw error;
    }
};

/**
 * Batch append multiple rows to a Google Sheet
 * @param {string[][]} rows - Array of rows, where each row is an array of values
 * @param {string} range - Sheet range (e.g., 'Sheet1!A:Z')
 * @param {string} sheetId - Optional sheet ID, defaults to env variable
 */
export const batchAppendToSheet = async (rows, range = 'Sheet1!A:Z', sheetId = SHEET_ID) => {
    try {
        if (!rows || rows.length === 0) {
            throw new Error('No rows provided to append');
        }

        if (!sheetId || sheetId === 'your_sheet_id_here') {
            throw new Error('Google Sheet ID not configured. Please set VITE_GOOGLE_SHEET_ID in .env');
        }

        await initializeSheetsApi();

        const token = gapi.client.getToken();
        if (!token || !token.access_token) {
            throw new Error('User not authenticated. Please sign in with Google.');
        }

        const params = {
            spreadsheetId: sheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
        };

        const valueRangeBody = {
            values: rows,
        };

        const response = await gapi.client.sheets.spreadsheets.values.append(
            params,
            valueRangeBody
        );

        console.log('Successfully batch appended to sheet:', response.result);
        return response.result;
    } catch (error) {
        console.error('Error batch appending to sheet:', error);

        if (error.status === 403) {
            throw new Error('Permission denied. Please ensure the sheet is shared with your Google account.');
        } else if (error.status === 404) {
            throw new Error('Sheet not found. Please check the VITE_GOOGLE_SHEET_ID in .env');
        } else if (error.status === 429) {
            throw new Error('Quota exceeded. Please try again later.');
        }

        throw error;
    }
};

/**
 * Get data from a Google Sheet
 * @param {string} range - Sheet range (e.g., 'Sheet1!A1:Z100')
 * @param {string} sheetId - Optional sheet ID, defaults to env variable
 */
export const getSheetData = async (range = 'Sheet1!A:Z', sheetId = SHEET_ID) => {
    try {
        if (!sheetId || sheetId === 'your_sheet_id_here') {
            throw new Error('Google Sheet ID not configured. Please set VITE_GOOGLE_SHEET_ID in .env');
        }

        await initializeSheetsApi();

        const token = gapi.client.getToken();
        if (!token || !token.access_token) {
            throw new Error('User not authenticated. Please sign in with Google.');
        }

        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: range,
        });

        console.log('Successfully retrieved sheet data:', response.result);
        return response.result.values || [];
    } catch (error) {
        console.error('Error getting sheet data:', error);

        if (error.status === 403) {
            throw new Error('Permission denied. Please ensure the sheet is shared with your Google account.');
        } else if (error.status === 404) {
            throw new Error('Sheet not found. Please check the VITE_GOOGLE_SHEET_ID in .env');
        }

        throw error;
    }
};

/**
 * Create a new sheet (tab) in an existing spreadsheet
 * @param {string} sheetTitle - Title for the new sheet
 * @param {string} sheetId - Optional spreadsheet ID, defaults to env variable
 */
export const createSheet = async (sheetTitle, sheetId = SHEET_ID) => {
    try {
        if (!sheetId || sheetId === 'your_sheet_id_here') {
            throw new Error('Google Sheet ID not configured. Please set VITE_GOOGLE_SHEET_ID in .env');
        }

        await initializeSheetsApi();

        const token = gapi.client.getToken();
        if (!token || !token.access_token) {
            throw new Error('User not authenticated. Please sign in with Google.');
        }

        const request = {
            spreadsheetId: sheetId,
            resource: {
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title: sheetTitle,
                            },
                        },
                    },
                ],
            },
        };

        const response = await gapi.client.sheets.spreadsheets.batchUpdate(request);
        console.log('Successfully created sheet:', response.result);
        return response.result;
    } catch (error) {
        console.error('Error creating sheet:', error);
        throw error;
    }
};

/**
 * Helper function to format form data for Google Sheets
 * @param {Object} formData - Form data object
 * @returns {Array} Array of values in the correct order
 */
export const formatFormDataForSheet = (formData) => {
    const timestamp = new Date().toISOString();

    // Customize this based on your form structure
    return [
        timestamp,
        formData.name || '',
        formData.email || '',
        formData.phone || '',
        formData.address || '',
        formData.city || '',
        formData.state || '',
        formData.postalCode || '',
        formData.country || '',
        formData.productType || '',
        formData.quantity || '',
        formData.totalAmount || '',
        formData.additionalNotes || '',
    ];
};

/**
 * Generate a unique order ID
 * Format: ORD-YYYYMMDD-XXXXX (e.g., ORD-20260205-A3F2G)
 */
const generateOrderId = () => {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase(); // 5 char random
    return `ORD-${dateStr}-${randomStr}`;
};

/**
 * Validate order form data
 * @param {Object} orderData - Order form data
 * @returns {Object} { isValid: boolean, errors: Array }
 */
const validateOrderData = (orderData) => {
    const errors = [];

    // Required fields validation
    if (!orderData.fullName || orderData.fullName.trim().length < 2) {
        errors.push('Full name is required (minimum 2 characters)');
    }

    if (!orderData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email)) {
        errors.push('Valid email address is required');
    }

    if (!orderData.phone || !/^\+?[\d\s-()]{10,}$/.test(orderData.phone)) {
        errors.push('Valid phone number is required (minimum 10 digits)');
    }

    if (!orderData.streetAddress || orderData.streetAddress.trim().length < 5) {
        errors.push('Street address is required (minimum 5 characters)');
    }

    if (!orderData.city || orderData.city.trim().length < 2) {
        errors.push('City is required');
    }

    if (!orderData.state || orderData.state.trim().length < 2) {
        errors.push('State is required');
    }

    if (!orderData.zipCode || !/^[\d-]{5,10}$/.test(orderData.zipCode)) {
        errors.push('Valid ZIP code is required');
    }

    if (!orderData.country || orderData.country.trim().length < 2) {
        errors.push('Country is required');
    }

    if (!orderData.productType || orderData.productType.trim().length === 0) {
        errors.push('Product type is required');
    }

    if (!orderData.quantity || orderData.quantity < 1) {
        errors.push('Quantity must be at least 1');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Format order data for Google Sheets with all required columns
 * Column structure:
 * Timestamp | Order_ID | Order_Status | Product_Type | Full_Name | Email | Phone | 
 * Street_Address | City | State | ZIP_Code | Country | Quantity | 
 * Image_URL | Image_Filename | Custom_Message | Special_Instructions | Product_Details
 * 
 * @param {Object} orderData - Order form data
 * @returns {Array} Formatted array of values for spreadsheet row
 */
/**
 * Helper to sanitize object for Sheets (remove large strings)
 */
const sanitizeForSheet = (obj) => {
    return JSON.stringify(obj, (key, value) => {
        // Remove large base64 images to prevent hitting 50k char limit in Sheets
        if (typeof value === 'string' && value.length > 1000 && (value.startsWith('data:image') || key === 'preview' || key === 'image')) {
            return '[Image Too Large - Removed]';
        }
        return value;
    }, 2); // Add indentation for readability
};

const formatOrderForSheet = (orderData) => {
    const timestamp = new Date().toISOString();
    const orderId = orderData.orderId || generateOrderId();

    // Ensure we handle potential undefined values gracefully
    return [
        timestamp,                                    // 1. Order_Date
        orderId,                                      // 2. Order_ID
        orderData.orderStatus || 'Pending',          // 3. Order_Status
        orderData.fullName || '',                    // 4. Customer_Name
        orderData.email || '',                       // 5. Customer_Email
        orderData.phone || '',                       // 6. Customer_Phone
        orderData.companyName || '',                 // 7. Company_Name
        orderData.streetAddress || '',               // 8. Shipping_Address
        orderData.city || '',                        // 9. City
        orderData.state || '',                       // 10. State
        orderData.zipCode || '',                     // 11. ZIP_Code
        orderData.country || '',                     // 12. Country
        orderData.billingAddress || '',              // 13. Billing_Address
        orderData.productType || '',                 // 14. Product_Types
        orderData.quantity || 1,                     // 15. Total_Quantity
        orderData.totalAmount || 0,                  // 16. Total_Amount
        orderData.paymentMethod || '',               // 17. Payment_Method
        orderData.orderNotes || '',                  // 18. Order_Notes
        // Extract first image link being sent to product details (if any)
        (orderData.productDetails && Array.isArray(orderData.productDetails))
            ? ((orderData.productDetails.find(i => i.preview && !i.preview.startsWith('data:') && i.preview.startsWith('http'))?.preview)
                || (orderData.productDetails.find(i => i.image && !i.image.startsWith('data:') && i.image.startsWith('http'))?.image)
                || (orderData.productDetails.find(i => i.customization?.preview && !i.customization.preview.startsWith('data:') && i.customization.preview.startsWith('http'))?.customization.preview)
                || '')
            : '',                                    // 19. Image_Link
        orderData.productDetails ? sanitizeForSheet(orderData.productDetails) : '', // 20. Product_Details_JSON
    ];
};

/**
 * Submit order data to Google Sheets
 * Main function to handle order submissions with validation and error handling
 * 
 * @param {Object} orderData - Order form data object
 * @param {Object} options - Additional options
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @param {string} options.sheetRange - Optional custom sheet range (default: 'Orders!A:R')
 * @param {string} options.sheetId - Optional custom sheet ID
 * @returns {Promise<Object>} { success: boolean, orderId: string, message: string }
 */
export const submitOrderToSheet = async (orderData, options = {}) => {
    const {
        onSuccess,
        onError,
        // Default to Sheet1!A:Z to ensure compatibility with newly created sheets
        sheetRange = 'Sheet1!A:Z',
        sheetId,
    } = options;

    try {
        // Step 1: Validate data
        const validation = validateOrderData(orderData);
        if (!validation.isValid) {
            const errorMessage = `Validation failed:\n${validation.errors.join('\n')}`;
            console.error(errorMessage);

            if (onError) {
                onError(new Error(validation.errors[0])); // Pass first error
            }

            return {
                success: false,
                errors: validation.errors,
                message: validation.errors[0],
            };
        }

        // Step 2: Generate Order ID if not provided
        const orderId = orderData.orderId || generateOrderId();

        // Step 2.5: Process Images (Upload to Drive)
        // We clone the data to avoid mutating the original object in UI
        const processedOrderData = JSON.parse(JSON.stringify(orderData));
        processedOrderData.orderId = orderId;

        if (processedOrderData.productDetails && Array.isArray(processedOrderData.productDetails)) {
            const uploadPromises = processedOrderData.productDetails.map(async (item, index) => {
                // Check for preview image
                if (item.preview && typeof item.preview === 'string' && item.preview.startsWith('data:image')) {
                    try {
                        const filename = `${orderId}_item${index + 1}_preview.png`;
                        const driveLink = await uploadImageToDrive(item.preview, filename);
                        item.preview = driveLink; // Replace base64 with link
                    } catch (e) {
                        console.error("Failed to upload preview image:", e);
                        item.preview = "[Upload Failed]";
                    }
                }

                // Check for 'image' field (common in some custom objects)
                if (item.image && typeof item.image === 'string' && item.image.startsWith('data:image')) {
                    try {
                        const filename = `${orderId}_item${index + 1}_image.png`;
                        const driveLink = await uploadImageToDrive(item.image, filename);
                        item.image = driveLink;
                    } catch (e) {
                        console.error("Failed to upload image:", e);
                        item.image = "[Upload Failed]";
                    }
                }

                // Check for 'customization' object with 'preview' or uploads
                if (item.customization) {
                    if (item.customization.preview && item.customization.preview.startsWith('data:image')) {
                        try {
                            const filename = `${orderId}_item${index + 1}_custom_preview.png`;
                            const driveLink = await uploadImageToDrive(item.customization.preview, filename);
                            item.customization.preview = driveLink;
                        } catch (e) {
                            console.error("Failed to upload custom preview:", e);
                            item.customization.preview = "[Upload Failed]";
                        }
                    }
                }

                return item;
            });

            // Wait for all uploads to complete
            await Promise.all(uploadPromises);
        }

        const completeOrderData = { ...processedOrderData, orderId };

        // Step 3: Format data for sheet
        const formattedData = formatOrderForSheet(completeOrderData);

        // Step 4: Submit to Google Sheets
        const result = await appendToSheet(formattedData, sheetRange, sheetId);

        // Step 5: Success handling

        if (onSuccess) {
            onSuccess({
                orderId,
                result,
                message: `Order ${orderId} submitted successfully!`,
            });
        }

        return {
            success: true,
            orderId,
            result,
            message: `Order ${orderId} submitted successfully!`,
        };

    } catch (error) {
        // Step 6: Error handling
        console.error('Error submitting order to Google Sheets:', error);

        const safeErrorMessage = getErrorMessage(error);
        let userMessage = 'Failed to submit order. Please try again.';

        // Provide specific error messages
        if (safeErrorMessage.includes('not authenticated')) {
            userMessage = 'Please sign in with Google to submit your order.';
        } else if (safeErrorMessage.includes('Permission denied')) {
            userMessage = 'Permission denied. Please contact support.';
        } else if (safeErrorMessage.includes('not found')) {
            userMessage = 'Google Sheet not configured. Please contact support.';
        } else if (safeErrorMessage.includes('Quota exceeded')) {
            userMessage = 'Service temporarily unavailable. Please try again in a few minutes.';
        } else {
            userMessage = safeErrorMessage;
        }

        if (onError) {
            onError(new Error(safeErrorMessage));
        }

        return {
            success: false,
            error: safeErrorMessage,
            message: userMessage,
        };
    }
};

/**
 * Batch submit multiple orders to Google Sheets
 * Useful for processing multiple orders at once
 * 
 * @param {Array<Object>} orders - Array of order data objects
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} { success: boolean, submitted: number, failed: number, results: Array }
 */
export const submitBatchOrders = async (orders, options = {}) => {
    const { sheetRange = 'Sheet1!A:Z', sheetId } = options;

    const results = {
        success: true,
        submitted: 0,
        failed: 0,
        details: [],
    };

    try {
        // Validate all orders first
        const validOrders = [];
        for (const order of orders) {
            const validation = validateOrderData(order);
            if (validation.isValid) {
                const orderId = order.orderId || generateOrderId();
                validOrders.push({ ...order, orderId });
            } else {
                results.failed++;
                results.details.push({
                    order,
                    success: false,
                    errors: validation.errors,
                });
            }
        }

        if (validOrders.length === 0) {
            throw new Error('No valid orders to submit');
        }

        // Format all valid orders
        const formattedRows = validOrders.map(order => formatOrderForSheet(order));

        // Submit all at once
        await batchAppendToSheet(formattedRows, sheetRange, sheetId);

        // Update results
        results.submitted = validOrders.length;
        validOrders.forEach(order => {
            results.details.push({
                orderId: order.orderId,
                success: true,
            });
        });



        return results;

    } catch (error) {
        console.error('Error in batch order submission:', error);
        results.success = false;
        results.error = error.message;
        return results;
    }
};

// Helper to extract error message safely
const getErrorMessage = (error) => {
    if (!error) return 'Unknown error occurred';
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.result && error.result.error && error.result.error.message) return error.result.error.message;
    return JSON.stringify(error);
};

/**
 * Create a new spreadsheet with proper headers and formatting
 * @param {string} title - Title of the new spreadsheet
 * @returns {Promise<Object>} Object containing spreadsheetId and spreadsheetUrl
 */
export const createNewSpreadsheet = async (title) => {
    try {
        await initializeSheetsApi();

        const token = gapi.client.getToken();
        if (!token || !token.access_token) {
            throw new Error('User not authenticated. Please sign in with Google.');
        }

        // 1. Create the spreadsheet
        const createResponse = await gapi.client.sheets.spreadsheets.create({
            properties: {
                title: title,
            },
        });

        const spreadsheetId = createResponse.result.spreadsheetId;
        const spreadsheetUrl = createResponse.result.spreadsheetUrl;

        console.log('Created spreadsheet:', spreadsheetId);

        // 2. Add headers and formatting
        // Define headers based on our formatOrderForSheet function
        const headers = [
            'Order Date',           // 1. Order_Date
            'Order ID',             // 2. Order_ID
            'Order Status',         // 3. Order_Status
            'Customer Name',        // 4. Customer_Name
            'Customer Email',       // 5. Customer_Email
            'Customer Phone',       // 6. Customer_Phone
            'Company Name',         // 7. Company_Name
            'Shipping Address',     // 8. Shipping_Address
            'City',                 // 9. City
            'State',                // 10. State
            'ZIP Code',             // 11. ZIP_Code
            'Country',              // 12. Country
            'Billing Address',      // 13. Billing_Address
            'Product Types',        // 14. Product_Types
            'Total Quantity',       // 15. Total_Quantity
            'Total Amount',         // 16. Total_Amount
            'Payment Method',       // 17. Payment_Method
            'Order Notes',          // 18. Order_Notes
            'Image Link',           // 19. Image_Link (New easy access column)
            'Product Details JSON', // 20. Product_Details_JSON
        ];

        const batchUpdateRequest = {
            requests: [
                // Set Header Values
                {
                    updateCells: {
                        rows: [{
                            values: headers.map(header => ({
                                userEnteredValue: { stringValue: header },
                                userEnteredFormat: {
                                    textFormat: { bold: true },
                                    backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 }
                                }
                            }))
                        }],
                        fields: 'userEnteredValue,userEnteredFormat',
                        range: {
                            sheetId: 0, // Default first sheet
                            startRowIndex: 0,
                            endRowIndex: 1
                        }
                    }
                },
                // Freeze the first row
                {
                    updateSheetProperties: {
                        properties: {
                            sheetId: 0,
                            gridProperties: {
                                frozenRowCount: 1
                            }
                        },
                        fields: 'gridProperties.frozenRowCount'
                    }
                },
                // Auto-resize columns (optional, creates better view)
                {
                    autoResizeDimensions: {
                        dimensions: {
                            sheetId: 0,
                            dimension: 'COLUMNS',
                            startIndex: 0,
                            endIndex: headers.length
                        }
                    }
                }
            ]
        };

        await gapi.client.sheets.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheetId,
            resource: batchUpdateRequest
        });

        return { spreadsheetId, spreadsheetUrl };

    } catch (error) {
        console.error('Error creating spreadsheet:', error);
        throw new Error(getErrorMessage(error));
    }
};
