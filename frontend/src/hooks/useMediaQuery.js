/**
 * @fileoverview Media query hook for Sticker & Magnet Lab
 * Provides responsive breakpoint detection
 * @module hooks/useMediaQuery
 */

import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Default breakpoints (matches Tailwind CSS)
 * @constant {Object}
 */
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Hook to detect media query matches
 * @param {string} query - Media query string
 * @returns {boolean} Whether the media query matches
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export const useMediaQuery = (query) => {
  // Initialize with a function to handle SSR
  const getMatches = useCallback(() => {
    // Return false during SSR
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Handler for changes
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    // Legacy browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [query]);

  return matches;
};

/**
 * Hook to check if viewport is mobile
 * @returns {boolean} Is mobile viewport
 * @example
 * const isMobile = useIsMobile();
 */
export const useIsMobile = () => {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
};

/**
 * Hook to check if viewport is tablet
 * @returns {boolean} Is tablet viewport
 * @example
 * const isTablet = useIsTablet();
 */
export const useIsTablet = () => {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.lg - 1}px)`);
};

/**
 * Hook to check if viewport is desktop
 * @returns {boolean} Is desktop viewport
 * @example
 * const isDesktop = useIsDesktop();
 */
export const useIsDesktop = () => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
};

/**
 * Hook to check if viewport is large desktop
 * @returns {boolean} Is large desktop viewport
 */
export const useIsLargeDesktop = () => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
};

/**
 * Hook to get current breakpoint name
 * @returns {string} Current breakpoint name
 * @example
 * const breakpoint = useBreakpoint(); // 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
 */
export const useBreakpoint = () => {
  const isXs = useMediaQuery(`(max-width: ${BREAKPOINTS.xs - 1}px)`);
  const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.xs}px) and (max-width: ${BREAKPOINTS.sm - 1}px)`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`);
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px) and (max-width: ${BREAKPOINTS.xl - 1}px)`);
  const is2Xl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);

  if (is2Xl) return '2xl';
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  return 'xs';
};

/**
 * Hook to check if user prefers dark color scheme
 * @returns {boolean} Prefers dark mode
 */
export const usePrefersDark = () => {
  return useMediaQuery('(prefers-color-scheme: dark)');
};

/**
 * Hook to check if user prefers reduced motion
 * @returns {boolean} Prefers reduced motion
 */
export const usePrefersReducedMotion = () => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

/**
 * Hook to check device orientation
 * @returns {'portrait'|'landscape'} Device orientation
 */
export const useOrientation = () => {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  return isPortrait ? 'portrait' : 'landscape';
};

/**
 * Hook to check if device is touch-capable
 * @returns {boolean} Is touch device
 */
export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouch();
  }, []);

  return isTouch;
};

/**
 * Hook to get window dimensions
 * @returns {Object} Window dimensions
 * @returns {number} returns.width - Window width
 * @returns {number} returns.height - Window height
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

/**
 * Hook to get all breakpoint states at once
 * @returns {Object} Breakpoint states
 */
export const useResponsive = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const breakpoint = useBreakpoint();
  const orientation = useOrientation();
  const { width, height } = useWindowSize();

  return useMemo(() => ({
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
    orientation,
    width,
    height,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape'
  }), [isMobile, isTablet, isDesktop, breakpoint, orientation, width, height]);
};

export default useMediaQuery;
