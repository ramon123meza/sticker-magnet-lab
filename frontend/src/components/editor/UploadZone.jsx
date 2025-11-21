import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, FileWarning, CheckCircle, Loader2 } from 'lucide-react';

/**
 * UploadZone - Beautiful drag and drop upload component
 *
 * Features:
 * - Drag and drop with animated feedback
 * - Click to browse
 * - File type validation (.jpg, .png)
 * - Upload progress indicator
 * - Preview after upload
 * - Error messages for invalid files
 */
export default function UploadZone({
  onFileSelect,
  isLoading = false,
  progress = 0,
  error = null,
  hasImage = false,
  imagePreview = null,
  accept = '.jpg,.jpeg,.png',
  maxSize = 10 * 1024 * 1024, // 10MB
  className = ''
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const inputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCount = prev - 1;
      if (newCount === 0) {
        setIsDragging(false);
      }
      return newCount;
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        return;
      }

      onFileSelect?.(file);
    }
  }, [onFileSelect]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback((e) => {
    const files = e.target?.files;
    if (files && files.length > 0) {
      onFileSelect?.(files[0]);
    }
    // Reset input so same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onFileSelect]);

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload image"
      />

      <motion.div
        onClick={!isLoading ? handleClick : undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={!isLoading ? { scale: 1.01 } : undefined}
        whileTap={!isLoading ? { scale: 0.99 } : undefined}
        className={`
          relative overflow-hidden rounded-xl border-2 border-dashed
          transition-all duration-300 cursor-pointer
          ${isDragging
            ? 'border-cool-blue bg-soft-sky/50 scale-[1.02]'
            : error
              ? 'border-red-400 bg-red-50'
              : hasImage
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-cool-blue hover:bg-soft-sky/30'
          }
        `}
      >
        {/* Main content area */}
        <div className="p-8 min-h-[200px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              // Loading state
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                <Loader2 className="w-12 h-12 text-cool-blue animate-spin mb-4" />
                <p className="text-graphite font-medium mb-2">Processing image...</p>
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-cool-blue rounded-full"
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">{progress}%</p>
              </motion.div>
            ) : error ? (
              // Error state
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center"
              >
                <FileWarning className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-red-600 font-medium mb-2">Upload Failed</p>
                <p className="text-sm text-red-500">{error}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="mt-4 text-cool-blue hover:underline text-sm font-medium"
                >
                  Try again
                </button>
              </motion.div>
            ) : hasImage && imagePreview ? (
              // Success state with preview
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-green-600 font-medium mb-1">Image uploaded!</p>
                <p className="text-sm text-gray-500">Click or drag to replace</p>
              </motion.div>
            ) : (
              // Default empty state
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  className="mb-4"
                >
                  {isDragging ? (
                    <Image className="w-16 h-16 text-cool-blue" />
                  ) : (
                    <Upload className="w-16 h-16 text-gray-400" />
                  )}
                </motion.div>

                <h3 className="text-lg font-semibold text-graphite mb-1">
                  {isDragging ? 'Drop your image here' : 'Upload Your Design'}
                </h3>

                <p className="text-gray-500 text-sm mb-4">
                  Drag and drop your image or{' '}
                  <span className="text-cool-blue font-medium">click to browse</span>
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="px-2 py-1 bg-gray-100 rounded">JPG</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">PNG</span>
                  <span>Max 10MB</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Drag overlay effect */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-cool-blue/10 pointer-events-none"
            >
              <motion.div
                className="absolute inset-4 border-2 border-cool-blue rounded-lg"
                animate={{ borderStyle: ['dashed', 'solid', 'dashed'] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
