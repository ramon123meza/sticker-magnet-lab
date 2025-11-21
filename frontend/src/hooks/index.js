/**
 * @fileoverview Hook exports for Sticker & Magnet Lab
 * @module hooks
 */

export { useProducts, useProduct, clearProductsCache } from './useProducts';
export { usePricing, useCalculatedPrice, clearPricingCache } from './usePricing';
export { useImageUpload, UPLOAD_STAGES } from './useImageUpload';
export { useCart, getStoredCart, clearStoredCart } from './useCart';
export { useForm } from './useForm';
export { useScrollToTop, ScrollToTop } from './useScrollToTop';
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
  useBreakpoint,
  usePrefersDark,
  usePrefersReducedMotion,
  useOrientation,
  useIsTouchDevice,
  useWindowSize,
  useResponsive,
  BREAKPOINTS
} from './useMediaQuery';

// Default exports for convenience
export { default as useProducts } from './useProducts';
export { default as usePricing } from './usePricing';
export { default as useImageUpload } from './useImageUpload';
export { default as useCart } from './useCart';
export { default as useForm } from './useForm';
export { default as useScrollToTop } from './useScrollToTop';
export { default as useMediaQuery } from './useMediaQuery';
