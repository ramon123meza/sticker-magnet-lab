import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import useForm from '../hooks/useForm';
import {
  validateEmail,
  validateRequired,
  validateMinLength,
  SUBJECT_OPTIONS,
} from '../utils/validation';

/**
 * Contact Page - Contact form and company information
 */
const Contact = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form initial values
  const initialValues = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  // Validation function
  const validate = (values) => {
    const errors = {};

    // Name validation
    const nameResult = validateRequired(values.name, 'Name');
    if (!nameResult.isValid) errors.name = nameResult.error;

    // Email validation
    const emailResult = validateEmail(values.email);
    if (!emailResult.isValid) errors.email = emailResult.error;

    // Subject validation
    const subjectResult = validateRequired(values.subject, 'Subject');
    if (!subjectResult.isValid) errors.subject = subjectResult.error;

    // Message validation
    const messageRequired = validateRequired(values.message, 'Message');
    if (!messageRequired.isValid) {
      errors.message = messageRequired.error;
    } else {
      const messageLength = validateMinLength(values.message, 20, 'Message');
      if (!messageLength.isValid) errors.message = messageLength.error;
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitSuccess(true);
    return { success: true };
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: submitForm,
    getFieldProps,
    reset,
  } = useForm(initialValues, validate, handleSubmit);

  // Get input class based on error state
  const getInputClass = (fieldName) => {
    const baseClass = 'input-field';
    if (touched[fieldName] && errors[fieldName]) {
      return `${baseClass} input-error`;
    }
    if (touched[fieldName] && !errors[fieldName] && values[fieldName]) {
      return `${baseClass} input-success`;
    }
    return baseClass;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Sticker & Magnet Lab</title>
        <meta
          name="description"
          content="Get in touch with Sticker & Magnet Lab. Questions about custom stickers, magnets, or your order? We're here to help!"
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-deep-indigo to-cool-blue py-16 md:py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-white/80">
              Have a question or need help with your order? We'd love to hear from you. Fill out the form below or reach out directly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-soft-gray">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-soft p-8 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-graphite mb-4">
                    Message Sent!
                  </h2>
                  <p className="text-slate-gray mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      reset();
                    }}
                    className="btn-secondary"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-graphite mb-6">
                    Send Us a Message
                  </h2>

                  <form onSubmit={submitForm} noValidate className="space-y-5">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-graphite mb-1"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...getFieldProps('name')}
                        className={getInputClass('name')}
                        placeholder="Your name"
                        autoComplete="name"
                        aria-required="true"
                        aria-invalid={touched.name && !!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {touched.name && errors.name && (
                        <motion.p
                          id="name-error"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-500"
                          role="alert"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-graphite mb-1"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...getFieldProps('email')}
                        className={getInputClass('email')}
                        placeholder="your@email.com"
                        autoComplete="email"
                        aria-required="true"
                        aria-invalid={touched.email && !!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {touched.email && errors.email && (
                        <motion.p
                          id="email-error"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-500"
                          role="alert"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-graphite mb-1"
                      >
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        {...getFieldProps('subject')}
                        className={`${getInputClass('subject')} cursor-pointer`}
                        aria-required="true"
                        aria-invalid={touched.subject && !!errors.subject}
                        aria-describedby={
                          errors.subject ? 'subject-error' : undefined
                        }
                      >
                        <option value="">Select a subject</option>
                        {SUBJECT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {touched.subject && errors.subject && (
                        <motion.p
                          id="subject-error"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-500"
                          role="alert"
                        >
                          {errors.subject}
                        </motion.p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-graphite mb-1"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        {...getFieldProps('message')}
                        rows={5}
                        className={`${getInputClass('message')} resize-none`}
                        placeholder="Tell us how we can help you (minimum 20 characters)"
                        aria-required="true"
                        aria-invalid={touched.message && !!errors.message}
                        aria-describedby={
                          errors.message ? 'message-error' : undefined
                        }
                      />
                      <div className="flex items-center justify-between mt-1">
                        {touched.message && errors.message ? (
                          <motion.p
                            id="message-error"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-500"
                            role="alert"
                          >
                            {errors.message}
                          </motion.p>
                        ) : (
                          <span />
                        )}
                        <span
                          className={`text-xs ${
                            values.message.length < 20
                              ? 'text-slate-gray'
                              : 'text-green-600'
                          }`}
                        >
                          {values.message.length}/20 min
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className="btn-primary w-full py-3"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                          Send Message
                        </span>
                      )}
                    </motion.button>
                  </form>
                </div>
              )}
            </motion.div>

            {/* Company Info */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Company Card */}
              <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                <h2 className="text-2xl font-bold text-graphite mb-6">
                  Get in Touch
                </h2>

                <div className="space-y-5">
                  {/* Company Name */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-cool-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-cool-blue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-graphite">R and R Imports INC</h3>
                      <p className="text-slate-gray text-sm">Sticker & Magnet Lab</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-cool-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-cool-blue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-graphite">Address</h3>
                      <p className="text-slate-gray text-sm">
                        5271 Lee Hwy<br />
                        Troutville, VA 24017
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-cool-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-cool-blue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-graphite">Email</h3>
                      <a
                        href="mailto:orders@rrinconline.com"
                        className="text-cool-blue hover:text-deep-indigo transition-colors text-sm"
                      >
                        orders@rrinconline.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-cool-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-cool-blue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-graphite">Phone</h3>
                      <a
                        href="tel:+12767060463"
                        className="text-cool-blue hover:text-deep-indigo transition-colors text-sm"
                      >
                        (276) 706-0463
                      </a>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-cool-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-cool-blue"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-graphite">Business Hours</h3>
                      <div className="text-slate-gray text-sm space-y-1">
                        <p>Monday - Friday: 9:00 AM - 5:00 PM EST</p>
                        <p>Saturday: 10:00 AM - 2:00 PM EST</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="aspect-video bg-soft-gray relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 mx-auto mb-3 text-slate-gray/50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <p className="text-slate-gray text-sm">
                        5271 Lee Hwy, Troutville, VA
                      </p>
                      <a
                        href="https://maps.google.com/?q=5271+Lee+Hwy+Troutville+VA+24017"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cool-blue hover:text-deep-indigo transition-colors text-sm mt-2"
                      >
                        <span>Open in Google Maps</span>
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
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Response Promise */}
              <div className="bg-gradient-to-r from-cool-blue to-deep-indigo rounded-2xl p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Quick Response Guarantee</h3>
                    <p className="text-white/80 text-sm">
                      We respond to all inquiries within 24 hours during business days.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;
