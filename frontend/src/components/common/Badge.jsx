/**
 * Badge Component
 *
 * A versatile badge component for displaying status, labels, and tags.
 * Supports multiple variants, sizes, and shapes.
 *
 * Features:
 * - Multiple status variants (success, warning, error, info, neutral)
 * - Multiple sizes (sm, md, lg)
 * - Pill and rounded shape options
 * - Optional icon support
 * - Subtle animation on mount
 *
 * @module components/common/Badge
 */

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion } from 'framer-motion';

/**
 * Variant-specific styling classes
 * Each variant has its own color scheme for different statuses
 */
const variantClasses = {
  success: `
    bg-emerald-100 text-emerald-800
    border border-emerald-200
  `,
  warning: `
    bg-amber-100 text-amber-800
    border border-amber-200
  `,
  error: `
    bg-red-100 text-red-800
    border border-red-200
  `,
  info: `
    bg-soft-sky text-cool-blue
    border border-blue-200
  `,
  neutral: `
    bg-gray-100 text-slate-gray
    border border-gray-200
  `,
  primary: `
    bg-cool-blue text-white
    border border-cool-blue
  `,
  secondary: `
    bg-deep-indigo text-white
    border border-deep-indigo
  `,
};

/**
 * Size-specific styling classes
 */
const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

/**
 * Icon size mapping based on badge size
 */
const iconSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

/**
 * Shape-specific styling classes
 */
const shapeClasses = {
  pill: 'rounded-full',
  rounded: 'rounded-md',
  square: 'rounded-sm',
};

/**
 * Framer Motion animation variants
 */
const motionVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

/**
 * Badge Component
 *
 * Displays a status badge with customizable appearance.
 *
 * @param {Object} props - Component props
 * @param {'success'|'warning'|'error'|'info'|'neutral'|'primary'|'secondary'} props.variant - Color variant
 * @param {'sm'|'md'|'lg'} props.size - Badge size
 * @param {'pill'|'rounded'|'square'} props.shape - Badge shape
 * @param {React.ReactNode} props.icon - Optional icon to display
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.animate - Whether to animate on mount
 *
 * @example
 * // Success badge
 * <Badge variant="success">Active</Badge>
 *
 * @example
 * // Badge with icon
 * <Badge variant="warning" icon={<AlertTriangle />}>Pending</Badge>
 *
 * @example
 * // Pill shaped badge
 * <Badge variant="info" shape="pill">New</Badge>
 */
const Badge = ({
  variant = 'neutral',
  size = 'md',
  shape = 'pill',
  icon,
  children,
  className = '',
  animate = true,
}) => {
  const Component = animate ? motion.span : 'span';
  const animationProps = animate ? {
    variants: motionVariants,
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
    transition: { duration: 0.2 },
  } : {};

  return (
    <Component
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        shapeClasses[shape],
        className
      )}
      {...animationProps}
    >
      {/* Optional icon */}
      {icon && (
        <span className={clsx('shrink-0', iconSizeClasses[size])}>
          {icon}
        </span>
      )}

      {/* Badge content */}
      {children}
    </Component>
  );
};

Badge.propTypes = {
  /** Color variant */
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'neutral', 'primary', 'secondary']),
  /** Badge size */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Badge shape */
  shape: PropTypes.oneOf(['pill', 'rounded', 'square']),
  /** Optional icon to display */
  icon: PropTypes.node,
  /** Badge content */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Whether to animate on mount */
  animate: PropTypes.bool,
};

export default Badge;
