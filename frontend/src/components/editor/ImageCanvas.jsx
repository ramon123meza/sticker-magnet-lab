import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { fabric } from 'fabric';
import { motion } from 'framer-motion';

/**
 * ImageCanvas - Main Fabric.js canvas component for image editing
 *
 * Features:
 * - Dynamic sizing based on product dimensions
 * - Smart auto-fit for uploaded images
 * - Drag/pan within bounds
 * - Scale control (0.1x to 3x)
 * - Rotate control (0, 90, 180, 270 degrees)
 * - Safe print area visualization
 * - Touch gesture support
 */
const ImageCanvas = forwardRef(({
  productSize = { width: 5, height: 5 },
  imageDataUrl,
  scale = 1,
  rotation = 0,
  showGrid = false,
  onCanvasReady,
  onImageLoaded,
  className = ''
}, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const imageObjRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });

  // Calculate canvas size based on container and product aspect ratio
  const calculateCanvasSize = useCallback(() => {
    if (!containerRef.current) return { width: 400, height: 400 };

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 48; // Account for padding
    const containerHeight = container.clientHeight - 48;

    const aspectRatio = productSize.width / productSize.height;

    let width, height;

    if (aspectRatio >= 1) {
      // Wider than tall
      width = Math.min(containerWidth, containerHeight * aspectRatio);
      height = width / aspectRatio;
    } else {
      // Taller than wide
      height = Math.min(containerHeight, containerWidth / aspectRatio);
      width = height * aspectRatio;
    }

    // Ensure minimum size
    width = Math.max(300, Math.min(width, 600));
    height = Math.max(300, Math.min(height, 600));

    return { width: Math.round(width), height: Math.round(height) };
  }, [productSize]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const size = calculateCanvasSize();
    setCanvasSize(size);

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: size.width,
      height: size.height,
      backgroundColor: 'transparent',
      selection: false,
      preserveObjectStacking: true,
      renderOnAddRemove: true
    });

    fabricCanvasRef.current = canvas;
    setIsReady(true);

    if (onCanvasReady) {
      onCanvasReady(canvas);
    }

    // Handle window resize
    const handleResize = () => {
      const newSize = calculateCanvasSize();
      setCanvasSize(newSize);
      canvas.setDimensions(newSize);
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [calculateCanvasSize, onCanvasReady]);

  // Update canvas size when product dimensions change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const size = calculateCanvasSize();
    setCanvasSize(size);
    fabricCanvasRef.current.setDimensions(size);

    // Re-center image if exists
    if (imageObjRef.current) {
      centerImage(imageObjRef.current);
    }

    fabricCanvasRef.current.renderAll();
  }, [productSize, calculateCanvasSize]);

  // Center and scale image to fit canvas
  const centerImage = useCallback((imgObj) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !imgObj) return;

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // Calculate scale to fit within canvas while maintaining aspect ratio
    const imgWidth = imgObj.width;
    const imgHeight = imgObj.height;

    const scaleX = (canvasWidth * 0.9) / imgWidth;
    const scaleY = (canvasHeight * 0.9) / imgHeight;
    const fitScale = Math.min(scaleX, scaleY);

    imgObj.set({
      scaleX: fitScale,
      scaleY: fitScale,
      left: canvasWidth / 2,
      top: canvasHeight / 2,
      originX: 'center',
      originY: 'center'
    });

    imgObj.setCoords();
  }, []);

  // Load image onto canvas
  useEffect(() => {
    if (!fabricCanvasRef.current || !imageDataUrl) return;

    const canvas = fabricCanvasRef.current;

    // Remove existing image
    if (imageObjRef.current) {
      canvas.remove(imageObjRef.current);
      imageObjRef.current = null;
    }

    fabric.Image.fromURL(imageDataUrl, (img) => {
      // Configure image object
      img.set({
        selectable: true,
        hasControls: false, // We'll use external controls
        hasBorders: false,
        lockRotation: true,
        originX: 'center',
        originY: 'center'
      });

      // Center and fit
      centerImage(img);

      // Add to canvas
      canvas.add(img);
      canvas.setActiveObject(img);
      imageObjRef.current = img;

      // Set up drag constraints
      img.on('moving', () => {
        constrainImagePosition(img);
      });

      canvas.renderAll();

      if (onImageLoaded) {
        onImageLoaded(img);
      }
    }, { crossOrigin: 'anonymous' });
  }, [imageDataUrl, centerImage, onImageLoaded]);

  // Constrain image position to stay within reasonable bounds
  const constrainImagePosition = useCallback((img) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !img) return;

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const imgWidth = img.getScaledWidth();
    const imgHeight = img.getScaledHeight();

    // Allow some overflow but not too much
    const minOverlap = 0.3; // 30% must remain visible
    const minVisibleX = imgWidth * minOverlap;
    const minVisibleY = imgHeight * minOverlap;

    // Calculate bounds
    const minLeft = minVisibleX;
    const maxLeft = canvasWidth - minVisibleX;
    const minTop = minVisibleY;
    const maxTop = canvasHeight - minVisibleY;

    // Constrain position
    const newLeft = Math.max(minLeft, Math.min(maxLeft, img.left));
    const newTop = Math.max(minTop, Math.min(maxTop, img.top));

    img.set({
      left: newLeft,
      top: newTop
    });
  }, []);

  // Apply scale changes
  useEffect(() => {
    if (!imageObjRef.current || !fabricCanvasRef.current) return;

    const img = imageObjRef.current;
    const canvas = fabricCanvasRef.current;

    // Get base scale (to fit canvas)
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const scaleX = (canvasWidth * 0.9) / img.width;
    const scaleY = (canvasHeight * 0.9) / img.height;
    const baseScale = Math.min(scaleX, scaleY);

    // Apply user scale multiplier
    const finalScale = baseScale * scale;

    img.set({
      scaleX: finalScale,
      scaleY: finalScale
    });

    constrainImagePosition(img);
    canvas.renderAll();
  }, [scale, constrainImagePosition]);

  // Apply rotation changes
  useEffect(() => {
    if (!imageObjRef.current || !fabricCanvasRef.current) return;

    const img = imageObjRef.current;
    img.set({ angle: rotation });
    fabricCanvasRef.current.renderAll();
  }, [rotation]);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getCanvas: () => fabricCanvasRef.current,
    getImage: () => imageObjRef.current,
    reset: () => {
      if (imageObjRef.current) {
        centerImage(imageObjRef.current);
        imageObjRef.current.set({ angle: 0 });
        fabricCanvasRef.current?.renderAll();
      }
    },
    exportAsDataURL: (multiplier = 2) => {
      return fabricCanvasRef.current?.toDataURL({
        format: 'png',
        quality: 1,
        multiplier
      });
    }
  }), [centerImage]);

  // Draw safe print area border
  const drawSafeArea = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Remove existing safe area rect
    const existingRect = canvas.getObjects().find(obj => obj.name === 'safeArea');
    if (existingRect) {
      canvas.remove(existingRect);
    }

    // Create safe area visualization (5% margin)
    const margin = 0.05;
    const safeArea = new fabric.Rect({
      left: canvas.getWidth() * margin,
      top: canvas.getHeight() * margin,
      width: canvas.getWidth() * (1 - 2 * margin),
      height: canvas.getHeight() * (1 - 2 * margin),
      fill: 'transparent',
      stroke: '#3A6EA5',
      strokeWidth: 2,
      strokeDashArray: [8, 4],
      selectable: false,
      evented: false,
      name: 'safeArea'
    });

    canvas.add(safeArea);
    canvas.sendToBack(safeArea);
    canvas.renderAll();
  }, []);

  // Update safe area when canvas size changes
  useEffect(() => {
    if (isReady) {
      drawSafeArea();
    }
  }, [isReady, canvasSize, drawSafeArea]);

  // Draw grid overlay
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Remove existing grid
    const existingGrid = canvas.getObjects().filter(obj => obj.name === 'gridLine');
    existingGrid.forEach(obj => canvas.remove(obj));

    if (showGrid) {
      const gridSize = 40;
      const width = canvas.getWidth();
      const height = canvas.getHeight();

      // Vertical lines
      for (let x = gridSize; x < width; x += gridSize) {
        const line = new fabric.Line([x, 0, x, height], {
          stroke: 'rgba(0,0,0,0.1)',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          name: 'gridLine'
        });
        canvas.add(line);
        canvas.sendToBack(line);
      }

      // Horizontal lines
      for (let y = gridSize; y < height; y += gridSize) {
        const line = new fabric.Line([0, y, width, y], {
          stroke: 'rgba(0,0,0,0.1)',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          name: 'gridLine'
        });
        canvas.add(line);
        canvas.sendToBack(line);
      }
    }

    canvas.renderAll();
  }, [showGrid, canvasSize]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative flex items-center justify-center min-h-[400px] p-6 ${className}`}
    >
      {/* Checkered background */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
            linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      />

      {/* Canvas container */}
      <div
        className="relative bg-white rounded-lg shadow-lg overflow-hidden"
        style={{
          width: canvasSize.width,
          height: canvasSize.height
        }}
      >
        <canvas ref={canvasRef} id="editor-canvas" />

        {/* Size indicator */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {productSize.width}" x {productSize.height}"
        </div>
      </div>

      {/* Loading overlay */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cool-blue border-t-transparent" />
        </div>
      )}
    </motion.div>
  );
});

ImageCanvas.displayName = 'ImageCanvas';

export default ImageCanvas;
