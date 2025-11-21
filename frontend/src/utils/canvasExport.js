import { v4 as uuidv4 } from 'uuid';

/**
 * Export canvas as high-resolution PNG
 * @param {fabric.Canvas} canvas - The Fabric.js canvas
 * @param {number} multiplier - Resolution multiplier (default 2 for retina)
 * @returns {string} - Data URL of the exported image
 */
export function exportCanvasAsPNG(canvas, multiplier = 2) {
  if (!canvas) {
    throw new Error('Canvas is not initialized');
  }

  return canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: multiplier
  });
}

/**
 * Export canvas as Blob for uploading
 * @param {fabric.Canvas} canvas - The Fabric.js canvas
 * @param {number} multiplier - Resolution multiplier
 * @returns {Promise<Blob>} - Blob of the exported image
 */
export function exportCanvasAsBlob(canvas, multiplier = 2) {
  return new Promise((resolve, reject) => {
    if (!canvas) {
      reject(new Error('Canvas is not initialized'));
      return;
    }

    const dataURL = exportCanvasAsPNG(canvas, multiplier);

    // Convert data URL to Blob
    fetch(dataURL)
      .then(res => res.blob())
      .then(blob => resolve(blob))
      .catch(err => reject(err));
  });
}

/**
 * Generate thumbnail from canvas
 * @param {fabric.Canvas} canvas - The Fabric.js canvas
 * @param {number} maxSize - Maximum width/height for thumbnail
 * @returns {string} - Data URL of the thumbnail
 */
export function generateThumbnail(canvas, maxSize = 200) {
  if (!canvas) {
    throw new Error('Canvas is not initialized');
  }

  const width = canvas.getWidth();
  const height = canvas.getHeight();

  // Calculate scale to fit within maxSize
  const scale = Math.min(maxSize / width, maxSize / height);

  return canvas.toDataURL({
    format: 'png',
    quality: 0.8,
    multiplier: scale
  });
}

/**
 * Generate unique filename with session ID
 * @param {string} prefix - Filename prefix
 * @param {string} extension - File extension (default 'png')
 * @returns {string} - Unique filename
 */
export function generateFilename(prefix = 'design', extension = 'png') {
  const sessionId = uuidv4().split('-')[0];
  const timestamp = Date.now();
  return `${prefix}_${sessionId}_${timestamp}.${extension}`;
}

/**
 * Prepare canvas data for S3 upload
 * @param {fabric.Canvas} canvas - The Fabric.js canvas
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} - Upload-ready data object
 */
export async function prepareForUpload(canvas, metadata = {}) {
  const blob = await exportCanvasAsBlob(canvas, 3); // High quality for printing
  const thumbnail = generateThumbnail(canvas);
  const filename = generateFilename('sticker_design');

  return {
    file: new File([blob], filename, { type: 'image/png' }),
    thumbnail: thumbnail,
    filename: filename,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
      canvasWidth: canvas.getWidth(),
      canvasHeight: canvas.getHeight()
    }
  };
}

/**
 * Download canvas as PNG file
 * @param {fabric.Canvas} canvas - The Fabric.js canvas
 * @param {string} filename - Download filename
 */
export function downloadCanvas(canvas, filename = 'my-design.png') {
  if (!canvas) {
    throw new Error('Canvas is not initialized');
  }

  const dataURL = exportCanvasAsPNG(canvas, 3);

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Get canvas state for saving/restoring
 * @param {fabric.Canvas} canvas - The Fabric.js canvas
 * @returns {string} - JSON string of canvas state
 */
export function getCanvasState(canvas) {
  if (!canvas) {
    return null;
  }
  return JSON.stringify(canvas.toJSON());
}

/**
 * Restore canvas from saved state
 * @param {fabric.Canvas} canvas - The Fabric.js canvas
 * @param {string} state - JSON string of canvas state
 * @returns {Promise<void>}
 */
export function restoreCanvasState(canvas, state) {
  return new Promise((resolve, reject) => {
    if (!canvas || !state) {
      reject(new Error('Invalid canvas or state'));
      return;
    }

    try {
      canvas.loadFromJSON(state, () => {
        canvas.renderAll();
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
