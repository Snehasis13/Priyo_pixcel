/**
 * Comprehensive Validation Utilities
 * Reusable validation functions for all forms
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} { isValid, error }
 */
export const validateEmail = (email) => {
    if (!email || email.trim() === '') {
        return { isValid: false, error: 'Email is required' };
    }

    if (email.length > 254) {
        return { isValid: false, error: 'Email is too long' };
    }

    // RFC 5322 compliant email regex (simplified)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    // Check for common typos
    const domain = email.split('@')[1];
    const typos = {
        'gmial.com': 'gmail.com',
        'gmai.com': 'gmail.com',
        'yahooo.com': 'yahoo.com',
        'hotmial.com': 'hotmail.com',
    };

    if (typos[domain]) {
        return {
            isValid: false,
            error: `Did you mean ${email.replace(domain, typos[domain])}?`,
        };
    }

    return { isValid: true, error: null };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} { isValid, error }
 */
export const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') {
        return { isValid: false, error: 'Phone number is required' };
    }

    // Remove all non-digit characters for counting
    const digitsOnly = phone.replace(/\D/g, '');

    if (digitsOnly.length < 10) {
        return { isValid: false, error: 'Phone number must be at least 10 digits' };
    }

    if (digitsOnly.length > 15) {
        return { isValid: false, error: 'Phone number is too long' };
    }

    // Indian mobile number specific validation (if starts with +91 or 91)
    if (phone.startsWith('+91') || phone.startsWith('91')) {
        const indianDigits = digitsOnly.replace(/^91/, '');
        if (indianDigits.length !== 10) {
            return { isValid: false, error: 'Indian mobile number must be 10 digits' };
        }
        if (!['6', '7', '8', '9'].includes(indianDigits[0])) {
            return { isValid: false, error: 'Indian mobile number must start with 6, 7, 8, or 9' };
        }
    }

    // General format check (allows international format)
    const phoneRegex = /^[\d\s\-+()]+$/;
    if (!phoneRegex.test(phone)) {
        return { isValid: false, error: 'Phone number contains invalid characters' };
    }

    return { isValid: true, error: null };
};

/**
 * Validate name (full name or any name field)
 * @param {string} name - Name to validate
 * @param {Object} options - Validation options
 * @returns {Object} { isValid, error }
 */
export const validateName = (name, options = {}) => {
    const { minLength = 2, maxLength = 100, fieldName = 'Name' } = options;

    if (!name || name.trim() === '') {
        return { isValid: false, error: `${fieldName} is required` };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < minLength) {
        return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
    }

    if (trimmedName.length > maxLength) {
        return { isValid: false, error: `${fieldName} must not exceed ${maxLength} characters` };
    }

    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(trimmedName)) {
        return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
    }

    // Check for consecutive spaces
    if (/\s{2,}/.test(trimmedName)) {
        return { isValid: false, error: `${fieldName} cannot contain consecutive spaces` };
    }

    return { isValid: true, error: null };
};

/**
 * Validate address field
 * @param {string} address - Address to validate
 * @param {Object} options - Validation options
 * @returns {Object} { isValid, error }
 */
export const validateAddress = (address, options = {}) => {
    const { minLength = 5, maxLength = 200, fieldName = 'Address' } = options;

    if (!address || address.trim() === '') {
        return { isValid: false, error: `${fieldName} is required` };
    }

    const trimmedAddress = address.trim();

    if (trimmedAddress.length < minLength) {
        return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
    }

    if (trimmedAddress.length > maxLength) {
        return { isValid: false, error: `${fieldName} must not exceed ${maxLength} characters` };
    }

    return { isValid: true, error: null };
};

/**
 * Validate city name
 * @param {string} city - City name to validate
 * @returns {Object} { isValid, error }
 */
export const validateCity = (city) => {
    return validateName(city, { minLength: 2, maxLength: 100, fieldName: 'City' });
};

/**
 * Validate state name
 * @param {string} state - State name to validate
 * @returns {Object} { isValid, error }
 */
export const validateState = (state) => {
    return validateName(state, { minLength: 2, maxLength: 100, fieldName: 'State' });
};

/**
 * Validate postal/ZIP code
 * @param {string} zipCode - ZIP code to validate
 * @param {string} country - Country (for country-specific validation)
 * @returns {Object} { isValid, error }
 */
export const validateZipCode = (zipCode, country = 'India') => {
    if (!zipCode || zipCode.trim() === '') {
        return { isValid: false, error: 'ZIP code is required' };
    }

    const trimmedZip = zipCode.trim();

    // India-specific validation (6 digits)
    if (country === 'India') {
        const indiaZipRegex = /^\d{6}$/;
        if (!indiaZipRegex.test(trimmedZip)) {
            return { isValid: false, error: 'Indian PIN code must be 6 digits' };
        }
        return { isValid: true, error: null };
    }

    // General validation (5-10 alphanumeric characters)
    const zipRegex = /^[a-zA-Z0-9\s-]{5,10}$/;
    if (!zipRegex.test(trimmedZip)) {
        return { isValid: false, error: 'ZIP code must be 5-10 characters' };
    }

    return { isValid: true, error: null };
};

/**
 * Validate country
 * @param {string} country - Country to validate
 * @returns {Object} { isValid, error }
 */
export const validateCountry = (country) => {
    if (!country || country.trim() === '') {
        return { isValid: false, error: 'Country is required' };
    }

    return { isValid: true, error: null };
};

/**
 * Validate quantity
 * @param {number|string} quantity - Quantity to validate
 * @param {Object} options - Validation options
 * @returns {Object} { isValid, error }
 */
export const validateQuantity = (quantity, options = {}) => {
    const { min = 1, max = 100 } = options;

    const qty = parseInt(quantity, 10);

    if (isNaN(qty)) {
        return { isValid: false, error: 'Quantity must be a number' };
    }

    if (qty < min) {
        return { isValid: false, error: `Quantity must be at least ${min}` };
    }

    if (qty > max) {
        return { isValid: false, error: `Quantity cannot exceed ${max}` };
    }

    return { isValid: true, error: null };
};

/**
 * Validate custom message
 * @param {string} message - Message to validate
 * @param {Object} options - Validation options
 * @returns {Object} { isValid, error }
 */
export const validateMessage = (message, options = {}) => {
    const { maxLength = 500, required = false } = options;

    if (required && (!message || message.trim() === '')) {
        return { isValid: false, error: 'Message is required' };
    }

    if (message && message.length > maxLength) {
        return { isValid: false, error: `Message must not exceed ${maxLength} characters` };
    }

    return { isValid: true, error: null };
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} { isValid, error }
 */
export const validateFile = (file, options = {}) => {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
        required = false,
    } = options;

    if (required && !file) {
        return { isValid: false, error: 'File is required' };
    }

    if (!file) {
        return { isValid: true, error: null };
    }

    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        return { isValid: false, error: `File size must not exceed ${maxSizeMB}MB` };
    }

    if (!allowedTypes.includes(file.type)) {
        const allowedExtensions = allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ');
        return { isValid: false, error: `Only ${allowedExtensions} files are allowed` };
    }

    return { isValid: true, error: null };
};

/**
 * Validate form data object
 * @param {Object} formData - Form data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} { isValid, errors }
 */
export const validateForm = (formData, schema) => {
    const errors = {};
    let isValid = true;

    for (const [field, rules] of Object.entries(schema)) {
        const value = formData[field];
        const validator = rules.validator || validateField;
        const result = validator(value, rules.options || {});

        if (!result.isValid) {
            errors[field] = result.error;
            isValid = false;
        }
    }

    return { isValid, errors };
};

/**
 * Generic field validator (used internally)
 * @param {any} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {Object} { isValid, error }
 */
const validateField = (value, options = {}) => {
    const { required = false, fieldName = 'Field' } = options;

    if (required && (!value || value.toString().trim() === '')) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    return { isValid: true, error: null };
};

/**
 * Real-time validation helper (debounced)
 * @param {Function} validator - Validation function
 * @param {number} delay - Debounce delay in ms
 * @returns {Function} Debounced validation function
 */
export const createDebouncedValidator = (validator, delay = 300) => {
    let timeoutId;

    return (value, options, callback) => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            const result = validator(value, options);
            if (callback) callback(result);
        }, delay);
    };
};

/**
 * Sanitize input (remove potentially dangerous characters)
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    // Remove HTML tags
    let sanitized = input.replace(/<[^>]*>/g, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    return sanitized;
};

export default {
    validateEmail,
    validatePhone,
    validateName,
    validateAddress,
    validateCity,
    validateState,
    validateZipCode,
    validateCountry,
    validateQuantity,
    validateMessage,
    validateFile,
    validateForm,
    createDebouncedValidator,
    sanitizeInput,
};
