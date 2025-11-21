import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Check,
  ArrowRight,
  Sun,
  Droplets,
  Palette,
  Star,
  Quote
} from 'lucide-react';
import { getProductBySlug, formatPrice, SIZES, QUANTITIES, STICKER_PRICES } from '../data/products';

const Stickers = () => {
  const product = getProductBySlug('die-cut-stickers');
  const [previewSize, setPreviewSize] = useState('5x5');
  const [previewQty, setPreviewQty] = useState(100);

  // Size categories for visual display
  const sizeCategories = {
    small: SIZES.dieCut.slice(0, 4),
    medium: SIZES.dieCut.slice(4, 8),
    large: SIZES.dieCut.slice(8, 12),
    xlarge: SIZES.dieCut.slice(12)
  };

  // Testimonials placeholder
  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Small Business Owner',
      content: 'These stickers are amazing quality! They survived my water bottle going through the dishwasher multiple times.',
      rating: 5
    },
    {
      name: 'Mike T.',
      role: 'Event Organizer',
      content: 'Ordered 1000 stickers for our music festival. Colors were vibrant and delivery was faster than expected.',
      rating: 5
    },
    {
      name: 'Jessica L.',
      role: 'Artist',
      content: 'Finally found a printer that does justice to my artwork. The die-cut precision is spot on!',
      rating: 5
    }
  ];

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Custom Die-Cut Stickers',
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
        <title>Custom Die-Cut Stickers | Sticker & Magnet Lab</title>
        <meta
          name="description"
          content="Create custom die-cut stickers with high-quality vinyl. Weather resistant, sun and rain proof. Available in 16 sizes from 2x2 to 22x22 inches."
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
            className="absolute top-20 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-96 h-96 bg-cool-blue/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
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
                <Palette className="w-4 h-4" />
                <span className="text-sm font-medium">Premium Vinyl Stickers</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Custom Die-Cut
                <span className="block text-soft-sky">Stickers</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
                High-quality vinyl stickers cut to any shape. Weather resistant,
                sun and rain proof, and incredibly durable for indoor and outdoor use.
              </p>

              {/* Features list */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: Sun, text: 'UV Resistant' },
                  { icon: Droplets, text: 'Waterproof' },
                  { icon: Palette, text: 'Vibrant Colors' }
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
                <Link to="/products/die-cut-stickers" className="btn-primary bg-white text-deep-indigo hover:bg-soft-sky">
                  View Details
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/customize/die-cut-stickers" className="btn-secondary border-white text-white hover:bg-white hover:text-deep-indigo">
                  Design Your Stickers
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
                  alt="Custom Die-Cut Stickers"
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

      {/* Size Options Section */}
      <section className="container-custom py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-graphite mb-4">
            Choose Your Perfect Size
          </h2>
          <p className="text-lg text-slate-gray max-w-2xl mx-auto">
            From small laptop stickers to large wall decals, we have the perfect size for every need.
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
                      from {formatPrice(STICKER_PRICES[size]?.[12])}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Preview Table */}
      <section className="bg-soft-gray py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-graphite mb-4">
              Transparent Pricing
            </h2>
            <p className="text-lg text-slate-gray max-w-2xl mx-auto">
              Volume discounts that reward bigger orders. See our complete pricing below.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-soft overflow-hidden"
          >
            {/* Size selector for table */}
            <div className="bg-deep-indigo p-4 flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-white font-semibold">
                Pricing for {previewSize}" Stickers
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Per Sticker</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {QUANTITIES.map((qty, index) => {
                    const price = STICKER_PRICES[previewSize]?.[qty];
                    const pricePerUnit = price ? (price / qty).toFixed(2) : null;
                    const basePerUnit = STICKER_PRICES[previewSize]?.[12] / 12;
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
              to={`/customize/die-cut-stickers?size=${previewSize}&qty=${previewQty}`}
              className="btn-accent inline-flex"
            >
              Design {previewQty} {previewSize}" Stickers
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-custom py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-graphite mb-6">
              Why Our Stickers Stand Out
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Premium Vinyl Material',
                  description: 'Made with high-grade vinyl that resists fading, peeling, and water damage.'
                },
                {
                  title: 'Precision Die-Cutting',
                  description: 'Each sticker is precisely cut to match your design shape perfectly.'
                },
                {
                  title: 'Vivid Full-Color Printing',
                  description: 'State-of-the-art printing ensures your colors pop and stay vibrant.'
                },
                {
                  title: 'Easy Application & Removal',
                  description: 'Apply smoothly without bubbles and remove without sticky residue.'
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
                  alt={`Sticker example ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
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
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join thousands of happy customers who trust us with their sticker needs.
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
            Ready to Create Your Custom Stickers?
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Upload your design and see your stickers come to life. Fast turnaround, premium quality.
          </p>
          <Link to="/customize/die-cut-stickers" className="btn-primary bg-white text-deep-indigo hover:bg-soft-sky inline-flex">
            Design Your Stickers
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default Stickers;
