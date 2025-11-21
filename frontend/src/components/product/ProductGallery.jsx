import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

const ProductGallery = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});

  // Minimum swipe distance for detection
  const minSwipeDistance = 50;

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          setLightboxOpen(false);
          setIsZoomed(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handlePrevious, handleNext]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }
  };

  const handleImageLoad = (index) => {
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="w-full">
      {/* Main Image */}
      <div
        className="relative aspect-square bg-soft-gray rounded-2xl overflow-hidden cursor-zoom-in group"
        onClick={() => setLightboxOpen(true)}
      >
        {/* Loading skeleton */}
        {!imageLoaded[selectedIndex] && (
          <div className="absolute inset-0 skeleton" />
        )}

        <motion.img
          key={selectedIndex}
          src={images[selectedIndex]}
          alt={`${productName} - View ${selectedIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded[selectedIndex] ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => handleImageLoad(selectedIndex)}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded[selectedIndex] ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Zoom indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
          <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
            <ZoomIn className="w-6 h-6 text-graphite" />
          </div>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="mt-4 flex gap-3">
        {images.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              selectedIndex === index
                ? 'border-cool-blue ring-2 ring-cool-blue/30'
                : 'border-transparent hover:border-slate-gray/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {selectedIndex !== index && (
              <div className="absolute inset-0 bg-white/40 transition-opacity duration-300 hover:opacity-0" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={() => {
              setLightboxOpen(false);
              setIsZoomed(false);
            }}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors duration-300 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(false);
                setIsZoomed(false);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Zoom toggle */}
            <motion.button
              className="absolute top-4 left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors duration-300 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isZoomed ? (
                <ZoomOut className="w-6 h-6" />
              ) : (
                <ZoomIn className="w-6 h-6" />
              )}
            </motion.button>

            {/* Navigation arrows */}
            <motion.button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors duration-300 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-8 h-8" />
            </motion.button>

            <motion.button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors duration-300 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-8 h-8" />
            </motion.button>

            {/* Main lightbox image */}
            <motion.div
              className={`relative max-w-[90vw] max-h-[90vh] ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: isZoomed ? 1.5 : 1,
                opacity: 1
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={images[selectedIndex]}
                alt={`${productName} - View ${selectedIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain"
                draggable={false}
              />
            </motion.div>

            {/* Bottom thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(index);
                    setIsZoomed(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedIndex === index
                      ? 'w-6 bg-white'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGallery;
