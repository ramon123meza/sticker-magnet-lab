/**
 * @fileoverview Session management utilities for Sticker & Magnet Lab
 * Handles session IDs, storage, and order ID generation
 * @module utils/session
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Local storage key for session ID
 * @constant {string}
 */
const SESSION_KEY = 'sml_session_id';

/**
 * Local storage key for session start timestamp
 * @constant {string}
 */
const SESSION_START_KEY = 'sml_session_start';

/**
 * Local storage key for session data
 * @constant {string}
 */
const SESSION_DATA_KEY = 'sml_session_data';

/**
 * Session expiry time in milliseconds (24 hours)
 * @constant {number}
 */
const SESSION_EXPIRY = 24 * 60 * 60 * 1000;

/**
 * Get or create session ID
 * Creates a new session if none exists or if existing session has expired
 * @returns {string} Session ID (UUID v4)
 * @example
 * const sessionId = getSessionId();
 * // Returns: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 */
export const getSessionId = () => {
  try {
    let sessionId = localStorage.getItem(SESSION_KEY);
    const sessionStart = localStorage.getItem(SESSION_START_KEY);

    // Check if session exists and is still valid
    if (sessionId && sessionStart) {
      const startTime = parseInt(sessionStart, 10);
      const elapsed = Date.now() - startTime;

      // Session is still valid
      if (elapsed < SESSION_EXPIRY) {
        return sessionId;
      }

      // Session has expired, clear it
      clearSession();
    }

    // Create new session
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
    localStorage.setItem(SESSION_START_KEY, Date.now().toString());

    return sessionId;
  } catch (error) {
    // Fallback for environments without localStorage
    console.warn('localStorage not available, generating temporary session ID');
    return uuidv4();
  }
};

/**
 * Clear current session
 * Removes session ID and all session data from storage
 */
export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_START_KEY);
    localStorage.removeItem(SESSION_DATA_KEY);
  } catch (error) {
    console.warn('Failed to clear session:', error);
  }
};

/**
 * Get session duration in milliseconds
 * @returns {number} Session duration in ms, or 0 if no session
 */
export const getSessionDuration = () => {
  try {
    const sessionStart = localStorage.getItem(SESSION_START_KEY);

    if (!sessionStart) {
      return 0;
    }

    return Date.now() - parseInt(sessionStart, 10);
  } catch (error) {
    return 0;
  }
};

/**
 * Get session duration formatted as string
 * @returns {string} Formatted duration (e.g., "5m 30s", "2h 15m")
 */
export const getFormattedSessionDuration = () => {
  const duration = getSessionDuration();

  if (duration === 0) {
    return '0s';
  }

  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }

  return `${seconds}s`;
};

/**
 * Generate unique order ID
 * Format: SLMAG-{timestamp}-{random}
 * @returns {string} Unique order ID
 * @example
 * const orderId = generateOrderId();
 * // Returns: "SLMAG-1700000000000-A3F"
 */
export const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `SLMAG-${timestamp}-${random}`;
};

/**
 * Generate a shorter reference code for customer use
 * Format: SML-{6 random chars}
 * @returns {string} Short reference code
 */
export const generateReferenceCode = () => {
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `SML-${random}`;
};

/**
 * Store data in session storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 */
export const setSessionData = (key, value) => {
  try {
    const sessionData = getSessionDataObject();
    sessionData[key] = value;
    localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.warn('Failed to set session data:', error);
  }
};

/**
 * Retrieve data from session storage
 * @param {string} key - Storage key
 * @param {any} [defaultValue=null] - Default value if key not found
 * @returns {any} Stored value or default
 */
export const getSessionData = (key, defaultValue = null) => {
  try {
    const sessionData = getSessionDataObject();
    return sessionData[key] !== undefined ? sessionData[key] : defaultValue;
  } catch (error) {
    console.warn('Failed to get session data:', error);
    return defaultValue;
  }
};

/**
 * Remove data from session storage
 * @param {string} key - Storage key to remove
 */
export const removeSessionData = (key) => {
  try {
    const sessionData = getSessionDataObject();
    delete sessionData[key];
    localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.warn('Failed to remove session data:', error);
  }
};

/**
 * Get all session data as object
 * @returns {Object} Session data object
 * @private
 */
const getSessionDataObject = () => {
  try {
    const data = localStorage.getItem(SESSION_DATA_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    return {};
  }
};

/**
 * Check if session is active
 * @returns {boolean} True if session exists and is valid
 */
export const isSessionActive = () => {
  try {
    const sessionId = localStorage.getItem(SESSION_KEY);
    const sessionStart = localStorage.getItem(SESSION_START_KEY);

    if (!sessionId || !sessionStart) {
      return false;
    }

    const elapsed = Date.now() - parseInt(sessionStart, 10);
    return elapsed < SESSION_EXPIRY;
  } catch (error) {
    return false;
  }
};

/**
 * Extend session expiry
 * Updates the session start time to extend the session
 */
export const extendSession = () => {
  try {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      localStorage.setItem(SESSION_START_KEY, Date.now().toString());
    }
  } catch (error) {
    console.warn('Failed to extend session:', error);
  }
};

/**
 * Get session metadata
 * @returns {Object} Session metadata
 */
export const getSessionMetadata = () => {
  const sessionId = getSessionId();
  const duration = getSessionDuration();
  const isActive = isSessionActive();

  return {
    sessionId,
    duration,
    formattedDuration: getFormattedSessionDuration(),
    isActive,
    expiresIn: SESSION_EXPIRY - duration,
    startedAt: new Date(Date.now() - duration).toISOString()
  };
};

/**
 * Storage keys used by the application
 * @constant {Object}
 */
export const STORAGE_KEYS = {
  SESSION_ID: SESSION_KEY,
  SESSION_START: SESSION_START_KEY,
  SESSION_DATA: SESSION_DATA_KEY,
  CART: 'sml_cart',
  USER_PREFERENCES: 'sml_preferences',
  RECENTLY_VIEWED: 'sml_recently_viewed'
};

export default {
  getSessionId,
  clearSession,
  getSessionDuration,
  getFormattedSessionDuration,
  generateOrderId,
  generateReferenceCode,
  setSessionData,
  getSessionData,
  removeSessionData,
  isSessionActive,
  extendSession,
  getSessionMetadata,
  STORAGE_KEYS
};
