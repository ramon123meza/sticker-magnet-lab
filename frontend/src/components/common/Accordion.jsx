/**
 * Accordion Component
 *
 * An expandable accordion component with smooth height animations,
 * single/multiple expand modes, and customizable icons.
 *
 * Features:
 * - Smooth height animation
 * - Single or multiple expand modes
 * - Custom expand/collapse icons
 * - Keyboard accessible
 * - Controlled and uncontrolled modes
 *
 * @module components/common/Accordion
 */

import { useState, createContext, useContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';

/**
 * Accordion Context for sharing state
 */
const AccordionContext = createContext(null);

/**
 * Icon style configurations
 */
const iconStyles = {
  chevron: {
    icon: ChevronDown,
    openRotation: 180,
    closedRotation: 0,
  },
  plusMinus: {
    openIcon: Minus,
    closedIcon: Plus,
  },
};

/**
 * Accordion Component
 *
 * Main accordion wrapper that manages expand state.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.allowMultiple - Allow multiple items open
 * @param {string|string[]} props.defaultExpanded - Default expanded item(s)
 * @param {string|string[]} props.expanded - Controlled expanded item(s)
 * @param {function} props.onChange - Change handler for controlled mode
 * @param {'chevron'|'plusMinus'} props.iconStyle - Icon animation style
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Accordion items
 *
 * @example
 * // Basic accordion
 * <Accordion>
 *   <Accordion.Item value="item1">
 *     <Accordion.Trigger>Section 1</Accordion.Trigger>
 *     <Accordion.Content>Content for section 1</Accordion.Content>
 *   </Accordion.Item>
 *   <Accordion.Item value="item2">
 *     <Accordion.Trigger>Section 2</Accordion.Trigger>
 *     <Accordion.Content>Content for section 2</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 *
 * @example
 * // Multiple expansion allowed
 * <Accordion allowMultiple defaultExpanded={['item1', 'item2']}>
 *   ...
 * </Accordion>
 */
const Accordion = ({
  allowMultiple = false,
  defaultExpanded,
  expanded,
  onChange,
  iconStyle = 'chevron',
  className = '',
  children,
}) => {
  // Normalize default expanded to array
  const normalizedDefault = defaultExpanded
    ? Array.isArray(defaultExpanded)
      ? defaultExpanded
      : [defaultExpanded]
    : [];

  // Internal state for uncontrolled mode
  const [internalExpanded, setInternalExpanded] = useState(normalizedDefault);

  // Determine if controlled
  const isControlled = expanded !== undefined;
  const expandedItems = isControlled
    ? Array.isArray(expanded)
      ? expanded
      : expanded
      ? [expanded]
      : []
    : internalExpanded;

  // Handle toggle
  const toggleItem = useCallback(
    (value) => {
      let newExpanded;

      if (expandedItems.includes(value)) {
        // Collapse item
        newExpanded = expandedItems.filter((v) => v !== value);
      } else {
        // Expand item
        if (allowMultiple) {
          newExpanded = [...expandedItems, value];
        } else {
          newExpanded = [value];
        }
      }

      if (!isControlled) {
        setInternalExpanded(newExpanded);
      }

      // Call onChange with appropriate format
      if (onChange) {
        if (allowMultiple) {
          onChange(newExpanded);
        } else {
          onChange(newExpanded[0] || null);
        }
      }
    },
    [allowMultiple, expandedItems, isControlled, onChange]
  );

  // Check if item is expanded
  const isExpanded = useCallback(
    (value) => expandedItems.includes(value),
    [expandedItems]
  );

  // Context value
  const contextValue = {
    isExpanded,
    toggleItem,
    iconStyle: iconStyles[iconStyle],
    iconStyleName: iconStyle,
  };

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={clsx('divide-y divide-gray-200', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

Accordion.propTypes = {
  /** Allow multiple items to be expanded */
  allowMultiple: PropTypes.bool,
  /** Default expanded item(s) for uncontrolled mode */
  defaultExpanded: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  /** Expanded item(s) for controlled mode */
  expanded: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  /** Change handler */
  onChange: PropTypes.func,
  /** Icon animation style */
  iconStyle: PropTypes.oneOf(['chevron', 'plusMinus']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Accordion items */
  children: PropTypes.node.isRequired,
};

/**
 * AccordionItem Component
 *
 * Wrapper for a single accordion item.
 */
const AccordionItem = ({
  value,
  disabled = false,
  children,
  className = '',
}) => {
  const { isExpanded, toggleItem } = useContext(AccordionContext);
  const expanded = isExpanded(value);

  // Item context
  const itemContext = {
    value,
    expanded,
    disabled,
    toggle: () => !disabled && toggleItem(value),
  };

  return (
    <AccordionItemContext.Provider value={itemContext}>
      <div
        className={clsx(
          'first:rounded-t-lg last:rounded-b-lg',
          disabled && 'opacity-50',
          className
        )}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

// Separate context for item-level state
const AccordionItemContext = createContext(null);

AccordionItem.displayName = 'Accordion.Item';

AccordionItem.propTypes = {
  /** Unique value for this item */
  value: PropTypes.string.isRequired,
  /** Disable this item */
  disabled: PropTypes.bool,
  /** Item content (Trigger + Content) */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * AccordionTrigger Component
 *
 * Clickable trigger that expands/collapses the accordion item.
 */
const AccordionTrigger = ({
  children,
  className = '',
}) => {
  const { value, expanded, disabled, toggle } = useContext(AccordionItemContext);
  const { iconStyle, iconStyleName } = useContext(AccordionContext);

  // Render icon based on style
  const renderIcon = () => {
    if (iconStyleName === 'plusMinus') {
      const Icon = expanded ? iconStyle.openIcon : iconStyle.closedIcon;
      return (
        <motion.span
          initial={false}
          animate={{ scale: expanded ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-5 h-5 text-slate-gray" />
        </motion.span>
      );
    }

    // Chevron style
    const Icon = iconStyle.icon;
    return (
      <motion.span
        initial={false}
        animate={{ rotate: expanded ? iconStyle.openRotation : iconStyle.closedRotation }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-5 h-5 text-slate-gray" />
      </motion.span>
    );
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      aria-expanded={expanded}
      aria-controls={`accordion-content-${value}`}
      id={`accordion-trigger-${value}`}
      className={clsx(
        'w-full flex items-center justify-between',
        'py-4 px-4 sm:px-6',
        'text-left font-medium text-graphite',
        'hover:bg-gray-50',
        'transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cool-blue focus-visible:ring-inset',
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      <span className="flex-1">{children}</span>
      {renderIcon()}
    </button>
  );
};

AccordionTrigger.displayName = 'Accordion.Trigger';

AccordionTrigger.propTypes = {
  /** Trigger label content */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * AccordionContent Component
 *
 * Collapsible content area with smooth height animation.
 */
const AccordionContent = ({
  children,
  className = '',
}) => {
  const { value, expanded } = useContext(AccordionItemContext);
  const contentRef = useRef(null);

  return (
    <AnimatePresence initial={false}>
      {expanded && (
        <motion.div
          id={`accordion-content-${value}`}
          role="region"
          aria-labelledby={`accordion-trigger-${value}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: {
              height: { duration: 0.3, ease: 'easeOut' },
              opacity: { duration: 0.2, delay: 0.1 },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.3, ease: 'easeIn' },
              opacity: { duration: 0.2 },
            },
          }}
          className="overflow-hidden"
        >
          <div
            ref={contentRef}
            className={clsx(
              'px-4 sm:px-6 pb-4',
              'text-slate-gray',
              className
            )}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AccordionContent.displayName = 'Accordion.Content';

AccordionContent.propTypes = {
  /** Content to show when expanded */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

// Attach sub-components
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export default Accordion;
