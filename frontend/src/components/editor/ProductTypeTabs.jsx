import { motion } from 'framer-motion';
import { Sticker, Magnet, Square } from 'lucide-react';
import { PRODUCT_TYPES } from '../../data/pricingData';

/**
 * ProductTypeTabs - Tabbed navigation for product types
 *
 * Features:
 * - Stickers | Magnets | Fridge Magnets tabs
 * - Animated underline indicator
 * - Icon for each type
 */
export default function ProductTypeTabs({
  activeType = PRODUCT_TYPES.STICKERS,
  onChange,
  className = ''
}) {
  const tabs = [
    {
      id: PRODUCT_TYPES.STICKERS,
      label: 'Stickers',
      icon: Sticker,
      description: 'Die-cut vinyl stickers'
    },
    {
      id: PRODUCT_TYPES.DIE_CUT_MAGNETS,
      label: 'Die-Cut Magnets',
      icon: Magnet,
      description: 'Custom shape magnets'
    },
    {
      id: PRODUCT_TYPES.FRIDGE_MAGNETS,
      label: 'Fridge Magnets',
      icon: Square,
      description: 'Standard fridge magnets'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Tab buttons */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeType === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onChange?.(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative flex-1 flex items-center justify-center gap-2
                px-3 py-3 rounded-lg font-medium text-sm
                transition-colors duration-200
                ${isActive
                  ? 'text-white'
                  : 'text-gray-600 hover:text-graphite'
                }
              `}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-cool-blue to-deep-indigo rounded-lg shadow-md"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30
                  }}
                />
              )}

              {/* Tab content */}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Active tab description */}
      <motion.p
        key={activeType}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-gray-500 mt-2 text-center"
      >
        {tabs.find(t => t.id === activeType)?.description}
      </motion.p>
    </div>
  );
}
