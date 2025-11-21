import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * PaymentPlaceholder - Payment section placeholder component
 * Stripe-style card inputs (visual only) for future integration
 *
 * TODO: Integrate Stripe
 * const stripe = loadStripe('pk_test_...');
 * const elements = stripe.elements();
 *
 * Future implementation:
 * - Install @stripe/stripe-js and @stripe/react-stripe-js
 * - Wrap app with Elements provider
 * - Use CardElement or individual card input elements
 * - Handle payment intent creation on backend
 * - Process payment confirmation
 */
const PaymentPlaceholder = ({
  onPaymentReady,
  disabled = false,
}) => {
  // Placeholder state for visual demonstration
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  // Format expiry as MM/YY
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-soft p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cool-blue/10 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-cool-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-graphite">Payment Details</h3>
          <p className="text-sm text-slate-gray">Secure payment processing</p>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6 p-4 bg-gradient-to-r from-cool-blue/5 to-deep-indigo/5 border border-cool-blue/20 rounded-xl"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-cool-blue/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-cool-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-deep-indigo mb-1">Payment Coming Soon</h4>
            <p className="text-sm text-slate-gray">
              Secure payment processing will be enabled soon. For now, you can place your order and we'll contact you for payment details.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Card Input Fields (Visual Only - Disabled) */}
      <div className="space-y-4 opacity-60">
        {/* Cardholder Name */}
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-graphite mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            id="cardholderName"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            disabled
            className="input-field bg-gray-50 cursor-not-allowed"
            placeholder="John Doe"
          />
        </div>

        {/* Card Number */}
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-graphite mb-1">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              disabled
              className="input-field bg-gray-50 cursor-not-allowed pl-12"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg className="w-6 h-6 text-slate-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            {/* Card Brand Icons */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-[8px] font-bold text-gray-400">VISA</span>
              </div>
              <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-[8px] font-bold text-gray-400">MC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expiry and CVC Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Expiry */}
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-graphite mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiry"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              disabled
              className="input-field bg-gray-50 cursor-not-allowed"
              placeholder="MM/YY"
              maxLength={5}
            />
          </div>

          {/* CVC */}
          <div>
            <label htmlFor="cvc" className="block text-sm font-medium text-graphite mb-1">
              CVC
            </label>
            <div className="relative">
              <input
                type="text"
                id="cvc"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                disabled
                className="input-field bg-gray-50 cursor-not-allowed"
                placeholder="123"
                maxLength={4}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-slate-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 flex items-center gap-2 text-sm text-slate-gray">
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>Your payment information is encrypted and secure</span>
      </div>

      {/* Stripe Branding Placeholder */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-slate-gray">
        <span>Powered by</span>
        <div className="flex items-center gap-1 font-bold text-[#635BFF]">
          <svg className="w-10 h-4" viewBox="0 0 60 25" fill="currentColor">
            <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 01-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.02 1.04-.06 1.48zm-6.3-5.63c-1.03 0-1.77.82-1.9 2.24h3.74c-.09-1.4-.7-2.24-1.84-2.24z"/>
            <path d="M41.14 5.57h4.24v14.17h-4.24V5.57zm0-5.33h4.24v3.57h-4.24V.24zM34.7 5.57l.26 1.3c.78-.99 1.93-1.55 3.43-1.55v4.05c-.22-.04-.47-.06-.75-.06-1.18 0-2.07.39-2.69 1.16v9.27h-4.24V5.57h4z"/>
            <path d="M21.72 13.42v-.24c0-.81.33-1.36 1.66-1.67l1.94-.45v-.15c0-.84-.56-1.25-1.58-1.25-1.11 0-2.09.36-3 .93V6.38c.99-.55 2.26-.97 4.01-.97 3.28 0 4.8 1.55 4.8 4.65v9.68h-3.86l-.3-1.06c-.86.83-1.91 1.31-3.2 1.31-2.35 0-3.73-1.55-3.73-3.93 0-1.43.51-2.64 1.55-3.31.85-.55 1.74-.84 2.71-.84v2.38c-.97.04-1.56.46-1.56 1.25 0 .65.37 1.04.96 1.04.7 0 1.38-.4 1.84-.89v-2.27h-2.24z"/>
            <path d="M6.22 5.57l.26 1.04c.86-.86 2.05-1.3 3.53-1.3 2.5 0 4.42 1.34 4.42 5.45v9.98h-4.24v-9.3c0-1.46-.61-2.08-1.68-2.08-.84 0-1.54.41-2.03 1.06v10.32H2V5.57h4.22z"/>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentPlaceholder;
