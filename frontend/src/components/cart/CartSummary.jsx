import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * CartSummary - Order summary component for cart/checkout
 * Shows subtotal, shipping, total, and trust badges
 */
const CartSummary = ({
  subtotal = 0,
  shipping = 0,
  total = 0,
  itemCount = 0,
  showCheckoutButton = true,
  showEditLink = false,
  isCheckout = false,
  onCheckout,
  isLoading = false,
}) => {
  const isFreeShipping = shipping === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-soft p-6 ${isCheckout ? 'sticky top-24' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-graphite">Order Summary</h3>
        {showEditLink && (
          <Link
            to="/cart"
            className="text-sm text-cool-blue hover:text-deep-indigo transition-colors"
          >
            Edit Cart
          </Link>
        )}
      </div>

      {/* Item Count */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-slate-gray">Items ({itemCount})</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={subtotal}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-graphite font-medium"
          >
            ${subtotal.toFixed(2)}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-gray">Subtotal</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={subtotal}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-graphite font-medium"
          >
            ${subtotal.toFixed(2)}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Shipping */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-gray">Shipping</span>
        {isFreeShipping ? (
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1 text-green-600 font-semibold"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            FREE
          </motion.span>
        ) : (
          <span className="text-graphite font-medium">
            ${shipping.toFixed(2)}
          </span>
        )}
      </div>

      {/* Free Shipping Banner */}
      {isFreeShipping && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4"
        >
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span className="font-medium">You qualify for FREE shipping!</span>
          </div>
        </motion.div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* Total */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-semibold text-graphite">Total</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={total}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-2xl font-bold text-deep-indigo"
          >
            ${total.toFixed(2)}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <motion.button
          onClick={onCheckout}
          disabled={isLoading || itemCount === 0}
          whileHover={{ scale: itemCount > 0 ? 1.02 : 1 }}
          whileTap={{ scale: itemCount > 0 ? 0.98 : 1 }}
          className="btn-accent w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            'Proceed to Checkout'
          )}
        </motion.button>
      )}

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          {/* Secure Checkout */}
          <div className="flex items-center gap-2 text-slate-gray">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs">Secure Checkout</span>
          </div>

          {/* Money Back */}
          <div className="flex items-center gap-2 text-slate-gray">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Money Back Guarantee</span>
          </div>

          {/* Quality Products */}
          <div className="flex items-center gap-2 text-slate-gray">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-xs">Premium Quality</span>
          </div>

          {/* Fast Delivery */}
          <div className="flex items-center gap-2 text-slate-gray">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs">Fast Production</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-center text-slate-gray mb-2">Accepted Payment Methods</p>
        <div className="flex items-center justify-center gap-3">
          {/* Visa */}
          <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-blue-700">VISA</span>
          </div>
          {/* Mastercard */}
          <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-orange-500">MC</span>
          </div>
          {/* Amex */}
          <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-blue-500">AMEX</span>
          </div>
          {/* Discover */}
          <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-orange-600">DISC</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;
