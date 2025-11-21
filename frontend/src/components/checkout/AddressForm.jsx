import React from 'react';
import { motion } from 'framer-motion';
import { US_STATES, formatPhone, formatZip } from '../../utils/validation';

/**
 * AddressForm - Reusable address form component
 * Includes all address fields with validation and formatting
 */
const AddressForm = ({
  values,
  errors,
  touched,
  onChange,
  onBlur,
  getFieldProps,
  setFieldValue,
  disabled = false,
}) => {
  // Handle phone input with formatting
  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFieldValue('phone', formatted);
  };

  // Handle ZIP input with formatting
  const handleZipChange = (e) => {
    const formatted = formatZip(e.target.value);
    setFieldValue('zip', formatted);
  };

  // Get input class based on error state
  const getInputClass = (fieldName) => {
    const baseClass = 'input-field';
    if (touched?.[fieldName] && errors?.[fieldName]) {
      return `${baseClass} input-error`;
    }
    if (touched?.[fieldName] && !errors?.[fieldName] && values?.[fieldName]) {
      return `${baseClass} input-success`;
    }
    return baseClass;
  };

  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-graphite mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          {...(getFieldProps ? getFieldProps('fullName') : {
            name: 'fullName',
            value: values?.fullName || '',
            onChange,
            onBlur,
          })}
          disabled={disabled}
          className={getInputClass('fullName')}
          placeholder="John Doe"
          autoComplete="name"
          aria-required="true"
          aria-invalid={touched?.fullName && !!errors?.fullName}
          aria-describedby={errors?.fullName ? 'fullName-error' : undefined}
        />
        {touched?.fullName && errors?.fullName && (
          <motion.p
            id="fullName-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {errors.fullName}
          </motion.p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-graphite mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          {...(getFieldProps ? getFieldProps('email') : {
            name: 'email',
            value: values?.email || '',
            onChange,
            onBlur,
          })}
          disabled={disabled}
          className={getInputClass('email')}
          placeholder="john@example.com"
          autoComplete="email"
          aria-required="true"
          aria-invalid={touched?.email && !!errors?.email}
          aria-describedby={errors?.email ? 'email-error' : undefined}
        />
        {touched?.email && errors?.email && (
          <motion.p
            id="email-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {errors.email}
          </motion.p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-graphite mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={values?.phone || ''}
          onChange={handlePhoneChange}
          onBlur={onBlur}
          disabled={disabled}
          className={getInputClass('phone')}
          placeholder="(555) 123-4567"
          autoComplete="tel"
          aria-required="true"
          aria-invalid={touched?.phone && !!errors?.phone}
          aria-describedby={errors?.phone ? 'phone-error' : undefined}
        />
        {touched?.phone && errors?.phone && (
          <motion.p
            id="phone-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {errors.phone}
          </motion.p>
        )}
      </div>

      {/* Street Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-graphite mb-1">
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="address"
          {...(getFieldProps ? getFieldProps('address') : {
            name: 'address',
            value: values?.address || '',
            onChange,
            onBlur,
          })}
          disabled={disabled}
          className={getInputClass('address')}
          placeholder="123 Main Street"
          autoComplete="address-line1"
          aria-required="true"
          aria-invalid={touched?.address && !!errors?.address}
          aria-describedby={errors?.address ? 'address-error' : undefined}
        />
        {touched?.address && errors?.address && (
          <motion.p
            id="address-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {errors.address}
          </motion.p>
        )}
      </div>

      {/* Apartment/Suite */}
      <div>
        <label htmlFor="apartment" className="block text-sm font-medium text-graphite mb-1">
          Apartment / Suite <span className="text-slate-gray text-xs">(optional)</span>
        </label>
        <input
          type="text"
          id="apartment"
          {...(getFieldProps ? getFieldProps('apartment') : {
            name: 'apartment',
            value: values?.apartment || '',
            onChange,
            onBlur,
          })}
          disabled={disabled}
          className="input-field"
          placeholder="Apt 4B, Suite 100, etc."
          autoComplete="address-line2"
        />
      </div>

      {/* City, State, ZIP Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* City */}
        <div className="sm:col-span-1">
          <label htmlFor="city" className="block text-sm font-medium text-graphite mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            {...(getFieldProps ? getFieldProps('city') : {
              name: 'city',
              value: values?.city || '',
              onChange,
              onBlur,
            })}
            disabled={disabled}
            className={getInputClass('city')}
            placeholder="New York"
            autoComplete="address-level2"
            aria-required="true"
            aria-invalid={touched?.city && !!errors?.city}
            aria-describedby={errors?.city ? 'city-error' : undefined}
          />
          {touched?.city && errors?.city && (
            <motion.p
              id="city-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
              role="alert"
            >
              {errors.city}
            </motion.p>
          )}
        </div>

        {/* State */}
        <div className="sm:col-span-1">
          <label htmlFor="state" className="block text-sm font-medium text-graphite mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="state"
            {...(getFieldProps ? getFieldProps('state') : {
              name: 'state',
              value: values?.state || '',
              onChange,
              onBlur,
            })}
            disabled={disabled}
            className={`${getInputClass('state')} cursor-pointer`}
            autoComplete="address-level1"
            aria-required="true"
            aria-invalid={touched?.state && !!errors?.state}
            aria-describedby={errors?.state ? 'state-error' : undefined}
          >
            <option value="">Select State</option>
            {US_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
          {touched?.state && errors?.state && (
            <motion.p
              id="state-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
              role="alert"
            >
              {errors.state}
            </motion.p>
          )}
        </div>

        {/* ZIP */}
        <div className="sm:col-span-1">
          <label htmlFor="zip" className="block text-sm font-medium text-graphite mb-1">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={values?.zip || ''}
            onChange={handleZipChange}
            onBlur={onBlur}
            disabled={disabled}
            className={getInputClass('zip')}
            placeholder="10001"
            autoComplete="postal-code"
            maxLength={5}
            aria-required="true"
            aria-invalid={touched?.zip && !!errors?.zip}
            aria-describedby={errors?.zip ? 'zip-error' : undefined}
          />
          {touched?.zip && errors?.zip && (
            <motion.p
              id="zip-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
              role="alert"
            >
              {errors.zip}
            </motion.p>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-graphite mb-1">
          Country
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value="United States"
          readOnly
          disabled
          className="input-field bg-soft-gray cursor-not-allowed"
          autoComplete="country-name"
        />
        <p className="mt-1 text-xs text-slate-gray">
          Currently shipping to US addresses only
        </p>
      </div>
    </div>
  );
};

export default AddressForm;
