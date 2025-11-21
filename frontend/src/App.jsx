/**
 * App.jsx
 * Main application component for Sticker & Magnet Lab
 *
 * Features:
 * - Context providers (Session, UI)
 * - Main layout wrapper with Header, Footer, Cart Drawer, Toasts
 * - Lazy-loaded route configuration for optimal performance
 * - SEO-friendly URL structure
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SessionProvider, UIProvider } from './contexts';
import { Layout } from './components/layout';

/**
 * Loading Component - Displayed while lazy components load
 */
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-soft-gray">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-cool-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-gray font-medium">Loading...</p>
    </div>
  </div>
);

// Lazy load pages for better performance (code splitting)
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Stickers = lazy(() => import('./pages/Stickers'));
const MagnetsDieCut = lazy(() => import('./pages/MagnetsDieCut'));
const MagnetsFridge = lazy(() => import('./pages/MagnetsFridge'));
const Customizer = lazy(() => import('./pages/Customizer'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const ShippingReturns = lazy(() => import('./pages/ShippingReturns'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Main App Component
 */
function App() {
  return (
    <SessionProvider>
      <UIProvider>
        <Layout>
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ==================== HOME ==================== */}
                <Route path="/" element={<Home />} />

                {/* ==================== PRODUCTS ==================== */}
                {/* Main product listing */}
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/shop" element={<Navigate to="/products" replace />} />

                {/* ==================== STICKERS ==================== */}
                <Route path="/stickers" element={<Stickers />} />
                <Route path="/stickers/die-cut" element={<Stickers />} />
                <Route path="/die-cut-stickers" element={<Stickers />} />
                <Route path="/vinyl-stickers" element={<Stickers />} />
                <Route path="/custom-stickers" element={<Stickers />} />

                {/* ==================== MAGNETS ==================== */}
                {/* Die-Cut Magnets */}
                <Route path="/magnets" element={<MagnetsDieCut />} />
                <Route path="/magnets/die-cut" element={<MagnetsDieCut />} />
                <Route path="/die-cut-magnets" element={<MagnetsDieCut />} />
                <Route path="/custom-magnets" element={<MagnetsDieCut />} />

                {/* Fridge Magnets */}
                <Route path="/magnets/fridge" element={<MagnetsFridge />} />
                <Route path="/fridge-magnets" element={<MagnetsFridge />} />
                <Route path="/refrigerator-magnets" element={<MagnetsFridge />} />

                {/* ==================== CUSTOMIZER / DESIGN STUDIO ==================== */}
                <Route path="/customize" element={<Customizer />} />
                <Route path="/customize/:productType" element={<Customizer />} />
                <Route path="/customizer" element={<Customizer />} />
                <Route path="/design" element={<Customizer />} />
                <Route path="/design/:productType" element={<Customizer />} />
                <Route path="/create" element={<Customizer />} />
                <Route path="/editor" element={<Customizer />} />
                <Route path="/design-studio" element={<Customizer />} />

                {/* ==================== CART & CHECKOUT ==================== */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/order-confirmation" element={<ThankYou />} />
                <Route path="/order-confirmation/:orderId" element={<ThankYou />} />

                {/* ==================== CONTACT ==================== */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/contact-us" element={<Contact />} />

                {/* ==================== COMPANY PAGES ==================== */}
                <Route path="/about" element={<About />} />
                <Route path="/about-us" element={<About />} />

                {/* Shipping & Returns */}
                <Route path="/shipping" element={<ShippingReturns />} />
                <Route path="/shipping-returns" element={<ShippingReturns />} />
                <Route path="/returns" element={<ShippingReturns />} />
                <Route path="/shipping-and-returns" element={<ShippingReturns />} />

                {/* Legal Pages */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/tos" element={<TermsOfService />} />

                {/* ==================== LEGACY REDIRECTS ==================== */}
                <Route path="/store" element={<Navigate to="/products" replace />} />
                <Route path="/catalog" element={<Navigate to="/products" replace />} />
                <Route path="/home" element={<Navigate to="/" replace />} />

                {/* ==================== 404 NOT FOUND ==================== */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </Layout>
      </UIProvider>
    </SessionProvider>
  );
}

export default App;
