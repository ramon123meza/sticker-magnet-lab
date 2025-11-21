/**
 * @fileoverview Pricing calculations for Sticker & Magnet Lab
 * Contains all pricing data and calculation functions
 * @module utils/pricing
 */

/**
 * Die-cut sticker prices by size and quantity
 * Prices are in USD
 * @constant {Object}
 */
export const STICKER_PRICES = {
  '2x2': {
    12: 18.50,
    25: 32.25,
    50: 47.50,
    75: 65.25,
    100: 75.00,
    200: 130.00,
    300: 177.00,
    600: 306.00,
    1000: 440.00,
    2000: 760.00,
    3000: 1020.00,
    6000: 1860.00,
    10000: 2900.00
  },
  '3x3': {
    12: 20.35,
    25: 35.55,
    50: 52.25,
    75: 71.78,
    100: 82.50,
    200: 143.00,
    300: 194.70,
    600: 336.60,
    1000: 484.00,
    2000: 836.00,
    3000: 1122.00,
    6000: 2046.00,
    10000: 3190.00
  },
  '4x4': {
    12: 22.20,
    25: 38.85,
    50: 57.00,
    75: 78.30,
    100: 90.00,
    200: 156.00,
    300: 212.40,
    600: 367.20,
    1000: 528.00,
    2000: 912.00,
    3000: 1224.00,
    6000: 2232.00,
    10000: 3480.00
  },
  '5x5': {
    12: 24.05,
    25: 42.15,
    50: 61.75,
    75: 84.83,
    100: 97.50,
    200: 169.00,
    300: 230.10,
    600: 397.80,
    1000: 572.00,
    2000: 988.00,
    3000: 1326.00,
    6000: 2418.00,
    10000: 3770.00
  },
  '6x6': {
    12: 25.90,
    25: 45.45,
    50: 66.50,
    75: 91.35,
    100: 105.00,
    200: 182.00,
    300: 247.80,
    600: 428.40,
    1000: 616.00,
    2000: 1064.00,
    3000: 1428.00,
    6000: 2604.00,
    10000: 4060.00
  },
  '3x4': {
    12: 21.28,
    25: 37.20,
    50: 54.63,
    75: 75.04,
    100: 86.25,
    200: 149.50,
    300: 203.55,
    600: 351.90,
    1000: 506.00,
    2000: 874.00,
    3000: 1173.00,
    6000: 2139.00,
    10000: 3335.00
  },
  '4x6': {
    12: 24.05,
    25: 42.15,
    50: 61.75,
    75: 84.83,
    100: 97.50,
    200: 169.00,
    300: 230.10,
    600: 397.80,
    1000: 572.00,
    2000: 988.00,
    3000: 1326.00,
    6000: 2418.00,
    10000: 3770.00
  },
  '5x7': {
    12: 26.83,
    25: 47.08,
    50: 68.88,
    75: 94.61,
    100: 108.75,
    200: 188.50,
    300: 256.65,
    600: 443.70,
    1000: 638.00,
    2000: 1102.00,
    3000: 1479.00,
    6000: 2697.00,
    10000: 4205.00
  }
};

/**
 * Die-cut magnet prices by size and quantity
 * Magnets have a ~5% markup over stickers
 * @constant {Object}
 */
export const MAGNET_PRICES = {
  '2x2': {
    12: 19.43,
    25: 33.86,
    50: 49.88,
    75: 68.51,
    100: 78.75,
    200: 136.50,
    300: 185.85,
    600: 321.30,
    1000: 462.00,
    2000: 798.00,
    3000: 1071.00,
    6000: 1953.00,
    10000: 3045.00
  },
  '3x3': {
    12: 21.37,
    25: 37.33,
    50: 54.86,
    75: 75.37,
    100: 86.63,
    200: 150.15,
    300: 204.44,
    600: 353.43,
    1000: 508.20,
    2000: 877.80,
    3000: 1178.10,
    6000: 2148.30,
    10000: 3349.50
  },
  '4x4': {
    12: 23.31,
    25: 40.79,
    50: 59.85,
    75: 82.22,
    100: 94.50,
    200: 163.80,
    300: 223.02,
    600: 385.56,
    1000: 554.40,
    2000: 957.60,
    3000: 1285.20,
    6000: 2343.60,
    10000: 3654.00
  },
  '5x5': {
    12: 25.25,
    25: 44.26,
    50: 64.84,
    75: 89.07,
    100: 102.38,
    200: 177.45,
    300: 241.61,
    600: 417.69,
    1000: 600.60,
    2000: 1037.40,
    3000: 1392.30,
    6000: 2538.90,
    10000: 3958.50
  },
  '6x6': {
    12: 27.20,
    25: 47.72,
    50: 69.83,
    75: 95.92,
    100: 110.25,
    200: 191.10,
    300: 260.19,
    600: 449.82,
    1000: 646.80,
    2000: 1117.20,
    3000: 1499.40,
    6000: 2734.20,
    10000: 4263.00
  },
  '3x4': {
    12: 22.34,
    25: 39.06,
    50: 57.36,
    75: 78.79,
    100: 90.56,
    200: 156.98,
    300: 213.73,
    600: 369.50,
    1000: 531.30,
    2000: 917.70,
    3000: 1231.65,
    6000: 2245.95,
    10000: 3501.75
  },
  '4x6': {
    12: 25.25,
    25: 44.26,
    50: 64.84,
    75: 89.07,
    100: 102.38,
    200: 177.45,
    300: 241.61,
    600: 417.69,
    1000: 600.60,
    2000: 1037.40,
    3000: 1392.30,
    6000: 2538.90,
    10000: 3958.50
  },
  '5x7': {
    12: 28.17,
    25: 49.43,
    50: 72.32,
    75: 99.34,
    100: 114.19,
    200: 197.93,
    300: 269.48,
    600: 465.89,
    1000: 669.90,
    2000: 1157.10,
    3000: 1552.95,
    6000: 2831.85,
    10000: 4415.25
  }
};

/**
 * Fridge magnet sizes with dimensions
 * @constant {Object}
 */
export const FRIDGE_MAGNET_SIZES = {
  '2x3': { width: 2, height: 3, area: 6 },
  '2.5x3.5': { width: 2.5, height: 3.5, area: 8.75 },
  '4.75x2': { width: 4.75, height: 2, area: 9.5 },
  '2.5x2.5': { width: 2.5, height: 2.5, area: 6.25 }
};

/**
 * Fridge magnet markup percentage over base magnet prices
 * @constant {number}
 */
const FRIDGE_MAGNET_MARKUP = 0.15;

/**
 * All available quantities
 * @constant {number[]}
 */
export const ALL_QUANTITIES = [12, 25, 50, 75, 100, 200, 300, 600, 1000, 2000, 3000, 6000, 10000];

/**
 * Quantity tier descriptions for UI
 * @constant {Object}
 */
export const QUANTITY_TIERS = {
  12: { label: '12 pcs', tier: 'sample' },
  25: { label: '25 pcs', tier: 'sample' },
  50: { label: '50 pcs', tier: 'starter' },
  75: { label: '75 pcs', tier: 'starter' },
  100: { label: '100 pcs', tier: 'small' },
  200: { label: '200 pcs', tier: 'small' },
  300: { label: '300 pcs', tier: 'medium' },
  600: { label: '600 pcs', tier: 'medium' },
  1000: { label: '1,000 pcs', tier: 'large' },
  2000: { label: '2,000 pcs', tier: 'large' },
  3000: { label: '3,000 pcs', tier: 'bulk' },
  6000: { label: '6,000 pcs', tier: 'bulk' },
  10000: { label: '10,000 pcs', tier: 'wholesale' }
};

/**
 * Get price for a product type, size, and quantity
 * @param {string} productType - Product type ('sticker', 'magnet', or 'fridge-magnet')
 * @param {string} size - Size string (e.g., '2x2', '3x3')
 * @param {number} quantity - Quantity
 * @returns {number|null} Price or null if not found
 * @example
 * const price = getPrice('sticker', '3x3', 100);
 * // Returns 82.50
 */
export const getPrice = (productType, size, quantity) => {
  if (productType === 'fridge-magnet') {
    return calculateFridgeMagnetPrice(size, quantity);
  }

  const priceTable = productType === 'sticker' ? STICKER_PRICES : MAGNET_PRICES;

  if (!priceTable[size]) {
    console.warn(`Size "${size}" not found for ${productType}`);
    return null;
  }

  if (!priceTable[size][quantity]) {
    console.warn(`Quantity "${quantity}" not found for ${productType} ${size}`);
    return null;
  }

  return priceTable[size][quantity];
};

/**
 * Get unit price (price per item)
 * @param {string} productType - Product type
 * @param {string} size - Size string
 * @param {number} quantity - Quantity
 * @returns {number|null} Unit price or null if not found
 * @example
 * const unitPrice = getUnitPrice('sticker', '3x3', 100);
 * // Returns 0.825
 */
export const getUnitPrice = (productType, size, quantity) => {
  const totalPrice = getPrice(productType, size, quantity);

  if (totalPrice === null) {
    return null;
  }

  return totalPrice / quantity;
};

/**
 * Calculate savings between two quantities
 * @param {string} productType - Product type
 * @param {string} size - Size string
 * @param {number} qty1 - Smaller quantity
 * @param {number} qty2 - Larger quantity
 * @returns {number|null} Savings amount or null if not calculable
 * @example
 * const savings = getSavings('sticker', '3x3', 100, 1000);
 */
export const getSavings = (productType, size, qty1, qty2) => {
  const unitPrice1 = getUnitPrice(productType, size, qty1);
  const unitPrice2 = getUnitPrice(productType, size, qty2);

  if (unitPrice1 === null || unitPrice2 === null) {
    return null;
  }

  // Calculate what qty2 items would cost at qty1 pricing vs qty2 pricing
  const costAtLowerTier = unitPrice1 * qty2;
  const costAtHigherTier = unitPrice2 * qty2;

  return costAtLowerTier - costAtHigherTier;
};

/**
 * Calculate savings percentage between two quantities
 * @param {string} productType - Product type
 * @param {string} size - Size string
 * @param {number} qty1 - Smaller quantity
 * @param {number} qty2 - Larger quantity
 * @returns {number|null} Savings percentage (0-100) or null
 * @example
 * const savingsPercent = getSavingsPercentage('sticker', '3x3', 100, 1000);
 * // Returns something like 41.3
 */
export const getSavingsPercentage = (productType, size, qty1, qty2) => {
  const unitPrice1 = getUnitPrice(productType, size, qty1);
  const unitPrice2 = getUnitPrice(productType, size, qty2);

  if (unitPrice1 === null || unitPrice2 === null || unitPrice1 === 0) {
    return null;
  }

  return ((unitPrice1 - unitPrice2) / unitPrice1) * 100;
};

/**
 * Format price as currency string
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 * @example
 * formatPrice(82.5); // Returns "$82.50"
 * formatPrice(1000); // Returns "$1,000.00"
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Format unit price with more decimal places for small values
 * @param {number} price - Unit price to format
 * @returns {string} Formatted unit price string
 * @example
 * formatUnitPrice(0.825); // Returns "$0.83"
 * formatUnitPrice(0.044); // Returns "$0.044"
 */
export const formatUnitPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '$0.00';
  }

  // Use more decimal places for very small prices
  const decimalPlaces = price < 0.1 ? 3 : 2;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(price);
};

/**
 * Get all available sizes for a product type
 * @param {string} productType - Product type
 * @returns {string[]} Array of size strings
 * @example
 * getAllSizes('sticker'); // Returns ['2x2', '3x3', '4x4', ...]
 */
export const getAllSizes = (productType) => {
  if (productType === 'fridge-magnet') {
    return Object.keys(FRIDGE_MAGNET_SIZES);
  }

  const priceTable = productType === 'sticker' ? STICKER_PRICES : MAGNET_PRICES;
  return Object.keys(priceTable);
};

/**
 * Get all available quantities
 * @returns {number[]} Array of quantity options
 */
export const getAllQuantities = () => ALL_QUANTITIES;

/**
 * Calculate fridge magnet price
 * Uses closest die-cut magnet size as base with 15% markup
 * @param {string} size - Fridge magnet size
 * @param {number} quantity - Quantity
 * @returns {number|null} Price or null if not found
 */
export const calculateFridgeMagnetPrice = (size, quantity) => {
  const sizeData = FRIDGE_MAGNET_SIZES[size];

  if (!sizeData) {
    console.warn(`Fridge magnet size "${size}" not found`);
    return null;
  }

  // Find closest die-cut magnet size by area
  const area = sizeData.area;
  let closestSize = '2x2';
  let closestDiff = Infinity;

  const magnetSizeAreas = {
    '2x2': 4,
    '3x3': 9,
    '4x4': 16,
    '3x4': 12,
    '4x6': 24
  };

  for (const [magnetSize, magnetArea] of Object.entries(magnetSizeAreas)) {
    const diff = Math.abs(magnetArea - area);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestSize = magnetSize;
    }
  }

  const basePrice = MAGNET_PRICES[closestSize]?.[quantity];

  if (basePrice === undefined) {
    console.warn(`Base price not found for closest size ${closestSize} at quantity ${quantity}`);
    return null;
  }

  // Apply 15% markup for fridge magnets
  return basePrice * (1 + FRIDGE_MAGNET_MARKUP);
};

/**
 * Get pricing breakdown for display
 * @param {string} productType - Product type
 * @param {string} size - Size string
 * @returns {Object[]} Array of pricing breakdown objects
 */
export const getPricingBreakdown = (productType, size) => {
  return ALL_QUANTITIES.map((quantity) => {
    const totalPrice = getPrice(productType, size, quantity);
    const unitPrice = getUnitPrice(productType, size, quantity);

    return {
      quantity,
      totalPrice,
      unitPrice,
      formattedTotal: formatPrice(totalPrice),
      formattedUnit: formatUnitPrice(unitPrice),
      tier: QUANTITY_TIERS[quantity]?.tier || 'unknown'
    };
  });
};

/**
 * Get the best value quantity (lowest unit price)
 * @param {string} productType - Product type
 * @param {string} size - Size string
 * @returns {Object} Best value quantity info
 */
export const getBestValue = (productType, size) => {
  let bestQuantity = 10000;
  let bestUnitPrice = getUnitPrice(productType, size, 10000);

  // Highest quantity is always best value, but we return the info
  return {
    quantity: bestQuantity,
    unitPrice: bestUnitPrice,
    formattedUnit: formatUnitPrice(bestUnitPrice)
  };
};

/**
 * Calculate cart total
 * @param {Object[]} items - Cart items
 * @returns {Object} Total breakdown
 */
export const calculateCartTotal = (items) => {
  const subtotal = items.reduce((sum, item) => {
    const price = getPrice(item.productType, item.size, item.quantity);
    return sum + (price || 0);
  }, 0);

  // Free shipping over $50
  const shipping = subtotal >= 50 ? 0 : 5.99;

  // No tax for now (can be added later based on location)
  const tax = 0;

  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
    formattedSubtotal: formatPrice(subtotal),
    formattedShipping: shipping === 0 ? 'FREE' : formatPrice(shipping),
    formattedTax: formatPrice(tax),
    formattedTotal: formatPrice(total),
    freeShippingEligible: subtotal >= 50
  };
};

export default {
  STICKER_PRICES,
  MAGNET_PRICES,
  FRIDGE_MAGNET_SIZES,
  ALL_QUANTITIES,
  QUANTITY_TIERS,
  getPrice,
  getUnitPrice,
  getSavings,
  getSavingsPercentage,
  formatPrice,
  formatUnitPrice,
  getAllSizes,
  getAllQuantities,
  calculateFridgeMagnetPrice,
  getPricingBreakdown,
  getBestValue,
  calculateCartTotal
};
