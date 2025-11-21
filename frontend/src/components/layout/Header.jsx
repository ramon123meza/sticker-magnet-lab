/**
 * Header.jsx
 * Main site header component with navigation, cart, and mobile menu
 *
 * Features:
 * - Logo on left with navigation
 * - Main nav with dropdowns for Stickers and Magnets
 * - Shopping cart icon with animated item count badge
 * - Mobile hamburger menu with slide-in drawer
 * - Sticky header on scroll with blur backdrop effect
 * - Dismissible free shipping banner
 * - Smooth animations on all interactions
 */

import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ShoppingCart,
  ChevronDown,
  Sparkles,
  Package,
  Magnet,
  ImageIcon,
  Phone,
  Home,
} from 'lucide-react';
import clsx from 'clsx';
import { useCartStore, useCartCount } from '../../contexts/CartContext';
import { useUI } from '../../contexts/UIContext';

// Logo URL
const LOGO_URL = 'https://layout-tool-randr.s3.us-east-1.amazonaws.com/logo_sticker_magnet_lab.png';

// Navigation items configuration
const NAV_ITEMS = [
  {
    label: 'Home',
    path: '/',
    icon: Home,
  },
  {
    label: 'Stickers',
    path: '/stickers',
    icon: Sparkles,
    dropdown: [
      {
        label: 'Die-Cut Stickers',
        path: '/stickers/die-cut',
        description: 'Custom shaped stickers cut to your design',
        icon: Sparkles,
      },
    ],
  },
  {
    label: 'Magnets',
    path: '/magnets',
    icon: Magnet,
    dropdown: [
      {
        label: 'Die-Cut Magnets',
        path: '/magnets/die-cut',
        description: 'Custom shaped magnets for any surface',
        icon: Magnet,
      },
      {
        label: 'Fridge Magnets',
        path: '/magnets/fridge',
        description: 'Classic rectangular fridge magnets',
        icon: ImageIcon,
      },
    ],
  },
  {
    label: 'Contact',
    path: '/contact',
    icon: Phone,
  },
];

/**
 * Free Shipping Banner Component
 */
function ShippingBanner({ onDismiss, isVisible }) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-deep-indigo via-cool-blue to-deep-indigo text-white overflow-hidden"
    >
      <div className="container-custom py-2 flex items-center justify-center gap-2 text-sm">
        <Package className="w-4 h-4 animate-bounce-gentle" />
        <span className="font-medium">
          FREE SHIPPING on orders over $50!
        </span>
        <button
          onClick={onDismiss}
          className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Navigation Dropdown Component
 */
function NavDropdown({ item, isOpen, onToggle, onClose }) {
  const location = useLocation();

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        onMouseEnter={() => onToggle()}
        className={clsx(
          'flex items-center gap-1 px-4 py-2 font-medium transition-colors rounded-lg',
          'hover:text-cool-blue hover:bg-soft-sky/50',
          location.pathname.startsWith(item.path) && 'text-cool-blue'
        )}
      >
        {item.label}
        <ChevronDown
          className={clsx(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={onClose}
            className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-large border border-gray-100 overflow-hidden z-50"
          >
            <div className="p-2">
              {item.dropdown.map((subItem) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  onClick={onClose}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-soft-sky/50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-soft-sky text-cool-blue group-hover:bg-cool-blue group-hover:text-white transition-colors">
                    <subItem.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-graphite group-hover:text-cool-blue transition-colors">
                      {subItem.label}
                    </p>
                    <p className="text-sm text-slate-gray mt-0.5">
                      {subItem.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Cart Badge Component with Animation
 */
function CartBadge({ count }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(count);

  useEffect(() => {
    if (count !== prevCount && count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      setPrevCount(count);
      return () => clearTimeout(timer);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  if (count === 0) return null;

  return (
    <motion.span
      key={count}
      initial={isAnimating ? { scale: 1.5 } : { scale: 1 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      className={clsx(
        'absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5',
        'flex items-center justify-center',
        'bg-red-500 text-white text-xs font-bold rounded-full',
        isAnimating && 'animate-pulse'
      )}
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  );
}

/**
 * Mobile Menu Drawer Component
 */
function MobileDrawer({ isOpen, onClose }) {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState(null);

  // Close drawer on route change
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  const toggleExpanded = (label) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-large z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <img
                src={LOGO_URL}
                alt="Sticker & Magnet Lab"
                className="h-10 object-contain"
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-soft-gray rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="mb-2">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className={clsx(
                          'w-full flex items-center justify-between p-3 rounded-lg',
                          'font-medium transition-colors',
                          'hover:bg-soft-sky/50 hover:text-cool-blue',
                          location.pathname.startsWith(item.path) && 'text-cool-blue bg-soft-sky/30'
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </span>
                        <ChevronDown
                          className={clsx(
                            'w-5 h-5 transition-transform duration-200',
                            expandedItem === item.label && 'rotate-180'
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedItem === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 py-2 space-y-1">
                              {item.dropdown.map((subItem) => (
                                <Link
                                  key={subItem.path}
                                  to={subItem.path}
                                  className={clsx(
                                    'flex items-center gap-3 p-3 rounded-lg',
                                    'text-slate-gray transition-colors',
                                    'hover:bg-soft-sky/50 hover:text-cool-blue',
                                    location.pathname === subItem.path && 'text-cool-blue bg-soft-sky/30'
                                  )}
                                >
                                  <subItem.icon className="w-4 h-4" />
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={clsx(
                        'flex items-center gap-3 p-3 rounded-lg',
                        'font-medium transition-colors',
                        'hover:bg-soft-sky/50 hover:text-cool-blue',
                        location.pathname === item.path && 'text-cool-blue bg-soft-sky/30'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Contact Info */}
            <div className="p-4 mt-auto border-t border-gray-100">
              <p className="text-sm text-slate-gray">
                Need help? Call us at
              </p>
              <a
                href="tel:276-706-0463"
                className="text-cool-blue font-semibold hover:underline"
              >
                276-706-0463
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Main Header Component
 */
export default function Header() {
  const location = useLocation();
  const cartCount = useCartCount();
  const { openCart, isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useUI();

  // Shipping banner state
  const [showBanner, setShowBanner] = useState(() => {
    return localStorage.getItem('sml_hide_shipping_banner') !== 'true';
  });

  // Scroll state for sticky header
  const [isScrolled, setIsScrolled] = useState(false);

  // Active dropdown state
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  // Dismiss shipping banner
  const dismissBanner = useCallback(() => {
    setShowBanner(false);
    localStorage.setItem('sml_hide_shipping_banner', 'true');
  }, []);

  // Toggle dropdown
  const toggleDropdown = useCallback((label) => {
    setActiveDropdown((prev) => (prev === label ? null : label));
  }, []);

  // Close dropdown
  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  return (
    <>
      {/* Free Shipping Banner */}
      <AnimatePresence>
        {showBanner && (
          <ShippingBanner isVisible={showBanner} onDismiss={dismissBanner} />
        )}
      </AnimatePresence>

      {/* Main Header */}
      <header
        className={clsx(
          'sticky top-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-white/90 backdrop-blur-lg shadow-soft'
            : 'bg-white'
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 transition-transform hover:scale-105"
            >
              <img
                src={LOGO_URL}
                alt="Sticker & Magnet Lab"
                className="h-10 md:h-12 object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                item.dropdown ? (
                  <NavDropdown
                    key={item.label}
                    item={item}
                    isOpen={activeDropdown === item.label}
                    onToggle={() => toggleDropdown(item.label)}
                    onClose={closeDropdown}
                  />
                ) : (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={clsx(
                      'px-4 py-2 font-medium transition-colors rounded-lg',
                      'hover:text-cool-blue hover:bg-soft-sky/50',
                      location.pathname === item.path && 'text-cool-blue'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Cart Button */}
              <button
                onClick={openCart}
                className={clsx(
                  'relative p-2.5 rounded-lg transition-all',
                  'hover:bg-soft-sky/50 hover:text-cool-blue',
                  'active:scale-95'
                )}
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingCart className="w-6 h-6" />
                <CartBadge count={cartCount} />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
                className={clsx(
                  'lg:hidden p-2.5 rounded-lg transition-all',
                  'hover:bg-soft-sky/50 hover:text-cool-blue',
                  'active:scale-95'
                )}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}
