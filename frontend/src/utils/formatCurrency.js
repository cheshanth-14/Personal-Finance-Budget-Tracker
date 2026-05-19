// src/utils/formatCurrency.js
/**
 * Format a number as USD currency string
 * @param {number} amount
 * @returns {string} e.g. "$1,234.56"
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'Rs. 0.00';
  const formatted = new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `Rs. ${formatted}`;
};
