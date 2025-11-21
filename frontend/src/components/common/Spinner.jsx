/**
 * Spinner Component
 *
 * A versatile loading spinner component with multiple sizes and colors.
 * Used standalone or within buttons and other components to indicate loading state.
 *
 * Features:
 * - Multiple sizes (xs, sm, md, lg, xl)
 * - Color variants matching the brand palette
 * - Smooth CSS animation
 * - Accessible with proper ARIA attributes
 *
 * @module components/common/Spinner
 */

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion } from 'framer-motion';

/**
 * Size configuration for the spinner
 * Maps size prop values to Tailwind CSS classes
 */
const sizeClasses = {
  xs: 'w-3 h-3 border-[1.5px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-12 h-12 border-4',
};

/**
 * Color configuration for the spinner
 * Maps color prop values to Tailwind CSS border color classes
 */
const colorClasses = {
  primary: 'border-cool-blue border-t-transparent',
  secondary: 'border-deep-indigo border-t-transparent',
  white: 'border-white border-t-transparent',
  slate: 'border-slate-gray border-t-transparent',
  sky: 'border-soft-sky border-t-transparent',
  current: 'border-current border-t-transparent',
};

/**
 * Spinner Component
 *
 * Displays an animated loading spinner with customizable size and color.
 *
 * @param {Object} props - Component props
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} props.size - Size of the spinner
 * @param {'primary'|'secondary'|'white'|'slate'|'sky'|'current'} props.color - Color variant
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.label - Accessible label for screen readers
 *
 * @example
 * // Basic usage
 * <Spinner />
 *
 * @example
 * // Large primary spinner
 * <Spinner size="lg" color="primary" />
 *
 * @example
 * // White spinner for dark backgrounds
 * <Spinner size="sm" color="white" />
 */
const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  label = 'Loading',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={clsx(
        'inline-block rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </motion.div>
  );
};

Spinner.propTypes = {
  /** Size of the spinner */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Color variant of the spinner */
  color: PropTypes.oneOf(['primary', 'secondary', 'white', 'slate', 'sky', 'current']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Accessible label for screen readers */
  label: PropTypes.string,
};

export default Spinner;
