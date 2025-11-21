import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from './CartItem';

/**
 * CartDrawer - Slide-in cart drawer component
 * Triggered by header cart icon, slides in from right
 */
const CartDrawer = ({
  isOpen,
  onClose,
  items = [],
  onRemoveItem,
  onUpdateInstructions,
}) => {
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  // Backdrop animation
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Drawer animation
  const drawerVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-large z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-graphite">Your Cart</h2>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center justify-center w-6 h-6 bg-cool-blue text-white text-xs font-bold rounded-full"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-soft-gray rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-6 h-6 text-slate-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                /* Empty State */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full px-6 text-center"
                >
                  <div className="w-24 h-24 mb-6 bg-soft-gray rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-graphite mb-2">Your cart is empty</h3>
                  <p className="text-slate-gray mb-6">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/products');
                    }}
                    className="btn-primary"
                  >
                    Start Shopping
                  </button>
                </motion.div>
              ) : (
                /* Cart Items */
                <div className="px-4 py-4 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        compact
                        onRemove={onRemoveItem}
                        onUpdateInstructions={onUpdateInstructions}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-gray-100 px-6 py-4 bg-white"
              >
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-gray">Subtotal</span>
                  <motion.span
                    key={subtotal}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-xl font-bold text-deep-indigo"
                  >
                    ${subtotal.toFixed(2)}
                  </motion.span>
                </div>

                {/* Free Shipping Notice */}
                <div className="flex items-center gap-2 mb-4 p-2 bg-green-50 rounded-lg">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-700 font-medium">FREE shipping on all orders!</span>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <motion.button
                    onClick={handleCheckout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-accent w-full py-3"
                  >
                    Checkout
                  </motion.button>
                  <button
                    onClick={handleViewCart}
                    className="btn-secondary w-full py-3"
                  >
                    View Cart
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
