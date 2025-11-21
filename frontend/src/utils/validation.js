/**
 * @fileoverview Form validation utilities for Sticker & Magnet Lab
 * Contains validators, formatters, and reference data
 * @module utils/validation
 */

/**
 * Email validation regex pattern
 * @constant {RegExp}
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Phone validation regex pattern (US format)
 * @constant {RegExp}
 */
const PHONE_REGEX = /^[\d\s\-().+]{10,}$/;

/**
 * US ZIP code validation regex pattern
 * @constant {RegExp}
 */
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

/**
 * Validation result object type
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {string|null} error - Error message if invalid, null if valid
 */

/**
 * Validate email address format
 * @param {string} email - Email to validate
 * @returns {ValidationResult} Validation result
 * @example
 * validateEmail('test@example.com'); // { isValid: true, error: null }
 * validateEmail('invalid'); // { isValid: false, error: 'Please enter a valid email address' }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @param {boolean} [required=false] - Whether field is required
 * @returns {ValidationResult} Validation result
 * @example
 * validatePhone('555-123-4567'); // { isValid: true, error: null }
 */
export const validatePhone = (phone, required = false) => {
  if (!phone || phone.trim() === '') {
    if (required) {
      return {
        isValid: false,
        error: 'Phone number is required'
      };
    }
    return { isValid: true, error: null };
  }

  // Remove all non-digit characters for length check
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length < 10) {
    return {
      isValid: false,
      error: 'Phone number must be at least 10 digits'
    };
  }

  if (digitsOnly.length > 15) {
    return {
      isValid: false,
      error: 'Phone number is too long'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate US ZIP code format
 * @param {string} zip - ZIP code to validate
 * @returns {ValidationResult} Validation result
 * @example
 * validateZip('12345'); // { isValid: true, error: null }
 * validateZip('12345-6789'); // { isValid: true, error: null }
 */
export const validateZip = (zip) => {
  if (!zip || zip.trim() === '') {
    return {
      isValid: false,
      error: 'ZIP code is required'
    };
  }

  if (!ZIP_REGEX.test(zip.trim())) {
    return {
      isValid: false,
      error: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {ValidationResult} Validation result
 * @example
 * validateRequired('', 'Name'); // { isValid: false, error: 'Name is required' }
 */
export const validateRequired = (value, fieldName) => {
  if (value === null || value === undefined) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  if (Array.isArray(value) && value.length === 0) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @param {string} fieldName - Field name for error message
 * @returns {ValidationResult} Validation result
 * @example
 * validateMinLength('Hi', 3, 'Message'); // { isValid: false, error: 'Message must be at least 3 characters' }
 */
export const validateMinLength = (value, min, fieldName) => {
  if (!value || value.length < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min} characters`
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {ValidationResult} Validation result
 */
export const validateMaxLength = (value, max, fieldName) => {
  if (value && value.length > max) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${max} characters`
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @param {number} [options.maxSize] - Maximum file size in bytes
 * @param {string[]} [options.allowedTypes] - Array of allowed MIME types
 * @returns {ValidationResult} Validation result
 * @example
 * validateFile(file, { maxSize: 10 * 1024 * 1024, allowedTypes: ['image/png', 'image/jpeg'] });
 */
export const validateFile = (file, { maxSize, allowedTypes } = {}) => {
  if (!file) {
    return {
      isValid: false,
      error: 'Please select a file'
    };
  }

  if (maxSize && file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    };
  }

  if (allowedTypes && allowedTypes.length > 0) {
    if (!allowedTypes.includes(file.type)) {
      const extensions = allowedTypes.map(type => {
        const ext = type.split('/')[1];
        return ext === 'jpeg' ? 'jpg' : ext;
      }).join(', ');
      return {
        isValid: false,
        error: `Allowed file types: ${extensions}`
      };
    }
  }

  return { isValid: true, error: null };
};

/**
 * Validate name field (no numbers or special characters)
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error message
 * @returns {ValidationResult} Validation result
 */
export const validateName = (name, fieldName = 'Name') => {
  const required = validateRequired(name, fieldName);
  if (!required.isValid) return required;

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters`
    };
  }

  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name.trim())) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate address field
 * @param {string} address - Address to validate
 * @returns {ValidationResult} Validation result
 */
export const validateAddress = (address) => {
  const required = validateRequired(address, 'Address');
  if (!required.isValid) return required;

  if (address.trim().length < 5) {
    return {
      isValid: false,
      error: 'Please enter a valid address'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate city field
 * @param {string} city - City to validate
 * @returns {ValidationResult} Validation result
 */
export const validateCity = (city) => {
  const required = validateRequired(city, 'City');
  if (!required.isValid) return required;

  if (city.trim().length < 2) {
    return {
      isValid: false,
      error: 'Please enter a valid city'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate state selection
 * @param {string} state - State code to validate
 * @returns {ValidationResult} Validation result
 */
export const validateState = (state) => {
  const required = validateRequired(state, 'State');
  if (!required.isValid) return required;

  const validState = US_STATES.find(s => s.code === state);
  if (!validState) {
    return {
      isValid: false,
      error: 'Please select a valid state'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate credit card number (basic Luhn algorithm)
 * @param {string} cardNumber - Card number to validate
 * @returns {ValidationResult} Validation result
 */
export const validateCardNumber = (cardNumber) => {
  if (!cardNumber || !cardNumber.trim()) {
    return {
      isValid: false,
      error: 'Card number is required'
    };
  }

  const digitsOnly = cardNumber.replace(/\D/g, '');

  if (digitsOnly.length < 13 || digitsOnly.length > 19) {
    return {
      isValid: false,
      error: 'Please enter a valid card number'
    };
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return {
      isValid: false,
      error: 'Please enter a valid card number'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate card expiry date
 * @param {string} expiry - Expiry in MM/YY format
 * @returns {ValidationResult} Validation result
 */
export const validateExpiry = (expiry) => {
  if (!expiry || !expiry.trim()) {
    return {
      isValid: false,
      error: 'Expiry date is required'
    };
  }

  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiry)) {
    return {
      isValid: false,
      error: 'Please enter a valid expiry date (MM/YY)'
    };
  }

  const [month, year] = expiry.split('/');
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  const expYear = parseInt(year, 10);
  const expMonth = parseInt(month, 10);

  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return {
      isValid: false,
      error: 'Card has expired'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate CVC
 * @param {string} cvc - CVC to validate
 * @returns {ValidationResult} Validation result
 */
export const validateCVC = (cvc) => {
  if (!cvc || !cvc.trim()) {
    return {
      isValid: false,
      error: 'CVC is required'
    };
  }

  const digitsOnly = cvc.replace(/\D/g, '');

  if (digitsOnly.length < 3 || digitsOnly.length > 4) {
    return {
      isValid: false,
      error: 'Please enter a valid CVC'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Format phone number to (xxx) xxx-xxxx
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 * @example
 * formatPhone('5551234567'); // Returns '(555) 123-4567'
 */
export const formatPhone = (phone) => {
  if (!phone) return '';

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Handle different lengths
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // For longer numbers (international), include country code
  return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
};

/**
 * Format ZIP code
 * @param {string} zip - ZIP code to format
 * @returns {string} Formatted ZIP code
 * @example
 * formatZip('123456789'); // Returns '12345-6789'
 */
export const formatZip = (zip) => {
  if (!zip) return '';

  // Remove all non-digit characters
  const digits = zip.replace(/\D/g, '');

  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
};

/**
 * Format credit card number with spaces
 * @param {string} cardNumber - Raw card number
 * @returns {string} Formatted card number
 */
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '';

  const digitsOnly = cardNumber.replace(/\D/g, '');
  const groups = digitsOnly.match(/.{1,4}/g);

  return groups ? groups.join(' ').slice(0, 19) : '';
};

/**
 * Format expiry date as MM/YY
 * @param {string} expiry - Raw expiry input
 * @returns {string} Formatted expiry
 */
export const formatExpiry = (expiry) => {
  if (!expiry) return '';

  const digitsOnly = expiry.replace(/\D/g, '');

  if (digitsOnly.length <= 2) {
    return digitsOnly;
  }

  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
};

/**
 * US States list
 * @constant {Object[]}
 */
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

/**
 * Contact form subject options
 * @constant {Object[]}
 */
export const SUBJECT_OPTIONS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'order', label: 'Order Question' },
  { value: 'custom', label: 'Custom Request' },
  { value: 'support', label: 'Technical Support' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'partnership', label: 'Partnership Inquiry' }
];

/**
 * Run multiple validators and return combined result
 * @param {Function[]} validators - Array of validator functions that return ValidationResult
 * @returns {ValidationResult} Combined validation result
 * @example
 * runValidators([
 *   () => validateRequired(value, 'Email'),
 *   () => validateEmail(value)
 * ]);
 */
export const runValidators = (validators) => {
  for (const validator of validators) {
    const result = validator();
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true, error: null };
};

/**
 * Validate entire form object
 * @param {Object} values - Form values
 * @param {Object} schema - Validation schema
 * @returns {Object} Object with field names as keys and error messages as values
 * @example
 * validateForm(
 *   { email: '', name: 'John' },
 *   { email: (v) => validateEmail(v), name: (v) => validateRequired(v, 'Name') }
 * );
 */
export const validateForm = (values, schema) => {
  const errors = {};

  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(values[field]);
    if (!result.isValid) {
      errors[field] = result.error;
    }
  }

  return errors;
};

/**
 * Check if form has any errors
 * @param {Object} errors - Errors object from validateForm
 * @returns {boolean} True if form has errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Create a validation schema runner (legacy support)
 * @param {Object} schema - Validation schema
 * @returns {Function} Validator function
 */
export const createValidator = (schema) => {
  return (values) => {
    const errors = {};

    Object.keys(schema).forEach((field) => {
      const validators = schema[field];

      for (const validate of validators) {
        const result = validate(values[field], values);
        if (result !== true && result.isValid !== true) {
          errors[field] = typeof result === 'string' ? result : result.error;
          break;
        }
      }
    });

    return errors;
  };
};

export default {
  validateEmail,
  validatePhone,
  validateZip,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateFile,
  validateName,
  validateAddress,
  validateCity,
  validateState,
  validateCardNumber,
  validateExpiry,
  validateCVC,
  formatPhone,
  formatZip,
  formatCardNumber,
  formatExpiry,
  US_STATES,
  SUBJECT_OPTIONS,
  runValidators,
  validateForm,
  hasErrors,
  createValidator
};
