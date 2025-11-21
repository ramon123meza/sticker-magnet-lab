/**
 * @fileoverview SEO utilities and data for Sticker & Magnet Lab
 * Contains schema generators and meta data for all pages
 * @module utils/seo
 */

/**
 * Site-wide SEO configuration
 * @constant {Object}
 */
export const SITE_CONFIG = {
  siteName: 'Sticker & Magnet Lab',
  siteUrl: 'https://stickermagnetlab.com',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@stickermagnetlab',
  locale: 'en_US'
};

/**
 * Generate product structured data (JSON-LD)
 * @param {Object} product - Product data
 * @param {string} product.name - Product name
 * @param {string} product.description - Product description
 * @param {string} product.image - Product image URL
 * @param {string} product.sku - Product SKU
 * @param {number} product.price - Product price
 * @param {string} product.type - Product type
 * @param {string} product.size - Product size
 * @returns {Object} JSON-LD schema object
 * @example
 * const schema = generateProductSchema({
 *   name: 'Custom Die-Cut Stickers 3x3',
 *   description: 'High-quality vinyl stickers...',
 *   price: 82.50,
 *   sku: 'STK-3X3-100'
 * });
 */
export const generateProductSchema = (product) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || `${SITE_CONFIG.siteUrl}/images/products/${product.type}-${product.size}.jpg`,
    sku: product.sku || `${product.type?.toUpperCase()}-${product.size}`,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.siteName
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: product.lowPrice || product.price,
      highPrice: product.highPrice || product.price,
      offerCount: product.offerCount || 1,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.siteName
      }
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      reviewCount: product.rating.count
    } : undefined
  };
};

/**
 * Generate organization structured data (JSON-LD)
 * @returns {Object} JSON-LD schema object
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.siteName,
    url: SITE_CONFIG.siteUrl,
    logo: `${SITE_CONFIG.siteUrl}/images/logo.png`,
    description: 'Professional custom die-cut stickers and magnets with free shipping on orders over $50.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
      email: 'support@stickermagnetlab.com'
    },
    sameAs: [
      'https://facebook.com/stickermagnetlab',
      'https://instagram.com/stickermagnetlab',
      'https://twitter.com/stickermagnetlab'
    ]
  };
};

/**
 * Generate breadcrumb structured data (JSON-LD)
 * @param {Object[]} items - Breadcrumb items
 * @param {string} items[].name - Item name
 * @param {string} items[].url - Item URL
 * @returns {Object} JSON-LD schema object
 * @example
 * const schema = generateBreadcrumbSchema([
 *   { name: 'Home', url: '/' },
 *   { name: 'Stickers', url: '/stickers' },
 *   { name: 'Die-Cut Stickers', url: '/stickers/die-cut' }
 * ]);
 */
export const generateBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.siteUrl}${item.url}`
    }))
  };
};

/**
 * Generate FAQ structured data (JSON-LD)
 * @param {Object[]} faqs - FAQ items
 * @param {string} faqs[].question - Question text
 * @param {string} faqs[].answer - Answer text
 * @returns {Object} JSON-LD schema object
 */
export const generateFAQSchema = (faqs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

/**
 * Generate local business structured data (JSON-LD)
 * @returns {Object} JSON-LD schema object
 */
export const generateLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_CONFIG.siteName,
    description: 'Custom sticker and magnet printing services',
    url: SITE_CONFIG.siteUrl,
    priceRange: '$',
    paymentAccepted: ['Credit Card', 'PayPal'],
    currenciesAccepted: 'USD'
  };
};

/**
 * Meta data for all pages
 * @constant {Object}
 */
export const META_DATA = {
  home: {
    title: 'Custom Stickers & Magnets | Free Shipping | Sticker & Magnet Lab',
    description: 'Professional custom die-cut stickers and magnets printed on premium vinyl. Free shipping on orders over $50. Upload your design and get started today!',
    keywords: 'custom stickers, die cut stickers, custom magnets, vinyl stickers, sticker printing, magnet printing, personalized stickers, bulk stickers',
    ogType: 'website'
  },
  stickers: {
    title: 'Custom Die-Cut Stickers | Premium Vinyl | Sticker & Magnet Lab',
    description: 'Order custom die-cut stickers in any shape and size. Durable vinyl with waterproof laminate. Perfect for laptops, bottles, cars, and more. Free shipping over $50.',
    keywords: 'die cut stickers, custom stickers, vinyl stickers, waterproof stickers, laptop stickers, bumper stickers, custom decals',
    ogType: 'website'
  },
  magnets: {
    title: 'Custom Die-Cut Magnets | Premium Quality | Sticker & Magnet Lab',
    description: 'Create custom die-cut magnets for your business or personal use. Thick, durable magnetic material. Perfect for fridges, cars, and promotional items.',
    keywords: 'custom magnets, die cut magnets, fridge magnets, car magnets, promotional magnets, magnetic stickers, business magnets',
    ogType: 'website'
  },
  fridgeMagnets: {
    title: 'Custom Fridge Magnets | Photo Magnets | Sticker & Magnet Lab',
    description: 'Turn your photos into beautiful fridge magnets. Multiple sizes available. Perfect for gifts, save-the-dates, and family photos.',
    keywords: 'fridge magnets, photo magnets, custom fridge magnets, refrigerator magnets, picture magnets, personalized magnets',
    ogType: 'website'
  },
  pricing: {
    title: 'Sticker & Magnet Pricing | Bulk Discounts | Sticker & Magnet Lab',
    description: 'Transparent pricing for custom stickers and magnets. Volume discounts available. See our price calculator for instant quotes.',
    keywords: 'sticker prices, magnet prices, bulk sticker pricing, custom sticker cost, wholesale stickers',
    ogType: 'website'
  },
  upload: {
    title: 'Upload Your Design | Custom Stickers & Magnets | Sticker & Magnet Lab',
    description: 'Upload your artwork and create custom stickers or magnets in minutes. Support for PNG, JPG, and more. Free design review included.',
    keywords: 'upload design, custom artwork, sticker design upload, create custom stickers',
    ogType: 'website'
  },
  cart: {
    title: 'Shopping Cart | Sticker & Magnet Lab',
    description: 'Review your custom sticker and magnet order. Free shipping on orders over $50.',
    keywords: 'shopping cart, checkout, order stickers',
    ogType: 'website'
  },
  checkout: {
    title: 'Checkout | Sticker & Magnet Lab',
    description: 'Complete your custom sticker and magnet order securely.',
    keywords: 'checkout, secure payment, order confirmation',
    ogType: 'website'
  },
  contact: {
    title: 'Contact Us | Sticker & Magnet Lab',
    description: 'Have questions about your custom sticker or magnet order? Contact our friendly support team. We typically respond within 24 hours.',
    keywords: 'contact, support, customer service, help, questions',
    ogType: 'website'
  },
  about: {
    title: 'About Us | Sticker & Magnet Lab',
    description: 'Learn about Sticker & Magnet Lab, your trusted source for premium custom stickers and magnets. Quality printing, fast turnaround, great prices.',
    keywords: 'about us, sticker company, magnet printer, custom printing',
    ogType: 'website'
  },
  faq: {
    title: 'FAQ | Frequently Asked Questions | Sticker & Magnet Lab',
    description: 'Find answers to common questions about ordering custom stickers and magnets, shipping, artwork requirements, and more.',
    keywords: 'FAQ, frequently asked questions, help, sticker questions, magnet questions',
    ogType: 'website'
  },
  privacy: {
    title: 'Privacy Policy | Sticker & Magnet Lab',
    description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
    keywords: 'privacy policy, data protection, personal information',
    ogType: 'website'
  },
  terms: {
    title: 'Terms of Service | Sticker & Magnet Lab',
    description: 'Review our terms of service for ordering custom stickers and magnets.',
    keywords: 'terms of service, terms and conditions, ordering terms',
    ogType: 'website'
  }
};

/**
 * Get meta data for a page
 * @param {string} page - Page key
 * @returns {Object} Meta data object
 */
export const getMetaData = (page) => {
  return META_DATA[page] || META_DATA.home;
};

/**
 * Generate canonical URL
 * @param {string} path - Page path
 * @returns {string} Full canonical URL
 */
export const getCanonicalUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.siteUrl}${cleanPath}`;
};

/**
 * Generate Open Graph meta tags
 * @param {Object} options - OG options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description
 * @param {string} options.url - Page URL
 * @param {string} [options.image] - OG image URL
 * @param {string} [options.type='website'] - OG type
 * @returns {Object[]} Array of meta tag objects
 */
export const generateOGTags = ({ title, description, url, image, type = 'website' }) => {
  return [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image || `${SITE_CONFIG.siteUrl}${SITE_CONFIG.defaultImage}` },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: SITE_CONFIG.siteName },
    { property: 'og:locale', content: SITE_CONFIG.locale }
  ];
};

/**
 * Generate Twitter Card meta tags
 * @param {Object} options - Twitter options
 * @param {string} options.title - Card title
 * @param {string} options.description - Card description
 * @param {string} [options.image] - Card image URL
 * @param {string} [options.card='summary_large_image'] - Card type
 * @returns {Object[]} Array of meta tag objects
 */
export const generateTwitterTags = ({ title, description, image, card = 'summary_large_image' }) => {
  return [
    { name: 'twitter:card', content: card },
    { name: 'twitter:site', content: SITE_CONFIG.twitterHandle },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image || `${SITE_CONFIG.siteUrl}${SITE_CONFIG.defaultImage}` }
  ];
};

/**
 * Serialize schema object to JSON-LD script content
 * @param {Object} schema - Schema object
 * @returns {string} JSON string for script tag
 */
export const serializeSchema = (schema) => {
  return JSON.stringify(schema);
};

export default {
  SITE_CONFIG,
  META_DATA,
  generateProductSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateLocalBusinessSchema,
  getMetaData,
  getCanonicalUrl,
  generateOGTags,
  generateTwitterTags,
  serializeSchema
};
