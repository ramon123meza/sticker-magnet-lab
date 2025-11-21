/**
 * 404 Not Found Page
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Frown } from 'lucide-react';

const NotFound = () => {
  const suggestions = [
    { label: 'Browse Our Products', href: '/products', icon: Search },
    { label: 'Design Custom Stickers', href: '/customize', icon: Home },
    { label: 'Go Back Home', href: '/', icon: ArrowLeft },
  ];

  return (
    <>
      <Helmet>
        <title>Page Not Found | Sticker & Magnet Lab</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* 404 Illustration */}
            <div className="mb-8">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                className="inline-block"
              >
                <div className="relative">
                  <span className="text-[150px] md:text-[200px] font-bold text-soft-gray leading-none">
                    404
                  </span>
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <Frown className="w-20 h-20 md:w-28 md:h-28 text-cool-blue" />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Message */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-deep-indigo mb-4"
            >
              Oops! Page Not Found
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-gray mb-8 max-w-md mx-auto"
            >
              The page you&apos;re looking for seems to have wandered off.
              Let&apos;s get you back on track!
            </motion.p>

            {/* Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  to={suggestion.href}
                  className={`
                    inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                    transition-all duration-300
                    ${index === 0
                      ? 'bg-cool-blue text-white hover:bg-deep-indigo hover:shadow-glow'
                      : 'bg-soft-gray text-deep-indigo hover:bg-gray-200'}
                  `}
                >
                  <suggestion.icon className="w-5 h-5" />
                  {suggestion.label}
                </Link>
              ))}
            </motion.div>

            {/* Fun fact */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 text-sm text-gray-400"
            >
              Fun fact: This page is as lost as a sticker without a surface to stick to!
            </motion.p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
