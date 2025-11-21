import React from 'react';
import { motion } from 'framer-motion';
import AddressForm from './AddressForm';
import PaymentPlaceholder from './PaymentPlaceholder';
import useForm from '../../hooks/useForm';
import {
  validateEmail,
  validatePhone,
  validateZip,
  validateRequired,
} from '../../utils/validation';

/**
 * CheckoutForm - Main checkout form component
 * Includes shipping address and payment sections with validation
 */
const CheckoutForm = ({
  onSubmit,
  isLoading = false,
  initialValues = {},
}) => {
  // Default form values
  const defaultValues = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    ...initialValues,
  };

  // Validation function
  const validate = (values) => {
    const errors = {};

    // Full Name
    const nameResult = validateRequired(values.fullName, 'Full name');
    if (!nameResult.isValid) errors.fullName = nameResult.error;

    // Email
    const emailResult = validateEmail(values.email);
    if (!emailResult.isValid) errors.email = emailResult.error;

    // Phone
    const phoneResult = validatePhone(values.phone, true);
    if (!phoneResult.isValid) errors.phone = phoneResult.error;

    // Address
    const addressResult = validateRequired(values.address, 'Street address');
    if (!addressResult.isValid) errors.address = addressResult.error;

    // City
    const cityResult = validateRequired(values.city, 'City');
    if (!cityResult.isValid) errors.city = cityResult.error;

    // State
    const stateResult = validateRequired(values.state, 'State');
    if (!stateResult.isValid) errors.state = stateResult.error;

    // ZIP
    const zipResult = validateZip(values.zip);
    if (!zipResult.isValid) errors.zip = zipResult.error;

    return errors;
  };

  // Use custom form hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = useForm(defaultValues, validate, onSubmit);

  // Calculate if form can be submitted
  const canSubmit = isValid && !isSubmitting && !isLoading;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Shipping Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-soft p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-cool-blue text-white rounded-lg flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h2 className="text-xl font-bold text-graphite">Shipping Information</h2>
            <p className="text-sm text-slate-gray">Where should we ship your order?</p>
          </div>
        </div>

        <AddressForm
          values={values}
          errors={errors}
          touched={touched}
          onChange={handleChange}
          onBlur={handleBlur}
          getFieldProps={getFieldProps}
          setFieldValue={setFieldValue}
          disabled={isSubmitting || isLoading}
        />
      </motion.div>

      {/* Payment Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-gray text-white rounded-lg flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h2 className="text-xl font-bold text-graphite">Payment</h2>
            <p className="text-sm text-slate-gray">Complete your purchase</p>
          </div>
        </div>

        <PaymentPlaceholder disabled={isSubmitting || isLoading} />
      </motion.div>

      {/* Submit Error */}
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{submitError}</span>
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          type="submit"
          disabled={!canSubmit}
          whileHover={{ scale: canSubmit ? 1.02 : 1 }}
          whileTap={{ scale: canSubmit ? 0.98 : 1 }}
          className="btn-accent w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing Order...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Place Order
            </span>
          )}
        </motion.button>

        {/* Security Assurance */}
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-gray">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Your information is secure and encrypted</span>
        </div>
      </motion.div>
    </form>
  );
};

export default CheckoutForm;
