/**
 * QuantitySelector Component
 *
 * A quantity input component with plus/minus buttons for e-commerce
 * product quantity selection.
 *
 * Features:
 * - Plus/minus increment buttons
 * - Direct input field
 * - Min/max value limits
 * - Custom step value
 * - Disabled states
 * - Keyboard support
 * - Framer Motion animations
 *
 * @module components/common/QuantitySelector
 */

import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

/**
 * Size configurations
 */
const sizeClasses = {
  sm: {
    container: 'h-8',
    button: 'w-8 h-8',
    input: 'w-12 text-sm',
    icon: 'w-3.5 h-3.5',
  },
  md: {
    container: 'h-10',
    button: 'w-10 h-10',
    input: 'w-16 text-base',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'h-12',
    button: 'w-12 h-12',
    input: 'w-20 text-lg',
    icon: 'w-5 h-5',
  },
};

/**
 * Button animation variants
 */
const buttonVariants = {
  idle: { scale: 1 },
  tap: { scale: 0.9 },
};

/**
 * QuantitySelector Component
 *
 * Provides quantity input with increment/decrement controls.
 *
 * @param {Object} props - Component props
 * @param {number} props.value - Current quantity value
 * @param {function} props.onChange - Change handler
 * @param {number} props.min - Minimum allowed value
 * @param {number} props.max - Maximum allowed value
 * @param {number} props.step - Increment/decrement step
 * @param {'sm'|'md'|'lg'} props.size - Component size
 * @param {boolean} props.disabled - Disable all controls
 * @param {string} props.label - Accessible label
 * @param {string} props.className - Additional CSS classes
 *
 * @example
 * // Basic usage
 * <QuantitySelector
 *   value={quantity}
 *   onChange={setQuantity}
 *   min={1}
 *   max={99}
 * />
 *
 * @example
 * // With custom step
 * <QuantitySelector
 *   value={quantity}
 *   onChange={setQuantity}
 *   step={5}
 *   max={100}
 * />
 */
const QuantitySelector = ({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  size = 'md',
  disabled = false,
  label = 'Quantity',
  className = '',
}) => {
  // Local state for input
  const [inputValue, setInputValue] = useState(String(value));

  // Sync input with prop value
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  // Check if decrement is disabled
  const isDecrementDisabled = disabled || value <= min;

  // Check if increment is disabled
  const isIncrementDisabled = disabled || value >= max;

  // Handle decrement
  const handleDecrement = useCallback(() => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  }, [min, value, step, onChange]);

  // Handle increment
  const handleIncrement = useCallback(() => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  }, [max, value, step, onChange]);

  // Handle direct input change
  const handleInputChange = useCallback((e) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);

    // Only update if valid number
    const numValue = parseInt(newInputValue, 10);
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(max, Math.max(min, numValue));
      onChange(clampedValue);
    }
  }, [min, max, onChange]);

  // Handle blur - ensure valid value
  const handleBlur = useCallback(() => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < min) {
      setInputValue(String(min));
      onChange(min);
    } else if (numValue > max) {
      setInputValue(String(max));
      onChange(max);
    } else {
      setInputValue(String(numValue));
      onChange(numValue);
    }
  }, [inputValue, min, max, onChange]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isIncrementDisabled) handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isDecrementDisabled) handleDecrement();
    }
  }, [isIncrementDisabled, isDecrementDisabled, handleIncrement, handleDecrement]);

  const styles = sizeClasses[size];

  return (
    <div
      className={clsx('inline-flex items-center', className)}
      role="group"
      aria-label={label}
    >
      {/* Decrement button */}
      <motion.button
        type="button"
        onClick={handleDecrement}
        disabled={isDecrementDisabled}
        variants={buttonVariants}
        initial="idle"
        whileTap={!isDecrementDisabled ? 'tap' : undefined}
        className={clsx(
          'flex items-center justify-center',
          'rounded-l-lg border-2 border-r-0',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-cool-blue focus:ring-inset',
          styles.button,
          isDecrementDisabled
            ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
            : 'bg-white border-gray-200 text-slate-gray hover:bg-soft-sky hover:border-cool-blue hover:text-cool-blue'
        )}
        aria-label={`Decrease quantity by ${step}`}
      >
        <Minus className={styles.icon} />
      </motion.button>

      {/* Input field */}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={clsx(
          'text-center font-medium text-graphite',
          'border-y-2 border-gray-200',
          'focus:outline-none focus:border-cool-blue focus:ring-0',
          'transition-colors duration-200',
          styles.container,
          styles.input,
          disabled && 'bg-gray-100 text-gray-400 cursor-not-allowed'
        )}
      />

      {/* Increment button */}
      <motion.button
        type="button"
        onClick={handleIncrement}
        disabled={isIncrementDisabled}
        variants={buttonVariants}
        initial="idle"
        whileTap={!isIncrementDisabled ? 'tap' : undefined}
        className={clsx(
          'flex items-center justify-center',
          'rounded-r-lg border-2 border-l-0',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-cool-blue focus:ring-inset',
          styles.button,
          isIncrementDisabled
            ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
            : 'bg-white border-gray-200 text-slate-gray hover:bg-soft-sky hover:border-cool-blue hover:text-cool-blue'
        )}
        aria-label={`Increase quantity by ${step}`}
      >
        <Plus className={styles.icon} />
      </motion.button>
    </div>
  );
};

QuantitySelector.propTypes = {
  /** Current quantity value */
  value: PropTypes.number,
  /** Change handler */
  onChange: PropTypes.func.isRequired,
  /** Minimum allowed value */
  min: PropTypes.number,
  /** Maximum allowed value */
  max: PropTypes.number,
  /** Increment/decrement step */
  step: PropTypes.number,
  /** Component size */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Disable all controls */
  disabled: PropTypes.bool,
  /** Accessible label */
  label: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default QuantitySelector;
