/**
 * @fileoverview Image compression utilities for Sticker & Magnet Lab
 * Handles image validation, compression, and format conversion
 * @module utils/imageCompression
 */

import imageCompression from 'browser-image-compression';

/**
 * Maximum file size in MB for uploads
 * @constant {number}
 */
const MAX_SIZE_MB = 9;

/**
 * Maximum width or height for images
 * @constant {number}
 */
const MAX_DIMENSION = 4096;

/**
 * Allowed image MIME types
 * @constant {string[]}
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif'
];

/**
 * Allowed file extensions
 * @constant {string[]}
 */
export const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

/**
 * Minimum resolution requirements by size (in pixels)
 * Based on 300 DPI for print quality
 * @constant {Object}
 */
export const MIN_RESOLUTIONS = {
  '2x2': { width: 600, height: 600 },
  '3x3': { width: 900, height: 900 },
  '4x4': { width: 1200, height: 1200 },
  '5x5': { width: 1500, height: 1500 },
  '6x6': { width: 1800, height: 1800 },
  '3x4': { width: 900, height: 1200 },
  '4x6': { width: 1200, height: 1800 },
  '5x7': { width: 1500, height: 2100 },
  '2x3': { width: 600, height: 900 },
  '2.5x3.5': { width: 750, height: 1050 },
  '4.75x2': { width: 1425, height: 600 },
  '2.5x2.5': { width: 750, height: 750 }
};

/**
 * Validation result type
 * @typedef {Object} ImageValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {string|null} error - Error message if invalid
 * @property {Object} [details] - Additional details about the image
 */

/**
 * Compress image if it exceeds maximum size
 * @param {File} file - Image file to compress
 * @param {Function} [onProgress] - Progress callback (0-100)
 * @returns {Promise<File>} Compressed file or original if already small enough
 * @example
 * const compressedFile = await compressImage(file, (progress) => {
 *   console.log(`Compression: ${progress}%`);
 * });
 */
export const compressImage = async (file, onProgress = null) => {
  // Check if compression is needed
  const maxSizeBytes = MAX_SIZE_MB * 1024 * 1024;

  if (file.size <= maxSizeBytes) {
    // File is already small enough
    if (onProgress) {
      onProgress(100);
    }
    return file;
  }

  const options = {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: MAX_DIMENSION,
    useWebWorker: true,
    onProgress: onProgress,
    fileType: file.type,
    // Preserve image quality as much as possible
    initialQuality: 0.9,
    // Maintain EXIF data
    preserveExif: false
  };

  try {
    let compressedFile = await imageCompression(file, options);

    // If still too large, try more aggressive compression
    if (compressedFile.size > maxSizeBytes) {
      const aggressiveOptions = {
        ...options,
        initialQuality: 0.8,
        maxWidthOrHeight: 3000
      };
      compressedFile = await imageCompression(file, aggressiveOptions);
    }

    // Ensure we return a File, not a Blob
    if (compressedFile instanceof Blob && !(compressedFile instanceof File)) {
      return new File([compressedFile], file.name, {
        type: compressedFile.type,
        lastModified: Date.now()
      });
    }

    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    throw new Error(`Failed to compress image: ${error.message}`);
  }
};

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {ImageValidationResult} Validation result
 * @example
 * const result = validateImage(file);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 */
export const validateImage = (file) => {
  if (!file) {
    return {
      isValid: false,
      error: 'Please select an image file'
    };
  }

  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: PNG, JPG, JPEG, WebP, GIF`
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
    };
  }

  // Check file size (warn if over 50MB, even though we can compress)
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > 50) {
    return {
      isValid: false,
      error: 'File is too large. Maximum size is 50MB'
    };
  }

  return {
    isValid: true,
    error: null,
    details: {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeMB: fileSizeMB.toFixed(2)
    }
  };
};

/**
 * Get image dimensions from file
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 * @example
 * const { width, height } = await getImageDimensions(file);
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

/**
 * Check if image meets minimum resolution for a size
 * @param {File} file - Image file
 * @param {string} size - Target size (e.g., '3x3')
 * @returns {Promise<ImageValidationResult>} Resolution check result
 * @example
 * const result = await checkMinResolution(file, '3x3');
 * if (!result.isValid) {
 *   console.warn(result.error);
 * }
 */
export const checkMinResolution = async (file, size) => {
  try {
    const dimensions = await getImageDimensions(file);
    const minRes = MIN_RESOLUTIONS[size];

    if (!minRes) {
      // Unknown size, skip resolution check
      return {
        isValid: true,
        error: null,
        details: dimensions
      };
    }

    // Check if image meets minimum resolution
    // Allow some flexibility - image can be oriented differently
    const meetsWidth = dimensions.width >= minRes.width || dimensions.width >= minRes.height;
    const meetsHeight = dimensions.height >= minRes.height || dimensions.height >= minRes.width;

    if (!meetsWidth || !meetsHeight) {
      return {
        isValid: false,
        error: `Image resolution (${dimensions.width}x${dimensions.height}) is below the recommended minimum (${minRes.width}x${minRes.height}) for size ${size}. This may result in a blurry print.`,
        details: {
          ...dimensions,
          minRequired: minRes,
          isWarning: true // This is a warning, not a hard error
        }
      };
    }

    return {
      isValid: true,
      error: null,
      details: dimensions
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Failed to check image resolution: ${error.message}`
    };
  }
};

/**
 * Convert file to base64 string
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 encoded string (without data URI prefix)
 * @example
 * const base64 = await fileToBase64(file);
 * // Returns: "iVBORw0KGgoAAAANSUhEUgAA..."
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      // Remove data URI prefix (e.g., "data:image/png;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Convert file to base64 data URI
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 data URI string
 * @example
 * const dataUri = await fileToDataUri(file);
 * // Returns: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 */
export const fileToDataUri = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Convert base64 string to File
 * @param {string} base64 - Base64 encoded string (with or without data URI prefix)
 * @param {string} filename - Desired filename
 * @param {string} [mimeType='image/png'] - MIME type
 * @returns {File} Converted file
 * @example
 * const file = base64ToFile(base64String, 'design.png', 'image/png');
 */
export const base64ToFile = (base64, filename, mimeType = 'image/png') => {
  // Handle data URI format
  let base64Data = base64;
  let detectedMimeType = mimeType;

  if (base64.includes(',')) {
    const parts = base64.split(',');
    const header = parts[0];
    base64Data = parts[1];

    // Extract MIME type from data URI
    const mimeMatch = header.match(/data:([^;]+);/);
    if (mimeMatch) {
      detectedMimeType = mimeMatch[1];
    }
  }

  // Decode base64
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: detectedMimeType });

  return new File([blob], filename, {
    type: detectedMimeType,
    lastModified: Date.now()
  });
};

/**
 * Generate thumbnail from image file
 * @param {File} file - Image file
 * @param {number} maxSize - Maximum width or height
 * @returns {Promise<string>} Data URI of thumbnail
 */
export const generateThumbnail = async (file, maxSize = 200) => {
  const dimensions = await getImageDimensions(file);

  // Calculate new dimensions maintaining aspect ratio
  let newWidth, newHeight;
  if (dimensions.width > dimensions.height) {
    newWidth = maxSize;
    newHeight = (dimensions.height / dimensions.width) * maxSize;
  } else {
    newHeight = maxSize;
    newWidth = (dimensions.width / dimensions.height) * maxSize;
  }

  // Create canvas and draw resized image
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to generate thumbnail'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Get file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Human-readable file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if file needs compression
 * @param {File} file - File to check
 * @returns {boolean} True if file needs compression
 */
export const needsCompression = (file) => {
  return file.size > MAX_SIZE_MB * 1024 * 1024;
};

/**
 * Check if file type is a valid image
 * @param {File} file - File to check
 * @returns {boolean} True if valid image type
 */
export const isValidImageType = (file) => {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
};

/**
 * Calculate DPI based on image dimensions and print size
 * @param {number} imageWidth - Image width in pixels
 * @param {number} imageHeight - Image height in pixels
 * @param {number} printWidth - Print width in inches
 * @param {number} printHeight - Print height in inches
 * @returns {number} Estimated DPI (uses the lower of width/height DPI)
 */
export const calculateDPI = (imageWidth, imageHeight, printWidth, printHeight) => {
  const dpiWidth = imageWidth / printWidth;
  const dpiHeight = imageHeight / printHeight;
  return Math.min(dpiWidth, dpiHeight);
};

/**
 * Get quality indicator based on DPI
 * @param {number} dpi - The calculated DPI
 * @returns {{level: string, color: string, message: string}} Quality indicator
 */
export const getQualityIndicator = (dpi) => {
  if (dpi >= 300) {
    return {
      level: 'excellent',
      color: 'green',
      message: 'Excellent quality - Print will be crisp and clear'
    };
  } else if (dpi >= 200) {
    return {
      level: 'good',
      color: 'blue',
      message: 'Good quality - Print will look nice'
    };
  } else if (dpi >= 150) {
    return {
      level: 'acceptable',
      color: 'yellow',
      message: 'Acceptable quality - Some detail loss possible'
    };
  } else {
    return {
      level: 'low',
      color: 'red',
      message: 'Low quality - Image may appear blurry when printed'
    };
  }
};

export default {
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
  MIN_RESOLUTIONS,
  MAX_SIZE_MB,
  MAX_DIMENSION
};
