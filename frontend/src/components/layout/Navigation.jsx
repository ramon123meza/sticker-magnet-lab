/**
 * Navigation.jsx
 * Desktop mega menu and mobile responsive drawer navigation
 *
 * Features:
 * - Desktop mega menu for products with rich content
 * - Mobile responsive drawer navigation
 * - Animated underlines on hover
 * - Current page highlight
 * - Search functionality placeholder
 * - Keyboard accessible navigation
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronRight,
  Sparkles,
  Magnet,
  ImageIcon,
  ArrowRight,
  X,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';

// Product Categories for Mega Menu
const PRODUCT_CATEGORIES = {
  stickers: {
    title: 'Stickers',
    description: 'High-quality custom stickers for any purpose',
    icon: Sparkles,
    items: [
      {
        label: 'Die-Cut Stickers',
        path: '/stickers/die-cut',
        description: 'Custom shaped vinyl stickers cut precisely to your design',
        icon: Sparkles,
        featured: true,
      },
    ],
    cta: {
      label: 'View All Stickers',
      path: '/stickers',
    },
  },
  magnets: {
    title: 'Magnets',
    description: 'Durable magnets for cars, fridges, and more',
    icon: Magnet,
    items: [
      {
        label: 'Die-Cut Magnets',
        path: '/magnets/die-cut',
        description: 'Custom shaped magnets for any surface',
        icon: Magnet,
        featured: true,
      },
      {
        label: 'Fridge Magnets',
        path: '/magnets/fridge',
        description: 'Classic rectangular fridge magnets in multiple sizes',
        icon: ImageIcon,
        featured: false,
      },
    ],
    cta: {
      label: 'View All Magnets',
      path: '/magnets',
    },
  },
};

/**
 * Search Overlay Component
 */
function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    // Placeholder for search functionality
    // In production, this would call a search API
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSearching(false);
    onClose();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
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
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 left-0 right-0 bg-white shadow-large z-50"
          >
            <div className="container-custom py-6">
              <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-gray" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for stickers, magnets, and more..."
                  className={clsx(
                    'w-full pl-14 pr-24 py-4 text-lg',
                    'border-2 border-gray-200 rounded-xl',
                    'focus:border-cool-blue focus:outline-none',
                    'transition-colors'
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {isSearching && (
                    <Loader2 className="w-5 h-5 text-cool-blue animate-spin" />
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 hover:bg-soft-gray rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Quick Links */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-slate-gray">Popular:</span>
                {['Die-Cut Stickers', 'Fridge Magnets', 'Custom Magnets'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1 text-sm bg-soft-sky text-cool-blue rounded-full hover:bg-cool-blue hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Mega Menu Component
 */
function MegaMenu({ category, isOpen, onClose }) {
  const menuRef = useRef(null);
  const categoryData = PRODUCT_CATEGORIES[category];

  if (!categoryData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          onMouseLeave={onClose}
          className="absolute top-full left-0 right-0 bg-white shadow-large border-t border-gray-100 z-50"
        >
          <div className="container-custom py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Category Info */}
              <div className="col-span-3 border-r border-gray-100 pr-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-soft-sky text-cool-blue">
                    <categoryData.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-graphite">
                    {categoryData.title}
                  </h3>
                </div>
                <p className="text-slate-gray text-sm mb-6">
                  {categoryData.description}
                </p>
                <Link
                  to={categoryData.cta.path}
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-cool-blue font-medium hover:gap-3 transition-all"
                >
                  {categoryData.cta.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Products Grid */}
              <div className="col-span-9">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryData.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={clsx(
                        'group p-4 rounded-xl transition-all',
                        'hover:bg-soft-sky/50',
                        item.featured && 'bg-gradient-to-br from-soft-sky/30 to-transparent'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={clsx(
                          'p-2 rounded-lg transition-colors',
                          'bg-white group-hover:bg-cool-blue group-hover:text-white',
                          item.featured ? 'text-cool-blue' : 'text-slate-gray'
                        )}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-graphite group-hover:text-cool-blue transition-colors">
                              {item.label}
                            </h4>
                            {item.featured && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-cool-blue text-white rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-gray mt-1">
                            {item.description}
                          </p>
                          <span className="inline-flex items-center gap-1 text-sm text-cool-blue mt-2 group-hover:gap-2 transition-all">
                            Learn more
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Navigation Link with Animated Underline
 */
function NavLink({ to, children, isActive, onMouseEnter, onMouseLeave }) {
  return (
    <Link
      to={to}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={clsx(
        'relative px-4 py-2 font-medium transition-colors',
        isActive ? 'text-cool-blue' : 'text-graphite hover:text-cool-blue'
      )}
    >
      {children}
      {/* Animated underline */}
      <motion.span
        className="absolute bottom-0 left-4 right-4 h-0.5 bg-cool-blue"
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ originX: 0 }}
      />
    </Link>
  );
}

/**
 * Navigation Dropdown Trigger
 */
function NavDropdownTrigger({
  label,
  isActive,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={clsx(
        'relative px-4 py-2 font-medium transition-colors flex items-center gap-1',
        isActive || isOpen ? 'text-cool-blue' : 'text-graphite hover:text-cool-blue'
      )}
    >
      {label}
      <motion.svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path d="M6 9l6 6 6-6" />
      </motion.svg>
      {/* Animated underline */}
      <motion.span
        className="absolute bottom-0 left-4 right-4 h-0.5 bg-cool-blue"
        initial={false}
        animate={{ scaleX: isActive || isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ originX: 0 }}
      />
    </button>
  );
}

/**
 * Main Navigation Component
 */
export default function Navigation() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuTimeoutRef = useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setActiveMenu(null);
  }, [location.pathname]);

  // Handle mouse enter with delay to prevent flickering
  const handleMenuEnter = useCallback((menu) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveMenu(menu);
  }, []);

  // Handle mouse leave with delay
  const handleMenuLeave = useCallback(() => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }, []);

  // Check if a path is active
  const isPathActive = useCallback((path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  // Open search
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  // Close search
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-1">
        {/* Home Link */}
        <NavLink
          to="/"
          isActive={isPathActive('/') && location.pathname === '/'}
        >
          Home
        </NavLink>

        {/* Stickers Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMenuEnter('stickers')}
          onMouseLeave={handleMenuLeave}
        >
          <NavDropdownTrigger
            label="Stickers"
            isActive={isPathActive('/stickers')}
            isOpen={activeMenu === 'stickers'}
          />
        </div>

        {/* Magnets Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMenuEnter('magnets')}
          onMouseLeave={handleMenuLeave}
        >
          <NavDropdownTrigger
            label="Magnets"
            isActive={isPathActive('/magnets')}
            isOpen={activeMenu === 'magnets'}
          />
        </div>

        {/* Contact Link */}
        <NavLink
          to="/contact"
          isActive={isPathActive('/contact')}
        >
          Contact
        </NavLink>

        {/* Search Button */}
        <button
          onClick={openSearch}
          className={clsx(
            'ml-2 p-2 rounded-lg transition-all',
            'text-slate-gray hover:text-cool-blue hover:bg-soft-sky/50'
          )}
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </nav>

      {/* Mega Menus */}
      <MegaMenu
        category="stickers"
        isOpen={activeMenu === 'stickers'}
        onClose={() => setActiveMenu(null)}
      />
      <MegaMenu
        category="magnets"
        isOpen={activeMenu === 'magnets'}
        onClose={() => setActiveMenu(null)}
      />

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
}

/**
 * Mobile Navigation Items Export
 * Used by the mobile drawer in Header.jsx
 */
export function getMobileNavItems() {
  return Object.entries(PRODUCT_CATEGORIES).map(([key, category]) => ({
    key,
    ...category,
  }));
}
