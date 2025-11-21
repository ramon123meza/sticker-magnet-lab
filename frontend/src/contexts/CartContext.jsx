/**
 * CartContext.jsx
 * Shopping cart state management using Zustand
 *
 * Handles all cart operations including:
 * - Adding/removing items
 * - Updating quantities and instructions
 * - Persisting cart to localStorage
 * - Session ID management
 * - Cart totals and counts
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Generate or retrieve session ID from localStorage
const getSessionId = () => {
  const existingSessionId = localStorage.getItem('sml_session_id');
  if (existingSessionId) {
    return existingSessionId;
  }
  const newSessionId = uuidv4();
  localStorage.setItem('sml_session_id', newSessionId);
  return newSessionId;
};

/**
 * Cart Item Structure:
 * {
 *   id: uuid(),                    - Unique cart item ID
 *   productType: string,           - 'die-cut-sticker' | 'die-cut-magnet' | 'fridge-magnet-2x3' etc
 *   productName: string,           - Display name of the product
 *   size: string,                  - '5x5' or '2x3' etc
 *   quantity: number,              - Order quantity (12, 25, 50, 75, 100, etc)
 *   unitPrice: number,             - Price per unit
 *   totalPrice: number,            - Total price for this line item
 *   imageUrl: string,              - S3 URL for the uploaded image
 *   imageData: string,             - Base64 thumbnail for preview
 *   instructions: string,          - Special instructions for the order
 *   addedAt: timestamp             - When item was added to cart
 * }
 */

// Create the cart store with persistence
const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      sessionId: getSessionId(),
      lastUpdated: null,

      /**
       * Add an item to the cart
       * @param {Object} item - Cart item to add (without id and addedAt)
       * @returns {string} - The ID of the added item
       */
      addToCart: (item) => {
        const newItem = {
          ...item,
          id: uuidv4(),
          addedAt: Date.now(),
        };

        set((state) => ({
          items: [...state.items, newItem],
          lastUpdated: Date.now(),
        }));

        return newItem.id;
      },

      /**
       * Remove an item from the cart by ID
       * @param {string} itemId - ID of the item to remove
       */
      removeFromCart: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
          lastUpdated: Date.now(),
        }));
      },

      /**
       * Update the quantity for a cart item
       * @param {string} itemId - ID of the item to update
       * @param {number} newQuantity - New quantity value
       * @param {number} newUnitPrice - New unit price for the quantity tier
       */
      updateQuantity: (itemId, newQuantity, newUnitPrice) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === itemId) {
              const unitPrice = newUnitPrice !== undefined ? newUnitPrice : item.unitPrice;
              return {
                ...item,
                quantity: newQuantity,
                unitPrice: unitPrice,
                totalPrice: newQuantity * unitPrice,
              };
            }
            return item;
          }),
          lastUpdated: Date.now(),
        }));
      },

      /**
       * Update special instructions for a cart item
       * @param {string} itemId - ID of the item to update
       * @param {string} instructions - New instructions text
       */
      updateInstructions: (itemId, instructions) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                instructions: instructions,
              };
            }
            return item;
          }),
          lastUpdated: Date.now(),
        }));
      },

      /**
       * Clear all items from the cart
       */
      clearCart: () => {
        set({
          items: [],
          lastUpdated: Date.now(),
        });
      },

      /**
       * Get the total price of all items in the cart
       * @returns {number} - Total cart value
       */
      getCartTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.totalPrice, 0);
      },

      /**
       * Get the total number of items in the cart
       * @returns {number} - Total item count
       */
      getCartCount: () => {
        const state = get();
        return state.items.length;
      },

      /**
       * Get all cart items
       * @returns {Array} - Array of cart items
       */
      getCartItems: () => {
        const state = get();
        return state.items;
      },

      /**
       * Get the current session ID
       * @returns {string} - Session ID
       */
      getSessionId: () => {
        const state = get();
        return state.sessionId;
      },

      /**
       * Update an item's image data (for when S3 URL is received)
       * @param {string} itemId - ID of the item to update
       * @param {string} imageUrl - S3 URL for the image
       */
      updateItemImage: (itemId, imageUrl) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                imageUrl: imageUrl,
              };
            }
            return item;
          }),
          lastUpdated: Date.now(),
        }));
      },

      /**
       * Reset session (called after successful order)
       * Clears cart and generates new session ID
       */
      resetSession: () => {
        const newSessionId = uuidv4();
        localStorage.setItem('sml_session_id', newSessionId);
        set({
          items: [],
          sessionId: newSessionId,
          lastUpdated: Date.now(),
        });
      },

      /**
       * Get cart data for order submission
       * @returns {Object} - Cart data with session info
       */
      getOrderData: () => {
        const state = get();
        return {
          sessionId: state.sessionId,
          items: state.items,
          total: state.items.reduce((total, item) => total + item.totalPrice, 0),
          itemCount: state.items.length,
          createdAt: Date.now(),
        };
      },
    }),
    {
      name: 'sml-cart-storage', // Key for localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        sessionId: state.sessionId,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);

// Export the store hook
export { useCartStore };

// Export a hook for accessing cart count (useful for header badge)
export const useCartCount = () => useCartStore((state) => state.items.length);

// Export a hook for accessing cart total
export const useCartTotal = () => useCartStore((state) =>
  state.items.reduce((total, item) => total + item.totalPrice, 0)
);

// Export a hook for checking if cart has items
export const useHasCartItems = () => useCartStore((state) => state.items.length > 0);

export default useCartStore;
