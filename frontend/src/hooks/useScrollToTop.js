/**
 * @fileoverview Scroll to top hook for Sticker & Magnet Lab
 * Scrolls to top of page on route changes
 * @module hooks/useScrollToTop
 */

import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to scroll to top on route change
 * Automatically scrolls to top when pathname changes
 * @param {Object} [options={}] - Options
 * @param {boolean} [options.smooth=false] - Use smooth scrolling
 * @param {number} [options.delay=0] - Delay before scrolling (ms)
 * @param {string[]} [options.excludePaths=[]] - Paths to exclude from scroll
 * @returns {Object} Scroll methods
 * @returns {Function} returns.scrollToTop - Manually scroll to top
 * @returns {Function} returns.scrollToElement - Scroll to specific element
 * @example
 * // Basic usage - scrolls on route change
 * useScrollToTop();
 *
 * // With options
 * useScrollToTop({ smooth: true, delay: 100 });
 *
 * // Manual scroll
 * const { scrollToTop } = useScrollToTop();
 * scrollToTop();
 */
export const useScrollToTop = (options = {}) => {
  const {
    smooth = false,
    delay = 0,
    excludePaths = []
  } = options;

  const { pathname, hash } = useLocation();

  /**
   * Scroll to top of page
   * @param {boolean} [smoothScroll] - Override smooth setting
   */
  const scrollToTop = useCallback((smoothScroll) => {
    const behavior = (smoothScroll ?? smooth) ? 'smooth' : 'instant';

    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
  }, [smooth]);

  /**
   * Scroll to a specific element
   * @param {string|HTMLElement} target - Element ID or element
   * @param {Object} [scrollOptions={}] - Scroll options
   * @param {number} [scrollOptions.offset=0] - Offset from top
   * @param {boolean} [scrollOptions.smooth] - Smooth scroll
   */
  const scrollToElement = useCallback((target, scrollOptions = {}) => {
    const { offset = 0, smooth: smoothOption } = scrollOptions;
    const behavior = (smoothOption ?? smooth) ? 'smooth' : 'instant';

    let element;
    if (typeof target === 'string') {
      element = document.getElementById(target) || document.querySelector(target);
    } else {
      element = target;
    }

    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior
      });
    }
  }, [smooth]);

  /**
   * Scroll to hash if present
   */
  const scrollToHash = useCallback(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          scrollToElement(element, { smooth: true, offset: 80 });
        }, 100);
        return true;
      }
    }
    return false;
  }, [hash, scrollToElement]);

  // Auto-scroll on pathname change
  useEffect(() => {
    // Check if path is excluded
    if (excludePaths.some(path => pathname.startsWith(path))) {
      return;
    }

    // If there's a hash, scroll to it instead
    if (scrollToHash()) {
      return;
    }

    // Scroll to top
    const timeoutId = setTimeout(() => {
      scrollToTop();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [pathname, hash, excludePaths, delay, scrollToTop, scrollToHash]);

  return {
    scrollToTop,
    scrollToElement,
    scrollToHash
  };
};

/**
 * Component version of useScrollToTop
 * Can be placed in App to automatically scroll on route changes
 * @param {Object} props - Component props
 * @param {boolean} [props.smooth=false] - Use smooth scrolling
 * @param {number} [props.delay=0] - Delay before scrolling
 * @param {string[]} [props.excludePaths=[]] - Paths to exclude
 * @returns {null} Renders nothing
 * @example
 * // In App.jsx
 * <ScrollToTop smooth />
 */
export const ScrollToTop = ({ smooth = false, delay = 0, excludePaths = [] }) => {
  useScrollToTop({ smooth, delay, excludePaths });
  return null;
};

export default useScrollToTop;
