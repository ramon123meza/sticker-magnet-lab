import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingDown, Package, DollarSign, Sparkles } from 'lucide-react';
import { formatPrice, getPrice, getPricePerUnit, getSavings } from '../../data/products';

const PriceCalculator = ({
  product,
  selectedSize,
  selectedQuantity,
  onSizeChange,
  onQuantityChange,
  compact = false
}) => {
  const [animatePrice, setAnimatePrice] = useState(false);

  const totalPrice = getPrice(product, selectedSize, selectedQuantity);
  const pricePerUnit = getPricePerUnit(product, selectedSize, selectedQuantity);
  const savings = getSavings(product, selectedSize, selectedQuantity);

  // Animate price when it changes
  useEffect(() => {
    setAnimatePrice(true);
    const timer = setTimeout(() => setAnimatePrice(false), 300);
    return () => clearTimeout(timer);
  }, [totalPrice]);

  // Get next quantity tier for comparison
  const getNextQuantityTier = () => {
    const quantities = product.quantities;
    const currentIndex = quantities.indexOf(selectedQuantity);
    if (currentIndex < quantities.length - 1) {
      const nextQty = quantities[currentIndex + 1];
      const nextPrice = getPrice(product, selectedSize, nextQty);
      const nextPricePerUnit = getPricePerUnit(product, selectedSize, nextQty);
      const additionalSavings = Math.round((1 - nextPricePerUnit / pricePerUnit) * 100);
      return { qty: nextQty, price: nextPrice, perUnit: nextPricePerUnit, savings: additionalSavings };
    }
    return null;
  };

  const nextTier = getNextQuantityTier();

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-5 h-5 text-cool-blue" />
          <h3 className="font-semibold text-graphite">Price Calculator</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Size Dropdown */}
          <div>
            <label className="block text-xs text-slate-gray mb-1">Size</label>
            <select
              value={selectedSize}
              onChange={(e) => onSizeChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-soft-gray border-0 rounded-lg focus:ring-2 focus:ring-cool-blue"
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>{size}"</option>
              ))}
            </select>
          </div>

          {/* Quantity Dropdown */}
          <div>
            <label className="block text-xs text-slate-gray mb-1">Quantity</label>
            <select
              value={selectedQuantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-soft-gray border-0 rounded-lg focus:ring-2 focus:ring-cool-blue"
            >
              {product.quantities.map((qty) => (
                <option key={qty} value={qty}>{qty}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Display */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-slate-gray">Total:</span>
          <motion.span
            className="text-xl font-bold text-deep-indigo"
            animate={{ scale: animatePrice ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {formatPrice(totalPrice)}
          </motion.span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-deep-indigo to-cool-blue p-4">
        <div className="flex items-center gap-3 text-white">
          <Calculator className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Price Calculator</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Size Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-graphite mb-3">
            <Package className="w-4 h-4 text-cool-blue" />
            Select Size (inches)
          </label>
          <div className="relative">
            <select
              value={selectedSize}
              onChange={(e) => onSizeChange(e.target.value)}
              className="w-full px-4 py-3 bg-soft-gray border-2 border-transparent rounded-xl text-graphite appearance-none cursor-pointer transition-all duration-200 focus:border-cool-blue focus:bg-white"
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}" - {formatPrice(getPrice(product, size, selectedQuantity))}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-slate-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quantity Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-graphite mb-3">
            <DollarSign className="w-4 h-4 text-cool-blue" />
            Select Quantity
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {product.quantities.slice(0, 10).map((qty) => (
              <motion.button
                key={qty}
                onClick={() => onQuantityChange(qty)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedQuantity === qty
                    ? 'bg-cool-blue text-white shadow-md'
                    : 'bg-soft-gray text-graphite hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {qty}
              </motion.button>
            ))}
          </div>
          {product.quantities.length > 10 && (
            <div className="mt-3">
              <select
                value={selectedQuantity}
                onChange={(e) => onQuantityChange(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-soft-gray border-0 rounded-lg text-sm text-graphite"
              >
                {product.quantities.map((qty) => (
                  <option key={qty} value={qty}>{qty} units</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          {/* Total Price */}
          <div className="flex items-center justify-between">
            <span className="text-slate-gray">Total Price:</span>
            <motion.span
              className="text-3xl font-bold text-deep-indigo"
              animate={{ scale: animatePrice ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {formatPrice(totalPrice)}
            </motion.span>
          </div>

          {/* Price per unit */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-gray">Price per unit:</span>
            <span className="font-semibold text-graphite">{formatPrice(pricePerUnit)}/ea</span>
          </div>

          {/* Savings badge */}
          <AnimatePresence>
            {savings > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg"
              >
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">
                  You save <span className="font-bold">{savings}%</span> compared to buying 12!
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next tier suggestion */}
          <AnimatePresence>
            {nextTier && nextTier.savings > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-soft-sky/50 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-cool-blue mt-0.5" />
                  <div className="text-sm">
                    <p className="text-graphite">
                      Order <span className="font-semibold">{nextTier.qty}</span> and save{' '}
                      <span className="font-semibold text-cool-blue">{nextTier.savings}% more</span>!
                    </p>
                    <p className="text-slate-gray mt-1">
                      Just {formatPrice(nextTier.price)} ({formatPrice(nextTier.perUnit)}/ea)
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
