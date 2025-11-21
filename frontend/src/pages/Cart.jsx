import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

/**
 * Cart Page - Full cart page with items list and order summary
 */
const Cart = () => {
  const navigate = useNavigate();

  // Demo cart items - in production, this would come from a cart context/store
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      productType: 'Custom Sticker',
      size: '3" x 3"',
      quantity: 10,
      price: 2.99,
      thumbnail: null,
      instructions: 'Please use matte finish',
    },
    {
      id: '2',
      productType: 'Custom Magnet',
      size: '4" x 4"',
      quantity: 5,
      price: 4.99,
      thumbnail: null,
      instructions: '',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handle remove item
  const handleRemoveItem = (itemId) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId));
  };

  // Handle update instructions
  const handleUpdateInstructions = (itemId, instructions) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, instructions } : item
      )
    );
  };

  // Handle checkout
  const handleCheckout = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      navigate('/checkout');
    }, 500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>Your Cart | Sticker & Magnet Lab</title>
        <meta
          name="description"
          content="Review your custom stickers and magnets in your shopping cart. Free shipping on all orders!"
        />
      </Helmet>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-deep-indigo to-cool-blue py-12 md:py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Your Cart
            </h1>
            <p className="text-lg text-white/80">
              {itemCount > 0
                ? `You have ${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`
                : 'Your cart is empty'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-soft-gray">
        <div className="container-custom">
          {cartItems.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-12"
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-full shadow-soft flex items-center justify-center">
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-16 h-16 text-slate-gray"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </motion.svg>
              </div>

              <h2 className="text-2xl font-bold text-graphite mb-4">
                Your cart is empty
              </h2>
              <p className="text-slate-gray mb-8 max-w-sm mx-auto">
                Looks like you haven't added any custom stickers or magnets yet. Start creating your unique designs today!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="btn-primary">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Start Shopping
                </Link>
                <Link to="/editor" className="btn-secondary">
                  Create Custom Design
                </Link>
              </div>

              {/* Featured Products Suggestion */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-slate-gray mb-4">
                  Not sure where to start?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/products/stickers"
                    className="p-4 bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow group"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 bg-soft-sky rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <p className="text-sm font-medium text-graphite">
                      Custom Stickers
                    </p>
                  </Link>
                  <Link
                    to="/products/magnets"
                    className="p-4 bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow group"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 bg-soft-sky rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🧲</span>
                    </div>
                    <p className="text-sm font-medium text-graphite">
                      Custom Magnets
                    </p>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Cart Content */
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Cart Items - Left Column */}
              <div className="lg:col-span-2 space-y-4">
                {/* Header */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between mb-4"
                >
                  <h2 className="text-xl font-bold text-graphite">
                    Cart Items ({itemCount})
                  </h2>
                  <Link
                    to="/products"
                    className="text-cool-blue hover:text-deep-indigo transition-colors flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Continue Shopping
                  </Link>
                </motion.div>

                {/* Items List */}
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      layout
                    >
                      <CartItem
                        item={item}
                        onRemove={handleRemoveItem}
                        onUpdateInstructions={handleUpdateInstructions}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Additional Actions */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap gap-4 pt-4"
                >
                  <Link
                    to="/products"
                    className="btn-secondary"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>

              {/* Order Summary - Right Column */}
              <div className="lg:col-span-1">
                <motion.div variants={itemVariants}>
                  <CartSummary
                    subtotal={subtotal}
                    shipping={shipping}
                    total={total}
                    itemCount={itemCount}
                    onCheckout={handleCheckout}
                    isLoading={isLoading}
                  />
                </motion.div>

                {/* Promo Code (Placeholder) */}
                <motion.div
                  variants={itemVariants}
                  className="mt-4 bg-white rounded-xl shadow-soft p-4"
                >
                  <label
                    htmlFor="promoCode"
                    className="block text-sm font-medium text-graphite mb-2"
                  >
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="promoCode"
                      placeholder="Enter code"
                      className="input-field flex-1"
                      disabled
                    />
                    <button
                      type="button"
                      className="btn-secondary px-4"
                      disabled
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-slate-gray mt-2 italic">
                    Promo codes coming soon!
                  </p>
                </motion.div>

                {/* Need Help */}
                <motion.div
                  variants={itemVariants}
                  className="mt-4 p-4 bg-white rounded-xl shadow-soft"
                >
                  <h3 className="font-semibold text-graphite mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-slate-gray mb-3">
                    Questions about your order? We're here to help!
                  </p>
                  <Link
                    to="/contact"
                    className="text-cool-blue hover:text-deep-indigo transition-colors text-sm flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Contact Support
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cart;
