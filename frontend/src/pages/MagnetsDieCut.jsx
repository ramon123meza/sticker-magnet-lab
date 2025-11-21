import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Check,
  ArrowRight,
  Shield,
  Magnet,
  Palette,
  Star,
  Quote,
  Car,
  Home as HomeIcon
} from 'lucide-react';
import { getProductBySlug, formatPrice, SIZES, QUANTITIES, MAGNET_PRICES } from '../data/products';

const MagnetsDieCut = () => {
  const product = getProductBySlug('die-cut-magnets');
  const [previewSize, setPreviewSize] = useState('5x5');
  const [previewQty, setPreviewQty] = useState(100);

  // Size categories for visual display
  const sizeCategories = {
    small: SIZES.dieCut.slice(0, 4),
    medium: SIZES.dieCut.slice(4, 8),
    large: SIZES.dieCut.slice(8, 12),
    xlarge: SIZES.dieCut.slice(12)
  };

  // Use cases
  const useCases = [
    { icon: Car, title: 'Vehicle Magnets', description: 'Perfect for car doors, trucks, and fleet vehicles' },
    { icon: HomeIcon, title: 'Home Decor', description: 'Add personality to refrigerators and metal surfaces' },
    { icon: Shield, title: 'Business Branding', description: 'Professional signage that moves with you' }
  ];

  // Testimonials placeholder
  const testimonials = [
    {
      name: 'David R.',
      role: 'Food Truck Owner',
      content: 'The car magnets for my food truck look amazing! They stay put even at highway speeds.',
      rating: 5
    },
    {
      name: 'Emily K.',
      role: 'Real Estate Agent',
      content: 'I use these on my car for advertising. Professional look and easy to swap out for different listings.',
      rating: 5
    },
    {
      name: 'Tom H.',
      role: 'HVAC Contractor',
      content: 'Strong magnets that don\'t damage my work van. Perfect for business advertising.',
      rating: 5
    }
  ];

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Custom Die-Cut Magnets',
    description: product?.description,
    image: product?.images[0],
    brand: {
      '@type': 'Brand',
      name: 'Sticker & Magnet Lab'
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: product?.startingPrice,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <>
      <Helmet>
        <title>Custom Die-Cut Magnets | Sticker & Magnet Lab</title>
        <meta
          name="description"
          content="Create custom die-cut magnets with strong magnetic backing. Durable, wear-resistant, and perfect for vehicles and any metal surface."
        />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-deep-indigo via-cool-blue to-deep-indigo text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-80 h-80 bg-cool-blue/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="relative container-custom py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <Magnet className="w-4 h-4" />
                <span className="text-sm font-medium">Strong Magnetic Backing</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Custom Die-Cut
                <span className="block text-soft-sky">Magnets</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
                Durable magnets with a solid, stiff magnetic backing. Cut to any shape,
                perfect for vehicles, refrigerators, and any metal surface.
              </p>

              {/* Features list */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: Magnet, text: 'Strong Hold' },
                  { icon: Shield, text: 'Wear Resistant' },
                  { icon: Palette, text: 'Vivid Colors' }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg"
                  >
                    <feature.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/products/die-cut-magnets" className="btn-primary bg-white text-deep-indigo hover:bg-soft-sky">
                  View Details
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/customize/die-cut-magnets" className="btn-secondary border-white text-white hover:bg-white hover:text-deep-indigo">
                  Design Your Magnets
                </Link>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={product?.images[0]}
                  alt="Custom Die-Cut Magnets"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating price badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-large p-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <p className="text-xs text-slate-gray">Starting at</p>
                <p className="text-2xl font-bold text-deep-indigo">
                  {formatPrice(product?.startingPrice)}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container-custom py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-graphite mb-4">
            Perfect For Every Application
          </h2>
          <p className="text-lg text-slate-gray max-w-2xl mx-auto">
            Our die-cut magnets are versatile and built to perform in any environment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-soft p-6 text-center"
            >
              <div className="w-16 h-16 bg-cool-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <useCase.icon className="w-8 h-8 text-cool-blue" />
              </div>
              <h3 className="text-xl font-bold text-graphite mb-2">{useCase.title}</h3>
              <p className="text-slate-gray">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Size Options Section */}
      <section className="bg-soft-gray py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-graphite mb-4">
              Available Sizes
            </h2>
            <p className="text-lg text-slate-gray max-w-2xl mx-auto">
              From small promotional magnets to large vehicle signage.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(sizeCategories).map(([category, sizes], catIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-soft p-6"
              >
                <h3 className="text-lg font-bold text-graphite mb-4 capitalize">
                  {category === 'xlarge' ? 'Extra Large' : category} Sizes
                </h3>
                <div className="space-y-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setPreviewSize(size)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 ${
                        previewSize === size
                          ? 'bg-cool-blue text-white'
                          : 'bg-soft-gray text-graphite hover:bg-gray-200'
                      }`}
                    >
                      <span className="font-medium">{size}"</span>
                      <span className="text-sm opacity-80">
                        from {formatPrice(MAGNET_PRICES[size]?.[12])}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Table */}
      <section className="container-custom py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-soft overflow-hidden"
        >
          {/* Size selector for table */}
          <div className="bg-deep-indigo p-4 flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-white font-semibold">
              Pricing for {previewSize}" Die-Cut Magnets
            </h3>
            <select
              value={previewSize}
              onChange={(e) => setPreviewSize(e.target.value)}
              className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg"
            >
              {SIZES.dieCut.map((size) => (
                <option key={size} value={size} className="text-graphite">
                  {size}"
                </option>
              ))}
            </select>
          </div>

          {/* Pricing table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-soft-gray">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Total Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Per Magnet</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {QUANTITIES.map((qty) => {
                  const price = MAGNET_PRICES[previewSize]?.[qty];
                  const pricePerUnit = price ? (price / qty).toFixed(2) : null;
                  const basePerUnit = MAGNET_PRICES[previewSize]?.[12] / 12;
                  const savings = pricePerUnit && basePerUnit
                    ? Math.round((1 - pricePerUnit / basePerUnit) * 100)
                    : 0;

                  return (
                    <tr
                      key={qty}
                      className={`transition-colors ${
                        previewQty === qty ? 'bg-cool-blue/5' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setPreviewQty(qty)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-graphite">{qty}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-deep-indigo">{formatPrice(price)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-gray">{formatPrice(parseFloat(pricePerUnit))}</span>
                      </td>
                      <td className="px-6 py-4">
                        {savings > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            Save {savings}%
                          </span>
                        ) : (
                          <span className="text-slate-gray">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            to={`/customize/die-cut-magnets?size=${previewSize}&qty=${previewQty}`}
            className="btn-accent inline-flex"
          >
            Design {previewQty} {previewSize}" Magnets
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-soft-gray py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-graphite mb-6">
                Built to Last, Designed to Impress
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: 'Premium Magnetic Material',
                    description: 'Thick, flexible magnets with powerful hold that won\'t scratch surfaces.'
                  },
                  {
                    title: 'Custom Die-Cut Shapes',
                    description: 'Cut to match any design contour for a professional, finished look.'
                  },
                  {
                    title: 'Weather Resistant',
                    description: 'UV-protected printing that resists fading from sun exposure.'
                  },
                  {
                    title: 'Removable & Reusable',
                    description: 'Move between surfaces without damage or residue.'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-graphite mb-1">{feature.title}</h3>
                      <p className="text-slate-gray">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {product?.images.slice(0, 2).map((image, index) => (
                <div
                  key={index}
                  className={`rounded-2xl overflow-hidden shadow-soft ${
                    index === 0 ? 'mt-8' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`Magnet example ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-deep-indigo text-white py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Businesses & Creators
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              See why professionals choose our die-cut magnets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
              >
                <Quote className="w-8 h-8 text-soft-sky mb-4" />
                <p className="text-gray-200 mb-4">{testimonial.content}</p>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-custom py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-cool-blue to-deep-indigo rounded-3xl p-8 md:p-12 text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your Custom Magnets?
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Upload your design and create professional magnets for any surface.
          </p>
          <Link to="/customize/die-cut-magnets" className="btn-primary bg-white text-deep-indigo hover:bg-soft-sky inline-flex">
            Design Your Magnets
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default MagnetsDieCut;
