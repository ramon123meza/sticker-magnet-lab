/**
 * Privacy Policy Page
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Mail, Trash2 } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Sticker & Magnet Lab</title>
        <meta name="description" content="Privacy Policy for Sticker & Magnet Lab. Learn how we collect, use, and protect your personal information." />
      </Helmet>

      {/* Hero */}
      <section className="bg-hero-pattern text-white py-16">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Shield className="w-16 h-16 mx-auto mb-4 text-soft-sky" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-300">Last updated: January 2025</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-slate max-w-none"
            >
              <div className="bg-soft-sky rounded-xl p-6 mb-8">
                <p className="text-deep-indigo font-medium m-0">
                  At Sticker & Magnet Lab, we take your privacy seriously. This policy explains
                  how we collect, use, and protect your personal information when you use our website
                  and services.
                </p>
              </div>

              <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-cool-blue" />
                  <h2 className="text-2xl font-bold text-deep-indigo m-0">Information We Collect</h2>
                </div>
                <p className="text-slate-gray mb-4">We collect the following types of information:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <div>
                      <strong>Contact Information:</strong> Name, email address, phone number,
                      and shipping address when you place an order or contact us.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <div>
                      <strong>Order Information:</strong> Products ordered, quantities, prices,
                      and any custom artwork you upload.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <div>
                      <strong>Technical Information:</strong> IP address, browser type, device
                      information, and pages visited (collected automatically).
                    </div>
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-cool-blue" />
                  <h2 className="text-2xl font-bold text-deep-indigo m-0">How We Use Your Information</h2>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Process and fulfill your orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Send order confirmations and shipping updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Respond to your inquiries and provide customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Improve our website and services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Prevent fraud and maintain security</span>
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-cool-blue" />
                  <h2 className="text-2xl font-bold text-deep-indigo m-0">How We Protect Your Information</h2>
                </div>
                <p className="text-slate-gray mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>SSL/TLS encryption for all data transmission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Secure cloud storage with access controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Regular security audits and updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Limited employee access to personal data</span>
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-cool-blue" />
                  <h2 className="text-2xl font-bold text-deep-indigo m-0">Information Sharing</h2>
                </div>
                <p className="text-slate-gray mb-4">
                  We do not sell, trade, or rent your personal information to third parties.
                  We may share your information only in these limited circumstances:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span><strong>Shipping Carriers:</strong> To deliver your order (name and address only)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span><strong>Payment Processors:</strong> To process your payment securely</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span><strong>Legal Requirements:</strong> If required by law or to protect our rights</span>
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 className="w-6 h-6 text-cool-blue" />
                  <h2 className="text-2xl font-bold text-deep-indigo m-0">Your Rights</h2>
                </div>
                <p className="text-slate-gray mb-4">You have the right to:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Access the personal information we hold about you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Request correction of inaccurate information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Request deletion of your personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Opt out of marketing communications</span>
                  </li>
                </ul>
                <p className="text-slate-gray mt-4">
                  To exercise any of these rights, please contact us at{' '}
                  <a href="mailto:orders@rrinconline.com" className="text-cool-blue hover:underline">
                    orders@rrinconline.com
                  </a>
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-deep-indigo mb-4">Cookies</h2>
                <p className="text-slate-gray">
                  We use cookies and similar technologies to enhance your browsing experience,
                  analyze site traffic, and personalize content. You can control cookies through
                  your browser settings. Disabling cookies may affect some site functionality.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-deep-indigo mb-4">Children&apos;s Privacy</h2>
                <p className="text-slate-gray">
                  Our website is not intended for children under 13 years of age. We do not
                  knowingly collect personal information from children under 13. If you believe
                  we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-deep-indigo mb-4">Changes to This Policy</h2>
                <p className="text-slate-gray">
                  We may update this privacy policy from time to time. We will notify you of
                  any significant changes by posting the new policy on this page and updating
                  the &quot;Last updated&quot; date.
                </p>
              </section>

              <section className="bg-soft-gray rounded-xl p-6">
                <h2 className="text-2xl font-bold text-deep-indigo mb-4">Contact Us</h2>
                <p className="text-slate-gray mb-4">
                  If you have questions about this privacy policy or our practices, please contact us:
                </p>
                <div className="space-y-2 text-slate-gray">
                  <p><strong>Sticker & Magnet Lab</strong></p>
                  <p>A division of R and R Imports INC</p>
                  <p>5271 Lee Hwy, Troutville, VA 24017</p>
                  <p>Email: <a href="mailto:orders@rrinconline.com" className="text-cool-blue hover:underline">orders@rrinconline.com</a></p>
                  <p>Phone: <a href="tel:276-706-0463" className="text-cool-blue hover:underline">276-706-0463</a></p>
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
