import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, Truck, Sparkles, Calculator } from 'lucide-react';
import {
  getPrice,
  getPerUnitPrice,
  getSavingsPercentage
} from '../../data/pricingData';

/**
 * PriceDisplay - Live price component with animations
 *
 * Features:
 * - Large price display
 * - Animated number changes
 * - Per-unit breakdown
 * - Savings comparison
 * - Free shipping badge
 */
export default function PriceDisplay({
  productType,
  size,
  quantity,
  className = ''
}) {
  const [displayPrice, setDisplayPrice] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevPriceRef = useRef(0);

  const price = getPrice(productType, size, quantity) || 0;
  const perUnitPrice = getPerUnitPrice(productType, size, quantity) || 0;
  const savingsPercent = getSavingsPercentage(productType, size, quantity);
  const showFreeShipping = price >= 50;

  // Animate price changes
  useEffect(() => {
    if (price === prevPriceRef.current) return;

    setIsAnimating(true);
    const startValue = prevPriceRef.current;
    const endValue = price;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;

      setDisplayPrice(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        prevPriceRef.current = endValue;
      }
    };

    requestAnimationFrame(animate);
  }, [price]);

  // Format currency
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-white to-soft-sky/30 rounded-2xl p-6 border border-gray-100 shadow-soft ${className}`}
    >
      {/* Main Price */}
      <div className="text-center mb-4">
        <motion.div
          className="relative inline-block"
          animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm text-gray-500 font-medium">Total Price</span>
          <div className="flex items-baseline justify-center">
            <span className="text-lg text-gray-400 mr-1">$</span>
            <motion.span
              key={price}
              className="text-4xl md:text-5xl font-bold text-deep-indigo"
            >
              {displayPrice.toFixed(2).split('.')[0]}
            </motion.span>
            <span className="text-xl md:text-2xl font-bold text-deep-indigo">
              .{displayPrice.toFixed(2).split('.')[1]}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Per Unit Price */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Calculator className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">
          <span className="font-semibold text-graphite">
            {formatPrice(perUnitPrice)}
          </span>
          {' '}per piece
        </span>
      </div>

      {/* Savings Badge */}
      <AnimatePresence mode="wait">
        {savingsPercent > 0 && (
          <motion.div
            key={savingsPercent}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="flex justify-center mb-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-semibold text-sm">
                Save {savingsPercent}% vs 12 qty
              </span>
              <Sparkles className="w-4 h-4 text-green-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Free Shipping Badge */}
      <AnimatePresence>
        {showFreeShipping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cool-blue/10 rounded-full">
              <Truck className="w-4 h-4 text-cool-blue" />
              <span className="text-cool-blue font-medium text-sm">
                Free Shipping
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quantity Breakdown */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{quantity.toLocaleString()} pieces @ {formatPrice(perUnitPrice)}/ea</span>
          <span className="font-semibold">{formatPrice(price)}</span>
        </div>
      </div>

      {/* Price Guarantee */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-center text-gray-400 mt-4"
      >
        Price includes printing, cutting, and packaging
      </motion.p>
    </motion.div>
  );
}
