/**
 * Card Component
 *
 * A flexible card component for displaying content in a contained,
 * visually distinct container. Perfect for product cards, info cards, etc.
 *
 * Features:
 * - Header, body, and footer sections
 * - Image slot with aspect ratio options
 * - Hover effects with Framer Motion
 * - Clickable variant
 * - Multiple shadow options
 * - Fully responsive
 *
 * @module components/common/Card
 */

import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion } from 'framer-motion';

/**
 * Shadow variant classes
 */
const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-soft',
  lg: 'shadow-medium',
  xl: 'shadow-large',
};

/**
 * Padding variant classes
 */
const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-6 sm:p-8',
};

/**
 * Framer Motion animation variants for hover effects
 */
const hoverVariants = {
  initial: { y: 0, scale: 1 },
  hover: { y: -4, scale: 1.01 },
};

/**
 * Card Component
 *
 * Main card wrapper component with customizable appearance.
 *
 * @param {Object} props - Component props
 * @param {'none'|'sm'|'md'|'lg'|'xl'} props.shadow - Shadow depth
 * @param {'none'|'sm'|'md'|'lg'} props.padding - Internal padding
 * @param {boolean} props.clickable - Enables hover effects and pointer cursor
 * @param {boolean} props.bordered - Adds border
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Card content
 *
 * @example
 * // Basic card
 * <Card>
 *   <Card.Body>Content here</Card.Body>
 * </Card>
 *
 * @example
 * // Clickable card with image
 * <Card clickable onClick={handleClick}>
 *   <Card.Image src="/image.jpg" alt="Product" />
 *   <Card.Body>Product description</Card.Body>
 * </Card>
 */
const Card = forwardRef(({
  shadow = 'md',
  padding = 'none',
  clickable = false,
  bordered = true,
  onClick,
  className = '',
  children,
  ...props
}, ref) => {
  const Component = clickable ? motion.div : 'div';
  const motionProps = clickable ? {
    variants: hoverVariants,
    initial: 'initial',
    whileHover: 'hover',
    transition: { duration: 0.2, ease: 'easeOut' },
  } : {};

  return (
    <Component
      ref={ref}
      onClick={onClick}
      className={clsx(
        'bg-white rounded-xl overflow-hidden',
        shadowClasses[shadow],
        paddingClasses[padding],
        bordered && 'border border-gray-100',
        clickable && 'cursor-pointer',
        'transition-shadow duration-200',
        className
      )}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyPress={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(e);
        }
      } : undefined}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

Card.propTypes = {
  /** Shadow depth */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  /** Internal padding */
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  /** Enables hover effects and pointer cursor */
  clickable: PropTypes.bool,
  /** Adds border */
  bordered: PropTypes.bool,
  /** Click handler */
  onClick: PropTypes.func,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Card content */
  children: PropTypes.node,
};

/**
 * Card.Image Component
 *
 * Image section of the card with aspect ratio support.
 */
const CardImage = ({
  src,
  alt,
  aspectRatio = '16/9',
  className = '',
  overlay,
  ...props
}) => {
  return (
    <div
      className={clsx('relative overflow-hidden', className)}
      style={{ aspectRatio }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4 }}
        {...props}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
          {overlay}
        </div>
      )}
    </div>
  );
};

CardImage.displayName = 'Card.Image';

CardImage.propTypes = {
  /** Image source URL */
  src: PropTypes.string.isRequired,
  /** Image alt text */
  alt: PropTypes.string.isRequired,
  /** Aspect ratio (CSS aspect-ratio value) */
  aspectRatio: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Overlay content */
  overlay: PropTypes.node,
};

/**
 * Card.Header Component
 *
 * Header section of the card with optional divider.
 */
const CardHeader = ({
  children,
  divider = false,
  className = '',
}) => {
  return (
    <div
      className={clsx(
        'px-4 sm:px-5 py-4',
        divider && 'border-b border-gray-100',
        className
      )}
    >
      {children}
    </div>
  );
};

CardHeader.displayName = 'Card.Header';

CardHeader.propTypes = {
  /** Header content */
  children: PropTypes.node,
  /** Show bottom divider */
  divider: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * Card.Body Component
 *
 * Main content area of the card.
 */
const CardBody = ({
  children,
  className = '',
}) => {
  return (
    <div className={clsx('px-4 sm:px-5 py-4', className)}>
      {children}
    </div>
  );
};

CardBody.displayName = 'Card.Body';

CardBody.propTypes = {
  /** Body content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * Card.Footer Component
 *
 * Footer section of the card with optional divider.
 */
const CardFooter = ({
  children,
  divider = true,
  className = '',
}) => {
  return (
    <div
      className={clsx(
        'px-4 sm:px-5 py-4',
        divider && 'border-t border-gray-100',
        className
      )}
    >
      {children}
    </div>
  );
};

CardFooter.displayName = 'Card.Footer';

CardFooter.propTypes = {
  /** Footer content */
  children: PropTypes.node,
  /** Show top divider */
  divider: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * Card.Title Component
 *
 * Pre-styled title for card headers.
 */
const CardTitle = ({
  children,
  as: Component = 'h3',
  className = '',
}) => {
  return (
    <Component
      className={clsx(
        'font-heading font-semibold text-lg text-graphite',
        className
      )}
    >
      {children}
    </Component>
  );
};

CardTitle.displayName = 'Card.Title';

CardTitle.propTypes = {
  /** Title content */
  children: PropTypes.node,
  /** HTML element to render */
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span']),
  /** Additional CSS classes */
  className: PropTypes.string,
};

/**
 * Card.Description Component
 *
 * Pre-styled description text for cards.
 */
const CardDescription = ({
  children,
  className = '',
}) => {
  return (
    <p className={clsx('text-sm text-slate-gray mt-1', className)}>
      {children}
    </p>
  );
};

CardDescription.displayName = 'Card.Description';

CardDescription.propTypes = {
  /** Description content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};

// Attach sub-components to Card
Card.Image = CardImage;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;
