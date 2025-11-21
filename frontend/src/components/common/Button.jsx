/**
 * Button Component
 *
 * A versatile button component with multiple variants, sizes, and states.
 * Supports icons, loading states, and full accessibility.
 *
 * Features:
 * - Multiple variants (primary, secondary, accent, outline, ghost)
 * - Multiple sizes (sm, md, lg)
 * - Loading state with spinner
 * - Icon support (left and right positions)
 * - Disabled state
 * - Full-width option
 * - Framer Motion animations
 *
 * @module components/common/Button
 */

import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import Spinner from './Spinner';

/**
 * Base classes applied to all button variants
 */
const baseClasses = `
  inline-flex items-center justify-center
  font-medium font-sans
  rounded-lg
  transition-all duration-200 ease-out
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
`;

/**
 * Variant-specific styling classes
 * Each variant has its own color scheme and hover/focus states
 */
const variantClasses = {
  primary: `
    bg-cool-blue text-white
    hover:bg-brand-600
    focus:ring-cool-blue
    active:bg-brand-700
    shadow-sm hover:shadow-md
  `,
  secondary: `
    bg-deep-indigo text-white
    hover:bg-brand-800
    focus:ring-deep-indigo
    active:bg-graphite
    shadow-sm hover:shadow-md
  `,
  accent: `
    bg-gradient-to-r from-cool-blue to-brand-600 text-white
    hover:from-brand-600 hover:to-brand-700
    focus:ring-cool-blue
    shadow-md hover:shadow-lg
  `,
  outline: `
    border-2 border-cool-blue text-cool-blue
    bg-transparent
    hover:bg-cool-blue hover:text-white
    focus:ring-cool-blue
  `,
  ghost: `
    bg-transparent text-slate-gray
    hover:bg-soft-sky hover:text-deep-indigo
    focus:ring-soft-sky
  `,
};

/**
 * Size-specific styling classes
 * Controls padding, font size, and icon sizing
 */
const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

/**
 * Icon size mapping based on button size
 */
const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

/**
 * Spinner size mapping based on button size
 */
const spinnerSizes = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

/**
 * Framer Motion animation variants for the button
 */
const motionVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

/**
 * Button Component
 *
 * A highly customizable button with animations and accessibility features.
 * Uses forwardRef to allow ref forwarding for external DOM access.
 *
 * @param {Object} props - Component props
 * @param {'primary'|'secondary'|'accent'|'outline'|'ghost'} props.variant - Visual style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.isLoading - Shows loading spinner when true
 * @param {boolean} props.disabled - Disables the button
 * @param {boolean} props.fullWidth - Makes button full width
 * @param {React.ReactNode} props.leftIcon - Icon component to display on the left
 * @param {React.ReactNode} props.rightIcon - Icon component to display on the right
 * @param {React.ReactNode} props.children - Button content
 * @param {'button'|'submit'|'reset'} props.type - HTML button type
 * @param {string} props.className - Additional CSS classes
 * @param {React.Ref} ref - Forwarded ref
 *
 * @example
 * // Primary button
 * <Button variant="primary">Click Me</Button>
 *
 * @example
 * // Button with loading state
 * <Button variant="primary" isLoading>Saving...</Button>
 *
 * @example
 * // Button with icons
 * <Button variant="outline" leftIcon={<ShoppingCart />}>Add to Cart</Button>
 */
const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  type = 'button',
  className = '',
  onClick,
  ...props
}, ref) => {
  // Determine spinner color based on variant
  const spinnerColor = variant === 'outline' || variant === 'ghost' ? 'primary' : 'white';

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      variants={motionVariants}
      initial="initial"
      whileHover={!disabled && !isLoading ? "hover" : undefined}
      whileTap={!disabled && !isLoading ? "tap" : undefined}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading spinner - replaces left icon when loading */}
      {isLoading && (
        <Spinner
          size={spinnerSizes[size]}
          color={spinnerColor}
          className="shrink-0"
        />
      )}

      {/* Left icon - hidden when loading */}
      {!isLoading && leftIcon && (
        <span className={clsx('shrink-0', iconSizeClasses[size])}>
          {leftIcon}
        </span>
      )}

      {/* Button content */}
      <span className={clsx(isLoading && 'opacity-80')}>
        {children}
      </span>

      {/* Right icon */}
      {rightIcon && !isLoading && (
        <span className={clsx('shrink-0', iconSizeClasses[size])}>
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  /** Visual style variant */
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'outline', 'ghost']),
  /** Button size */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Shows loading spinner when true */
  isLoading: PropTypes.bool,
  /** Disables the button */
  disabled: PropTypes.bool,
  /** Makes button full width */
  fullWidth: PropTypes.bool,
  /** Icon component to display on the left */
  leftIcon: PropTypes.node,
  /** Icon component to display on the right */
  rightIcon: PropTypes.node,
  /** Button content */
  children: PropTypes.node.isRequired,
  /** HTML button type */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Click handler */
  onClick: PropTypes.func,
};

export default Button;
