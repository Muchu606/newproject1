const {
  validateEmail,
  validatePhone,
  validateRequired,
  validateName,
  validateContactForm
} = require('../src/formValidation');

describe('Form Validation Module', () => {
  describe('validateEmail', () => {
    test('accepts valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('name.surname@domain.co.ug')).toBe(true);
      expect(validateEmail('test+label@gmail.com')).toBe(true);
      expect(validateEmail('info@palcleanersandjanitors.com')).toBe(true);
    });

    test('rejects invalid email addresses', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('notanemail')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@.com')).toBe(false);
      expect(validateEmail('user @domain.com')).toBe(false);
    });

    test('rejects null and undefined', () => {
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });

    test('rejects non-string input', () => {
      expect(validateEmail(123)).toBe(false);
      expect(validateEmail({})).toBe(false);
      expect(validateEmail([])).toBe(false);
    });

    test('trims whitespace before validation', () => {
      expect(validateEmail('  user@example.com  ')).toBe(true);
    });
  });

  describe('validatePhone', () => {
    test('accepts valid Uganda phone numbers', () => {
      expect(validatePhone('+256706944589')).toBe(true);
      expect(validatePhone('+256 706 944 589')).toBe(true);
      expect(validatePhone('0706944589')).toBe(true);
    });

    test('accepts international phone numbers', () => {
      expect(validatePhone('+1234567890')).toBe(true);
      expect(validatePhone('+44 20 7946 0958')).toBe(true);
    });

    test('rejects invalid phone numbers', () => {
      expect(validatePhone('')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('+1')).toBe(false);
    });

    test('rejects null and undefined', () => {
      expect(validatePhone(null)).toBe(false);
      expect(validatePhone(undefined)).toBe(false);
    });

    test('rejects non-string input', () => {
      expect(validatePhone(256706944589)).toBe(false);
    });

    test('handles phone with dashes and parentheses', () => {
      expect(validatePhone('+256-706-944-589')).toBe(true);
      expect(validatePhone('(0)706944589')).toBe(true);
    });
  });

  describe('validateRequired', () => {
    test('returns true for non-empty strings', () => {
      expect(validateRequired('hello')).toBe(true);
      expect(validateRequired('a')).toBe(true);
      expect(validateRequired('Weekly Services')).toBe(true);
    });

    test('returns false for empty or whitespace-only strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired('\t\n')).toBe(false);
    });

    test('returns false for null and undefined', () => {
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });

    test('converts non-string values to string', () => {
      expect(validateRequired(0)).toBe(true);
      expect(validateRequired(false)).toBe(true);
    });
  });

  describe('validateName', () => {
    test('accepts valid names', () => {
      expect(validateName('John')).toBe(true);
      expect(validateName('Mary Jane')).toBe(true);
      expect(validateName("O'Connor")).toBe(true);
      expect(validateName('Smith-Jones')).toBe(true);
    });

    test('rejects names that are too short', () => {
      expect(validateName('J')).toBe(false);
      expect(validateName('')).toBe(false);
    });

    test('rejects names that are too long', () => {
      const longName = 'A'.repeat(51);
      expect(validateName(longName)).toBe(false);
    });

    test('rejects names with invalid characters', () => {
      expect(validateName('John123')).toBe(false);
      expect(validateName('Name@!')).toBe(false);
      expect(validateName('test<script>')).toBe(false);
    });

    test('rejects null and undefined', () => {
      expect(validateName(null)).toBe(false);
      expect(validateName(undefined)).toBe(false);
    });

    test('rejects non-string input', () => {
      expect(validateName(42)).toBe(false);
      expect(validateName({})).toBe(false);
    });

    test('accepts names at boundary lengths', () => {
      expect(validateName('Jo')).toBe(true); // min valid (2 chars)
      expect(validateName('A'.repeat(50))).toBe(true); // max valid (50 chars)
    });
  });

  describe('validateContactForm', () => {
    const validForm = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+256706944589',
      email: 'john@example.com',
      service: 'Weekly Services'
    };

    test('accepts a fully valid form', () => {
      const result = validateContactForm(validForm);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('rejects form with invalid first name', () => {
      const result = validateContactForm({ ...validForm, firstName: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('First name is required and must be 2-50 alphabetic characters');
    });

    test('rejects form with invalid last name', () => {
      const result = validateContactForm({ ...validForm, lastName: '1' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Last name is required and must be 2-50 alphabetic characters');
    });

    test('rejects form with invalid phone', () => {
      const result = validateContactForm({ ...validForm, phone: 'abc' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('A valid phone number is required');
    });

    test('rejects form with invalid email', () => {
      const result = validateContactForm({ ...validForm, email: 'notvalid' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('A valid email address is required');
    });

    test('rejects form with missing service selection', () => {
      const result = validateContactForm({ ...validForm, service: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Please select a service type');
    });

    test('collects all errors for a completely invalid form', () => {
      const result = validateContactForm({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        service: ''
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(5);
    });

    test('returns error for null form data', () => {
      const result = validateContactForm(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Form data is required');
    });

    test('returns error for undefined form data', () => {
      const result = validateContactForm(undefined);
      expect(result.valid).toBe(false);
    });
  });
});
