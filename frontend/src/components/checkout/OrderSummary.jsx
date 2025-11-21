import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * OrderSummary - Checkout sidebar component
 * Shows cart items preview, pricing breakdown, and trust badges
 */
const OrderSummary = ({
  items = [],
  subtotal = 0,
  shipping = 0,
  total = 0,
  showEditLink = true,
  compact = false,
}) => {
  const isFreeShipping = shipping === 0;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-soft p-6 sticky top-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-graphite">Order Summary</h3>
        {showEditLink && (
          <Link
            to="/cart"
            className="text-sm text-cool-blue hover:text-deep-indigo transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </Link>
        )}
      </div>

      {/* Cart Items Preview */}
      {!compact && items.length > 0 && (
        <div className="mb-4 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-soft-gray">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.productType}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-gray">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-graphite truncate">
                    {item.productType}
                  </h4>
                  <p className="text-xs text-slate-gray">
                    {item.size} x {item.quantity}
                  </p>
                </div>

                {/* Price */}
                <p className="text-sm font-semibold text-graphite">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pricing Breakdown */}
      <div className="space-y-3 mb-4">
        {/* Items Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-gray">Items ({itemCount})</span>
          <span className="text-graphite">${subtotal.toFixed(2)}</span>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-gray">Subtotal</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={subtotal}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="text-graphite font-medium"
            >
              ${subtotal.toFixed(2)}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-gray">Shipping</span>
          {isFreeShipping ? (
            <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              FREE
            </span>
          ) : (
            <span className="text-graphite font-medium">${shipping.toFixed(2)}</span>
          )}
        </div>

        {/* Tax Notice */}
        <p className="text-xs text-slate-gray italic">
          * Taxes calculated at checkout if applicable
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* Total */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-bold text-graphite">Total</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={total}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-2xl font-bold text-deep-indigo"
          >
            ${total.toFixed(2)}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-sm text-slate-gray">Secure 256-bit SSL Encryption</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="text-sm text-slate-gray">Free Shipping on All Orders</span>
        </div>

        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-slate-gray">100% Satisfaction Guarantee</span>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-4 p-3 bg-soft-gray rounded-lg">
        <p className="text-xs text-slate-gray text-center">
          Questions? Contact us at{' '}
          <a href="mailto:orders@rrinconline.com" className="text-cool-blue hover:underline">
            orders@rrinconline.com
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
