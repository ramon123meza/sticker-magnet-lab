/**
 * @fileoverview Utility exports for Sticker & Magnet Lab
 * @module utils
 */

// Pricing utilities
export {
  STICKER_PRICES,
  MAGNET_PRICES,
  FRIDGE_MAGNET_SIZES,
  ALL_QUANTITIES,
  QUANTITY_TIERS,
  getPrice,
  getUnitPrice,
  getSavings,
  getSavingsPercentage,
  formatPrice,
  formatUnitPrice,
  getAllSizes,
  getAllQuantities,
  calculateFridgeMagnetPrice,
  getPricingBreakdown,
  getBestValue,
  calculateCartTotal
} from './pricing';

// Validation utilities
export {
  validateEmail,
  validatePhone,
  validateZip,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateFile,
  validateName,
  validateAddress,
  validateCity,
  validateState,
  validateCardNumber,
  validateExpiry,
  validateCVC,
  formatPhone,
  formatZip,
  formatCardNumber,
  formatExpiry,
  US_STATES,
  SUBJECT_OPTIONS,
  runValidators,
  validateForm,
  hasErrors,
  createValidator
} from './validation';

// Image compression utilities
export {
  compressImage,
  validateImage,
  getImageDimensions,
  checkMinResolution,
  fileToBase64,
  fileToDataUri,
  base64ToFile,
  generateThumbnail,
  formatFileSize,
  needsCompression,
  isValidImageType,
  calculateDPI,
  getQualityIndicator,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_EXTENSIONS,
  MIN_RESOLUTIONS
} from './imageCompression';

// Session utilities
export {
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
} from './session';

// SEO utilities
export {
  SITE_CONFIG,
  META_DATA,
  generateProductSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateLocalBusinessSchema,
  getMetaData,
  getCanonicalUrl,
  generateOGTags,
  generateTwitterTags,
  serializeSchema
} from './seo';

// Default exports
export { default as pricing } from './pricing';
export { default as validation } from './validation';
export { default as imageCompression } from './imageCompression';
export { default as session } from './session';
export { default as seo } from './seo';
