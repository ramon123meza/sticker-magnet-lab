import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * ThankYou Page - Order confirmation page after successful checkout
 */
const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  // Get order details from navigation state
  const orderNumber = location.state?.orderNumber || `SLMAG-${Date.now()}-XXXX`;
  const orderDetails = location.state?.orderDetails || null;

  // Hide confetti after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const checkmarkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // What's Next steps
  const nextSteps = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Order Confirmation Email',
      description: 'Check your inbox for order confirmation and receipt.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: 'Production Begins',
      description: 'We start creating your custom products within 24 hours.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Shipping',
      description: 'Expected delivery within 3-5 business days.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Questions?',
      description: 'Contact us at orders@rrinconline.com or 276-706-0463.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Order Confirmed | Sticker & Magnet Lab</title>
        <meta name="description" content="Thank you for your order! Your custom stickers and magnets are on their way." />
      </Helmet>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: Math.random() * 720 - 360,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                ease: 'linear',
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#3A6EA5', '#1B1F3B', '#60A5FA', '#34D399', '#FBBF24'][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <section className="section-padding bg-soft-gray min-h-screen">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Success Animation */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="text-center mb-8"
            >
              {/* Checkmark Circle */}
              <motion.div
                variants={checkmarkVariants}
                className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-graphite mb-4"
              >
                Thank You for Your Order!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-slate-gray"
              >
                Your custom stickers and magnets are being prepared with care.
              </motion.p>
            </motion.div>

            {/* Order Number Card */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-soft p-6 md:p-8 mb-8"
            >
              <motion.div variants={itemVariants} className="text-center mb-6 pb-6 border-b border-gray-100">
                <p className="text-sm text-slate-gray mb-2">Order Number</p>
                <p className="text-2xl md:text-3xl font-bold text-deep-indigo font-mono">
                  {orderNumber}
                </p>
              </motion.div>

              {/* Order Summary */}
              {orderDetails && (
                <motion.div variants={itemVariants} className="mb-6">
                  <h3 className="font-semibold text-graphite mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    {orderDetails.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-graphite">{item.productType}</p>
                          <p className="text-sm text-slate-gray">
                            {item.size} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-graphite">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-gray">Subtotal</span>
                      <span className="text-graphite">${orderDetails.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-gray">Shipping</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span className="text-graphite">Total</span>
                      <span className="text-deep-indigo">${orderDetails.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Shipping Address */}
              {orderDetails?.shipping && (
                <motion.div variants={itemVariants}>
                  <h3 className="font-semibold text-graphite mb-2">Shipping To</h3>
                  <div className="text-slate-gray">
                    <p>{orderDetails.shipping.fullName}</p>
                    <p>{orderDetails.shipping.address}</p>
                    {orderDetails.shipping.apartment && (
                      <p>{orderDetails.shipping.apartment}</p>
                    )}
                    <p>
                      {orderDetails.shipping.city}, {orderDetails.shipping.state}{' '}
                      {orderDetails.shipping.zip}
                    </p>
                    <p className="mt-2">{orderDetails.shipping.email}</p>
                    <p>{orderDetails.shipping.phone}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* What's Next Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-soft p-6 md:p-8 mb-8"
            >
              <motion.h2
                variants={itemVariants}
                className="text-xl font-bold text-graphite mb-6 text-center"
              >
                What's Next?
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nextSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start gap-4 p-4 bg-soft-gray rounded-xl"
                  >
                    <div className="w-12 h-12 flex-shrink-0 bg-cool-blue/10 rounded-lg flex items-center justify-center text-cool-blue">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-graphite mb-1">{step.title}</h3>
                      <p className="text-sm text-slate-gray">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
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
                Continue Shopping
              </Link>
              <Link to="/" className="btn-secondary">
                Return to Home
              </Link>
            </motion.div>

            {/* Social Sharing (Placeholder) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12 text-center"
            >
              <p className="text-sm text-slate-gray mb-4">Share your order with friends!</p>
              <div className="flex items-center justify-center gap-4">
                {/* Facebook */}
                <button
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </button>

                {/* Twitter */}
                <button
                  className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </button>

                {/* Email */}
                <button
                  className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label="Share via Email"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ThankYou;
