import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Check,
  ArrowRight,
  Camera,
  Gift,
  Calendar,
  Star,
  Quote,
  Heart
} from 'lucide-react';
import { getProductBySlug, formatPrice, SIZES, QUANTITIES, FRIDGE_MAGNET_PRICES } from '../data/products';

const MagnetsFridge = () => {
  const product = getProductBySlug('fridge-magnets');
  const [selectedSize, setSelectedSize] = useState('2x3');
  const [previewQty, setPreviewQty] = useState(100);

  // Fixed size options with descriptions
  const sizeOptions = [
    {
      size: '2x3',
      name: 'Standard Photo',
      description: 'Perfect for wallet-sized photos',
      popular: false
    },
    {
      size: '2.5x3.5',
      name: 'Trading Card',
      description: 'Like a business card or trading card',
      popular: true
    },
    {
      size: '4.75x2',
      name: 'Panoramic',
      description: 'Great for landscape photos and banners',
      popular: false
    },
    {
      size: '2.5x2.5',
      name: 'Square',
      description: 'Modern square format',
      popular: false
    }
  ];

  // Use cases
  const useCases = [
    { icon: Camera, title: 'Photo Magnets', description: 'Turn your favorite memories into fridge magnets' },
    { icon: Calendar, title: 'Save the Dates', description: 'Wedding invitations and event reminders' },
    { icon: Gift, title: 'Custom Gifts', description: 'Personalized gifts for family and friends' },
    { icon: Heart, title: 'Promotional Items', description: 'Business cards and promotional giveaways' }
  ];

  // Testimonials placeholder
  const testimonials = [
    {
      name: 'Amanda S.',
      role: 'Wedding Planner',
      content: 'These save-the-date magnets were a huge hit! Beautiful quality and they actually stick to the fridge.',
      rating: 5
    },
    {
      name: 'Robert M.',
      role: 'Grandparent',
      content: 'Ordered photo magnets of my grandkids. They look amazing on my fridge. Ordering more for Christmas!',
      rating: 5
    },
    {
      name: 'Lisa P.',
      role: 'Marketing Manager',
      content: 'We use these as promotional magnets for our brand. Great quality and our customers love them.',
      rating: 5
    }
  ];

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Custom Fridge Magnets',
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
        <title>Custom Fridge Magnets | Sticker & Magnet Lab</title>
        <meta
          name="description"
          content="Create custom fridge magnets in 4 popular sizes. Perfect for photos, save-the-dates, and promotional items. Premium quality with strong magnetic backing."
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
            className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
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
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">4 Popular Sizes</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Custom Fridge
                <span className="block text-soft-sky">Magnets</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
                Classic rectangular magnets perfect for photos, save-the-dates, and promotional items.
                Premium magnetic backing that holds firm.
              </p>

              {/* Features list */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: Camera, text: 'Photo Perfect' },
                  { icon: Gift, text: 'Great Gifts' },
                  { icon: Calendar, text: 'Event Ready' }
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
                <Link to="/products/fridge-magnets" className="btn-primary bg-white text-deep-indigo hover:bg-soft-sky">
                  View Details
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/customize/fridge-magnets" className="btn-secondary border-white text-white hover:bg-white hover:text-deep-indigo">
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
                  alt="Custom Fridge Magnets"
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

      {/* Size Options Section - Highlighted */}
      <section className="container-custom py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-graphite mb-4">
            4 Perfect Sizes
          </h2>
          <p className="text-lg text-slate-gray max-w-2xl mx-auto">
            Our fridge magnets come in four carefully selected sizes to fit any need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sizeOptions.map((option, index) => (
            <motion.div
              key={option.size}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-soft p-6 cursor-pointer transition-all duration-300 ${
                selectedSize === option.size
                  ? 'ring-2 ring-cool-blue shadow-glow'
                  : 'hover:shadow-medium hover:-translate-y-1'
              }`}
              onClick={() => setSelectedSize(option.size)}
            >
              {option.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cool-blue text-white text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              {/* Visual size representation */}
              <div className="flex items-center justify-center h-32 mb-4">
                <div
                  className={`bg-gradient-to-br from-soft-sky to-cool-blue/30 rounded-lg flex items-center justify-center text-cool-blue font-bold ${
                    selectedSize === option.size ? 'ring-2 ring-cool-blue' : ''
                  }`}
                  style={{
                    width: option.size === '4.75x2' ? '120px' : option.size === '2.5x2.5' ? '70px' : option.size === '2.5x3.5' ? '70px' : '60px',
                    height: option.size === '4.75x2' ? '50px' : option.size === '2.5x2.5' ? '70px' : option.size === '2.5x3.5' ? '98px' : '90px'
                  }}
                >
                  {option.size}"
                </div>
              </div>

              <h3 className="text-xl font-bold text-graphite mb-2 text-center">
                {option.name}
              </h3>
              <p className="text-sm text-slate-gray text-center mb-4">
                {option.description}
              </p>

              <div className="text-center">
                <p className="text-xs text-slate-gray">Starting at</p>
                <p className="text-2xl font-bold text-deep-indigo">
                  {formatPrice(FRIDGE_MAGNET_PRICES[option.size]?.[12])}
                </p>
              </div>

              {selectedSize === option.size && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-cool-blue rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-soft-gray py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-graphite mb-4">
              Perfect For Every Occasion
            </h2>
            <p className="text-lg text-slate-gray max-w-2xl mx-auto">
              From cherished memories to professional marketing materials.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <h3 className="text-lg font-bold text-graphite mb-2">{useCase.title}</h3>
                <p className="text-sm text-slate-gray">{useCase.description}</p>
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
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-graphite mb-4">
            Volume Pricing
          </h2>
          <p className="text-lg text-slate-gray max-w-2xl mx-auto">
            The more you order, the more you save. Perfect for events and bulk orders.
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
              Pricing for {selectedSize}" Fridge Magnets
            </h3>
            <div className="flex gap-2">
              {SIZES.fridge.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedSize === size
                      ? 'bg-white text-deep-indigo'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {size}"
                </button>
              ))}
            </div>
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
                  const price = FRIDGE_MAGNET_PRICES[selectedSize]?.[qty];
                  const pricePerUnit = price ? (price / qty).toFixed(2) : null;
                  const basePerUnit = FRIDGE_MAGNET_PRICES[selectedSize]?.[12] / 12;
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
            to={`/customize/fridge-magnets?size=${selectedSize}&qty=${previewQty}`}
            className="btn-accent inline-flex"
          >
            Design {previewQty} {selectedSize}" Magnets
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
                Quality You Can Feel
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: 'Premium Photo Quality',
                    description: 'Crisp, vibrant printing that does justice to your photos and designs.'
                  },
                  {
                    title: 'Thick Magnetic Material',
                    description: 'Sturdy magnets that hold firmly and feel substantial in your hands.'
                  },
                  {
                    title: 'Glossy Finish',
                    description: 'Beautiful glossy coating that protects and enhances your images.'
                  },
                  {
                    title: 'Perfect for Gifts',
                    description: 'Make memorable gifts for birthdays, holidays, and special occasions.'
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
                    alt={`Fridge magnet example ${index + 1}`}
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
              Loved by Our Customers
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              See what people are saying about our fridge magnets.
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
            Ready to Create Your Fridge Magnets?
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Turn your favorite photos into lasting memories. Upload your images and design today.
          </p>
          <Link to="/customize/fridge-magnets" className="btn-primary bg-white text-deep-indigo hover:bg-soft-sky inline-flex">
            Design Your Magnets
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default MagnetsFridge;
