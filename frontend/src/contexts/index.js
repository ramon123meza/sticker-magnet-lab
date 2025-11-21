/**
 * Contexts Index
 * Export all context providers and hooks for easy importing
 */

// Cart Context (Zustand Store)
export {
  useCartStore,
  useCartCount,
  useCartTotal,
  useHasCartItems,
} from './CartContext';

// Session Context
export {
  SessionProvider,
  useSession,
  useSessionId,
  useUploadData,
} from './SessionContext';

// UI Context
export {
  UIProvider,
  useUI,
  useToast,
  useModal,
  useLoadingState,
  TOAST_TYPES,
} from './UIContext';
