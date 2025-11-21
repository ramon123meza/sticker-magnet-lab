/**
 * Tooltip Component
 *
 * A hover tooltip component with multiple position options,
 * delay support, and smooth animations.
 *
 * Features:
 * - Multiple positions (top, bottom, left, right)
 * - Configurable show/hide delay
 * - Arrow indicator
 * - Custom styling support
 * - Accessible with proper ARIA attributes
 * - Framer Motion animations
 *
 * @module components/common/Tooltip
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Position-specific styling and animation configurations
 */
const positionConfig = {
  top: {
    container: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2 border-t-graphite border-x-transparent border-b-transparent',
    initial: { opacity: 0, y: 8, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.95 },
  },
  bottom: {
    container: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 border-b-graphite border-x-transparent border-t-transparent',
    initial: { opacity: 0, y: -8, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.95 },
  },
  left: {
    container: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 border-l-graphite border-y-transparent border-r-transparent',
    initial: { opacity: 0, x: 8, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 8, scale: 0.95 },
  },
  right: {
    container: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'right-full top-1/2 -translate-y-1/2 border-r-graphite border-y-transparent border-l-transparent',
    initial: { opacity: 0, x: -8, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -8, scale: 0.95 },
  },
};

/**
 * Tooltip Component
 *
 * Displays a tooltip on hover or focus.
 *
 * @param {Object} props - Component props
 * @param {string} props.content - Tooltip content
 * @param {'top'|'bottom'|'left'|'right'} props.position - Tooltip position
 * @param {number} props.showDelay - Delay before showing (ms)
 * @param {number} props.hideDelay - Delay before hiding (ms)
 * @param {boolean} props.disabled - Disable tooltip
 * @param {boolean} props.arrow - Show arrow indicator
 * @param {string} props.className - Additional CSS classes for tooltip
 * @param {string} props.containerClassName - Additional CSS classes for container
 * @param {React.ReactNode} props.children - Trigger element
 *
 * @example
 * // Basic tooltip
 * <Tooltip content="This is a tooltip">
 *   <button>Hover me</button>
 * </Tooltip>
 *
 * @example
 * // Tooltip with position and delay
 * <Tooltip content="Help text" position="right" showDelay={300}>
 *   <InfoIcon />
 * </Tooltip>
 */
const Tooltip = ({
  content,
  position = 'top',
  showDelay = 200,
  hideDelay = 0,
  disabled = false,
  arrow = true,
  className = '',
  containerClassName = '',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const config = positionConfig[position];

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Handle show
  const handleShow = useCallback(() => {
    if (disabled) return;

    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Set show timeout
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);
  }, [disabled, showDelay]);

  // Handle hide
  const handleHide = useCallback(() => {
    // Clear any pending show timeout
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    // Set hide timeout
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  }, [hideDelay]);

  // Don't render tooltip content if disabled or no content
  if (disabled || !content) {
    return children;
  }

  return (
    <div
      className={clsx('relative inline-flex', containerClassName)}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onFocus={handleShow}
      onBlur={handleHide}
    >
      {/* Trigger element */}
      {children}

      {/* Tooltip */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={config.initial}
            animate={config.animate}
            exit={config.exit}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={clsx(
              'absolute z-50 pointer-events-none',
              config.container
            )}
            role="tooltip"
          >
            {/* Tooltip content */}
            <div
              className={clsx(
                'px-3 py-2 rounded-lg',
                'bg-graphite text-white text-sm',
                'shadow-lg whitespace-nowrap max-w-xs',
                className
              )}
            >
              {content}
            </div>

            {/* Arrow */}
            {arrow && (
              <div
                className={clsx(
                  'absolute w-0 h-0 border-4',
                  config.arrow
                )}
                aria-hidden="true"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Tooltip.propTypes = {
  /** Tooltip content - can be string or React node */
  content: PropTypes.node.isRequired,
  /** Tooltip position relative to trigger */
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  /** Delay before showing tooltip (milliseconds) */
  showDelay: PropTypes.number,
  /** Delay before hiding tooltip (milliseconds) */
  hideDelay: PropTypes.number,
  /** Disable tooltip */
  disabled: PropTypes.bool,
  /** Show arrow indicator */
  arrow: PropTypes.bool,
  /** Additional CSS classes for tooltip content */
  className: PropTypes.string,
  /** Additional CSS classes for wrapper container */
  containerClassName: PropTypes.string,
  /** Trigger element */
  children: PropTypes.node.isRequired,
};

export default Tooltip;
