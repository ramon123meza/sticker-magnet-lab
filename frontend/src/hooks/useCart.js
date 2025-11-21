/**
 * @fileoverview Cart hook for Sticker & Magnet Lab
 * Provides cart state management with localStorage persistence
 * @module hooks/useCart
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getPrice, formatPrice, calculateCartTotal } from '../utils/pricing';
import { generateOrderId } from '../utils/session';

/**
 * Local storage key for cart data
 * @constant {string}
 */
const CART_STORAGE_KEY = 'sml_cart';

/**
 * Cart item structure
 * @typedef {Object} CartItem
 * @property {string} id - Unique item ID
 * @property {string} productType - Product type ('sticker', 'magnet', 'fridge-magnet')
 * @property {string} size - Size string
 * @property {number} quantity - Order quantity
 * @property {string} imageUrl - Uploaded design URL
 * @property {string} [imageName] - Original image filename
 * @property {Object} [options] - Additional options (finish, shape, etc.)
 * @property {number} price - Calculated price
 * @property {Date} addedAt - When item was added
 */

/**
 * Load cart from localStorage
 * @returns {CartItem[]} Cart items
 */
const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn('Failed to load cart from localStorage:', error);
  }
  return [];
};

/**
 * Save cart to localStorage
 * @param {CartItem[]} items - Cart items
 */
const saveCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
};

/**
 * Generate unique cart item ID
 * @returns {string} Unique ID
 */
const generateItemId = () => {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Hook to manage shopping cart
 * @returns {Object} Cart state and methods
 * @returns {CartItem[]} returns.items - Cart items
 * @returns {number} returns.itemCount - Total number of items
 * @returns {Object} returns.totals - Cart totals (subtotal, shipping, tax, total)
 * @returns {Function} returns.addItem - Add item to cart
 * @returns {Function} returns.removeItem - Remove item from cart
 * @returns {Function} returns.updateItem - Update item in cart
 * @returns {Function} returns.clearCart - Clear all items
 * @returns {Function} returns.getItem - Get item by ID
 * @returns {boolean} returns.isEmpty - Whether cart is empty
 * @example
 * const { items, addItem, removeItem, totals } = useCart();
 */
export const useCart = () => {
  const [items, setItems] = useState(() => loadCart());

  // Save to localStorage whenever items change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  /**
   * Add item to cart
   * @param {Object} item - Item to add
   * @param {string} item.productType - Product type
   * @param {string} item.size - Size
   * @param {number} item.quantity - Quantity
   * @param {string} item.imageUrl - Image URL
   * @param {string} [item.imageName] - Image filename
   * @param {Object} [item.options] - Additional options
   * @returns {CartItem} Added item with ID
   */
  const addItem = useCallback((item) => {
    const price = getPrice(item.productType, item.size, item.quantity);

    const newItem = {
      id: generateItemId(),
      productType: item.productType,
      size: item.size,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      imageName: item.imageName || 'design',
      options: item.options || {},
      price: price || 0,
      addedAt: new Date().toISOString()
    };

    setItems(prevItems => [...prevItems, newItem]);

    return newItem;
  }, []);

  /**
   * Remove item from cart
   * @param {string} itemId - Item ID to remove
   */
  const removeItem = useCallback((itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  /**
   * Update item in cart
   * @param {string} itemId - Item ID to update
   * @param {Object} updates - Fields to update
   */
  const updateItem = useCallback((itemId, updates) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id !== itemId) return item;

        const updatedItem = { ...item, ...updates };

        // Recalculate price if quantity or size changed
        if (updates.quantity || updates.size) {
          updatedItem.price = getPrice(
            updatedItem.productType,
            updatedItem.size,
            updatedItem.quantity
          ) || 0;
        }

        return updatedItem;
      })
    );
  }, []);

  /**
   * Update item quantity
   * @param {string} itemId - Item ID
   * @param {number} quantity - New quantity
   */
  const updateQuantity = useCallback((itemId, quantity) => {
    updateItem(itemId, { quantity });
  }, [updateItem]);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  /**
   * Get item by ID
   * @param {string} itemId - Item ID
   * @returns {CartItem|undefined} Cart item
   */
  const getItem = useCallback((itemId) => {
    return items.find(item => item.id === itemId);
  }, [items]);

  /**
   * Check if cart has a specific product type
   * @param {string} productType - Product type
   * @returns {boolean} Has product type
   */
  const hasProductType = useCallback((productType) => {
    return items.some(item => item.productType === productType);
  }, [items]);

  /**
   * Get items by product type
   * @param {string} productType - Product type
   * @returns {CartItem[]} Filtered items
   */
  const getItemsByType = useCallback((productType) => {
    return items.filter(item => item.productType === productType);
  }, [items]);

  /**
   * Calculate cart totals
   */
  const totals = useMemo(() => {
    return calculateCartTotal(items);
  }, [items]);

  /**
   * Total number of items
   */
  const itemCount = useMemo(() => items.length, [items]);

  /**
   * Total quantity of all items
   */
  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  /**
   * Whether cart is empty
   */
  const isEmpty = useMemo(() => items.length === 0, [items]);

  /**
   * Format cart for order submission
   * @returns {Object} Order-ready cart data
   */
  const getOrderData = useCallback(() => {
    return {
      orderId: generateOrderId(),
      items: items.map(item => ({
        productType: item.productType,
        size: item.size,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        options: item.options,
        price: item.price
      })),
      ...totals,
      createdAt: new Date().toISOString()
    };
  }, [items, totals]);

  return {
    items,
    itemCount,
    totalQuantity,
    totals,
    isEmpty,
    addItem,
    removeItem,
    updateItem,
    updateQuantity,
    clearCart,
    getItem,
    hasProductType,
    getItemsByType,
    getOrderData,
    formatPrice
  };
};

/**
 * Get cart from localStorage (for use outside React)
 * @returns {CartItem[]} Cart items
 */
export const getStoredCart = loadCart;

/**
 * Clear cart from localStorage
 */
export const clearStoredCart = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear cart from localStorage:', error);
  }
};

export default useCart;
