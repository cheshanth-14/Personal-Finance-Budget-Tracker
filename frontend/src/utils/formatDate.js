// src/utils/formatDate.js
/**
 * Format a date string or Date object to a readable form
 * @param {string|Date} date
 * @returns {string} e.g. "May 11, 2026"
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Format date as YYYY-MM-DD for input[type=date]
 */
export const formatDateInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
