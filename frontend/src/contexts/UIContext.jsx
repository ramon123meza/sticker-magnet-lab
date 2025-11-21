/**
 * UIContext.jsx
 * UI state management using React Context
 *
 * Handles:
 * - Mobile menu open/close
 * - Cart drawer open/close
 * - Modal states
 * - Toast notifications queue
 * - Loading states
 */

import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// Toast types for styling
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Default toast duration in milliseconds
const DEFAULT_TOAST_DURATION = 5000;

// Maximum toasts to show at once
const MAX_TOASTS = 5;

// Create the context
const UIContext = createContext(null);

/**
 * Toast structure:
 * {
 *   id: string,
 *   type: 'success' | 'error' | 'info' | 'warning',
 *   message: string,
 *   title?: string,
 *   duration: number,
 *   timestamp: number,
 * }
 */

/**
 * Modal structure:
 * {
 *   id: string,
 *   component: React Component or null,
 *   props: object,
 *   onClose?: function,
 * }
 */

/**
 * UI Provider Component
 * Provides UI state management across the app
 */
export function UIProvider({ children }) {
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cart drawer state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modal state
  const [modals, setModals] = useState([]);

  // Toast notifications queue
  const [toasts, setToasts] = useState([]);

  // Loading states map
  const [loadingStates, setLoadingStates] = useState({});

  // Global loading overlay
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [globalLoadingMessage, setGlobalLoadingMessage] = useState('');

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Toast timeout refs for cleanup
  const toastTimeouts = useRef({});

  // Clean up toast timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(toastTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  // ========================
  // Mobile Menu Functions
  // ========================

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  const toggleMobileMenu = useCallback(() => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }, [isMobileMenuOpen, openMobileMenu, closeMobileMenu]);

  // ========================
  // Cart Drawer Functions
  // ========================

  const openCart = useCallback(() => {
    setIsCartOpen(true);
    closeMobileMenu(); // Close mobile menu if open
  }, [closeMobileMenu]);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    if (isCartOpen) {
      closeCart();
    } else {
      openCart();
    }
  }, [isCartOpen, openCart, closeCart]);

  // ========================
  // Modal Functions
  // ========================

  const openModal = useCallback((component, props = {}, onClose = null) => {
    const modalId = uuidv4();
    setModals((prev) => [
      ...prev,
      {
        id: modalId,
        component,
        props,
        onClose,
      },
    ]);
    document.body.style.overflow = 'hidden';
    return modalId;
  }, []);

  const closeModal = useCallback((modalId) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.id === modalId);
      if (modal?.onClose) {
        modal.onClose();
      }
      const newModals = prev.filter((m) => m.id !== modalId);
      if (newModals.length === 0) {
        document.body.style.overflow = '';
      }
      return newModals;
    });
  }, []);

  const closeAllModals = useCallback(() => {
    modals.forEach((modal) => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    setModals([]);
    document.body.style.overflow = '';
  }, [modals]);

  // ========================
  // Toast Functions
  // ========================

  const addToast = useCallback((message, type = TOAST_TYPES.INFO, options = {}) => {
    const {
      title,
      duration = DEFAULT_TOAST_DURATION,
    } = options;

    const toastId = uuidv4();

    const newToast = {
      id: toastId,
      type,
      message,
      title,
      duration,
      timestamp: Date.now(),
    };

    setToasts((prev) => {
      // Remove oldest toast if we're at max
      const newToasts = prev.length >= MAX_TOASTS
        ? [...prev.slice(1), newToast]
        : [...prev, newToast];
      return newToasts;
    });

    // Set up auto-removal if duration > 0
    if (duration > 0) {
      toastTimeouts.current[toastId] = setTimeout(() => {
        removeToast(toastId);
      }, duration);
    }

    return toastId;
  }, []);

  const removeToast = useCallback((toastId) => {
    // Clear the timeout if it exists
    if (toastTimeouts.current[toastId]) {
      clearTimeout(toastTimeouts.current[toastId]);
      delete toastTimeouts.current[toastId];
    }

    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  const clearAllToasts = useCallback(() => {
    // Clear all timeouts
    Object.values(toastTimeouts.current).forEach(clearTimeout);
    toastTimeouts.current = {};
    setToasts([]);
  }, []);

  // Convenience toast methods
  const showSuccess = useCallback((message, options = {}) => {
    return addToast(message, TOAST_TYPES.SUCCESS, options);
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    return addToast(message, TOAST_TYPES.ERROR, { ...options, duration: options.duration || 7000 });
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    return addToast(message, TOAST_TYPES.INFO, options);
  }, [addToast]);

  const showWarning = useCallback((message, options = {}) => {
    return addToast(message, TOAST_TYPES.WARNING, options);
  }, [addToast]);

  // ========================
  // Loading State Functions
  // ========================

  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: isLoading,
    }));
  }, []);

  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const clearLoadingStates = useCallback(() => {
    setLoadingStates({});
  }, []);

  // Global loading overlay
  const showGlobalLoading = useCallback((message = 'Loading...') => {
    setGlobalLoadingMessage(message);
    setIsGlobalLoading(true);
  }, []);

  const hideGlobalLoading = useCallback(() => {
    setIsGlobalLoading(false);
    setGlobalLoadingMessage('');
  }, []);

  // ========================
  // Dropdown Functions
  // ========================

  const openDropdown = useCallback((dropdownId) => {
    setActiveDropdown(dropdownId);
  }, []);

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  const toggleDropdown = useCallback((dropdownId) => {
    setActiveDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  }, []);

  const isDropdownOpen = useCallback((dropdownId) => {
    return activeDropdown === dropdownId;
  }, [activeDropdown]);

  // ========================
  // Utility Functions
  // ========================

  // Close all overlays (useful for route changes)
  const closeAllOverlays = useCallback(() => {
    closeMobileMenu();
    closeCart();
    closeDropdown();
    // Keep modals open by default, they should be explicitly closed
  }, [closeMobileMenu, closeCart, closeDropdown]);

  // Reset all UI state
  const resetUIState = useCallback(() => {
    closeMobileMenu();
    closeCart();
    closeAllModals();
    clearAllToasts();
    clearLoadingStates();
    hideGlobalLoading();
    closeDropdown();
  }, [
    closeMobileMenu,
    closeCart,
    closeAllModals,
    clearAllToasts,
    clearLoadingStates,
    hideGlobalLoading,
    closeDropdown,
  ]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    // Mobile menu
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,

    // Cart drawer
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,

    // Modals
    modals,
    openModal,
    closeModal,
    closeAllModals,

    // Toasts
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,

    // Loading states
    loadingStates,
    setLoading,
    isLoading,
    clearLoadingStates,
    isGlobalLoading,
    globalLoadingMessage,
    showGlobalLoading,
    hideGlobalLoading,

    // Dropdowns
    activeDropdown,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    isDropdownOpen,

    // Utilities
    closeAllOverlays,
    resetUIState,
  }), [
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    modals,
    openModal,
    closeModal,
    closeAllModals,
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    loadingStates,
    setLoading,
    isLoading,
    clearLoadingStates,
    isGlobalLoading,
    globalLoadingMessage,
    showGlobalLoading,
    hideGlobalLoading,
    activeDropdown,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    isDropdownOpen,
    closeAllOverlays,
    resetUIState,
  ]);

  return (
    <UIContext.Provider value={contextValue}>
      {children}
    </UIContext.Provider>
  );
}

UIProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to access UI context
 * @returns {Object} UI context value
 * @throws {Error} If used outside of UIProvider
 */
export function useUI() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }

  return context;
}

/**
 * Hook for toast notifications only
 * @returns {Object} Toast methods
 */
export function useToast() {
  const {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  } = useUI();

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}

/**
 * Hook for modal management only
 * @returns {Object} Modal methods
 */
export function useModal() {
  const {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  } = useUI();

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };
}

/**
 * Hook for loading states only
 * @returns {Object} Loading state methods
 */
export function useLoadingState() {
  const {
    loadingStates,
    setLoading,
    isLoading,
    clearLoadingStates,
    isGlobalLoading,
    globalLoadingMessage,
    showGlobalLoading,
    hideGlobalLoading,
  } = useUI();

  return {
    loadingStates,
    setLoading,
    isLoading,
    clearLoadingStates,
    isGlobalLoading,
    globalLoadingMessage,
    showGlobalLoading,
    hideGlobalLoading,
  };
}

export default UIContext;
