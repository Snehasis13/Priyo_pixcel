export const validateEmail = (email) => {
    // Regex for basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(email)) {
        return { valid: true, message: '' };
    }
    return { valid: false, message: 'Please enter a valid email address.' };
};

export const validatePassword = (password) => {
    // Check minimum 8 characters
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long.' };
    }
    // Check for uppercase
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    // Check for lowercase
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    // Check for number
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number.' };
    }

    return { valid: true, message: '' };
};

export const validateUsername = (username) => {
    // Check minimum 3 characters
    if (username.length < 3) {
        return { valid: false, message: 'Username must be at least 3 characters long.' };
    }
    // Check alphanumeric only (letters and numbers)
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(username)) {
        return { valid: false, message: 'Username must contain only letters and numbers.' };
    }

    return { valid: true, message: '' };
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (password === confirmPassword) {
        return { valid: true, message: '' };
    }
    return { valid: false, message: 'Passwords do not match.' };
};
