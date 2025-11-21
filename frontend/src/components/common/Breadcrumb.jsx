/**
 * Breadcrumb Component
 *
 * A navigation breadcrumb component for showing the user's location
 * within the site hierarchy.
 *
 * Features:
 * - Home icon option
 * - Custom separator
 * - Truncation for long paths
 * - Responsive design
 * - Keyboard accessible
 * - Structured data support for SEO
 *
 * @module components/common/Breadcrumb
 */

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Animation variants for breadcrumb items
 */
const itemVariants = {
  initial: { opacity: 0, x: -8 },
  animate: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.2 },
  }),
};

/**
 * Breadcrumb Component
 *
 * Main breadcrumb navigation wrapper.
 *
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of breadcrumb items
 * @param {boolean} props.showHome - Show home icon for first item
 * @param {React.ReactNode} props.separator - Custom separator element
 * @param {number} props.maxItems - Max items to show before truncating
 * @param {string} props.className - Additional CSS classes
 *
 * @example
 * // Basic breadcrumb
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Stickers', href: '/products/stickers' },
 *   ]}
 * />
 *
 * @example
 * // With home icon and custom separator
 * <Breadcrumb
 *   items={items}
 *   showHome
 *   separator={<span>/</span>}
 * />
 */
const Breadcrumb = ({
  items = [],
  showHome = true,
  separator,
  maxItems = 0,
  className = '',
}) => {
  // Process items for truncation if needed
  const processedItems = maxItems > 0 && items.length > maxItems
    ? [
        items[0],
        { label: '...', truncated: true },
        ...items.slice(-( maxItems - 2)),
      ]
    : items;

  // Default separator
  const SeparatorComponent = separator || (
    <ChevronRight className="w-4 h-4 text-gray-400" />
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx('flex items-center', className)}
    >
      <ol
        className="flex items-center flex-wrap gap-1 sm:gap-2"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {processedItems.map((item, index) => {
          const isLast = index === processedItems.length - 1;
          const isFirst = index === 0;
          const isTruncated = item.truncated;

          return (
            <motion.li
              key={item.href || index}
              custom={index}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              className="flex items-center gap-1 sm:gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {/* Separator (not for first item) */}
              {index > 0 && (
                <span className="text-gray-300" aria-hidden="true">
                  {SeparatorComponent}
                </span>
              )}

              {/* Truncation indicator */}
              {isTruncated ? (
                <span className="text-gray-400 text-sm px-1">...</span>
              ) : isLast ? (
                /* Current page (not a link) */
                <span
                  className={clsx(
                    'text-sm font-medium text-slate-gray',
                    'px-1 sm:px-2 py-1',
                    'truncate max-w-[120px] sm:max-w-[200px]'
                  )}
                  aria-current="page"
                  itemProp="name"
                >
                  {item.label}
                </span>
              ) : (
                /* Link item */
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className={clsx(
                    'text-sm text-gray-500 hover:text-cool-blue',
                    'transition-colors duration-200',
                    'px-1 sm:px-2 py-1 rounded',
                    'hover:bg-soft-sky/50',
                    'focus:outline-none focus:ring-2 focus:ring-cool-blue/50',
                    'flex items-center gap-1.5',
                    'truncate max-w-[100px] sm:max-w-[150px]'
                  )}
                  itemProp="item"
                >
                  {/* Home icon for first item */}
                  {isFirst && showHome && (
                    <Home className="w-4 h-4 shrink-0" />
                  )}
                  <span itemProp="name" className={isFirst && showHome ? 'sr-only sm:not-sr-only' : ''}>
                    {item.label}
                  </span>
                </a>
              )}

              {/* Schema.org position */}
              <meta itemProp="position" content={String(index + 1)} />
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  /** Array of breadcrumb items */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      /** Display label */
      label: PropTypes.string.isRequired,
      /** Link URL (optional for current page) */
      href: PropTypes.string,
      /** Optional click handler */
      onClick: PropTypes.func,
    })
  ).isRequired,
  /** Show home icon for first item */
  showHome: PropTypes.bool,
  /** Custom separator element */
  separator: PropTypes.node,
  /** Max items to show before truncating (0 = no truncation) */
  maxItems: PropTypes.number,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * BreadcrumbItem Component
 *
 * Individual breadcrumb item for more control over rendering.
 * Used when you need custom item rendering.
 */
const BreadcrumbItem = ({
  href,
  onClick,
  isActive = false,
  children,
  className = '',
}) => {
  if (isActive) {
    return (
      <span
        className={clsx(
          'text-sm font-medium text-slate-gray',
          'px-2 py-1',
          className
        )}
        aria-current="page"
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className={clsx(
        'text-sm text-gray-500 hover:text-cool-blue',
        'transition-colors duration-200',
        'px-2 py-1 rounded',
        'hover:bg-soft-sky/50',
        'focus:outline-none focus:ring-2 focus:ring-cool-blue/50',
        className
      )}
    >
      {children}
    </a>
  );
};

BreadcrumbItem.displayName = 'Breadcrumb.Item';

BreadcrumbItem.propTypes = {
  /** Link URL */
  href: PropTypes.string,
  /** Click handler */
  onClick: PropTypes.func,
  /** Whether this is the current/active item */
  isActive: PropTypes.bool,
  /** Item content */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * BreadcrumbSeparator Component
 *
 * Custom separator component for manual breadcrumb construction.
 */
const BreadcrumbSeparator = ({
  children,
  className = '',
}) => {
  return (
    <span
      className={clsx('text-gray-300 mx-1', className)}
      aria-hidden="true"
    >
      {children || <ChevronRight className="w-4 h-4" />}
    </span>
  );
};

BreadcrumbSeparator.displayName = 'Breadcrumb.Separator';

BreadcrumbSeparator.propTypes = {
  /** Separator content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

// Attach sub-components
Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Separator = BreadcrumbSeparator;

export default Breadcrumb;
