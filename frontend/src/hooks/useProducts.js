/**
 * @fileoverview Products hook for Sticker & Magnet Lab
 * Fetches and caches product data from the API
 * @module hooks/useProducts
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';

/**
 * Cache duration in milliseconds (5 minutes)
 * @constant {number}
 */
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Simple in-memory cache for products
 * @type {Map<string, {data: Object, timestamp: number}>}
 */
const productCache = new Map();

/**
 * Hook to fetch and manage products
 * @param {string|null} [type=null] - Product type filter ('sticker', 'magnet', or null for all)
 * @returns {Object} Products state and methods
 * @returns {Array} returns.products - Array of products
 * @returns {boolean} returns.loading - Loading state
 * @returns {Error|null} returns.error - Error if any
 * @returns {Function} returns.refetch - Function to refetch products
 * @example
 * const { products, loading, error, refetch } = useProducts('sticker');
 */
export const useProducts = (type = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  /**
   * Get cache key for the request
   * @returns {string} Cache key
   */
  const getCacheKey = useCallback(() => {
    return `products_${type || 'all'}`;
  }, [type]);

  /**
   * Check if cached data is still valid
   * @param {string} key - Cache key
   * @returns {Object|null} Cached data or null
   */
  const getCachedData = useCallback((key) => {
    const cached = productCache.get(key);
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
    productCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  /**
   * Fetch products from API
   * @param {boolean} [skipCache=false] - Skip cache and force fetch
   */
  const fetchProducts = useCallback(async (skipCache = false) => {
    const cacheKey = getCacheKey();

    // Check cache first
    if (!skipCache) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setProducts(cachedData);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.getProducts(type);

      if (!mountedRef.current) return;

      // Handle different response structures
      const productData = response.products || response.data || response;
      const productArray = Array.isArray(productData) ? productData : [];

      setProducts(productArray);
      setCachedData(cacheKey, productArray);
    } catch (err) {
      if (!mountedRef.current) return;

      console.error('Failed to fetch products:', err);
      setError(err);

      // Return empty array on error but keep any cached data
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setProducts(cachedData);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [type, getCacheKey, getCachedData, setCachedData]);

  /**
   * Refetch products (bypasses cache)
   */
  const refetch = useCallback(() => {
    return fetchProducts(true);
  }, [fetchProducts]);

  // Fetch on mount and when type changes
  useEffect(() => {
    mountedRef.current = true;
    fetchProducts();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch
  };
};

/**
 * Hook to get a single product by ID
 * @param {string} productId - Product ID
 * @returns {Object} Product state
 */
export const useProduct = (productId) => {
  const { products, loading, error, refetch } = useProducts();

  const product = products.find(p => p.id === productId) || null;

  return {
    product,
    loading,
    error,
    refetch
  };
};

/**
 * Clear the products cache
 */
export const clearProductsCache = () => {
  productCache.clear();
};

export default useProducts;
