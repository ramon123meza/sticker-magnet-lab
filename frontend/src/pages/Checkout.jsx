import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';

/**
 * Checkout Page - Two-column checkout with shipping and payment
 */
const Checkout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Demo cart items - in production, this would come from a cart context/store
  const [cartItems] = useState([
    {
      id: '1',
      productType: 'Custom Sticker',
      size: '3" x 3"',
      quantity: 10,
      price: 2.99,
      thumbnail: null,
    },
    {
      id: '2',
      productType: 'Custom Magnet',
      size: '4" x 4"',
      quantity: 5,
      price: 4.99,
      thumbnail: null,
    },
  ]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  // Progress steps
  const steps = [
    { id: 'cart', label: 'Cart', completed: true },
    { id: 'shipping', label: 'Shipping', completed: false, active: true },
    { id: 'payment', label: 'Payment', completed: false },
    { id: 'confirmation', label: 'Confirmation', completed: false },
  ];

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate order number
      const orderNumber = `SLMAG-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Navigate to thank you page with order details
      navigate('/thank-you', {
        state: {
          orderNumber,
          orderDetails: {
            items: cartItems,
            shipping: values,
            subtotal,
            total,
          },
        },
      });

      return { success: true };
    } catch (error) {
      throw new Error('Failed to process order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <section className="section-padding bg-soft-gray min-h-screen">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full shadow-soft flex items-center justify-center">
              <svg
                className="w-12 h-12 text-slate-gray"
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
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-graphite mb-4">
              Your cart is empty
            </h2>
            <p className="text-slate-gray mb-6">
              Add some items to your cart before checking out.
            </p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Sticker & Magnet Lab</title>
        <meta
          name="description"
          content="Complete your order for custom stickers and magnets. Free shipping on all orders!"
        />
      </Helmet>

      {/* Progress Indicator */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="container-custom">
          <nav aria-label="Checkout progress">
            <ol className="flex items-center justify-center gap-2 md:gap-4">
              {steps.map((step, index) => (
                <li key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold
                        ${step.completed
                          ? 'bg-green-500 text-white'
                          : step.active
                          ? 'bg-cool-blue text-white'
                          : 'bg-gray-200 text-slate-gray'}
                      `}
                    >
                      {step.completed ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </motion.div>
                    <span
                      className={`
                        ml-2 text-sm hidden sm:block
                        ${step.active ? 'text-graphite font-medium' : 'text-slate-gray'}
                      `}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        w-8 md:w-16 h-0.5 mx-2
                        ${step.completed ? 'bg-green-500' : 'bg-gray-200'}
                      `}
                    />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-soft-gray">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form - Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              {/* Back to Cart Link */}
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 text-cool-blue hover:text-deep-indigo transition-colors mb-6"
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
                Back to Cart
              </Link>

              <CheckoutForm onSubmit={handleSubmit} isLoading={isLoading} />
            </motion.div>

            {/* Order Summary - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <OrderSummary
                items={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                showEditLink
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Footer */}
      <section className="bg-white py-6 border-t border-gray-100">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-gray">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span>Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
