import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Home,
  Check,
  Shield,
  Truck,
  RefreshCw,
  Star,
  ArrowRight
} from 'lucide-react';
import { ProductGallery, PriceCalculator, ProductCard } from '../components/product';
import { getProductBySlug, formatPrice, getPrice, products } from '../data/products';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProductBySlug(slug);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(12);

  // Set default size when product loads
  useEffect(() => {
    if (product && product.sizes.length > 0) {
      // Default to 5x5 if available, otherwise first size
      const defaultSize = product.sizes.includes('5x5') ? '5x5' : product.sizes[0];
      setSelectedSize(defaultSize);
    }
  }, [product]);

  // Handle product not found
  if (!product) {
    return (
      <div className="container-custom py-24 text-center">
        <h1 className="text-3xl font-bold text-graphite mb-4">Product Not Found</h1>
        <p className="text-slate-gray mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/products" className="btn-primary">
          Browse All Products
        </Link>
      </div>
    );
  }

  // Get related products (same category, different product)
  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  // Current price
  const currentPrice = getPrice(product, selectedSize, selectedQuantity);

  // Handle customize click
  const handleCustomize = () => {
    navigate(`/customize/${product.slug}?size=${selectedSize}&qty=${selectedQuantity}`);
  };

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'Sticker & Magnet Lab'
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: product.startingPrice,
      highPrice: Object.values(product.prices).reduce((max, qtyPrices) => {
        const maxPrice = Math.max(...Object.values(qtyPrices));
        return Math.max(max, maxPrice);
      }, 0),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      offerCount: product.sizes.length * product.quantities.length
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127'
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Sticker & Magnet Lab</title>
        <meta name="description" content={product.description} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav className="bg-soft-gray">
        <div className="container-custom py-4">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-slate-gray hover:text-cool-blue transition-colors flex items-center gap-1"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-slate-gray" />
            <li>
              <Link
                to="/products"
                className="text-slate-gray hover:text-cool-blue transition-colors"
              >
                Products
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-slate-gray" />
            <li>
              <Link
                to={`/products?category=${product.category}`}
                className="text-slate-gray hover:text-cool-blue transition-colors capitalize"
              >
                {product.category}
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-slate-gray" />
            <li className="text-graphite font-medium truncate">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* Main Product Section */}
      <section className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGallery images={product.images} productName={product.name} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Category badge */}
            <span className="inline-block px-3 py-1 bg-cool-blue/10 text-cool-blue text-sm font-semibold rounded-full capitalize">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-graphite">
              {product.name}
            </h1>

            {/* Rating placeholder */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-gray">(127 reviews)</span>
            </div>

            {/* Description */}
            <p className="text-lg text-slate-gray leading-relaxed">
              {product.description}
            </p>

            {/* Key Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-graphite">Key Features:</h3>
              <ul className="space-y-2">
                {product.detailedFeatures.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium text-graphite">{feature.title}:</span>{' '}
                      <span className="text-slate-gray">{feature.description}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-soft-gray rounded-xl">
              <div>
                <span className="text-sm text-slate-gray">Material</span>
                <p className="font-medium text-graphite">{product.material}</p>
              </div>
              <div>
                <span className="text-sm text-slate-gray">Finish</span>
                <p className="font-medium text-graphite">{product.finish}</p>
              </div>
              <div>
                <span className="text-sm text-slate-gray">Durability</span>
                <p className="font-medium text-graphite">{product.durability}</p>
              </div>
              <div>
                <span className="text-sm text-slate-gray">Waterproof</span>
                <p className="font-medium text-graphite">{product.waterproof ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Price Calculator */}
            <PriceCalculator
              product={product}
              selectedSize={selectedSize}
              selectedQuantity={selectedQuantity}
              onSizeChange={setSelectedSize}
              onQuantityChange={setSelectedQuantity}
            />

            {/* CTA Button */}
            <motion.button
              onClick={handleCustomize}
              className="w-full btn-accent text-lg py-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Customizing
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-slate-gray">
                <Shield className="w-5 h-5 text-cool-blue" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-gray">
                <Truck className="w-5 h-5 text-cool-blue" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-gray">
                <RefreshCw className="w-5 h-5 text-cool-blue" />
                <span>Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="bg-soft-gray py-12">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
            <h2 className="text-2xl font-bold text-graphite mb-6">Product Details</h2>

            <div className="prose max-w-none text-slate-gray">
              <h3 className="text-lg font-semibold text-graphite mb-3">Available Sizes</h3>
              <p className="mb-4">
                Our {product.name.toLowerCase()} are available in the following sizes (in inches):
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="px-3 py-1 bg-soft-gray rounded-full text-sm text-graphite"
                  >
                    {size}"
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-graphite mb-3">Quantity Options</h3>
              <p className="mb-4">
                Order as few as 12 or as many as 10,000. Bulk discounts available for larger orders:
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {product.quantities.map((qty) => (
                  <span
                    key={qty}
                    className="px-3 py-1 bg-soft-gray rounded-full text-sm text-graphite"
                  >
                    {qty}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-graphite mb-3">Application</h3>
              <p>
                {product.category === 'stickers'
                  ? 'Perfect for laptops, water bottles, car windows, notebooks, skateboards, and any smooth surface. Easy to apply and remove without leaving residue.'
                  : 'Ideal for refrigerators, filing cabinets, car doors, magnetic whiteboards, and any metal surface. Strong magnetic backing ensures your design stays in place.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container-custom py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-graphite mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
              ))}
            </div>
          </motion.div>
        </section>
      )}
    </>
  );
};

export default ProductDetail;
