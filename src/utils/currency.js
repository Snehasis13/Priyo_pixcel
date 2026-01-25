/**
 * Formats a number as Indian Rupee (INR) currency.
 * @param {number} amount - The amount to format.
 * @returns {string} - The formatted currency string.
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0, // Usually rounded for retail prices
    }).format(amount);
};
