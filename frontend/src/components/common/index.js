/**
 * Common UI Components Index
 *
 * This file exports all common UI components for the Sticker & Magnet Lab
 * e-commerce application. Import components from this file for cleaner imports.
 *
 * @module components/common
 *
 * @example
 * // Import multiple components
 * import { Button, Input, Card, Modal } from '@/components/common';
 *
 * @example
 * // Import individual component
 * import { Button } from '@/components/common';
 */

// Core Interactive Components
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Select } from './Select';

// Feedback Components
export { default as Spinner } from './Spinner';
export { default as Badge } from './Badge';
export { default as Toast, ToastProvider, useToast } from './Toast';
export { default as Tooltip } from './Tooltip';
export { default as Alert, AlertBanner, InlineAlert } from './Alert';
export { default as ProgressBar, ProgressSteps } from './ProgressBar';

// Layout Components
export { default as Card } from './Card';
export { default as Modal } from './Modal';
export { default as Tabs } from './Tabs';
export { default as Accordion } from './Accordion';

// Navigation Components
export { default as Breadcrumb } from './Breadcrumb';

// E-commerce Specific Components
export { default as QuantitySelector } from './QuantitySelector';
export { default as PriceDisplay, PriceRange } from './PriceDisplay';
export { default as ImageGallery } from './ImageGallery';
