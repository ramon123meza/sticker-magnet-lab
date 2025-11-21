/**
 * Shipping & Returns Page
 * Information about shipping policies and return procedures
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Truck, Package, Clock, RefreshCw, Shield, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShippingReturns = () => {
  const shippingInfo = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Every order ships free! No minimum purchase required. We ship to all 50 US states.'
    },
    {
      icon: Clock,
      title: 'Production Time',
      description: '3-5 business days for production. Most orders ship within 5 business days of placement.'
    },
    {
      icon: Package,
      title: 'Delivery Time',
      description: 'Standard shipping takes 3-7 business days after production. Total time: 6-12 business days.'
    }
  ];

  const faqs = [
    {
      question: 'How long will it take to receive my order?',
      answer: 'Production takes 3-5 business days, followed by 3-7 days for shipping. Most orders arrive within 6-12 business days.'
    },
    {
      question: 'Do you offer expedited shipping?',
      answer: 'Yes! Contact us before placing your order and we can discuss rush production and expedited shipping options for an additional fee.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within the United States. We hope to offer international shipping in the future.'
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes! Once your order ships, you\'ll receive a tracking number via email so you can monitor your delivery.'
    },
    {
      question: 'What if my order arrives damaged?',
      answer: 'Contact us immediately with photos of the damage. We\'ll work with you to resolve the issue, whether that\'s a replacement or refund.'
    },
    {
      question: 'Can I return my custom products?',
      answer: 'Due to the custom nature of our products, we cannot accept returns for buyer\'s remorse. However, if there\'s an issue with quality or your order is incorrect, we\'ll make it right.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Shipping & Returns | Sticker & Magnet Lab</title>
        <meta name="description" content="Free shipping on all orders at Sticker & Magnet Lab. Learn about our shipping policies, delivery times, and return procedures." />
      </Helmet>

      {/* Hero */}
      <section className="bg-hero-pattern text-white py-16">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Shipping & Returns
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300"
          >
            Free shipping on every order. Your satisfaction is guaranteed.
          </motion.p>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {shippingInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-soft-gray rounded-xl p-6 text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cool-blue to-deep-indigo rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-deep-indigo mb-2">{item.title}</h3>
                <p className="text-slate-gray">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Shipping Policy */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-deep-indigo mb-6">Shipping Policy</h2>
            <div className="prose prose-slate max-w-none">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-green-800 m-0">Free Shipping on All Orders!</h3>
                </div>
                <p className="text-green-700 m-0">
                  That&apos;s right - every order ships absolutely free. No minimum purchase required.
                  We believe in transparent pricing without surprise shipping fees at checkout.
                </p>
              </div>

              <h3 className="text-xl font-bold text-deep-indigo mb-4">Processing Times</h3>
              <ul className="space-y-2 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-cool-blue">•</span>
                  <span><strong>Standard Production:</strong> 3-5 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cool-blue">•</span>
                  <span><strong>Shipping Time:</strong> 3-7 business days (after production)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cool-blue">•</span>
                  <span><strong>Total Estimated Time:</strong> 6-12 business days</span>
                </li>
              </ul>

              <h3 className="text-xl font-bold text-deep-indigo mb-4">Shipping Carriers</h3>
              <p className="text-slate-gray mb-8">
                We ship via USPS, UPS, or FedEx depending on package size and destination.
                You&apos;ll receive tracking information via email once your order ships.
              </p>

              <div className="border-t border-gray-200 pt-8 mt-8">
                <h2 className="text-2xl font-bold text-deep-indigo mb-6 flex items-center gap-3">
                  <RefreshCw className="w-7 h-7" />
                  Returns Policy
                </h2>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                  <h4 className="font-bold text-amber-800 mb-2">Custom Products Policy</h4>
                  <p className="text-amber-700 text-sm">
                    Because each item is custom-made to your specifications, we cannot accept returns
                    for change of mind or buyer&apos;s remorse. Please review your design carefully before ordering.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-deep-indigo mb-4">We Will Make It Right If:</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Your order arrives damaged during shipping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>The wrong product or quantity was sent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>There&apos;s a printing defect or quality issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>The product doesn&apos;t match the approved design</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-deep-indigo mb-4">How to Request a Return/Replacement</h3>
                <ol className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-cool-blue text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                    <span>Contact us within 7 days of receiving your order</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-cool-blue text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                    <span>Include your order number and photos showing the issue</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-cool-blue text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                    <span>Our team will review and respond within 1-2 business days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-cool-blue text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                    <span>If approved, we&apos;ll send a replacement or issue a refund</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-soft-gray">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-12 h-12 text-cool-blue mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-deep-indigo mb-2">Frequently Asked Questions</h2>
              <p className="text-slate-gray">Common questions about shipping and returns</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-6 shadow-soft"
                >
                  <h3 className="font-bold text-deep-indigo mb-2">{faq.question}</h3>
                  <p className="text-slate-gray">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-deep-indigo mb-4">Still Have Questions?</h2>
          <p className="text-slate-gray mb-6">
            Our friendly team is here to help with any shipping or return inquiries.
          </p>
          <Link to="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
};

export default ShippingReturns;
