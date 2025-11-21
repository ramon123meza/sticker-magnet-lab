/**
 * Footer.jsx
 * Professional site footer component
 *
 * Features:
 * - Company information section
 * - Quick links navigation
 * - Product links
 * - Newsletter signup form
 * - Social media links
 * - Payment icons placeholder
 * - Beautiful gradient background
 * - Fully responsive design
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  ExternalLink,
  Send,
  CreditCard,
  Shield,
  Truck,
  Heart,
} from 'lucide-react';
import clsx from 'clsx';
import { useUI } from '../../contexts/UIContext';

// Company Information
const COMPANY_INFO = {
  name: 'R and R Imports INC',
  address: '5271 Lee Hwy',
  city: 'Troutville',
  state: 'VA',
  zip: '24017',
  email: 'orders@rrinconline.com',
  phone: '276-706-0463',
  parentWebsite: 'www.rrinconline.com',
};

// Quick Links
const QUICK_LINKS = [
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Shipping & Returns', path: '/shipping-returns' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
];

// Product Links
const PRODUCT_LINKS = [
  { label: 'Die-Cut Stickers', path: '/stickers/die-cut' },
  { label: 'Die-Cut Magnets', path: '/magnets/die-cut' },
  { label: 'Fridge Magnets', path: '/magnets/fridge' },
];

// Social Media Links (placeholders)
const SOCIAL_LINKS = [
  { label: 'Facebook', icon: Facebook, url: '#' },
  { label: 'Instagram', icon: Instagram, url: '#' },
  { label: 'Twitter', icon: Twitter, url: '#' },
];

/**
 * Newsletter Signup Component
 */
function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showSuccess, showError } = useUI();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      showError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setEmail('');
      showSuccess('Thank you for subscribing to our newsletter!');
    } catch (error) {
      showError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h4 className="text-lg font-semibold text-white mb-4">
        Subscribe to Our Newsletter
      </h4>
      <p className="text-white/70 text-sm mb-4">
        Get exclusive deals, new product updates, and design tips delivered to your inbox.
      </p>

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-green-400"
        >
          <Heart className="w-5 h-5" />
          <span>Thanks for subscribing!</span>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={clsx(
                'w-full px-4 py-3 rounded-lg',
                'bg-white/10 border border-white/20',
                'text-white placeholder-white/50',
                'focus:outline-none focus:border-cool-blue focus:bg-white/15',
                'transition-all duration-200'
              )}
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={clsx(
              'px-4 py-3 rounded-lg',
              'bg-cool-blue text-white font-medium',
              'hover:bg-blue-600 active:scale-95',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center justify-center'
            )}
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      )}
    </div>
  );
}

/**
 * Payment Icons Placeholder
 */
function PaymentIcons() {
  const paymentMethods = [
    { name: 'Visa', abbr: 'VISA' },
    { name: 'Mastercard', abbr: 'MC' },
    { name: 'American Express', abbr: 'AMEX' },
    { name: 'Discover', abbr: 'DISC' },
    { name: 'PayPal', abbr: 'PP' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {paymentMethods.map((method) => (
        <div
          key={method.name}
          className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium text-white/80"
          title={method.name}
        >
          {method.abbr}
        </div>
      ))}
    </div>
  );
}

/**
 * Trust Badges
 */
function TrustBadges() {
  const badges = [
    { icon: Shield, label: 'Secure Checkout' },
    { icon: Truck, label: 'Fast Shipping' },
    { icon: CreditCard, label: 'Safe Payments' },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
      {badges.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 text-white/70 text-sm"
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Main Footer Component
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-deep-indigo via-brand-800 to-deep-indigo">
      {/* Main Footer Content */}
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Company Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Sticker & Magnet Lab
            </h4>
            <div className="space-y-3 text-white/70 text-sm">
              <p className="font-medium text-white/90">{COMPANY_INFO.name}</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  {COMPANY_INFO.address}<br />
                  {COMPANY_INFO.city}, {COMPANY_INFO.state} {COMPANY_INFO.zip}
                </p>
              </div>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                {COMPANY_INFO.email}
              </a>
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                {COMPANY_INFO.phone}
              </a>
            </div>

            {/* Social Media */}
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map(({ label, icon: Icon, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'p-2.5 rounded-lg',
                    'bg-white/10 text-white/70',
                    'hover:bg-cool-blue hover:text-white',
                    'transition-all duration-200'
                  )}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={clsx(
                      'text-white/70 text-sm',
                      'hover:text-white hover:pl-1',
                      'transition-all duration-200',
                      'inline-block'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`https://${COMPANY_INFO.parentWebsite}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'text-white/70 text-sm',
                    'hover:text-white',
                    'transition-all duration-200',
                    'inline-flex items-center gap-1'
                  )}
                >
                  Parent Company
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Our Products
            </h4>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={clsx(
                      'text-white/70 text-sm',
                      'hover:text-white hover:pl-1',
                      'transition-all duration-200',
                      'inline-block'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment Methods */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-white/90 mb-3">
                We Accept
              </h5>
              <PaymentIcons />
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterSignup />
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <TrustBadges />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-white/60 text-sm">
              &copy; {currentYear} Sticker & Magnet Lab. A division of R and R Imports INC.
              All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span className="text-white/30">|</span>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span className="text-white/30">|</span>
              <a
                href={`https://${COMPANY_INFO.parentWebsite}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1"
              >
                {COMPANY_INFO.parentWebsite}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
