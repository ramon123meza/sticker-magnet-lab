import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Filter, X, SlidersHorizontal, Sparkles, ChevronDown } from 'lucide-react';
import { ProductGrid } from '../components/product';
import products from '../data/products';

const Products = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Price ranges
  const priceRanges = [
    { id: 'all', label: 'All Prices', min: 0, max: Infinity },
    { id: 'under-25', label: 'Under $25', min: 0, max: 25 },
    { id: '25-50', label: '$25 - $50', min: 25, max: 50 },
    { id: '50-100', label: '$50 - $100', min: 50, max: 100 },
    { id: 'over-100', label: 'Over $100', min: 100, max: Infinity }
  ];

  // Categories
  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'stickers', label: 'Stickers' },
    { id: 'magnets', label: 'Magnets' }
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange !== 'all') {
      const range = priceRanges.find(r => r.id === filters.priceRange);
      if (range) {
        result = result.filter(
          p => p.startingPrice >= range.min && p.startingPrice < range.max
        );
      }
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured - keep original order
        break;
    }

    return result;
  }, [filters, sortBy]);

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  const clearFilters = () => {
    setFilters({ category: 'all', priceRange: 'all' });
  };

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images[0],
        offers: {
          '@type': 'Offer',
          price: product.startingPrice,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock'
        }
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Custom Stickers & Magnets | Sticker & Magnet Lab</title>
        <meta
          name="description"
          content="Browse our collection of high-quality custom stickers and magnets. Die-cut stickers, die-cut magnets, and fridge magnets in various sizes."
        />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Hero Banner */}
      <section className="relative bg-hero-pattern text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-deep-indigo/90 to-cool-blue/80" />

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-20 w-80 h-80 bg-white/5 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <div className="relative container-custom py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-soft-sky font-medium">Premium Quality Products</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Custom Stickers & Magnets
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
              Create stunning custom stickers and magnets for your brand, events, or personal projects.
              High-quality materials, vibrant printing, and fast turnaround.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-soft-gray rounded-lg text-graphite font-medium"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-cool-blue text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 bg-soft-gray rounded-lg text-graphite font-medium cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-gray pointer-events-none" />
            </div>
          </div>

          {/* Sidebar Filters */}
          <motion.aside
            className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-graphite flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-cool-blue hover:text-deep-indigo flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>

              {/* Product Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-graphite mb-3">Product Type</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={filters.category === category.id}
                        onChange={(e) =>
                          setFilters({ ...filters, category: e.target.value })
                        }
                        className="w-4 h-4 text-cool-blue border-gray-300 focus:ring-cool-blue"
                      />
                      <span className="text-slate-gray group-hover:text-graphite transition-colors">
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-semibold text-graphite mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.id}
                        checked={filters.priceRange === range.id}
                        onChange={(e) =>
                          setFilters({ ...filters, priceRange: e.target.value })
                        }
                        className="w-4 h-4 text-cool-blue border-gray-300 focus:ring-cool-blue"
                      />
                      <span className="text-slate-gray group-hover:text-graphite transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Desktop Sort */}
              <div className="hidden lg:block mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-graphite mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-soft-gray rounded-lg text-graphite text-sm cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </motion.aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-gray">
                Showing <span className="font-semibold text-graphite">{filteredProducts.length}</span>{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            <ProductGrid
              products={filteredProducts}
              emptyMessage="No products match your filters. Try adjusting your criteria or clear all filters."
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-soft-gray py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-graphite mb-4">Why Choose Us</h2>
            <p className="text-slate-gray max-w-2xl mx-auto">
              Quality materials, expert printing, and attention to detail in every order.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Premium Materials',
                description: 'Weather-resistant vinyl and strong magnetic backing for lasting quality.',
                icon: '🎨'
              },
              {
                title: 'Vibrant Printing',
                description: 'Full-color digital printing with vivid, eye-catching results.',
                icon: '✨'
              },
              {
                title: 'Fast Turnaround',
                description: 'Quick production times without compromising on quality.',
                icon: '🚀'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-soft"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-bold text-graphite mb-2">{feature.title}</h3>
                <p className="text-slate-gray">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
