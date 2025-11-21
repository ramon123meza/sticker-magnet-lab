/**
 * SessionContext.jsx
 * Session management using React Context
 *
 * Handles:
 * - Unique session ID generation (UUID v4)
 * - Session tracking across tabs
 * - Session start time tracking
 * - Temporary upload data management
 * - Session cleanup after order completion
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// Session storage keys
const SESSION_STORAGE_KEY = 'sml_session';
const UPLOAD_DATA_KEY = 'sml_upload_data';

/**
 * Session data structure:
 * {
 *   id: string,            - UUID v4 session identifier
 *   startTime: number,     - Timestamp when session started
 *   lastActivity: number,  - Timestamp of last activity
 *   tabId: string,         - Unique ID for this browser tab
 *   uploadData: object,    - Temporary upload data storage
 * }
 */

// Create the context
const SessionContext = createContext(null);

/**
 * Generate or retrieve session from localStorage
 * Handles cross-tab session synchronization
 */
const initializeSession = () => {
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);

    if (storedSession) {
      const session = JSON.parse(storedSession);
      // Session exists, update last activity
      return {
        ...session,
        lastActivity: Date.now(),
        tabId: uuidv4(), // Each tab gets its own ID
      };
    }

    // Create new session
    const newSession = {
      id: uuidv4(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      tabId: uuidv4(),
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
    return newSession;
  } catch (error) {
    console.error('Error initializing session:', error);
    // Return a fallback session if localStorage fails
    return {
      id: uuidv4(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      tabId: uuidv4(),
    };
  }
};

/**
 * Load upload data from sessionStorage
 */
const loadUploadData = () => {
  try {
    const storedData = sessionStorage.getItem(UPLOAD_DATA_KEY);
    return storedData ? JSON.parse(storedData) : {};
  } catch (error) {
    console.error('Error loading upload data:', error);
    return {};
  }
};

/**
 * Session Provider Component
 * Wraps the app to provide session context
 */
export function SessionProvider({ children }) {
  // Initialize session state
  const [session, setSession] = useState(initializeSession);
  const [uploadData, setUploadData] = useState(loadUploadData);
  const [isInitialized, setIsInitialized] = useState(false);

  // Persist session to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        id: session.id,
        startTime: session.startTime,
        lastActivity: session.lastActivity,
      }));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }, [session]);

  // Persist upload data to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(UPLOAD_DATA_KEY, JSON.stringify(uploadData));
    } catch (error) {
      console.error('Error saving upload data:', error);
    }
  }, [uploadData]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === SESSION_STORAGE_KEY && event.newValue) {
        try {
          const updatedSession = JSON.parse(event.newValue);
          setSession((prev) => ({
            ...prev,
            id: updatedSession.id,
            startTime: updatedSession.startTime,
            lastActivity: updatedSession.lastActivity,
          }));
        } catch (error) {
          console.error('Error parsing session from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    setIsInitialized(true);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      lastActivity: Date.now(),
    }));
  }, []);

  // Store temporary upload data
  const setTemporaryUpload = useCallback((key, data) => {
    setUploadData((prev) => ({
      ...prev,
      [key]: {
        ...data,
        timestamp: Date.now(),
      },
    }));
    updateActivity();
  }, [updateActivity]);

  // Get temporary upload data
  const getTemporaryUpload = useCallback((key) => {
    return uploadData[key] || null;
  }, [uploadData]);

  // Remove temporary upload data
  const removeTemporaryUpload = useCallback((key) => {
    setUploadData((prev) => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  }, []);

  // Clear all temporary upload data
  const clearAllUploads = useCallback(() => {
    setUploadData({});
    sessionStorage.removeItem(UPLOAD_DATA_KEY);
  }, []);

  // Reset session (after order completion)
  const resetSession = useCallback(() => {
    const newSession = {
      id: uuidv4(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      tabId: session.tabId, // Keep the same tab ID
    };

    setSession(newSession);
    clearAllUploads();

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
    } catch (error) {
      console.error('Error resetting session:', error);
    }
  }, [session.tabId, clearAllUploads]);

  // Get session duration in milliseconds
  const getSessionDuration = useCallback(() => {
    return Date.now() - session.startTime;
  }, [session.startTime]);

  // Get session duration formatted
  const getFormattedDuration = useCallback(() => {
    const duration = getSessionDuration();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  }, [getSessionDuration]);

  // Check if session is stale (older than specified time)
  const isSessionStale = useCallback((maxAge = 24 * 60 * 60 * 1000) => {
    return Date.now() - session.startTime > maxAge;
  }, [session.startTime]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // Session data
    sessionId: session.id,
    tabId: session.tabId,
    startTime: session.startTime,
    lastActivity: session.lastActivity,
    isInitialized,

    // Upload data methods
    setTemporaryUpload,
    getTemporaryUpload,
    removeTemporaryUpload,
    clearAllUploads,
    uploadData,

    // Session methods
    updateActivity,
    resetSession,
    getSessionDuration,
    getFormattedDuration,
    isSessionStale,
  }), [
    session,
    isInitialized,
    uploadData,
    setTemporaryUpload,
    getTemporaryUpload,
    removeTemporaryUpload,
    clearAllUploads,
    updateActivity,
    resetSession,
    getSessionDuration,
    getFormattedDuration,
    isSessionStale,
  ]);

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to access session context
 * @returns {Object} Session context value
 * @throws {Error} If used outside of SessionProvider
 */
export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
}

/**
 * Hook to get just the session ID
 * @returns {string} Session ID
 */
export function useSessionId() {
  const { sessionId } = useSession();
  return sessionId;
}

/**
 * Hook to manage temporary uploads
 * @returns {Object} Upload management methods
 */
export function useUploadData() {
  const {
    setTemporaryUpload,
    getTemporaryUpload,
    removeTemporaryUpload,
    clearAllUploads,
    uploadData,
  } = useSession();

  return {
    setTemporaryUpload,
    getTemporaryUpload,
    removeTemporaryUpload,
    clearAllUploads,
    uploadData,
  };
}

export default SessionContext;
