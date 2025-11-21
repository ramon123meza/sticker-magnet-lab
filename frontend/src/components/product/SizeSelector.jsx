import { motion } from 'framer-motion';
import { Check, Ruler } from 'lucide-react';
import { formatPrice, getPrice } from '../../data/products';

const SizeSelector = ({
  sizes,
  selectedSize,
  onSizeChange,
  product,
  selectedQuantity,
  variant = 'grid' // 'grid' | 'dropdown' | 'visual'
}) => {
  // Parse size string to get numeric values
  const parseSize = (sizeStr) => {
    const parts = sizeStr.split('x');
    return {
      width: parseFloat(parts[0]),
      height: parseFloat(parts[1] || parts[0])
    };
  };

  // Get visual scale for size comparison (relative to largest size)
  const getVisualScale = (sizeStr) => {
    const { width } = parseSize(sizeStr);
    const maxSize = Math.max(...sizes.map(s => parseSize(s).width));
    return Math.max(0.3, width / maxSize);
  };

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-graphite mb-2">
          Select Size (inches)
        </label>
        <select
          value={selectedSize}
          onChange={(e) => onSizeChange(e.target.value)}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-graphite appearance-none cursor-pointer transition-all duration-200 focus:border-cool-blue focus:ring-0 focus:outline-none hover:border-gray-300"
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}" {product && selectedQuantity && `- ${formatPrice(getPrice(product, size, selectedQuantity))}`}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 translate-y-1/4 pointer-events-none">
          <svg className="w-5 h-5 text-slate-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'visual') {
    return (
      <div>
        <label className="block text-sm font-medium text-graphite mb-4">
          Select Size (inches)
        </label>
        <div className="flex items-end justify-center gap-4 p-6 bg-soft-gray rounded-xl min-h-[200px]">
          {sizes.slice(0, 6).map((size) => {
            const scale = getVisualScale(size);
            const isSelected = selectedSize === size;
            const price = product && selectedQuantity ? getPrice(product, size, selectedQuantity) : null;

            return (
              <motion.button
                key={size}
                onClick={() => onSizeChange(size)}
                className="flex flex-col items-center gap-2"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`relative rounded-lg border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-cool-blue bg-cool-blue/10'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  style={{
                    width: `${scale * 80}px`,
                    height: `${scale * 80}px`,
                    minWidth: '30px',
                    minHeight: '30px'
                  }}
                  animate={{
                    boxShadow: isSelected
                      ? '0 0 20px rgba(58, 110, 165, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-cool-blue rounded-full flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                <span className={`text-xs font-medium ${isSelected ? 'text-cool-blue' : 'text-slate-gray'}`}>
                  {size}"
                </span>
                {price && (
                  <span className={`text-xs ${isSelected ? 'text-cool-blue' : 'text-slate-gray'}`}>
                    {formatPrice(price)}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
        {sizes.length > 6 && (
          <p className="mt-2 text-center text-sm text-slate-gray">
            + {sizes.length - 6} more sizes available
          </p>
        )}
      </div>
    );
  }

  // Default: Grid variant
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Ruler className="w-5 h-5 text-cool-blue" />
        <label className="text-sm font-medium text-graphite">
          Select Size (inches)
        </label>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const price = product && selectedQuantity ? getPrice(product, size, selectedQuantity) : null;

          return (
            <motion.button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`relative p-3 rounded-lg border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-cool-blue bg-cool-blue/5 text-cool-blue'
                  : 'border-gray-200 bg-white text-graphite hover:border-gray-300 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSelected && (
                <motion.div
                  layoutId="sizeIndicator"
                  className="absolute inset-0 border-2 border-cool-blue rounded-lg"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative text-sm font-semibold">{size}"</span>
              {price && (
                <span className={`relative block text-xs mt-1 ${isSelected ? 'text-cool-blue' : 'text-slate-gray'}`}>
                  {formatPrice(price)}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Size preview */}
      {selectedSize && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-soft-gray rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="bg-cool-blue/20 border-2 border-cool-blue rounded"
                style={{
                  width: `${Math.min(parseSize(selectedSize).width * 4, 80)}px`,
                  height: `${Math.min(parseSize(selectedSize).height * 4, 80)}px`
                }}
              />
              <div>
                <p className="font-semibold text-graphite">{selectedSize} inches</p>
                <p className="text-sm text-slate-gray">
                  {parseSize(selectedSize).width}" x {parseSize(selectedSize).height}"
                </p>
              </div>
            </div>
            {product && selectedQuantity && (
              <div className="text-right">
                <p className="text-sm text-slate-gray">Price for {selectedQuantity}</p>
                <p className="text-lg font-bold text-deep-indigo">
                  {formatPrice(getPrice(product, selectedSize, selectedQuantity))}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SizeSelector;
