/**
 * ProgressBar Component
 *
 * A versatile progress bar component with animated fill,
 * multiple colors and sizes, and optional percentage display.
 *
 * Features:
 * - Animated fill effect
 * - Multiple color variants
 * - Multiple sizes
 * - Percentage display
 * - Striped option
 * - Indeterminate mode
 * - Accessible with ARIA attributes
 *
 * @module components/common/ProgressBar
 */

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion } from 'framer-motion';

/**
 * Size configurations
 */
const sizeClasses = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
  xl: 'h-6',
};

/**
 * Color configurations
 */
const colorClasses = {
  primary: 'bg-cool-blue',
  secondary: 'bg-deep-indigo',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-400',
  gradient: 'bg-gradient-to-r from-cool-blue to-brand-600',
};

/**
 * Track (background) color classes
 */
const trackClasses = {
  light: 'bg-gray-200',
  dark: 'bg-gray-300',
  soft: 'bg-soft-sky/50',
};

/**
 * ProgressBar Component
 *
 * Displays progress as a horizontal bar.
 *
 * @param {Object} props - Component props
 * @param {number} props.value - Progress value (0-100)
 * @param {number} props.max - Maximum value
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} props.size - Bar height
 * @param {'primary'|'secondary'|'success'|'warning'|'error'|'info'|'gradient'} props.color - Bar color
 * @param {'light'|'dark'|'soft'} props.track - Track/background color
 * @param {boolean} props.showLabel - Show percentage label
 * @param {'inside'|'outside'|'tooltip'} props.labelPosition - Label position
 * @param {boolean} props.striped - Show striped pattern
 * @param {boolean} props.animated - Animate stripes
 * @param {boolean} props.indeterminate - Show indeterminate animation
 * @param {boolean} props.rounded - Use rounded corners
 * @param {string} props.label - Custom label text
 * @param {string} props.className - Additional CSS classes
 *
 * @example
 * // Basic progress bar
 * <ProgressBar value={75} />
 *
 * @example
 * // With percentage label
 * <ProgressBar value={60} showLabel labelPosition="outside" />
 *
 * @example
 * // Striped and animated
 * <ProgressBar value={45} striped animated color="success" />
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  color = 'primary',
  track = 'light',
  showLabel = false,
  labelPosition = 'outside',
  striped = false,
  animated = false,
  indeterminate = false,
  rounded = true,
  label,
  className = '',
}) => {
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const displayLabel = label || `${Math.round(percentage)}%`;

  // Determine if label should be inside (only for larger sizes with enough progress)
  const showInsideLabel = showLabel && labelPosition === 'inside' && percentage >= 15;
  const showOutsideLabel = showLabel && labelPosition === 'outside';

  return (
    <div className={clsx('w-full', className)}>
      {/* Outside label (above) */}
      {showOutsideLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-slate-gray">
            Progress
          </span>
          <span className="text-sm font-medium text-graphite">
            {displayLabel}
          </span>
        </div>
      )}

      {/* Progress bar container */}
      <div
        className={clsx(
          'w-full overflow-hidden',
          sizeClasses[size],
          trackClasses[track],
          rounded && 'rounded-full'
        )}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={indeterminate ? 'Loading' : `Progress: ${displayLabel}`}
      >
        {/* Determinate progress */}
        {!indeterminate ? (
          <motion.div
            className={clsx(
              'h-full relative',
              colorClasses[color],
              rounded && 'rounded-full',
              striped && 'progress-striped',
              striped && animated && 'progress-animated'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
          >
            {/* Striped pattern overlay */}
            {striped && (
              <div
                className={clsx(
                  'absolute inset-0',
                  'bg-stripes',
                  animated && 'animate-progress-stripes'
                )}
                style={{
                  backgroundImage: `linear-gradient(
                    45deg,
                    rgba(255, 255, 255, 0.15) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255, 255, 255, 0.15) 50%,
                    rgba(255, 255, 255, 0.15) 75%,
                    transparent 75%,
                    transparent
                  )`,
                  backgroundSize: '1rem 1rem',
                }}
              />
            )}

            {/* Inside label */}
            {showInsideLabel && (
              <span
                className={clsx(
                  'absolute inset-0 flex items-center justify-center',
                  'text-white text-xs font-medium'
                )}
              >
                {displayLabel}
              </span>
            )}
          </motion.div>
        ) : (
          /* Indeterminate progress */
          <motion.div
            className={clsx(
              'h-full w-1/3',
              colorClasses[color],
              rounded && 'rounded-full'
            )}
            animate={{
              x: ['-100%', '400%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  /** Progress value */
  value: PropTypes.number,
  /** Maximum value */
  max: PropTypes.number,
  /** Bar height size */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Bar color */
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info', 'gradient']),
  /** Track/background color */
  track: PropTypes.oneOf(['light', 'dark', 'soft']),
  /** Show percentage label */
  showLabel: PropTypes.bool,
  /** Label position */
  labelPosition: PropTypes.oneOf(['inside', 'outside', 'tooltip']),
  /** Show striped pattern */
  striped: PropTypes.bool,
  /** Animate stripes */
  animated: PropTypes.bool,
  /** Show indeterminate animation */
  indeterminate: PropTypes.bool,
  /** Use rounded corners */
  rounded: PropTypes.bool,
  /** Custom label text */
  label: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * ProgressSteps Component
 *
 * Displays progress as discrete steps.
 */
export const ProgressSteps = ({
  currentStep = 1,
  totalSteps = 4,
  steps = [],
  color = 'primary',
  className = '',
}) => {
  return (
    <div className={clsx('w-full', className)}>
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const stepLabel = steps[index];

          return (
            <div
              key={stepNumber}
              className="flex-1 flex items-center"
            >
              {/* Step circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted || isCurrent
                    ? color === 'primary' ? '#3A6EA5' : '#1B1F3B'
                    : '#E5E7EB',
                }}
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  'text-sm font-medium transition-colors duration-300',
                  (isCompleted || isCurrent) ? 'text-white' : 'text-gray-500'
                )}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4\" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </motion.div>

              {/* Connector line */}
              {stepNumber < totalSteps && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-200 relative overflow-hidden">
                  <motion.div
                    className={clsx('h-full', colorClasses[color])}
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step labels */}
      {steps.length > 0 && (
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <span
              key={index}
              className={clsx(
                'text-xs text-center flex-1',
                index + 1 <= currentStep ? 'text-graphite font-medium' : 'text-gray-400'
              )}
            >
              {step}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

ProgressSteps.propTypes = {
  /** Current step (1-indexed) */
  currentStep: PropTypes.number,
  /** Total number of steps */
  totalSteps: PropTypes.number,
  /** Array of step labels */
  steps: PropTypes.arrayOf(PropTypes.string),
  /** Color theme */
  color: PropTypes.oneOf(['primary', 'secondary']),
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default ProgressBar;
