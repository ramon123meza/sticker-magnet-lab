/**
 * @fileoverview Image upload hook for Sticker & Magnet Lab
 * Handles the complete image upload flow with compression and validation
 * @module hooks/useImageUpload
 */

import { useState, useCallback, useRef } from 'react';
import { api } from '../services/api';
import {
  compressImage,
  validateImage,
  fileToBase64,
  getImageDimensions,
  checkMinResolution,
  formatFileSize,
  isValidImageType,
  needsCompression,
  calculateDPI,
  getQualityIndicator
} from '../utils/imageCompression';
import { getSessionId } from '../utils/session';

/**
 * Upload stages for progress tracking
 * @constant {Object}
 */
export const UPLOAD_STAGES = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  COMPRESSING: 'compressing',
  UPLOADING: 'uploading',
  COMPLETE: 'complete',
  ERROR: 'error'
};

/**
 * Hook to handle image upload flow
 * @returns {Object} Upload state and methods
 * @returns {Function} returns.upload - Function to upload an image file to API
 * @returns {Function} returns.handleFileSelect - Process file locally
 * @returns {boolean} returns.uploading - Whether upload is in progress
 * @returns {boolean} returns.isLoading - Alias for uploading
 * @returns {number} returns.progress - Upload progress (0-100)
 * @returns {number} returns.uploadProgress - Alias for progress
 * @returns {string} returns.stage - Current upload stage
 * @returns {Error|null} returns.error - Error if any
 * @returns {string|null} returns.imageUrl - Uploaded image URL
 * @returns {Object|null} returns.imageData - Image metadata
 * @returns {Function} returns.reset - Reset upload state
 * @returns {Function} returns.cancel - Cancel ongoing upload
 * @example
 * const { upload, uploading, progress, error, imageUrl, reset } = useImageUpload();
 * await upload(file);
 */
export const useImageUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(UPLOAD_STAGES.IDLE);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [warning, setWarning] = useState(null);
  const [qualityInfo, setQualityInfo] = useState(null);

  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  /**
   * Reset upload state
   */
  const reset = useCallback(() => {
    setImageFile(null);
    setImageDataUrl(null);
    setImageDimensions(null);
    setUploading(false);
    setProgress(0);
    setStage(UPLOAD_STAGES.IDLE);
    setError(null);
    setImageUrl(null);
    setImageData(null);
    setWarning(null);
    setQualityInfo(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Alias for reset
  const clearImage = reset;

  /**
   * Cancel ongoing upload
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    reset();
  }, [reset]);

  /**
   * Process and validate an uploaded file locally (no API upload)
   * @param {File} file - Image file to process
   * @param {Object} [printSize={width: 5, height: 5}] - Print size for quality calculation
   * @returns {Promise<Object>} Processed file result
   */
  const handleFileSelect = useCallback(async (file, printSize = { width: 5, height: 5 }) => {
    setError(null);
    setWarning(null);
    setUploading(true);
    setProgress(0);
    setStage(UPLOAD_STAGES.VALIDATING);

    try {
      // Validate file type
      if (!isValidImageType(file)) {
        throw new Error('Invalid file type. Please upload a JPG, PNG, WebP, or GIF image.');
      }

      // Full validation
      const validation = validateImage(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      setProgress(10);

      // Check if compression is needed
      let processedFile = file;
      if (needsCompression(file)) {
        setStage(UPLOAD_STAGES.COMPRESSING);
        setProgress(20);
        processedFile = await compressImage(file, (compressProgress) => {
          // Map compression progress to 20-70% of total progress
          setProgress(20 + Math.round(compressProgress * 0.5));
        });
      } else {
        setProgress(70);
      }

      // Get image dimensions
      const dimensions = await getImageDimensions(processedFile);
      setImageDimensions(dimensions);
      setProgress(80);

      // Calculate quality
      const dpi = calculateDPI(
        dimensions.width,
        dimensions.height,
        printSize.width,
        printSize.height
      );
      const quality = getQualityIndicator(dpi);
      const newQualityInfo = {
        ...quality,
        dpi: Math.round(dpi),
        originalSize: formatFileSize(file.size),
        processedSize: formatFileSize(processedFile.size),
        wasCompressed: file.size !== processedFile.size
      };
      setQualityInfo(newQualityInfo);

      // Set warning for low quality
      if (quality.level === 'low' || quality.level === 'acceptable') {
        setWarning(quality.message);
      }

      setProgress(90);

      // Create data URL for display
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(processedFile);
      });

      setImageDataUrl(dataUrl);
      setImageFile(processedFile);
      setProgress(100);
      setStage(UPLOAD_STAGES.COMPLETE);

      return {
        success: true,
        file: processedFile,
        dataUrl,
        dimensions,
        quality: newQualityInfo
      };
    } catch (err) {
      const errorMessage = err.message || 'Failed to process image';
      setError(new Error(errorMessage));
      setStage(UPLOAD_STAGES.ERROR);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  /**
   * Upload an image file to API
   * @param {File} file - Image file to upload
   * @param {Object} [options={}] - Upload options
   * @param {string} [options.targetSize] - Target print size for resolution check
   * @returns {Promise<Object>} Upload result with URL and metadata
   */
  const upload = useCallback(async (file, options = {}) => {
    const { targetSize } = options;

    // Reset state
    setUploading(true);
    setProgress(0);
    setError(null);
    setWarning(null);
    setImageUrl(null);
    setImageData(null);

    abortControllerRef.current = new AbortController();

    try {
      // Stage 1: Validation
      setStage(UPLOAD_STAGES.VALIDATING);
      setProgress(10);

      const validation = validateImage(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Get image dimensions
      let dimensions;
      try {
        dimensions = await getImageDimensions(file);
        setImageDimensions(dimensions);
      } catch (dimError) {
        throw new Error('Failed to read image. Please try a different file.');
      }

      // Check resolution if target size provided
      if (targetSize) {
        const resCheck = await checkMinResolution(file, targetSize);
        if (!resCheck.isValid && resCheck.details?.isWarning) {
          setWarning(resCheck.error);
        }
      }

      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      setProgress(20);

      // Stage 2: Compression (if needed)
      setStage(UPLOAD_STAGES.COMPRESSING);
      let fileToUpload = file;

      if (needsCompression(file)) {
        const compressedFile = await compressImage(file, (compressProgress) => {
          setProgress(20 + Math.round(compressProgress * 0.3));
        });
        fileToUpload = compressedFile;
      }

      setImageFile(fileToUpload);

      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      setProgress(50);

      // Stage 3: Convert to base64 and upload
      setStage(UPLOAD_STAGES.UPLOADING);
      const base64 = await fileToBase64(fileToUpload);

      // Also create data URL for preview
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(fileToUpload);
      });
      setImageDataUrl(dataUrl);

      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      setProgress(60);

      // Get session ID
      const sessionId = getSessionId();

      // Upload to API
      const response = await api.uploadImage(base64, file.name, sessionId);

      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      setProgress(100);
      setStage(UPLOAD_STAGES.COMPLETE);

      // Extract URL from response
      const uploadedUrl = response.url || response.imageUrl || response.data?.url;

      // Build image metadata
      const metadata = {
        originalName: file.name,
        originalSize: file.size,
        compressedSize: fileToUpload.size,
        width: dimensions.width,
        height: dimensions.height,
        type: file.type,
        url: uploadedUrl,
        uploadedAt: new Date().toISOString()
      };

      setImageUrl(uploadedUrl);
      setImageData(metadata);

      return {
        success: true,
        url: uploadedUrl,
        metadata,
        warning: warning || null
      };

    } catch (err) {
      if (!mountedRef.current) return { success: false, error: 'Component unmounted' };

      const errorMessage = err.message || 'Failed to upload image';
      setError(new Error(errorMessage));
      setStage(UPLOAD_STAGES.ERROR);

      return {
        success: false,
        error: errorMessage
      };

    } finally {
      if (mountedRef.current) {
        setUploading(false);
        abortControllerRef.current = null;
      }
    }
  }, [warning]);

  /**
   * Update quality calculation for new print size
   * @param {Object} printSize - Print size dimensions
   */
  const recalculateQuality = useCallback((printSize) => {
    if (!imageDimensions) return;

    const dpi = calculateDPI(
      imageDimensions.width,
      imageDimensions.height,
      printSize.width,
      printSize.height
    );
    const quality = getQualityIndicator(dpi);
    setQualityInfo(prev => prev ? {
      ...prev,
      ...quality,
      dpi: Math.round(dpi)
    } : null);

    // Update warning based on quality
    if (quality.level === 'low' || quality.level === 'acceptable') {
      setWarning(quality.message);
    } else {
      setWarning(null);
    }
  }, [imageDimensions]);

  /**
   * Validate a file without uploading
   * @param {File} file - File to validate
   * @param {string} [targetSize] - Target size for resolution check
   * @returns {Promise<Object>} Validation result
   */
  const validate = useCallback(async (file, targetSize = null) => {
    const validation = validateImage(file);
    if (!validation.isValid) {
      return validation;
    }

    try {
      const dimensions = await getImageDimensions(file);

      let resolutionWarning = null;
      if (targetSize) {
        const resCheck = await checkMinResolution(file, targetSize);
        if (!resCheck.isValid && resCheck.details?.isWarning) {
          resolutionWarning = resCheck.error;
        }
      }

      return {
        isValid: true,
        error: null,
        warning: resolutionWarning,
        details: {
          ...validation.details,
          ...dimensions,
          formattedSize: formatFileSize(file.size)
        }
      };
    } catch (err) {
      return {
        isValid: false,
        error: 'Failed to read image file'
      };
    }
  }, []);

  /**
   * Handle drag and drop events
   * @param {DragEvent} event - Drop event
   * @param {Object} [printSize] - Print size for quality calculation
   */
  const handleDrop = useCallback(async (event, printSize) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      return handleFileSelect(files[0], printSize);
    }
  }, [handleFileSelect]);

  /**
   * Handle file input change
   * @param {Event} event - Input change event
   * @param {Object} [printSize] - Print size for quality calculation
   */
  const handleInputChange = useCallback(async (event, printSize) => {
    const files = event.target?.files;
    if (files && files.length > 0) {
      return handleFileSelect(files[0], printSize);
    }
  }, [handleFileSelect]);

  return {
    // State
    imageFile,
    imageDataUrl,
    imageDimensions,
    uploading,
    isLoading: uploading, // Alias
    progress,
    uploadProgress: progress, // Alias
    stage,
    error,
    warning,
    imageUrl,
    imageData,
    qualityInfo,
    hasImage: !!imageDataUrl,

    // Methods
    upload,
    validate,
    handleFileSelect,
    handleDrop,
    handleInputChange,
    recalculateQuality,
    reset,
    clearImage,
    cancel,

    // Constants
    UPLOAD_STAGES
  };
};

export default useImageUpload;
