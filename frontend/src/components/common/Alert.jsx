/**
 * Alert Component
 *
 * An alert box component for displaying important messages
 * with different types, icons, and optional actions.
 *
 * Features:
 * - Multiple alert types (info, success, warning, error)
 * - Dismissible option
 * - Icon support
 * - Action buttons
 * - Animated entrance/exit
 * - Accessible with proper ARIA roles
 *
 * @module components/common/Alert
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
} from 'lucide-react';

/**
 * Alert type configurations
 */
const alertTypes = {
  info: {
    icon: Info,
    containerClass: 'bg-soft-sky border-blue-200',
    iconClass: 'text-cool-blue',
    titleClass: 'text-blue-800',
    textClass: 'text-blue-700',
  },
  success: {
    icon: CheckCircle2,
    containerClass: 'bg-emerald-50 border-emerald-200',
    iconClass: 'text-emerald-500',
    titleClass: 'text-emerald-800',
    textClass: 'text-emerald-700',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'bg-amber-50 border-amber-200',
    iconClass: 'text-amber-500',
    titleClass: 'text-amber-800',
    textClass: 'text-amber-700',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'bg-red-50 border-red-200',
    iconClass: 'text-red-500',
    titleClass: 'text-red-800',
    textClass: 'text-red-700',
  },
};

/**
 * Animation variants for alert
 */
const alertVariants = {
  initial: {
    opacity: 0,
    y: -8,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      duration: 0.15,
    },
  },
};

/**
 * Alert Component
 *
 * Displays an alert message with customizable appearance and behavior.
 *
 * @param {Object} props - Component props
 * @param {'info'|'success'|'warning'|'error'} props.type - Alert type
 * @param {string} props.title - Alert title
 * @param {React.ReactNode} props.children - Alert message content
 * @param {boolean} props.dismissible - Show dismiss button
 * @param {function} props.onDismiss - Callback when dismissed
 * @param {boolean} props.showIcon - Show type icon
 * @param {React.ReactNode} props.icon - Custom icon
 * @param {React.ReactNode} props.action - Action button/element
 * @param {string} props.className - Additional CSS classes
 *
 * @example
 * // Basic alert
 * <Alert type="info">This is an informational message.</Alert>
 *
 * @example
 * // Alert with title and action
 * <Alert
 *   type="warning"
 *   title="Low Stock"
 *   dismissible
 *   action={<Button size="sm">Restock</Button>}
 * >
 *   Only 5 items remaining in inventory.
 * </Alert>
 */
const Alert = ({
  type = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  showIcon = true,
  icon: customIcon,
  action,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = alertTypes[type];
  const Icon = customIcon || config.icon;

  // Handle dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="alert"
          variants={alertVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={clsx(
            'relative rounded-lg border p-4',
            config.containerClass,
            className
          )}
        >
          <div className="flex gap-3">
            {/* Icon */}
            {showIcon && (
              <div className={clsx('shrink-0 mt-0.5', config.iconClass)}>
                <Icon className="w-5 h-5" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              {title && (
                <h4 className={clsx('font-semibold text-sm mb-1', config.titleClass)}>
                  {title}
                </h4>
              )}

              {/* Message */}
              <div className={clsx('text-sm', config.textClass)}>
                {children}
              </div>

              {/* Action */}
              {action && (
                <div className="mt-3">
                  {action}
                </div>
              )}
            </div>

            {/* Dismiss button */}
            {dismissible && (
              <motion.button
                type="button"
                onClick={handleDismiss}
                className={clsx(
                  'shrink-0 p-1 rounded',
                  'opacity-60 hover:opacity-100',
                  'transition-opacity duration-200',
                  'focus:outline-none focus:ring-2',
                  config.iconClass
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Alert.propTypes = {
  /** Alert type */
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  /** Alert title */
  title: PropTypes.string,
  /** Alert message content */
  children: PropTypes.node.isRequired,
  /** Show dismiss button */
  dismissible: PropTypes.bool,
  /** Callback when dismissed */
  onDismiss: PropTypes.func,
  /** Show type icon */
  showIcon: PropTypes.bool,
  /** Custom icon component */
  icon: PropTypes.elementType,
  /** Action button/element */
  action: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * AlertBanner Component
 *
 * A full-width banner variant of the alert for page-level notifications.
 */
export const AlertBanner = ({
  type = 'info',
  children,
  dismissible = false,
  onDismiss,
  action,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = alertTypes[type];
  const Icon = config.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={clsx(
            'border-b',
            config.containerClass,
            className
          )}
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={clsx('w-5 h-5 shrink-0', config.iconClass)} />
                <p className={clsx('text-sm font-medium', config.textClass)}>
                  {children}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {action}

                {dismissible && (
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className={clsx(
                      'p-1 rounded',
                      'opacity-60 hover:opacity-100',
                      'transition-opacity duration-200',
                      config.iconClass
                    )}
                    aria-label="Dismiss banner"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AlertBanner.propTypes = {
  /** Alert type */
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  /** Banner message content */
  children: PropTypes.node.isRequired,
  /** Show dismiss button */
  dismissible: PropTypes.bool,
  /** Callback when dismissed */
  onDismiss: PropTypes.func,
  /** Action button/element */
  action: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * InlineAlert Component
 *
 * A compact inline variant for form-level messages.
 */
export const InlineAlert = ({
  type = 'info',
  children,
  showIcon = true,
  className = '',
}) => {
  const config = alertTypes[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        'flex items-start gap-2 text-sm',
        config.textClass,
        className
      )}
      role="alert"
    >
      {showIcon && <Icon className={clsx('w-4 h-4 shrink-0 mt-0.5', config.iconClass)} />}
      <span>{children}</span>
    </motion.div>
  );
};

InlineAlert.propTypes = {
  /** Alert type */
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  /** Alert message content */
  children: PropTypes.node.isRequired,
  /** Show type icon */
  showIcon: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default Alert;
