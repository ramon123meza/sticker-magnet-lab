/**
 * PriceDisplay Component
 *
 * A comprehensive price display component for e-commerce with
 * support for original/sale prices, currency formatting, and savings display.
 *
 * Features:
 * - Currency symbol and formatting
 * - Original and sale price display
 * - Per-unit pricing
 * - Savings display (amount or percentage)
 * - Multiple size options
 * - Animated price changes
 *
 * @module components/common/PriceDisplay
 */

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Size configurations for the price display
 */
const sizeClasses = {
  sm: {
    price: 'text-lg font-semibold',
    original: 'text-sm',
    savings: 'text-xs',
    perUnit: 'text-xs',
  },
  md: {
    price: 'text-2xl font-bold',
    original: 'text-base',
    savings: 'text-sm',
    perUnit: 'text-sm',
  },
  lg: {
    price: 'text-3xl sm:text-4xl font-bold',
    original: 'text-lg',
    savings: 'text-base',
    perUnit: 'text-base',
  },
  xl: {
    price: 'text-4xl sm:text-5xl font-bold',
    original: 'text-xl',
    savings: 'text-lg',
    perUnit: 'text-lg',
  },
};

/**
 * Format price with proper currency display
 *
 * @param {number} amount - Price amount
 * @param {string} currency - Currency code (USD, EUR, etc.)
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted price string
 */
const formatPrice = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculate savings
 *
 * @param {number} original - Original price
 * @param {number} sale - Sale price
 * @returns {{ amount: number, percentage: number }}
 */
const calculateSavings = (original, sale) => {
  const amount = original - sale;
  const percentage = Math.round((amount / original) * 100);
  return { amount, percentage };
};

/**
 * Animation variants for price changes
 */
const priceVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/**
 * PriceDisplay Component
 *
 * Displays product pricing with optional sale prices and savings.
 *
 * @param {Object} props - Component props
 * @param {number} props.price - Current/sale price
 * @param {number} props.originalPrice - Original price (for sale items)
 * @param {string} props.currency - Currency code
 * @param {string} props.locale - Locale for formatting
 * @param {'sm'|'md'|'lg'|'xl'} props.size - Display size
 * @param {string} props.perUnit - Per-unit text (e.g., "/each", "/pack")
 * @param {boolean} props.showSavings - Show savings amount/percentage
 * @param {'amount'|'percentage'|'both'} props.savingsFormat - Savings display format
 * @param {'row'|'column'} props.layout - Layout direction
 * @param {boolean} props.animate - Animate price changes
 * @param {string} props.className - Additional CSS classes
 *
 * @example
 * // Basic price
 * <PriceDisplay price={19.99} />
 *
 * @example
 * // Sale price with savings
 * <PriceDisplay
 *   price={14.99}
 *   originalPrice={19.99}
 *   showSavings
 *   savingsFormat="both"
 * />
 *
 * @example
 * // Price with per-unit
 * <PriceDisplay
 *   price={2.99}
 *   perUnit="/sticker"
 *   size="lg"
 * />
 */
const PriceDisplay = ({
  price,
  originalPrice,
  currency = 'USD',
  locale = 'en-US',
  size = 'md',
  perUnit,
  showSavings = false,
  savingsFormat = 'percentage',
  layout = 'row',
  animate = true,
  className = '',
}) => {
  const styles = sizeClasses[size];
  const isOnSale = originalPrice && originalPrice > price;
  const savings = isOnSale ? calculateSavings(originalPrice, price) : null;
  const formattedPrice = formatPrice(price, currency, locale);
  const formattedOriginal = originalPrice
    ? formatPrice(originalPrice, currency, locale)
    : null;

  // Price wrapper component - use motion or regular div
  const PriceWrapper = animate ? motion.span : 'span';
  const priceProps = animate
    ? {
        key: price,
        variants: priceVariants,
        initial: 'initial',
        animate: 'animate',
        exit: 'exit',
        transition: { duration: 0.2 },
      }
    : {};

  // Render savings badge
  const renderSavings = () => {
    if (!isOnSale || !showSavings || !savings) return null;

    let savingsText = '';
    if (savingsFormat === 'amount') {
      savingsText = `Save ${formatPrice(savings.amount, currency, locale)}`;
    } else if (savingsFormat === 'percentage') {
      savingsText = `${savings.percentage}% off`;
    } else {
      savingsText = `Save ${savings.percentage}% (${formatPrice(savings.amount, currency, locale)})`;
    }

    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={clsx(
          'inline-flex items-center px-2 py-0.5',
          'bg-emerald-100 text-emerald-700 rounded-full',
          'font-medium',
          styles.savings
        )}
      >
        {savingsText}
      </motion.span>
    );
  };

  return (
    <div
      className={clsx(
        'flex',
        layout === 'column' ? 'flex-col gap-1' : 'flex-wrap items-baseline gap-2',
        className
      )}
    >
      {/* Main price section */}
      <div className={clsx(
        'flex items-baseline',
        layout === 'row' ? 'gap-2' : 'gap-1'
      )}>
        {/* Current/sale price */}
        <AnimatePresence mode="wait">
          <PriceWrapper
            className={clsx(
              styles.price,
              isOnSale ? 'text-red-600' : 'text-graphite'
            )}
            {...priceProps}
          >
            {formattedPrice}
          </PriceWrapper>
        </AnimatePresence>

        {/* Per-unit text */}
        {perUnit && (
          <span className={clsx('text-slate-gray', styles.perUnit)}>
            {perUnit}
          </span>
        )}
      </div>

      {/* Original price (strikethrough) */}
      {isOnSale && formattedOriginal && (
        <span
          className={clsx(
            'text-gray-400 line-through',
            styles.original
          )}
          aria-label={`Original price: ${formattedOriginal}`}
        >
          {formattedOriginal}
        </span>
      )}

      {/* Savings badge */}
      {renderSavings()}
    </div>
  );
};

PriceDisplay.propTypes = {
  /** Current/sale price */
  price: PropTypes.number.isRequired,
  /** Original price (for sale items) */
  originalPrice: PropTypes.number,
  /** Currency code (ISO 4217) */
  currency: PropTypes.string,
  /** Locale for number formatting */
  locale: PropTypes.string,
  /** Display size */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  /** Per-unit text */
  perUnit: PropTypes.string,
  /** Show savings amount/percentage */
  showSavings: PropTypes.bool,
  /** Savings display format */
  savingsFormat: PropTypes.oneOf(['amount', 'percentage', 'both']),
  /** Layout direction */
  layout: PropTypes.oneOf(['row', 'column']),
  /** Animate price changes */
  animate: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * PriceRange Component
 *
 * Displays a price range for products with variations.
 */
export const PriceRange = ({
  minPrice,
  maxPrice,
  currency = 'USD',
  locale = 'en-US',
  size = 'md',
  className = '',
}) => {
  const styles = sizeClasses[size];
  const formattedMin = formatPrice(minPrice, currency, locale);
  const formattedMax = formatPrice(maxPrice, currency, locale);

  // If min and max are the same, just show one price
  if (minPrice === maxPrice) {
    return (
      <PriceDisplay
        price={minPrice}
        currency={currency}
        locale={locale}
        size={size}
        className={className}
      />
    );
  }

  return (
    <div className={clsx('flex items-baseline gap-1', className)}>
      <span className={clsx(styles.price, 'text-graphite')}>
        {formattedMin}
      </span>
      <span className="text-slate-gray">-</span>
      <span className={clsx(styles.price, 'text-graphite')}>
        {formattedMax}
      </span>
    </div>
  );
};

PriceRange.propTypes = {
  /** Minimum price */
  minPrice: PropTypes.number.isRequired,
  /** Maximum price */
  maxPrice: PropTypes.number.isRequired,
  /** Currency code */
  currency: PropTypes.string,
  /** Locale for formatting */
  locale: PropTypes.string,
  /** Display size */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default PriceDisplay;
