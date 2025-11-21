/**
 * @fileoverview Form state management hook for Sticker & Magnet Lab
 * Handles form values, validation, and submission
 * @module hooks/useForm
 */

import { useState, useCallback, useMemo, useRef } from 'react';

/**
 * Validation schema function type
 * @typedef {function(any, Object): {isValid: boolean, error: string|null}|boolean|string} ValidatorFn
 */

/**
 * Form state hook options
 * @typedef {Object} UseFormOptions
 * @property {boolean} [validateOnChange=false] - Validate on every change
 * @property {boolean} [validateOnBlur=true] - Validate on blur
 * @property {function} [onSubmit] - Submit handler
 */

/**
 * Hook for form state management
 * @param {Object} initialValues - Initial form values
 * @param {Object|Function} [validationSchema={}] - Validation schema (field: validatorFn) or validate function
 * @param {UseFormOptions|Function} [optionsOrOnSubmit={}] - Form options or submit handler for legacy API
 * @returns {Object} Form state and handlers
 * @example
 * // New API with schema object
 * const { values, errors, handleChange, handleSubmit } = useForm(
 *   { email: '', password: '' },
 *   {
 *     email: (value) => validateEmail(value),
 *     password: (value) => validateRequired(value, 'Password')
 *   }
 * );
 *
 * // Legacy API with validate function
 * const { values, errors, handleSubmit } = useForm(
 *   { email: '' },
 *   (values) => ({ email: values.email ? undefined : 'Required' }),
 *   async (values) => await submitForm(values)
 * );
 */
const useForm = (initialValues = {}, validationSchema = {}, optionsOrOnSubmit = {}) => {
  // Handle legacy API where third param is onSubmit function
  const isLegacyApi = typeof optionsOrOnSubmit === 'function';
  const options = isLegacyApi ? { onSubmit: optionsOrOnSubmit } : optionsOrOnSubmit;

  const {
    validateOnChange = false,
    validateOnBlur = true,
    onSubmit
  } = options;

  // Determine if validationSchema is a function (legacy) or object (new)
  const isSchemaFunction = typeof validationSchema === 'function';

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const initialValuesRef = useRef(initialValues);

  /**
   * Validate a single field
   * @param {string} fieldName - Field name to validate
   * @param {any} value - Field value
   * @param {Object} [allValues] - All form values
   * @returns {string|null} Error message or null
   */
  const validateField = useCallback((fieldName, value, allValues = values) => {
    if (isSchemaFunction) {
      // For function schemas, run full validation and extract field error
      const allErrors = validationSchema(allValues);
      return allErrors[fieldName] || null;
    }

    const validator = validationSchema[fieldName];
    if (!validator) return null;

    const result = validator(value, allValues);

    // Handle different return types
    if (result === true || result === null || result === undefined) {
      return null;
    }

    if (typeof result === 'string') {
      return result;
    }

    if (typeof result === 'object' && result !== null) {
      return result.isValid ? null : result.error;
    }

    return null;
  }, [validationSchema, values, isSchemaFunction]);

  /**
   * Validate entire form
   * @returns {Object} Errors object
   */
  const validateForm = useCallback(() => {
    let newErrors = {};

    if (isSchemaFunction) {
      // For function schemas, call directly
      newErrors = validationSchema(values) || {};
    } else {
      // For object schemas, validate each field
      Object.keys(validationSchema).forEach((fieldName) => {
        const error = validateField(fieldName, values[fieldName], values);
        if (error) {
          newErrors[fieldName] = error;
        }
      });
    }

    setErrors(newErrors);
    return newErrors;
  }, [validationSchema, values, validateField, isSchemaFunction]);

  // Compute errors based on current values (for legacy API compatibility)
  const computedErrors = useMemo(() => {
    if (isSchemaFunction) {
      return validationSchema(values) || {};
    }
    return errors;
  }, [values, validationSchema, errors, isSchemaFunction]);

  /**
   * Handle input change
   * @param {Event|Object} eventOrField - Event or { name, value } object
   */
  const handleChange = useCallback((eventOrField) => {
    let fieldName, value;

    if (eventOrField?.target) {
      // Standard event
      const { name, value: targetValue, type, checked } = eventOrField.target;
      fieldName = name;
      value = type === 'checkbox' ? checked : targetValue;
    } else if (typeof eventOrField === 'object' && eventOrField !== null) {
      // Direct { name, value } object
      fieldName = eventOrField.name;
      value = eventOrField.value;
    } else {
      return;
    }

    setValues(prev => ({ ...prev, [fieldName]: value }));

    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }

    // Validate on change if enabled
    if (validateOnChange) {
      const newValues = { ...values, [fieldName]: value };
      const error = validateField(fieldName, value, newValues);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    } else if (!isSchemaFunction) {
      // Clear error when user starts typing (if previously shown)
      if (errors[fieldName]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  }, [validateOnChange, validateField, errors, values, submitError, isSchemaFunction]);

  /**
   * Handle input blur
   * @param {Event} event - Blur event
   */
  const handleBlur = useCallback((event) => {
    const { name } = event.target;

    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate on blur if enabled
    if (validateOnBlur) {
      const error = validateField(name, values[name], values);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [validateOnBlur, validateField, values]);

  /**
   * Set a specific field value
   * @param {string} fieldName - Field name
   * @param {any} value - Field value
   */
  const setFieldValue = useCallback((fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
  }, []);

  /**
   * Set a specific field as touched
   * @param {string} fieldName - Field name
   * @param {boolean} [isTouched=true] - Touched state
   */
  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched(prev => ({ ...prev, [fieldName]: isTouched }));
  }, []);

  /**
   * Set a specific field error
   * @param {string} fieldName - Field name
   * @param {string|null} error - Error message or null to clear
   */
  const setFieldError = useCallback((fieldName, error) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, []);

  /**
   * Set multiple field values at once
   * @param {Object} newValues - Object with field values
   */
  const setFieldValues = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Alias for setFieldValues
  const setMultipleValues = setFieldValues;

  /**
   * Mark all fields as touched
   */
  const touchAll = useCallback(() => {
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
  }, [values]);

  /**
   * Reset form to initial values
   * @param {Object} [newInitialValues] - Optional new initial values
   */
  const reset = useCallback((newInitialValues) => {
    const valuesToUse = newInitialValues || initialValuesRef.current;
    if (newInitialValues) {
      initialValuesRef.current = newInitialValues;
    }
    setValues(valuesToUse);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
    setSubmitCount(0);
  }, []);

  /**
   * Handle form submission
   * @param {Event} [event] - Submit event
   * @returns {Promise<Object>} Submission result
   */
  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }

    setSubmitCount(prev => prev + 1);

    // Mark all fields as touched
    touchAll();

    // Validate form
    const formErrors = validateForm();
    const hasErrors = Object.keys(formErrors).length > 0;

    if (hasErrors) {
      return { success: false, errors: formErrors };
    }

    // Submit form
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (onSubmit) {
      try {
        const result = await onSubmit(values);
        setSubmitSuccess(true);
        return { success: true, values, data: result };
      } catch (error) {
        const errorMessage = error.message || 'An error occurred';
        setSubmitError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    }

    setIsSubmitting(false);
    return { success: true, values };
  }, [touchAll, validateForm, onSubmit, values]);

  /**
   * Get error for a specific field (only if touched)
   * @param {string} fieldName - Field name
   * @returns {string|undefined} Error message
   */
  const getFieldError = useCallback((fieldName) => {
    const fieldErrors = isSchemaFunction ? computedErrors : errors;
    return touched[fieldName] ? fieldErrors[fieldName] : undefined;
  }, [touched, errors, computedErrors, isSchemaFunction]);

  /**
   * Check if a specific field has an error (and is touched)
   * @param {string} fieldName - Field name
   * @returns {boolean} Has error
   */
  const hasFieldError = useCallback((fieldName) => {
    const fieldErrors = isSchemaFunction ? computedErrors : errors;
    return touched[fieldName] && !!fieldErrors[fieldName];
  }, [touched, errors, computedErrors, isSchemaFunction]);

  /**
   * Check if form is valid (no errors)
   */
  const isValid = useMemo(() => {
    const currentErrors = isSchemaFunction ? computedErrors : errors;
    return Object.keys(currentErrors).every(key => !currentErrors[key]);
  }, [errors, computedErrors, isSchemaFunction]);

  /**
   * Check if form has been modified
   */
  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
  }, [values]);

  /**
   * Get field props for easy binding
   * @param {string} fieldName - Field name
   * @returns {Object} Props to spread on input
   */
  const getFieldProps = useCallback((fieldName) => {
    return {
      name: fieldName,
      value: values[fieldName] || '',
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-invalid': hasFieldError(fieldName),
      'aria-describedby': hasFieldError(fieldName) ? `${fieldName}-error` : undefined
    };
  }, [values, handleChange, handleBlur, hasFieldError]);

  /**
   * Get props for form element
   * @returns {Object} Props to spread on form
   */
  const getFormProps = useCallback(() => ({
    onSubmit: handleSubmit,
    noValidate: true
  }), [handleSubmit]);

  /**
   * Get field state (error, touched)
   * @param {string} fieldName - Field name
   * @returns {Object} Field state
   */
  const getFieldState = useCallback((fieldName) => {
    const fieldErrors = isSchemaFunction ? computedErrors : errors;
    return {
      error: fieldErrors[fieldName] || null,
      touched: touched[fieldName] || false,
      hasError: !!(touched[fieldName] && fieldErrors[fieldName])
    };
  }, [errors, touched, computedErrors, isSchemaFunction]);

  return {
    // State
    values,
    errors: isSchemaFunction ? computedErrors : errors,
    touched,
    isSubmitting,
    submitError,
    submitSuccess,
    isValid,
    isDirty,
    submitCount,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Field helpers
    setFieldValue,
    setFieldTouched,
    setFieldError,
    setFieldValues,
    setMultipleValues,
    getFieldError,
    hasFieldError,
    getFieldProps,
    getFieldState,
    getFormProps,
    validateField,
    validateForm,

    // Form helpers
    touchAll,
    reset
  };
};

export { useForm };
export default useForm;
