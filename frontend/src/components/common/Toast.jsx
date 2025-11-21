/**
 * Toast Component & Toast System
 *
 * A complete toast notification system with auto-dismiss,
 * multiple toast types, and stacking support.
 *
 * Features:
 * - Multiple toast types (success, error, warning, info)
 * - Auto-dismiss with configurable duration
 * - Slide-in/out animations
 * - Stack multiple toasts
 * - Progress bar for auto-dismiss
 * - Manual dismiss
 * - Custom positioning
 *
 * @module components/common/Toast
 */

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Toast type configurations
 */
const toastTypes = {
  success: {
    icon: CheckCircle2,
    className: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    iconClassName: 'text-emerald-500',
    progressClassName: 'bg-emerald-500',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-50 border-red-200 text-red-800',
    iconClassName: 'text-red-500',
    progressClassName: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-amber-50 border-amber-200 text-amber-800',
    iconClassName: 'text-amber-500',
    progressClassName: 'bg-amber-500',
  },
  info: {
    icon: Info,
    className: 'bg-soft-sky border-blue-200 text-cool-blue',
    iconClassName: 'text-cool-blue',
    progressClassName: 'bg-cool-blue',
  },
};

/**
 * Position configurations
 */
const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

/**
 * Animation variants based on position
 */
const getAnimationVariants = (position) => {
  const isTop = position.startsWith('top');
  const isLeft = position.includes('left');
  const isCenter = position.includes('center');

  let x = 0;
  if (!isCenter) {
    x = isLeft ? -100 : 100;
  }

  return {
    initial: {
      opacity: 0,
      x,
      y: isTop ? -20 : 20,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      x,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };
};

/**
 * Toast Context for global toast management
 */
const ToastContext = createContext(null);

/**
 * Custom hook to access toast functionality
 *
 * @returns {Object} Toast methods (addToast, removeToast, clearToasts)
 *
 * @example
 * const { addToast } = useToast();
 * addToast({ type: 'success', message: 'Item saved!' });
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Toast Provider Component
 *
 * Wraps your app to provide toast functionality throughout.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - App content
 * @param {string} props.position - Toast container position
 * @param {number} props.maxToasts - Maximum number of toasts to show
 *
 * @example
 * <ToastProvider position="top-right">
 *   <App />
 * </ToastProvider>
 */
export const ToastProvider = ({
  children,
  position = 'top-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Add a new toast
   */
  const addToast = useCallback(
    ({
      type = 'info',
      message,
      title,
      duration = 5000,
      dismissible = true,
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      setToasts((prev) => {
        const newToasts = [
          { id, type, message, title, duration, dismissible },
          ...prev,
        ];
        return newToasts.slice(0, maxToasts);
      });

      return id;
    },
    [maxToasts]
  );

  /**
   * Remove a specific toast
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Clear all toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Memoize context value
  const contextValue = useMemo(
    () => ({ addToast, removeToast, clearToasts }),
    [addToast, removeToast, clearToasts]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} position={position} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  /** App content */
  children: PropTypes.node.isRequired,
  /** Toast container position */
  position: PropTypes.oneOf([
    'top-right',
    'top-left',
    'top-center',
    'bottom-right',
    'bottom-left',
    'bottom-center',
  ]),
  /** Maximum number of toasts to show */
  maxToasts: PropTypes.number,
};

/**
 * Toast Container Component
 *
 * Renders the stack of toast notifications.
 */
const ToastContainer = ({ toasts, position, onDismiss }) => {
  const variants = getAnimationVariants(position);

  return (
    <div
      className={clsx(
        'fixed z-[100] flex flex-col gap-2',
        positionClasses[position]
      )}
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={() => onDismiss(toast.id)}
            variants={variants}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

ToastContainer.propTypes = {
  /** Array of toast objects */
  toasts: PropTypes.array.isRequired,
  /** Container position */
  position: PropTypes.string.isRequired,
  /** Dismiss handler */
  onDismiss: PropTypes.func.isRequired,
};

/**
 * Individual Toast Component
 *
 * Renders a single toast notification.
 */
const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  dismissible = true,
  onDismiss,
  variants,
}) => {
  const config = toastTypes[type];
  const Icon = config.icon;

  // Auto-dismiss timer
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  return (
    <motion.div
      layout
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={clsx(
        'relative w-80 sm:w-96',
        'p-4 rounded-lg border shadow-medium',
        'overflow-hidden',
        config.className
      )}
      role="alert"
    >
      <div className="flex gap-3">
        {/* Icon */}
        <Icon className={clsx('w-5 h-5 shrink-0 mt-0.5', config.iconClassName)} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-sm mb-0.5">{title}</p>
          )}
          <p className="text-sm">{message}</p>
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={clsx(
              'shrink-0 p-1 rounded',
              'opacity-60 hover:opacity-100',
              'transition-opacity duration-200',
              'focus:outline-none focus:ring-2 focus:ring-current'
            )}
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress bar for auto-dismiss */}
      {duration > 0 && (
        <motion.div
          className={clsx(
            'absolute bottom-0 left-0 h-1',
            config.progressClassName
          )}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

Toast.propTypes = {
  /** Unique toast ID */
  id: PropTypes.string.isRequired,
  /** Toast type */
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  /** Toast title */
  title: PropTypes.string,
  /** Toast message */
  message: PropTypes.string.isRequired,
  /** Auto-dismiss duration in ms (0 to disable) */
  duration: PropTypes.number,
  /** Whether toast can be manually dismissed */
  dismissible: PropTypes.bool,
  /** Dismiss callback */
  onDismiss: PropTypes.func.isRequired,
  /** Animation variants */
  variants: PropTypes.object,
};

export default Toast;
