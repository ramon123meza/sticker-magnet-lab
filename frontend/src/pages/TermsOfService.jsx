/**
 * Terms of Service Page
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Scale, ShoppingCart, Copyright, Gavel } from 'lucide-react';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Sticker & Magnet Lab</title>
        <meta name="description" content="Terms of Service for Sticker & Magnet Lab. Read our terms and conditions for using our custom sticker and magnet printing services." />
      </Helmet>

      {/* Hero */}
      <section className="bg-hero-pattern text-white py-16">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FileText className="w-16 h-16 mx-auto mb-4 text-soft-sky" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
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
                  Welcome to Sticker & Magnet Lab. By using our website and services, you agree
                  to be bound by these Terms of Service. Please read them carefully before
                  placing an order.
                </p>
              </div>

              <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-6 h-6 text-cool-blue" />
                  <h2 className="text-2xl font-bold text-deep-indigo m-0">Acceptance of Terms</h2>
                </div>
                <p className="text-slate-gray">
                  By accessing or using Sticker & Magnet Lab (&quot;the Service&quot;), you agree to be
                  bound by these Terms of Service and all applicable laws and regulations. If you
                  do not agree with any of these terms, you are prohibited from using or accessing
                  this site.
                </p>
              </section>

              <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <ShoppingCart className="w-6 h-6 text-cool-blue" />
                  <h2 className="text-2xl font-bold text-deep-indigo m-0">Orders and Payment</h2>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>All prices are in US dollars and are subject to change without notice.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Payment is required at the time of order placement.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>We reserve the right to refuse or cancel any order for any reason.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Orders cannot be cancelled once production has begun.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Free shipping applies to all orders within the United States.</span>
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Copyright className="w-6 h-6 text-cool-blue" />
                  <h2 className="text-2xl font-bold text-deep-indigo m-0">Intellectual Property & Content</h2>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-800 mb-2">Important</h4>
                      <p className="text-amber-700 text-sm m-0">
                        You are solely responsible for ensuring you have the right to use any
                        artwork, images, logos, or designs you submit for printing.
                      </p>
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>By submitting artwork, you represent that you own the rights or have permission to use it.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>We will not print copyrighted material without proper authorization.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>We reserve the right to refuse any order that appears to violate intellectual property rights.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>You indemnify us against any claims arising from your use of unauthorized content.</span>
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-cool-blue" />
                  <h2 className="text-2xl font-bold text-deep-indigo m-0">Prohibited Content</h2>
                </div>
                <p className="text-slate-gray mb-4">We will not produce materials that:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Infringe on copyrights, trademarks, or other intellectual property rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Contain hate speech, discrimination, or promote violence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Are obscene, pornographic, or sexually explicit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Promote illegal activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Are defamatory or libelous</span>
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-deep-indigo mb-4">Product Quality & Variations</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Colors may vary slightly from screen displays due to monitor calibration differences.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Minor size variations (up to 1/8&quot;) are within acceptable production tolerances.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>We recommend ordering a sample for color-critical projects.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Low-resolution artwork may result in pixelation; we are not responsible for print quality issues caused by low-resolution source files.</span>
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-deep-indigo mb-4">Limitation of Liability</h2>
                <p className="text-slate-gray mb-4">
                  To the maximum extent permitted by law, Sticker & Magnet Lab and its parent
                  company R and R Imports INC shall not be liable for:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Any indirect, incidental, special, consequential, or punitive damages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Loss of profits, revenue, data, or business opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Damages exceeding the amount paid for the specific order in question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cool-blue font-bold">•</span>
                    <span>Delays or failures caused by circumstances beyond our control</span>
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Gavel className="w-6 h-6 text-cool-blue" />
                  <h2 className="text-2xl font-bold text-deep-indigo m-0">Governing Law</h2>
                </div>
                <p className="text-slate-gray">
                  These Terms of Service shall be governed by and construed in accordance with
                  the laws of the Commonwealth of Virginia, United States, without regard to its
                  conflict of law provisions. Any disputes arising from these terms or your use
                  of the Service shall be resolved in the courts of Virginia.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-deep-indigo mb-4">Changes to Terms</h2>
                <p className="text-slate-gray">
                  We reserve the right to modify these Terms of Service at any time. Changes
                  will be effective immediately upon posting to the website. Your continued use
                  of the Service after any changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="bg-soft-gray rounded-xl p-6">
                <h2 className="text-2xl font-bold text-deep-indigo mb-4">Contact Information</h2>
                <p className="text-slate-gray mb-4">
                  If you have questions about these Terms of Service, please contact us:
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

export default TermsOfService;
