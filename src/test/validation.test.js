/**
 * Validation Function Tests
 * Unit tests for all validation utilities
 */

import {
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
    sanitizeInput,
} from '../../utils/validation';

describe('Email Validation', () => {
    test('should accept valid email addresses', () => {
        const validEmails = [
            'test@example.com',
            'user.name@domain.co.in',
            'john+doe@gmail.com',
            'admin@company-name.org',
        ];

        validEmails.forEach((email) => {
            const result = validateEmail(email);
            expect(result.isValid).toBe(true);
            expect(result.error).toBeNull();
        });
    });

    test('should reject invalid email addresses', () => {
        const invalidEmails = [
            '',
            'invalid',
            'invalid@',
            '@invalid.com',
            'invalid@domain',
            'invalid domain@test.com',
        ];

        invalidEmails.forEach((email) => {
            const result = validateEmail(email);
            expect(result.isValid).toBe(false);
            expect(result.error).toBeTruthy();
        });
    });

    test('should detect common email typos', () => {
        const result = validateEmail('test@gmial.com');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('gmail.com');
    });

    test('should reject emails that are too long', () => {
        const longEmail = 'a'.repeat(250) + '@example.com';
        const result = validateEmail(longEmail);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('too long');
    });
});

describe('Phone Validation', () => {
    test('should accept valid phone numbers', () => {
        const validPhones = [
            '+91 9876543210',
            '9876543210',
            '+1 (555) 123-4567',
            '+44 20 1234 5678',
        ];

        validPhones.forEach((phone) => {
            const result = validatePhone(phone);
            expect(result.isValid).toBe(true);
            expect(result.error).toBeNull();
        });
    });

    test('should reject phone numbers that are too short', () => {
        const result = validatePhone('123');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('at least 10 digits');
    });

    test('should validate Indian mobile numbers', () => {
        const validIndian = '+91 9876543210';
        const invalidIndian = '+91 1234567890'; // Doesn't start with 6, 7, 8, or 9

        expect(validatePhone(validIndian).isValid).toBe(true);
        expect(validatePhone(invalidIndian).isValid).toBe(false);
    });

    test('should reject phone numbers with invalid characters', () => {
        const result = validatePhone('phone123abc');
        expect(result.isValid).toBe(false);
    });
});

describe('Name Validation', () => {
    test('should accept valid names', () => {
        const validNames = [
            'John Doe',
            'Mary-Jane Smith',
            "O'Connor",
            'José García',
        ];

        validNames.forEach((name) => {
            const result = validateName(name);
            expect(result.isValid).toBe(true);
            expect(result.error).toBeNull();
        });
    });

    test('should reject names that are too short', () => {
        const result = validateName('A');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('at least 2 characters');
    });

    test('should reject names with numbers', () => {
        const result = validateName('John123');
        expect(result.isValid).toBe(false);
    });

    test('should reject names with consecutive spaces', () => {
        const result = validateName('John  Doe');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('consecutive spaces');
    });

    test('should trim whitespace', () => {
        const result = validateName('  John Doe  ');
        expect(result.isValid).toBe(true);
    });
});

describe('Address Validation', () => {
    test('should accept valid addresses', () => {
        const validAddresses = [
            '123 Main Street, Apt 4B',
            'Building #5, Sector 42',
            'Plot No. 123, Street Name',
        ];

        validAddresses.forEach((address) => {
            const result = validateAddress(address);
            expect(result.isValid).toBe(true);
            expect(result.error).toBeNull();
        });
    });

    test('should reject addresses that are too short', () => {
        const result = validateAddress('ABC');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('at least 5 characters');
    });

    test('should reject empty addresses', () => {
        const result = validateAddress('');
        expect(result.isValid).toBe(false);
    });
});

describe('ZIP Code Validation', () => {
    test('should validate Indian PIN codes', () => {
        const validPIN = '400001';
        const invalidPIN = '12345'; // Should be 6 digits for India

        expect(validateZipCode(validPIN, 'India').isValid).toBe(true);
        expect(validateZipCode(invalidPIN, 'India').isValid).toBe(false);
    });

    test('should accept general ZIP codes', () => {
        const validZIPs = ['12345', 'SW1A 1AA', 'K1A 0B1'];

        validZIPs.forEach((zip) => {
            const result = validateZipCode(zip, 'USA');
            expect(result.isValid).toBe(true);
        });
    });
});

describe('Quantity Validation', () => {
    test('should accept valid quantities', () => {
        const validQuantities = [1, 5, 50, 100];

        validQuantities.forEach((qty) => {
            const result = validateQuantity(qty);
            expect(result.isValid).toBe(true);
            expect(result.error).toBeNull();
        });
    });

    test('should reject quantities below minimum', () => {
        const result = validateQuantity(0);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('at least 1');
    });

    test('should reject quantities above maximum', () => {
        const result = validateQuantity(150);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('cannot exceed 100');
    });

    test('should reject non-numeric quantities', () => {
        const result = validateQuantity('abc');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('must be a number');
    });
});

describe('Message Validation', () => {
    test('should accept valid messages', () => {
        const result = validateMessage('Happy Anniversary!');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
    });

    test('should reject messages that are too long', () => {
        const longMessage = 'a'.repeat(600);
        const result = validateMessage(longMessage);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('must not exceed 500 characters');
    });

    test('should allow empty messages when not required', () => {
        const result = validateMessage('', { required: false });
        expect(result.isValid).toBe(true);
    });

    test('should reject empty messages when required', () => {
        const result = validateMessage('', { required: true });
        expect(result.isValid).toBe(false);
    });
});

describe('File Validation', () => {
    test('should accept valid image files', () => {
        const mockFile = {
            size: 1024 * 1024, // 1MB
            type: 'image/jpeg',
        };

        const result = validateFile(mockFile);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
    });

    test('should reject files that are too large', () => {
        const mockFile = {
            size: 10 * 1024 * 1024, // 10MB
            type: 'image/jpeg',
        };

        const result = validateFile(mockFile);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('must not exceed');
    });

    test('should reject files with invalid types', () => {
        const mockFile = {
            size: 1024 * 1024,
            type: 'application/pdf',
        };

        const result = validateFile(mockFile);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Only');
    });
});

describe('Input Sanitization', () => {
    test('should remove HTML tags', () => {
        const input = '<script>alert("xss")</script>Hello';
        const result = sanitizeInput(input);
        expect(result).toBe('Hello');
        expect(result).not.toContain('<script>');
    });

    test('should trim whitespace', () => {
        const input = '  Hello World  ';
        const result = sanitizeInput(input);
        expect(result).toBe('Hello World');
    });

    test('should handle non-string inputs', () => {
        expect(sanitizeInput(123)).toBe(123);
        expect(sanitizeInput(null)).toBe(null);
    });
});
