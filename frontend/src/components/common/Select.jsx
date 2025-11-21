/**
 * Select Component
 *
 * A custom dropdown select component with search functionality,
 * multiple selection support, and beautiful animations.
 *
 * Features:
 * - Single and multiple selection modes
 * - Search/filter functionality
 * - Clear selection button
 * - Beautiful dropdown animation
 * - Custom option rendering
 * - Keyboard navigation
 * - WCAG AA accessible
 *
 * @module components/common/Select
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Check, Search } from 'lucide-react';

/**
 * Animation variants for the dropdown
 */
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.15 },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.15 },
  },
};

/**
 * Animation variants for individual options
 */
const optionVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.15 },
  }),
};

/**
 * Select Component
 *
 * A fully-featured select/dropdown component.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label text
 * @param {Array} props.options - Array of options { value, label, disabled? }
 * @param {*} props.value - Selected value(s)
 * @param {function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.multiple - Enable multiple selection
 * @param {boolean} props.searchable - Enable search functionality
 * @param {boolean} props.clearable - Show clear button
 * @param {boolean} props.disabled - Disable the select
 * @param {string} props.error - Error message
 * @param {function} props.renderOption - Custom option renderer
 * @param {string} props.className - Additional CSS classes
 *
 * @example
 * // Basic select
 * <Select
 *   label="Category"
 *   options={[
 *     { value: 'stickers', label: 'Stickers' },
 *     { value: 'magnets', label: 'Magnets' },
 *   ]}
 *   value={category}
 *   onChange={setCategory}
 * />
 *
 * @example
 * // Multi-select with search
 * <Select
 *   label="Tags"
 *   options={tags}
 *   value={selectedTags}
 *   onChange={setSelectedTags}
 *   multiple
 *   searchable
 * />
 */
const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  multiple = false,
  searchable = false,
  clearable = true,
  disabled = false,
  error,
  renderOption,
  className = '',
  id,
}) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Refs
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Auto-generate ID if not provided
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  // Get display value
  const displayValue = useMemo(() => {
    if (multiple) {
      if (!value || value.length === 0) return '';
      const selectedLabels = value
        .map((v) => options.find((opt) => opt.value === v)?.label)
        .filter(Boolean);
      return selectedLabels.join(', ');
    }
    return options.find((opt) => opt.value === value)?.label || '';
  }, [value, options, multiple]);

  // Check if option is selected
  const isSelected = useCallback(
    (optionValue) => {
      if (multiple) {
        return value?.includes(optionValue);
      }
      return value === optionValue;
    },
    [value, multiple]
  );

  // Handle option selection
  const handleSelect = useCallback(
    (optionValue) => {
      if (multiple) {
        const newValue = value?.includes(optionValue)
          ? value.filter((v) => v !== optionValue)
          : [...(value || []), optionValue];
        onChange(newValue);
      } else {
        onChange(optionValue);
        setIsOpen(false);
      }
      setSearchQuery('');
    },
    [multiple, value, onChange]
  );

  // Handle clear
  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      onChange(multiple ? [] : null);
      setSearchQuery('');
    },
    [multiple, onChange]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            handleSelect(filteredOptions[focusedIndex].value);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedIndex((prev) =>
              Math.min(prev + 1, filteredOptions.length - 1)
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchQuery('');
          break;
        case 'Tab':
          setIsOpen(false);
          break;
        default:
          break;
      }
    },
    [disabled, isOpen, focusedIndex, filteredOptions, handleSelect]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex];
      focusedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  // Reset focused index when dropdown opens/closes
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(-1);
      if (searchable && inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen, searchable]);

  const hasValue = multiple ? value?.length > 0 : value !== null && value !== undefined;

  return (
    <div className={clsx('w-full', className)} ref={containerRef}>
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className={clsx(
            'block mb-2 text-sm font-medium',
            error ? 'text-red-600' : 'text-slate-gray'
          )}
        >
          {label}
        </label>
      )}

      {/* Select trigger */}
      <div className="relative">
        <button
          type="button"
          id={selectId}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-3 text-left',
            'bg-white border-2 rounded-lg',
            'transition-all duration-200 ease-out',
            'focus:outline-none',
            disabled
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'cursor-pointer hover:border-gray-300',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
              : isOpen
              ? 'border-cool-blue ring-4 ring-soft-sky/50'
              : 'border-gray-200 focus:border-cool-blue focus:ring-4 focus:ring-soft-sky/50'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? selectId : undefined}
        >
          <span
            className={clsx(
              'block truncate pr-8',
              !hasValue && 'text-gray-400'
            )}
          >
            {displayValue || placeholder}
          </span>

          {/* Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Clear button */}
            {clearable && hasValue && !disabled && (
              <motion.button
                type="button"
                onClick={handleClear}
                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Clear selection"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}

            {/* Chevron */}
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.span>
          </div>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={clsx(
                'absolute z-50 w-full mt-1',
                'bg-white border border-gray-200 rounded-lg',
                'shadow-medium overflow-hidden'
              )}
            >
              {/* Search input */}
              {searchable && (
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className={clsx(
                        'w-full pl-9 pr-3 py-2',
                        'text-sm bg-gray-50 border border-gray-200 rounded-md',
                        'focus:outline-none focus:border-cool-blue focus:bg-white',
                        'placeholder:text-gray-400'
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Options list */}
              <ul
                ref={listRef}
                role="listbox"
                aria-multiselectable={multiple}
                className="max-h-60 overflow-y-auto py-1"
              >
                {filteredOptions.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-500 text-center">
                    No options found
                  </li>
                ) : (
                  filteredOptions.map((option, index) => (
                    <motion.li
                      key={option.value}
                      custom={index}
                      variants={optionVariants}
                      initial="hidden"
                      animate="visible"
                      role="option"
                      aria-selected={isSelected(option.value)}
                      aria-disabled={option.disabled}
                      onClick={() =>
                        !option.disabled && handleSelect(option.value)
                      }
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-2.5 cursor-pointer',
                        'transition-colors duration-100',
                        option.disabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : focusedIndex === index
                          ? 'bg-soft-sky/50 text-deep-indigo'
                          : isSelected(option.value)
                          ? 'bg-soft-sky/30 text-cool-blue'
                          : 'text-graphite hover:bg-gray-50'
                      )}
                    >
                      {/* Checkbox for multiple selection */}
                      {multiple && (
                        <span
                          className={clsx(
                            'flex items-center justify-center w-4 h-4 rounded border-2',
                            'transition-colors duration-150',
                            isSelected(option.value)
                              ? 'bg-cool-blue border-cool-blue text-white'
                              : 'border-gray-300'
                          )}
                        >
                          {isSelected(option.value) && (
                            <Check className="w-3 h-3" />
                          )}
                        </span>
                      )}

                      {/* Option content */}
                      {renderOption ? (
                        renderOption(option)
                      ) : (
                        <span className="text-sm flex-1">{option.label}</span>
                      )}

                      {/* Check mark for single selection */}
                      {!multiple && isSelected(option.value) && (
                        <Check className="w-4 h-4 text-cool-blue" />
                      )}
                    </motion.li>
                  ))
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

Select.propTypes = {
  /** Label text */
  label: PropTypes.string,
  /** Array of options */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  /** Selected value(s) */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  ]),
  /** Change handler */
  onChange: PropTypes.func.isRequired,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Enable multiple selection */
  multiple: PropTypes.bool,
  /** Enable search functionality */
  searchable: PropTypes.bool,
  /** Show clear button */
  clearable: PropTypes.bool,
  /** Disable the select */
  disabled: PropTypes.bool,
  /** Error message */
  error: PropTypes.string,
  /** Custom option renderer */
  renderOption: PropTypes.func,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Select ID */
  id: PropTypes.string,
};

export default Select;
