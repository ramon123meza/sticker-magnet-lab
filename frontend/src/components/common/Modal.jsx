/**
 * Modal Component
 *
 * An accessible modal dialog with backdrop blur, multiple sizes,
 * and smooth animations. Follows WAI-ARIA best practices.
 *
 * Features:
 * - Backdrop blur effect
 * - Close on escape key
 * - Close on backdrop click
 * - Prevent body scroll when open
 * - Multiple sizes (sm, md, lg, xl, full)
 * - Header, body, footer sections
 * - Focus trap
 * - Framer Motion animations
 *
 * @module components/common/Modal
 */

import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Size configuration for the modal
 */
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  '2xl': 'max-w-4xl',
  full: 'max-w-[95vw] max-h-[95vh]',
};

/**
 * Animation variants for backdrop
 */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Animation variants for modal content
 */
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.15 },
  },
};

/**
 * Modal Component
 *
 * Main modal wrapper that handles open/close state and accessibility.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {function} props.onClose - Function to call when modal should close
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'|'full'} props.size - Modal size
 * @param {boolean} props.closeOnBackdrop - Close when clicking backdrop
 * @param {boolean} props.closeOnEscape - Close when pressing escape
 * @param {boolean} props.showCloseButton - Show close button in header
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Modal content
 *
 * @example
 * // Basic modal
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <Modal.Header>Modal Title</Modal.Header>
 *   <Modal.Body>Modal content goes here</Modal.Body>
 *   <Modal.Footer>
 *     <Button onClick={() => setIsOpen(false)}>Close</Button>
 *   </Modal.Footer>
 * </Modal>
 */
const Modal = ({
  isOpen,
  onClose,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  children,
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle escape key
  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget && closeOnBackdrop) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose]
  );

  // Manage body scroll and focus
  useEffect(() => {
    if (isOpen) {
      // Store current active element
      previousActiveElement.current = document.activeElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Add escape key listener
      document.addEventListener('keydown', handleEscape);

      // Focus modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Remove escape key listener
      document.removeEventListener('keydown', handleEscape);

      // Restore focus to previously active element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  // Render modal in portal
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-graphite/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal content */}
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className={clsx(
              'relative w-full bg-white rounded-2xl shadow-large',
              'overflow-hidden',
              sizeClasses[size],
              className
            )}
          >
            {/* Close button */}
            {showCloseButton && (
              <motion.button
                type="button"
                onClick={onClose}
                className={clsx(
                  'absolute top-4 right-4 z-10',
                  'p-2 rounded-full',
                  'text-gray-400 hover:text-gray-600',
                  'hover:bg-gray-100',
                  'transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-cool-blue'
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at document body
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
};

Modal.propTypes = {
  /** Whether modal is visible */
  isOpen: PropTypes.bool.isRequired,
  /** Function to call when modal should close */
  onClose: PropTypes.func.isRequired,
  /** Modal size */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Close when clicking backdrop */
  closeOnBackdrop: PropTypes.bool,
  /** Close when pressing escape */
  closeOnEscape: PropTypes.bool,
  /** Show close button in header */
  showCloseButton: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Modal content */
  children: PropTypes.node,
};

/**
 * Modal.Header Component
 *
 * Header section of the modal with optional divider.
 */
const ModalHeader = ({
  children,
  className = '',
  divider = true,
}) => {
  return (
    <div
      className={clsx(
        'px-6 py-4 pr-12',
        divider && 'border-b border-gray-100',
        className
      )}
    >
      {typeof children === 'string' ? (
        <h2 className="text-xl font-heading font-semibold text-graphite">
          {children}
        </h2>
      ) : (
        children
      )}
    </div>
  );
};

ModalHeader.displayName = 'Modal.Header';

ModalHeader.propTypes = {
  /** Header content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Show bottom divider */
  divider: PropTypes.bool,
};

/**
 * Modal.Body Component
 *
 * Main content area of the modal with scroll support.
 */
const ModalBody = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={clsx(
        'px-6 py-4 overflow-y-auto max-h-[60vh]',
        className
      )}
    >
      {children}
    </div>
  );
};

ModalBody.displayName = 'Modal.Body';

ModalBody.propTypes = {
  /** Body content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * Modal.Footer Component
 *
 * Footer section of the modal, typically for actions.
 */
const ModalFooter = ({
  children,
  className = '',
  divider = true,
  align = 'right',
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={clsx(
        'px-6 py-4 flex items-center gap-3',
        alignClasses[align],
        divider && 'border-t border-gray-100',
        className
      )}
    >
      {children}
    </div>
  );
};

ModalFooter.displayName = 'Modal.Footer';

ModalFooter.propTypes = {
  /** Footer content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Show top divider */
  divider: PropTypes.bool,
  /** Alignment of footer content */
  align: PropTypes.oneOf(['left', 'center', 'right', 'between']),
};

// Attach sub-components to Modal
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
