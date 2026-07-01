/**
 * Form Validation Module
 * Validates contact/booking form inputs.
 */

/**
 * Validates an email address format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email format is valid.
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}

/**
 * Validates a phone number (Uganda format or international).
 * Accepts formats: +256..., 0..., or international with +.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} True if the phone format is valid.
 */
function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  // Uganda: +256 followed by 9 digits, or 0 followed by 9 digits
  // International: + followed by 7-15 digits
  const pattern = /^(\+256\d{9}|0\d{9}|\+\d{7,15})$/;
  return pattern.test(cleaned);
}

/**
 * Validates that a required text field is not empty.
 * @param {string} value - The field value to check.
 * @returns {boolean} True if the value is non-empty after trimming.
 */
function validateRequired(value) {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
}

/**
 * Validates a name field (alphabetic, spaces, hyphens, apostrophes).
 * @param {string} name - The name to validate.
 * @returns {boolean} True if the name is valid.
 */
function validateName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 50) return false;
  const pattern = /^[a-zA-Z\s'\-]+$/;
  return pattern.test(trimmed);
}

/**
 * Validates the entire contact form data.
 * @param {object} formData - Object with form field values.
 * @param {string} formData.firstName - First name.
 * @param {string} formData.lastName - Last name.
 * @param {string} formData.phone - Phone number.
 * @param {string} formData.email - Email address.
 * @param {string} formData.service - Selected service type.
 * @returns {object} { valid: boolean, errors: string[] }
 */
function validateContactForm(formData) {
  const errors = [];

  if (!formData) {
    return { valid: false, errors: ['Form data is required'] };
  }

  if (!validateName(formData.firstName)) {
    errors.push('First name is required and must be 2-50 alphabetic characters');
  }

  if (!validateName(formData.lastName)) {
    errors.push('Last name is required and must be 2-50 alphabetic characters');
  }

  if (!validatePhone(formData.phone)) {
    errors.push('A valid phone number is required');
  }

  if (!validateEmail(formData.email)) {
    errors.push('A valid email address is required');
  }

  if (!validateRequired(formData.service)) {
    errors.push('Please select a service type');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateEmail,
  validatePhone,
  validateRequired,
  validateName,
  validateContactForm
};
