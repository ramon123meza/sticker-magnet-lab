import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Ruler, Package } from 'lucide-react';
import {
  getAvailableSizes,
  QUANTITIES,
  FRIDGE_MAGNET_SIZES,
  PRODUCT_TYPES
} from '../../data/pricingData';

/**
 * SizeQuantitySelector - Combined selector component for size and quantity
 *
 * Features:
 * - Size dropdown with visual size reference
 * - Quantity buttons/dropdown
 * - Animated highlight on selection change
 * - Disabled states during loading
 * - Fridge magnet sub-selector
 */
export default function SizeQuantitySelector({
  productType = PRODUCT_TYPES.STICKERS,
  selectedSize,
  onSizeChange,
  selectedQuantity = 12,
  onQuantityChange,
  disabled = false,
  className = ''
}) {
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);

  const availableSizes = getAvailableSizes(productType);
  const isFridgeMagnet = productType === PRODUCT_TYPES.FRIDGE_MAGNETS;

  // Popular quantities to show as buttons
  const popularQuantities = [12, 25, 50, 100, 1000];
  const allQuantities = QUANTITIES;

  // Parse size for display
  const parseSizeLabel = (size) => {
    if (size.includes('x')) {
      const parts = size.split('x');
      return `${parts[0]}" x ${parts[1]}"`;
    }
    return size;
  };

  // Get visual size indicator (relative to 22x22 max)
  const getSizeIndicator = (size) => {
    const parts = size.split('x');
    const maxDim = Math.max(parseFloat(parts[0]), parseFloat(parts[1]));
    const percentage = (maxDim / 22) * 100;
    return Math.max(20, Math.min(percentage, 100));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Fridge Magnet Sub-selector */}
      {isFridgeMagnet && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-graphite">
            <Ruler className="w-4 h-4 text-cool-blue" />
            Fridge Magnet Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FRIDGE_MAGNET_SIZES.map((size) => (
              <motion.button
                key={size}
                onClick={() => onSizeChange?.(size)}
                disabled={disabled}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-3 rounded-lg border-2 text-sm font-medium
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${selectedSize === size
                    ? 'border-cool-blue bg-soft-sky text-cool-blue'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                {selectedSize === size && (
                  <motion.span
                    layoutId="selectedFridgeSize"
                    className="absolute top-1 right-1"
                  >
                    <Check className="w-4 h-4 text-cool-blue" />
                  </motion.span>
                )}
                {parseSizeLabel(size)}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selector (for non-fridge magnets) */}
      {!isFridgeMagnet && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-graphite">
            <Ruler className="w-4 h-4 text-cool-blue" />
            Select Size
          </label>

          <div className="relative">
            <motion.button
              onClick={() => !disabled && setSizeDropdownOpen(!sizeDropdownOpen)}
              disabled={disabled}
              whileHover={{ scale: 1.01 }}
              className={`
                w-full flex items-center justify-between p-4
                bg-white border-2 rounded-xl
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${sizeDropdownOpen
                  ? 'border-cool-blue shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-3">
                {/* Visual size indicator */}
                <div className="relative w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                  <motion.div
                    key={selectedSize}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute bg-cool-blue rounded"
                    style={{
                      width: `${getSizeIndicator(selectedSize)}%`,
                      height: `${getSizeIndicator(selectedSize)}%`,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                </div>

                <div className="text-left">
                  <div className="font-semibold text-graphite">
                    {parseSizeLabel(selectedSize)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {productType === PRODUCT_TYPES.STICKERS ? 'Vinyl Sticker' : 'Die-Cut Magnet'}
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ rotate: sizeDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {sizeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="
                    absolute z-50 w-full mt-2 py-2
                    bg-white border border-gray-200 rounded-xl
                    shadow-large max-h-64 overflow-y-auto
                  "
                >
                  {availableSizes.map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => {
                        onSizeChange?.(size);
                        setSizeDropdownOpen(false);
                      }}
                      whileHover={{ backgroundColor: 'rgba(215, 232, 255, 0.5)' }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3
                        transition-colors duration-150
                        ${selectedSize === size
                          ? 'bg-soft-sky text-cool-blue'
                          : 'text-graphite'
                        }
                      `}
                    >
                      {/* Visual indicator */}
                      <div className="relative w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <div
                          className={`
                            absolute rounded
                            ${selectedSize === size ? 'bg-cool-blue' : 'bg-gray-400'}
                          `}
                          style={{
                            width: `${getSizeIndicator(size)}%`,
                            height: `${getSizeIndicator(size)}%`,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                          }}
                        />
                      </div>

                      <span className="font-medium">{parseSizeLabel(size)}</span>

                      {selectedSize === size && (
                        <Check className="w-5 h-5 text-cool-blue ml-auto" />
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-graphite">
          <Package className="w-4 h-4 text-cool-blue" />
          Quantity
        </label>

        {/* Popular quantities as buttons */}
        <div className="flex flex-wrap gap-2">
          {popularQuantities.map((qty) => (
            <motion.button
              key={qty}
              onClick={() => onQuantityChange?.(qty)}
              disabled={disabled}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${selectedQuantity === qty
                  ? 'bg-cool-blue text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-cool-blue'
                }
              `}
            >
              {qty.toLocaleString()}
              {selectedQuantity === qty && (
                <motion.span
                  layoutId="selectedQty"
                  className="absolute inset-0 bg-cool-blue rounded-lg -z-10"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Full quantity dropdown for all options */}
        <div className="relative">
          <select
            value={selectedQuantity}
            onChange={(e) => onQuantityChange?.(parseInt(e.target.value))}
            disabled={disabled}
            className="
              w-full p-3 pr-10 bg-white border-2 border-gray-200 rounded-lg
              text-graphite font-medium appearance-none cursor-pointer
              transition-all duration-200
              hover:border-gray-300 focus:border-cool-blue focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {allQuantities.map((qty) => (
              <option key={qty} value={qty}>
                {qty.toLocaleString()} pieces
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Quantity info */}
        <p className="text-xs text-gray-500">
          Select quantity for better per-piece pricing
        </p>
      </div>

      {/* Close dropdown when clicking outside */}
      {sizeDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setSizeDropdownOpen(false)}
        />
      )}
    </div>
  );
}
