/**
 * Input Component
 *
 * A comprehensive text input component with labels, validation states,
 * and icon support. Designed for forms with full accessibility.
 *
 * Features:
 * - Multiple input types (text, email, tel, password, number, search)
 * - Label and placeholder support
 * - Error and success states with messages
 * - Helper text
 * - Icon support (left and right positions)
 * - Focus animations with Framer Motion
 * - WCAG AA accessible
 *
 * @module components/common/Input
 */

import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Base classes for the input container
 */
const containerClasses = 'w-full';

/**
 * Base classes for the input field
 */
const inputBaseClasses = `
  w-full
  px-4 py-3
  text-base text-graphite
  bg-white
  border-2 rounded-lg
  transition-all duration-200 ease-out
  placeholder:text-gray-400
  focus:outline-none
  disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
`;

/**
 * State-specific border and ring classes
 */
const stateClasses = {
  default: `
    border-gray-200
    hover:border-gray-300
    focus:border-cool-blue focus:ring-4 focus:ring-soft-sky/50
  `,
  error: `
    border-red-400
    hover:border-red-500
    focus:border-red-500 focus:ring-4 focus:ring-red-100
  `,
  success: `
    border-emerald-400
    hover:border-emerald-500
    focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100
  `,
};

/**
 * Animation variants for helper/error text
 */
const helperTextVariants = {
  initial: { opacity: 0, y: -4, height: 0 },
  animate: { opacity: 1, y: 0, height: 'auto' },
  exit: { opacity: 0, y: -4, height: 0 },
};

/**
 * Input Component
 *
 * A styled input field with comprehensive features for forms.
 * Uses forwardRef for external DOM access and form library compatibility.
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID (auto-generated if not provided)
 * @param {string} props.type - Input type
 * @param {string} props.label - Label text
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.error - Error message (triggers error state)
 * @param {string} props.success - Success message (triggers success state)
 * @param {string} props.helperText - Helper text below input
 * @param {React.ReactNode} props.leftIcon - Icon on the left
 * @param {React.ReactNode} props.rightIcon - Icon on the right
 * @param {boolean} props.required - Whether field is required
 * @param {boolean} props.disabled - Whether field is disabled
 * @param {string} props.className - Additional CSS classes
 *
 * @example
 * // Basic input with label
 * <Input label="Email" type="email" placeholder="Enter your email" />
 *
 * @example
 * // Input with error state
 * <Input label="Password" type="password" error="Password is required" />
 *
 * @example
 * // Input with icon
 * <Input label="Search" leftIcon={<Search />} placeholder="Search products..." />
 */
const Input = forwardRef(({
  id,
  type = 'text',
  label,
  placeholder,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Auto-generate ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Determine input type (handle password visibility)
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Determine current state for styling
  const currentState = error ? 'error' : success ? 'success' : 'default';

  // Calculate padding based on icons
  const hasLeftIcon = Boolean(leftIcon);
  const hasRightIcon = Boolean(rightIcon) || type === 'password';

  return (
    <div className={clsx(containerClasses, className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            'block mb-2 text-sm font-medium',
            error ? 'text-red-600' : 'text-slate-gray'
          )}
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {/* Input wrapper for icons */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <span className="w-5 h-5 block">{leftIcon}</span>
          </div>
        )}

        {/* Input field */}
        <motion.input
          ref={ref}
          id={inputId}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={clsx(
            inputBaseClasses,
            stateClasses[currentState],
            hasLeftIcon && 'pl-11',
            hasRightIcon && 'pr-11'
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` :
            success ? `${inputId}-success` :
            helperText ? `${inputId}-helper` :
            undefined
          }
          whileFocus={{ scale: 1.005 }}
          transition={{ duration: 0.15 }}
          {...props}
        />

        {/* Right icon or password toggle */}
        {type === 'password' ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={clsx(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'text-gray-400 hover:text-slate-gray',
              'transition-colors duration-200',
              'focus:outline-none focus:text-cool-blue'
            )}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        ) : rightIcon ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <span className="w-5 h-5 block">{rightIcon}</span>
          </div>
        ) : null}

        {/* Status icon for error/success */}
        {(error || success) && !rightIcon && type !== 'password' && (
          <div className={clsx(
            'absolute right-3 top-1/2 -translate-y-1/2',
            error ? 'text-red-500' : 'text-emerald-500'
          )}>
            {error ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>
        )}
      </div>

      {/* Helper text, error, or success message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-600 flex items-center gap-1.5"
            variants={helperTextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.p>
        )}

        {!error && success && (
          <motion.p
            key="success"
            id={`${inputId}-success`}
            className="mt-2 text-sm text-emerald-600 flex items-center gap-1.5"
            variants={helperTextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {success}
          </motion.p>
        )}

        {!error && !success && helperText && (
          <motion.p
            key="helper"
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-gray-500"
            variants={helperTextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  /** Input ID (auto-generated if not provided) */
  id: PropTypes.string,
  /** Input type */
  type: PropTypes.oneOf(['text', 'email', 'tel', 'password', 'number', 'search', 'url']),
  /** Label text */
  label: PropTypes.string,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Error message (triggers error state) */
  error: PropTypes.string,
  /** Success message (triggers success state) */
  success: PropTypes.string,
  /** Helper text below input */
  helperText: PropTypes.string,
  /** Icon on the left */
  leftIcon: PropTypes.node,
  /** Icon on the right */
  rightIcon: PropTypes.node,
  /** Whether field is required */
  required: PropTypes.bool,
  /** Whether field is disabled */
  disabled: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Input value (controlled) */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Change handler */
  onChange: PropTypes.func,
  /** Blur handler */
  onBlur: PropTypes.func,
  /** Input name */
  name: PropTypes.string,
};

export default Input;
