/**
 * Tabs Component
 *
 * A flexible tab navigation component with animated indicator,
 * multiple styles, and controlled/uncontrolled modes.
 *
 * Features:
 * - Animated active indicator
 * - Multiple styles (underline, pills, boxed)
 * - Controlled and uncontrolled modes
 * - Keyboard navigation
 * - Responsive design
 * - WCAG AA accessible
 *
 * @module components/common/Tabs
 */

import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion } from 'framer-motion';

/**
 * Tab Context for sharing state between components
 */
const TabContext = createContext(null);

/**
 * Style configurations for different tab variants
 */
const styleConfig = {
  underline: {
    list: 'border-b border-gray-200',
    tab: 'pb-3 px-4 text-gray-500 hover:text-cool-blue',
    activeTab: 'text-cool-blue',
    indicator: 'h-0.5 bg-cool-blue bottom-0',
  },
  pills: {
    list: 'gap-2 bg-gray-100 p-1 rounded-lg',
    tab: 'px-4 py-2 rounded-md text-gray-600 hover:text-graphite',
    activeTab: 'text-graphite',
    indicator: 'inset-0 bg-white rounded-md shadow-sm',
  },
  boxed: {
    list: 'border border-gray-200 rounded-lg p-1',
    tab: 'px-4 py-2 text-gray-600 hover:text-graphite',
    activeTab: 'text-white',
    indicator: 'inset-0 bg-cool-blue rounded-md',
  },
};

/**
 * Tabs Component
 *
 * Main tabs wrapper that manages tab state.
 *
 * @param {Object} props - Component props
 * @param {string} props.defaultValue - Default active tab (uncontrolled)
 * @param {string} props.value - Active tab value (controlled)
 * @param {function} props.onChange - Change handler for controlled mode
 * @param {'underline'|'pills'|'boxed'} props.variant - Tab style variant
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Tab components
 *
 * @example
 * // Uncontrolled tabs
 * <Tabs defaultValue="tab1">
 *   <Tabs.List>
 *     <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
 *     <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
 *   <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
 * </Tabs>
 *
 * @example
 * // Controlled tabs
 * <Tabs value={activeTab} onChange={setActiveTab}>
 *   ...
 * </Tabs>
 */
const Tabs = ({
  defaultValue,
  value,
  onChange,
  variant = 'underline',
  className = '',
  children,
}) => {
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue);

  // Determine if controlled
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  // Handle tab change
  const handleChange = useCallback(
    (newValue) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  // Context value
  const contextValue = {
    activeValue,
    onChange: handleChange,
    variant,
    styles: styleConfig[variant],
  };

  return (
    <TabContext.Provider value={contextValue}>
      <div className={clsx('w-full', className)}>
        {children}
      </div>
    </TabContext.Provider>
  );
};

Tabs.propTypes = {
  /** Default active tab for uncontrolled mode */
  defaultValue: PropTypes.string,
  /** Active tab value for controlled mode */
  value: PropTypes.string,
  /** Change handler */
  onChange: PropTypes.func,
  /** Tab style variant */
  variant: PropTypes.oneOf(['underline', 'pills', 'boxed']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Tab components */
  children: PropTypes.node.isRequired,
};

/**
 * TabsList Component
 *
 * Container for tab buttons with animated indicator.
 */
const TabsList = ({
  children,
  className = '',
}) => {
  const { activeValue, variant, styles } = useContext(TabContext);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const listRef = useRef(null);
  const tabRefs = useRef({});

  // Update indicator position when active tab changes
  useEffect(() => {
    const activeTab = tabRefs.current[activeValue];
    if (activeTab && listRef.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - listRect.left,
        width: tabRect.width,
      });
    }
  }, [activeValue]);

  // Register tab ref
  const registerTab = useCallback((value, ref) => {
    tabRefs.current[value] = ref;
  }, []);

  return (
    <TabContext.Provider value={{ ...useContext(TabContext), registerTab }}>
      <div
        ref={listRef}
        role="tablist"
        className={clsx(
          'relative flex items-center',
          styles.list,
          className
        )}
      >
        {children}

        {/* Animated indicator */}
        {indicatorStyle.width && (
          <motion.div
            className={clsx('absolute', styles.indicator)}
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            style={variant !== 'underline' ? { zIndex: -1 } : undefined}
          />
        )}
      </div>
    </TabContext.Provider>
  );
};

TabsList.displayName = 'Tabs.List';

TabsList.propTypes = {
  /** Tab buttons */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * TabsTab Component
 *
 * Individual tab button.
 */
const TabsTab = ({
  value,
  disabled = false,
  children,
  className = '',
}) => {
  const { activeValue, onChange, styles, registerTab } = useContext(TabContext);
  const tabRef = useRef(null);
  const isActive = activeValue === value;

  // Register this tab's ref
  useEffect(() => {
    if (tabRef.current) {
      registerTab(value, tabRef.current);
    }
  }, [value, registerTab]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        onChange(value);
      }
    }
  };

  return (
    <button
      ref={tabRef}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      onClick={() => !disabled && onChange(value)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={clsx(
        'relative font-medium text-sm whitespace-nowrap',
        'transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cool-blue focus-visible:ring-offset-2',
        styles.tab,
        isActive && styles.activeTab,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
};

TabsTab.displayName = 'Tabs.Tab';

TabsTab.propTypes = {
  /** Tab value identifier */
  value: PropTypes.string.isRequired,
  /** Disable this tab */
  disabled: PropTypes.bool,
  /** Tab label content */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * TabsPanel Component
 *
 * Content panel for a tab.
 */
const TabsPanel = ({
  value,
  children,
  className = '',
}) => {
  const { activeValue } = useContext(TabContext);
  const isActive = activeValue === value;

  if (!isActive) return null;

  return (
    <motion.div
      role="tabpanel"
      aria-hidden={!isActive}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className={clsx('pt-4', className)}
    >
      {children}
    </motion.div>
  );
};

TabsPanel.displayName = 'Tabs.Panel';

TabsPanel.propTypes = {
  /** Tab value this panel belongs to */
  value: PropTypes.string.isRequired,
  /** Panel content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

// Attach sub-components
Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;

export default Tabs;
