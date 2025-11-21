/**
 * Layout.jsx
 * Main layout wrapper component
 *
 * Features:
 * - Includes Header and Footer
 * - Main content area with proper padding
 * - Scroll to top on route change
 * - Toast notification container
 * - Cart drawer component
 * - Global loading overlay
 * - Modal container
 */

import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';
import { useUI, TOAST_TYPES } from '../../contexts/UIContext';
import { useCartStore } from '../../contexts/CartContext';

/**
 * Toast Notification Component
 */
function Toast({ toast, onRemove }) {
  const icons = {
    [TOAST_TYPES.SUCCESS]: CheckCircle,
    [TOAST_TYPES.ERROR]: AlertCircle,
    [TOAST_TYPES.INFO]: Info,
    [TOAST_TYPES.WARNING]: AlertTriangle,
  };

  const colors = {
    [TOAST_TYPES.SUCCESS]: 'bg-green-500',
    [TOAST_TYPES.ERROR]: 'bg-red-500',
    [TOAST_TYPES.INFO]: 'bg-cool-blue',
    [TOAST_TYPES.WARNING]: 'bg-yellow-500',
  };

  const Icon = icons[toast.type] || Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg shadow-large',
        'bg-white border-l-4',
        toast.type === TOAST_TYPES.SUCCESS && 'border-l-green-500',
        toast.type === TOAST_TYPES.ERROR && 'border-l-red-500',
        toast.type === TOAST_TYPES.INFO && 'border-l-cool-blue',
        toast.type === TOAST_TYPES.WARNING && 'border-l-yellow-500'
      )}
    >
      <div className={clsx('p-1 rounded-full text-white', colors[toast.type])}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold text-graphite">{toast.title}</p>
        )}
        <p className="text-sm text-slate-gray">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 hover:bg-soft-gray rounded transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4 text-slate-gray" />
      </button>
    </motion.div>
  );
}

Toast.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    title: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

/**
 * Toast Container Component
 */
function ToastContainer() {
  const { toasts, removeToast } = useUI();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Cart Item Component
 */
function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCartStore();

  // Handle quantity change
  const handleQuantityChange = (delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0) {
      // Note: In production, you'd fetch the new unit price based on quantity tier
      updateQuantity(item.id, newQuantity, item.unitPrice);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 p-4 border-b border-gray-100"
    >
      {/* Product Image */}
      <div className="w-20 h-20 rounded-lg bg-soft-gray overflow-hidden flex-shrink-0">
        {item.imageData ? (
          <img
            src={item.imageData}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-gray">
            <ShoppingBag className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-graphite truncate">
          {item.productName}
        </h4>
        <p className="text-sm text-slate-gray">
          Size: {item.size}
        </p>
        <p className="text-sm text-slate-gray">
          Qty: {item.quantity} @ ${item.unitPrice.toFixed(2)} each
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={item.quantity <= 1}
            className={clsx(
              'p-1 rounded border border-gray-200',
              'hover:bg-soft-gray transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            className={clsx(
              'p-1 rounded border border-gray-200',
              'hover:bg-soft-gray transition-colors'
            )}
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Price and Remove */}
      <div className="flex flex-col items-end justify-between">
        <p className="font-semibold text-graphite">
          ${item.totalPrice.toFixed(2)}
        </p>
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    size: PropTypes.string,
    quantity: PropTypes.number.isRequired,
    unitPrice: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
    imageData: PropTypes.string,
  }).isRequired,
};

/**
 * Cart Drawer Component
 */
function CartDrawer() {
  const { isCartOpen, closeCart } = useUI();
  const { items, getCartTotal, clearCart } = useCartStore();
  const cartTotal = getCartTotal();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-large z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cool-blue" />
                <h2 className="text-lg font-semibold text-graphite">
                  Your Cart ({items.length})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-soft-gray rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-graphite mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-slate-gray mb-6">
                    Add some awesome stickers or magnets to get started!
                  </p>
                  <Link
                    to="/stickers/die-cut"
                    onClick={closeCart}
                    className="btn-primary"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-4 space-y-4">
                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:underline"
                >
                  Clear Cart
                </button>

                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium text-graphite">Subtotal</span>
                  <span className="font-bold text-graphite">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-slate-gray">
                  Shipping calculated at checkout
                </p>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn-accent w-full flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={closeCart}
                  className="w-full py-2 text-center text-cool-blue hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Global Loading Overlay Component
 */
function GlobalLoadingOverlay() {
  const { isGlobalLoading, globalLoadingMessage } = useUI();

  return (
    <AnimatePresence>
      {isGlobalLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
        >
          <Loader2 className="w-12 h-12 text-cool-blue animate-spin mb-4" />
          <p className="text-lg font-medium text-graphite">
            {globalLoadingMessage || 'Loading...'}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Modal Container Component
 */
function ModalContainer() {
  const { modals, closeModal } = useUI();

  return (
    <AnimatePresence>
      {modals.map((modal) => (
        <motion.div
          key={modal.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeModal(modal.id)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-large max-w-lg w-full max-h-[90vh] overflow-hidden"
          >
            {modal.component && (
              <modal.component
                {...modal.props}
                onClose={() => closeModal(modal.id)}
              />
            )}
          </motion.div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

/**
 * Scroll to Top Component
 * Handles automatic scrolling to top on route changes
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Use instant to prevent jarring scroll on navigation
    });
  }, [pathname]);

  return null;
}

/**
 * Main Layout Component
 */
export default function Layout({ children }) {
  const { closeAllOverlays } = useUI();
  const location = useLocation();

  // Close overlays on route change
  useEffect(() => {
    closeAllOverlays();
  }, [location.pathname, closeAllOverlays]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Scroll to Top Handler */}
      <ScrollToTop />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Modal Container */}
      <ModalContainer />

      {/* Global Loading Overlay */}
      <GlobalLoadingOverlay />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
