/**
 * @fileoverview Pricing hook for Sticker & Magnet Lab
 * Provides access to pricing data with local caching
 * @module hooks/usePricing
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  getPrice,
  getUnitPrice,
  getAllQuantities,
  getAllSizes,
  formatPrice,
  formatUnitPrice,
  getPricingBreakdown,
  STICKER_PRICES,
  MAGNET_PRICES
} from '../utils/pricing';
import { api } from '../services/api';

/**
 * Cache duration in milliseconds (10 minutes)
 * @constant {number}
 */
const CACHE_DURATION = 10 * 60 * 1000;

/**
 * Simple in-memory cache for API pricing data
 * @type {Map<string, {data: Object, timestamp: number}>}
 */
const pricingCache = new Map();

/**
 * Hook to get pricing data for a product type and size
 * Uses local pricing data by default, with optional API fallback
 * @param {string} productType - Product type ('sticker', 'magnet', 'fridge-magnet')
 * @param {string} [size=null] - Optional size filter
 * @param {Object} [options={}] - Options
 * @param {boolean} [options.useApi=false] - Fetch from API instead of local data
 * @returns {Object} Pricing state and data
 * @returns {Object|null} returns.prices - Pricing data object
 * @returns {boolean} returns.loading - Loading state
 * @returns {Error|null} returns.error - Error if any
 * @returns {number[]} returns.quantities - Available quantities
 * @returns {string[]} returns.sizes - Available sizes
 * @example
 * const { prices, loading, quantities } = usePricing('sticker', '3x3');
 */
export const usePricing = (productType, size = null, options = {}) => {
  const { useApi = false } = options;
  const [apiPrices, setApiPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  /**
   * Get cache key
   * @returns {string} Cache key
   */
  const getCacheKey = useCallback(() => {
    return `pricing_${productType}_${size || 'all'}`;
  }, [productType, size]);

  /**
   * Check if cached data is still valid
   * @param {string} key - Cache key
   * @returns {Object|null} Cached data or null
   */
  const getCachedData = useCallback((key) => {
    const cached = pricingCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }, []);

  /**
   * Store data in cache
   * @param {string} key - Cache key
   * @param {Object} data - Data to cache
   */
  const setCachedData = useCallback((key, data) => {
    pricingCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  // Fetch API pricing if requested
  useEffect(() => {
    if (!useApi || !productType) return;

    mountedRef.current = true;

    const fetchPricing = async () => {
      const cacheKey = getCacheKey();

      // Check cache first
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setApiPrices(cachedData);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.getPricing(productType, size);

        if (!mountedRef.current) return;

        setApiPrices(response);
        setCachedData(cacheKey, response);
      } catch (err) {
        if (!mountedRef.current) return;

        console.error('Failed to fetch pricing:', err);
        setError(err);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchPricing();

    return () => {
      mountedRef.current = false;
    };
  }, [productType, size, useApi, getCacheKey, getCachedData, setCachedData]);

  /**
   * Get local prices for a specific size
   */
  const localPrices = useMemo(() => {
    if (!productType) return null;

    const priceTable = productType === 'sticker' ? STICKER_PRICES : MAGNET_PRICES;

    if (size) {
      return priceTable[size] || null;
    }

    return priceTable;
  }, [productType, size]);

  /**
   * Get available quantities
   */
  const quantities = useMemo(() => getAllQuantities(), []);

  /**
   * Get available sizes for product type
   */
  const sizes = useMemo(() => {
    if (!productType) return [];
    return getAllSizes(productType);
  }, [productType]);

  /**
   * Get pricing breakdown for display
   */
  const breakdown = useMemo(() => {
    if (!productType || !size) return [];
    return getPricingBreakdown(productType, size);
  }, [productType, size]);

  /**
   * Helper to get price for a quantity
   * @param {number} quantity - Quantity
   * @returns {number|null} Price
   */
  const getPriceForQuantity = useCallback((quantity) => {
    if (!productType || !size) return null;
    return getPrice(productType, size, quantity);
  }, [productType, size]);

  /**
   * Helper to get unit price for a quantity
   * @param {number} quantity - Quantity
   * @returns {number|null} Unit price
   */
  const getUnitPriceForQuantity = useCallback((quantity) => {
    if (!productType || !size) return null;
    return getUnitPrice(productType, size, quantity);
  }, [productType, size]);

  return {
    prices: useApi ? apiPrices : localPrices,
    loading,
    error,
    quantities,
    sizes,
    breakdown,
    getPriceForQuantity,
    getUnitPriceForQuantity,
    formatPrice,
    formatUnitPrice
  };
};

/**
 * Hook to calculate price for specific configuration
 * @param {string} productType - Product type
 * @param {string} size - Size
 * @param {number} quantity - Quantity
 * @returns {Object} Price calculation
 */
export const useCalculatedPrice = (productType, size, quantity) => {
  const price = useMemo(() => {
    if (!productType || !size || !quantity) return null;
    return getPrice(productType, size, quantity);
  }, [productType, size, quantity]);

  const unitPrice = useMemo(() => {
    if (!productType || !size || !quantity) return null;
    return getUnitPrice(productType, size, quantity);
  }, [productType, size, quantity]);

  return {
    price,
    unitPrice,
    formattedPrice: formatPrice(price),
    formattedUnitPrice: formatUnitPrice(unitPrice)
  };
};

/**
 * Clear the pricing cache
 */
export const clearPricingCache = () => {
  pricingCache.clear();
};

export default usePricing;
