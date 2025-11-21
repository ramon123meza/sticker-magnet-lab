/**
 * @fileoverview API Service for Sticker & Magnet Lab
 * Handles all communication with Lambda backend endpoints
 * @module services/api
 */

/**
 * API endpoint configuration
 * Uses environment variables with fallback to placeholder values
 * @constant {Object}
 */
const API_ENDPOINTS = {
  products: import.meta.env.VITE_API_PRODUCTS || 'REPLACE_WITH_LAMBDA_URL',
  pricing: import.meta.env.VITE_API_PRICING || 'REPLACE_WITH_LAMBDA_URL',
  upload: import.meta.env.VITE_API_UPLOAD || 'REPLACE_WITH_LAMBDA_URL',
  orders: import.meta.env.VITE_API_ORDERS || 'REPLACE_WITH_LAMBDA_URL',
  contact: import.meta.env.VITE_API_CONTACT || 'REPLACE_WITH_LAMBDA_URL'
};

/**
 * Default request timeout in milliseconds
 * @constant {number}
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * Maximum number of retry attempts for failed requests
 * @constant {number}
 */
const MAX_RETRIES = 3;

/**
 * Delay between retry attempts in milliseconds
 * @constant {number}
 */
const RETRY_DELAY = 1000;

/**
 * Check if we're in development mode
 * @constant {boolean}
 */
const isDev = import.meta.env.DEV;

/**
 * Log request/response in development mode
 * @param {string} type - Log type ('request' or 'response')
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to log
 */
const devLog = (type, endpoint, data) => {
  if (isDev) {
    const timestamp = new Date().toISOString();
    if (type === 'request') {
      console.log(`[API ${timestamp}] REQUEST to ${endpoint}:`, data);
    } else if (type === 'response') {
      console.log(`[API ${timestamp}] RESPONSE from ${endpoint}:`, data);
    } else if (type === 'error') {
      console.error(`[API ${timestamp}] ERROR from ${endpoint}:`, data);
    }
  }
};

/**
 * Custom API error class
 * @class
 * @extends Error
 */
class ApiError extends Error {
  /**
   * Create an API error
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {Object} data - Additional error data
   */
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create an AbortController with timeout
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Object} Controller and signal
 */
const createTimeoutController = (timeout) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId)
  };
};

/**
 * Make a fetch request with retry logic
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<Response>}
 */
const fetchWithRetry = async (url, options, retries = MAX_RETRIES) => {
  const { signal, clear } = createTimeoutController(options.timeout || DEFAULT_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal
    });
    clear();

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! Status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return response;
  } catch (error) {
    clear();

    // Don't retry on abort (timeout) or client errors (4xx)
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }

    if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
      throw error;
    }

    // Retry on network errors or server errors
    if (retries > 0) {
      devLog('error', url, { message: `Retrying... (${retries} attempts left)`, error: error.message });
      await sleep(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }

    throw error;
  }
};

/**
 * Parse response based on content type
 * @param {Response} response - Fetch response
 * @returns {Promise<Object|string>}
 */
const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

/**
 * Make an API request
 * @param {string} endpoint - API endpoint key
 * @param {Object} options - Request options
 * @returns {Promise<Object>}
 */
const request = async (endpoint, options = {}) => {
  const url = API_ENDPOINTS[endpoint] || endpoint;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: DEFAULT_TIMEOUT
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  devLog('request', url, { method: mergedOptions.method || 'GET', body: mergedOptions.body });

  try {
    const response = await fetchWithRetry(url, mergedOptions);
    const data = await parseResponse(response);

    devLog('response', url, data);

    return data;
  } catch (error) {
    devLog('error', url, error);
    throw error;
  }
};

/**
 * API service object with all endpoint methods
 * @namespace api
 */
export const api = {
  /**
   * Get all products or filter by type
   * @param {string|null} type - Product type filter ('sticker', 'magnet', or null for all)
   * @returns {Promise<Object>} Products data
   * @example
   * const allProducts = await api.getProducts();
   * const stickers = await api.getProducts('sticker');
   */
  getProducts: async (type = null) => {
    const params = new URLSearchParams();
    if (type) {
      params.append('type', type);
    }

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.products}?${queryString}`
      : API_ENDPOINTS.products;

    return request(url, { method: 'GET' });
  },

  /**
   * Get pricing for product type and optional size
   * @param {string} type - Product type ('sticker' or 'magnet')
   * @param {string|null} size - Optional size filter
   * @returns {Promise<Object>} Pricing data
   * @example
   * const allPricing = await api.getPricing('sticker');
   * const sizePricing = await api.getPricing('sticker', '2x2');
   */
  getPricing: async (type, size = null) => {
    const params = new URLSearchParams({ type });
    if (size) {
      params.append('size', size);
    }

    const url = `${API_ENDPOINTS.pricing}?${params.toString()}`;
    return request(url, { method: 'GET' });
  },

  /**
   * Upload image (base64) to S3
   * @param {string} imageBase64 - Base64 encoded image data
   * @param {string} filename - Original filename
   * @param {string} sessionId - User session ID
   * @returns {Promise<Object>} Upload result with S3 URL
   * @example
   * const result = await api.uploadImage(base64Data, 'design.png', sessionId);
   * console.log(result.url); // S3 URL
   */
  uploadImage: async (imageBase64, filename, sessionId) => {
    return request('upload', {
      method: 'POST',
      body: JSON.stringify({
        image: imageBase64,
        filename,
        sessionId
      }),
      timeout: 60000 // Longer timeout for uploads
    });
  },

  /**
   * Create new order
   * @param {Object} orderData - Order details
   * @param {string} orderData.orderId - Unique order ID
   * @param {Array} orderData.items - Cart items
   * @param {Object} orderData.customer - Customer information
   * @param {Object} orderData.shipping - Shipping address
   * @param {Object} orderData.billing - Billing address
   * @param {number} orderData.total - Order total
   * @returns {Promise<Object>} Order confirmation
   * @example
   * const order = await api.createOrder({
   *   orderId: 'SLMAG-123',
   *   items: [...],
   *   customer: { email: 'test@example.com' },
   *   total: 59.99
   * });
   */
  createOrder: async (orderData) => {
    return request('orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  /**
   * Get order by ID
   * @param {string} orderId - Order ID to retrieve
   * @returns {Promise<Object>} Order details
   */
  getOrder: async (orderId) => {
    const url = `${API_ENDPOINTS.orders}?orderId=${encodeURIComponent(orderId)}`;
    return request(url, { method: 'GET' });
  },

  /**
   * Submit contact form
   * @param {Object} formData - Contact form data
   * @param {string} formData.name - Contact name
   * @param {string} formData.email - Contact email
   * @param {string} formData.subject - Message subject
   * @param {string} formData.message - Message body
   * @param {string} [formData.phone] - Optional phone number
   * @param {string} [formData.orderNumber] - Optional order number reference
   * @returns {Promise<Object>} Submission confirmation
   * @example
   * await api.submitContact({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   subject: 'general',
   *   message: 'Hello!'
   * });
   */
  submitContact: async (formData) => {
    return request('contact', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString()
      })
    });
  }
};

/**
 * Export ApiError for external use
 */
export { ApiError };

/**
 * Export endpoint configuration for debugging
 */
export { API_ENDPOINTS };

export default api;
