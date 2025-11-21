import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CartItem - Individual cart item component
 * Displays product details, pricing, and edit/remove functionality
 */
const CartItem = ({
  item,
  onRemove,
  onUpdateInstructions,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [instructions, setInstructions] = useState(item.instructions || '');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleSaveInstructions = () => {
    onUpdateInstructions?.(item.id, instructions);
    setIsEditing(false);
  };

  const handleRemove = () => {
    if (showRemoveConfirm) {
      onRemove?.(item.id);
      setShowRemoveConfirm(false);
    } else {
      setShowRemoveConfirm(true);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveConfirm(false);
  };

  // Calculate total price for this item
  const totalPrice = (item.price * item.quantity).toFixed(2);

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
      >
        {/* Thumbnail */}
        <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-soft-gray">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.name}
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

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-graphite truncate">
            {item.productType} - {item.size}
          </h4>
          <p className="text-xs text-slate-gray">
            Qty: {item.quantity}
          </p>
        </div>

        {/* Price */}
        <p className="text-sm font-semibold text-deep-indigo">
          ${totalPrice}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white rounded-xl shadow-soft p-4 md:p-6 hover:shadow-medium transition-shadow duration-300"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnail */}
        <div className="w-full sm:w-24 md:w-32 aspect-square flex-shrink-0 rounded-lg overflow-hidden bg-soft-gray group">
          {item.thumbnail ? (
            <motion.img
              src={item.thumbnail}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              whileHover={{ scale: 1.05 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-gray">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-lg font-semibold text-graphite">
                {item.productType}
              </h3>
              <p className="text-sm text-slate-gray">
                Size: {item.size}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-gray">
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
              <motion.p
                key={totalPrice}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-xl font-bold text-deep-indigo"
              >
                ${totalPrice}
              </motion.p>
            </div>
          </div>

          {/* Quantity Display */}
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm text-slate-gray">Quantity:</span>
            <span className="inline-flex items-center justify-center px-3 py-1 bg-soft-gray rounded-full text-sm font-medium text-graphite">
              {item.quantity}
            </span>
          </div>

          {/* Instructions Section */}
          <div className="border-t border-gray-100 pt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm text-cool-blue hover:text-deep-indigo transition-colors"
              aria-expanded={isExpanded}
              aria-controls={`instructions-${item.id}`}
            >
              <motion.svg
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
              <span>
                {item.instructions ? 'View/Edit Instructions' : 'Add Instructions'}
              </span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  id={`instructions-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="Add special instructions for this item..."
                          className="input-field min-h-[80px] text-sm"
                          aria-label="Special instructions"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveInstructions}
                            className="px-3 py-1 text-sm bg-cool-blue text-white rounded-lg hover:bg-deep-indigo transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setInstructions(item.instructions || '');
                              setIsEditing(false);
                            }}
                            className="px-3 py-1 text-sm text-slate-gray hover:text-graphite transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-slate-gray italic">
                          {item.instructions || 'No special instructions'}
                        </p>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-sm text-cool-blue hover:text-deep-indigo transition-colors flex-shrink-0"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
        <AnimatePresence mode="wait">
          {showRemoveConfirm ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-slate-gray">Remove item?</span>
              <button
                onClick={handleRemove}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Remove
              </button>
              <button
                onClick={handleCancelRemove}
                className="px-3 py-1 text-sm text-slate-gray hover:text-graphite transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="remove"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleRemove}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors group"
              aria-label="Remove item from cart"
            >
              <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Remove</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CartItem;
