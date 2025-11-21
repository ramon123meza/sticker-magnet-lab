import { motion } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  RefreshCw,
  Grid3X3,
  Download,
  Maximize
} from 'lucide-react';

/**
 * CanvasControls - Control toolbar for canvas manipulation
 *
 * Features:
 * - Zoom slider with +/- buttons
 * - Rotate buttons (CCW, CW)
 * - Reset button
 * - Grid toggle
 * - Download preview button
 * - All with icons and tooltips
 */
export default function CanvasControls({
  scale = 1,
  onScaleChange,
  rotation = 0,
  onRotationChange,
  showGrid = false,
  onGridToggle,
  onReset,
  onDownload,
  onFitToCanvas,
  disabled = false,
  className = ''
}) {
  // Handle zoom slider change
  const handleZoomChange = (e) => {
    const value = parseFloat(e.target.value);
    onScaleChange?.(value);
  };

  // Increment/decrement zoom
  const incrementZoom = () => {
    const newScale = Math.min(3, scale + 0.1);
    onScaleChange?.(Math.round(newScale * 10) / 10);
  };

  const decrementZoom = () => {
    const newScale = Math.max(0.1, scale - 0.1);
    onScaleChange?.(Math.round(newScale * 10) / 10);
  };

  // Handle rotation
  const rotateClockwise = () => {
    const newRotation = (rotation + 90) % 360;
    onRotationChange?.(newRotation);
  };

  const rotateCounterClockwise = () => {
    const newRotation = (rotation - 90 + 360) % 360;
    onRotationChange?.(newRotation);
  };

  const ControlButton = ({ onClick, title, icon: Icon, active = false, variant = 'default' }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-2.5 rounded-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variant === 'primary'
          ? 'bg-cool-blue text-white hover:bg-deep-indigo shadow-md'
          : active
            ? 'bg-soft-sky text-cool-blue border-2 border-cool-blue'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        }
      `}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={`
        flex flex-wrap items-center justify-center gap-4 p-4
        bg-white rounded-xl shadow-soft border border-gray-100
        ${className}
      `}
    >
      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mr-1">
          Zoom
        </span>

        <ControlButton
          onClick={decrementZoom}
          title="Zoom out"
          icon={ZoomOut}
        />

        <div className="relative w-32">
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={scale}
            onChange={handleZoomChange}
            disabled={disabled}
            className="
              w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-cool-blue
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:hover:bg-deep-indigo
              [&::-webkit-slider-thumb]:shadow-md
            "
          />
        </div>

        <ControlButton
          onClick={incrementZoom}
          title="Zoom in"
          icon={ZoomIn}
        />

        <span className="text-sm font-medium text-graphite min-w-[45px] text-center">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200" />

      {/* Rotation Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mr-1">
          Rotate
        </span>

        <ControlButton
          onClick={rotateCounterClockwise}
          title="Rotate counter-clockwise (90°)"
          icon={RotateCcw}
        />

        <ControlButton
          onClick={rotateClockwise}
          title="Rotate clockwise (90°)"
          icon={RotateCw}
        />

        <span className="text-sm font-medium text-graphite min-w-[35px] text-center">
          {rotation}°
        </span>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200" />

      {/* Utility Controls */}
      <div className="flex items-center gap-2">
        <ControlButton
          onClick={onGridToggle}
          title="Toggle grid"
          icon={Grid3X3}
          active={showGrid}
        />

        <ControlButton
          onClick={onFitToCanvas}
          title="Fit to canvas"
          icon={Maximize}
        />

        <ControlButton
          onClick={onReset}
          title="Reset position"
          icon={RefreshCw}
        />
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200" />

      {/* Download Button */}
      <ControlButton
        onClick={onDownload}
        title="Download preview"
        icon={Download}
        variant="primary"
      />
    </motion.div>
  );
}
