/**
 * ImageGallery Component
 *
 * A comprehensive image gallery component with thumbnails,
 * lightbox view, zoom capability, and touch/swipe support.
 *
 * Features:
 * - Main image display with thumbnails
 * - Lightbox/fullscreen view
 * - Zoom on hover/click
 * - Navigation arrows
 * - Touch swipe support
 * - Keyboard navigation
 * - Responsive design
 *
 * @module components/common/ImageGallery
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

/**
 * Animation variants for main image
 */
const imageVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

/**
 * Animation variants for lightbox
 */
const lightboxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * ImageGallery Component
 *
 * Displays a collection of images with various viewing options.
 *
 * @param {Object} props - Component props
 * @param {Array} props.images - Array of image objects { src, alt, thumbnail? }
 * @param {number} props.initialIndex - Starting image index
 * @param {boolean} props.showThumbnails - Show thumbnail strip
 * @param {'bottom'|'left'|'right'} props.thumbnailPosition - Thumbnail placement
 * @param {boolean} props.showArrows - Show navigation arrows
 * @param {boolean} props.enableZoom - Enable zoom functionality
 * @param {boolean} props.enableLightbox - Enable fullscreen lightbox
 * @param {boolean} props.autoPlay - Auto-advance images
 * @param {number} props.autoPlayInterval - Auto-advance interval (ms)
 * @param {string} props.aspectRatio - Main image aspect ratio
 * @param {string} props.className - Additional CSS classes
 *
 * @example
 * // Basic gallery
 * <ImageGallery
 *   images={[
 *     { src: '/img1.jpg', alt: 'Image 1' },
 *     { src: '/img2.jpg', alt: 'Image 2' },
 *   ]}
 * />
 *
 * @example
 * // With all features
 * <ImageGallery
 *   images={images}
 *   showThumbnails
 *   enableZoom
 *   enableLightbox
 *   thumbnailPosition="bottom"
 * />
 */
const ImageGallery = ({
  images = [],
  initialIndex = 0,
  showThumbnails = true,
  thumbnailPosition = 'bottom',
  showArrows = true,
  enableZoom = true,
  enableLightbox = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  aspectRatio = '1/1',
  className = '',
}) => {
  // State
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // Refs
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Current image
  const currentImage = images[currentIndex];

  // Navigate to previous image
  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false);
  }, [images.length]);

  // Navigate to next image
  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  }, [images.length]);

  // Go to specific image
  const goToImage = useCallback((index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsZoomed(false);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isLightboxOpen) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, goToNext, isLightboxOpen]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  // Zoom handlers
  const handleMouseMove = (e) => {
    if (!enableZoom || !isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Toggle zoom
  const toggleZoom = () => {
    if (enableZoom) {
      setIsZoomed(!isZoomed);
    }
  };

  // Open lightbox
  const openLightbox = () => {
    if (enableLightbox) {
      setIsLightboxOpen(true);
    }
  };

  // Render navigation arrows
  const renderArrows = (size = 'md') => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    };

    return (
      <>
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className={clsx(
            'absolute left-2 top-1/2 -translate-y-1/2 z-10',
            'flex items-center justify-center rounded-full',
            'bg-white/90 shadow-md',
            'text-slate-gray hover:text-deep-indigo',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-cool-blue',
            sizeClasses[size]
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className={clsx(
            'absolute right-2 top-1/2 -translate-y-1/2 z-10',
            'flex items-center justify-center rounded-full',
            'bg-white/90 shadow-md',
            'text-slate-gray hover:text-deep-indigo',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-cool-blue',
            sizeClasses[size]
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </>
    );
  };

  // Render thumbnails
  const renderThumbnails = () => {
    if (!showThumbnails || images.length <= 1) return null;

    const isVertical = thumbnailPosition === 'left' || thumbnailPosition === 'right';

    return (
      <div
        className={clsx(
          'flex gap-2',
          isVertical ? 'flex-col' : 'flex-row overflow-x-auto py-2',
          thumbnailPosition === 'left' && 'order-first',
          thumbnailPosition === 'right' && 'order-last'
        )}
      >
        {images.map((image, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => goToImage(index)}
            className={clsx(
              'shrink-0 rounded-lg overflow-hidden',
              'border-2 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-cool-blue',
              isVertical ? 'w-16 h-16' : 'w-16 h-16 sm:w-20 sm:h-20',
              currentIndex === index
                ? 'border-cool-blue ring-2 ring-cool-blue/30'
                : 'border-gray-200 hover:border-gray-300'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`View image ${index + 1}`}
            aria-current={currentIndex === index ? 'true' : 'false'}
          >
            <img
              src={image.thumbnail || image.src}
              alt={image.alt || `Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.button>
        ))}
      </div>
    );
  };

  // Render lightbox
  const renderLightbox = () => (
    <AnimatePresence>
      {isLightboxOpen && (
        <motion.div
          variants={lightboxVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className={clsx(
              'absolute top-4 right-4 z-20',
              'p-2 rounded-full',
              'bg-white/10 text-white hover:bg-white/20',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-white'
            )}
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={currentIndex}
                src={currentImage?.src}
                alt={currentImage?.alt || ''}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </AnimatePresence>

            {/* Navigation arrows */}
            {showArrows && images.length > 1 && renderArrows('lg')}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (images.length === 0) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center bg-gray-100 rounded-lg',
          className
        )}
        style={{ aspectRatio }}
      >
        <span className="text-gray-400">No images</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={clsx(
        'flex gap-4',
        thumbnailPosition === 'bottom' && 'flex-col',
        thumbnailPosition === 'left' && 'flex-row',
        thumbnailPosition === 'right' && 'flex-row',
        className
      )}
    >
      {/* Main image container */}
      <div
        className="relative flex-1 overflow-hidden rounded-xl bg-gray-100"
        style={{ aspectRatio }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            onClick={toggleZoom}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
            style={{ cursor: enableZoom ? (isZoomed ? 'zoom-out' : 'zoom-in') : 'default' }}
          >
            <img
              src={currentImage?.src}
              alt={currentImage?.alt || ''}
              className={clsx(
                'w-full h-full object-cover transition-transform duration-200',
                isZoomed && 'scale-150'
              )}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {showArrows && images.length > 1 && !isZoomed && renderArrows()}

        {/* Action buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          {enableZoom && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
              className={clsx(
                'p-2 rounded-full',
                'bg-white/90 shadow-md',
                'text-slate-gray hover:text-deep-indigo',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-cool-blue'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
            >
              {isZoomed ? (
                <ZoomOut className="w-4 h-4" />
              ) : (
                <ZoomIn className="w-4 h-4" />
              )}
            </motion.button>
          )}

          {enableLightbox && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openLightbox();
              }}
              className={clsx(
                'p-2 rounded-full',
                'bg-white/90 shadow-md',
                'text-slate-gray hover:text-deep-indigo',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-cool-blue'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Image indicators (dots) */}
        {!showThumbnails && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToImage(index)}
                className={clsx(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  currentIndex === index
                    ? 'bg-white w-4'
                    : 'bg-white/50 hover:bg-white/75'
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {renderThumbnails()}

      {/* Lightbox */}
      {renderLightbox()}
    </div>
  );
};

ImageGallery.propTypes = {
  /** Array of image objects */
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
      thumbnail: PropTypes.string,
    })
  ).isRequired,
  /** Starting image index */
  initialIndex: PropTypes.number,
  /** Show thumbnail strip */
  showThumbnails: PropTypes.bool,
  /** Thumbnail placement */
  thumbnailPosition: PropTypes.oneOf(['bottom', 'left', 'right']),
  /** Show navigation arrows */
  showArrows: PropTypes.bool,
  /** Enable zoom functionality */
  enableZoom: PropTypes.bool,
  /** Enable fullscreen lightbox */
  enableLightbox: PropTypes.bool,
  /** Auto-advance images */
  autoPlay: PropTypes.bool,
  /** Auto-advance interval (ms) */
  autoPlayInterval: PropTypes.number,
  /** Main image aspect ratio */
  aspectRatio: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default ImageGallery;
