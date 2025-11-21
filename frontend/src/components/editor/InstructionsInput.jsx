import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronDown, Info } from 'lucide-react';

/**
 * InstructionsInput - Expandable textarea for custom instructions
 *
 * Features:
 * - Character count
 * - Collapsible section
 * - Placeholder text
 * - Visual feedback
 */
export default function InstructionsInput({
  value = '',
  onChange,
  maxLength = 500,
  placeholder = 'Add any special instructions for your order...',
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const characterCount = value.length;
  const remainingChars = maxLength - characterCount;
  const isNearLimit = remainingChars < 50;

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange?.(newValue);
    }
  };

  return (
    <div className={className}>
      {/* Header / Toggle */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cool-blue" />
          <span className="font-medium text-graphite text-sm">
            Special Instructions
          </span>
          {value && (
            <span className="text-xs text-gray-500">
              ({characterCount} chars)
            </span>
          )}
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">
              {/* Textarea */}
              <div
                className={`
                  relative rounded-xl border-2 transition-all duration-200
                  ${isFocused
                    ? 'border-cool-blue shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <textarea
                  value={value}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={placeholder}
                  rows={4}
                  className="
                    w-full p-4 bg-transparent resize-none
                    text-graphite placeholder-gray-400
                    focus:outline-none
                  "
                />

                {/* Character count */}
                <div className={`
                  absolute bottom-2 right-3 text-xs font-medium
                  ${isNearLimit ? 'text-orange-500' : 'text-gray-400'}
                `}>
                  {remainingChars} characters remaining
                </div>
              </div>

              {/* Tips */}
              <div className="flex items-start gap-2 p-3 bg-soft-sky/30 rounded-lg">
                <Info className="w-4 h-4 text-cool-blue flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-medium text-graphite">Example instructions:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Special color requests</li>
                    <li>Mirror or flip the image</li>
                    <li>Add border or padding</li>
                    <li>Rush order notes</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
