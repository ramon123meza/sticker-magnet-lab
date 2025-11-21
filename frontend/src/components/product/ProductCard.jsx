import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Star } from 'lucide-react';
import { formatPrice } from '../../data/products';

const ProductCard = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Link
        to={`/products/${product.slug}`}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-soft transition-all duration-500 hover:shadow-large hover:-translate-y-2">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-soft-gray">
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}

            {/* Main Image */}
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              animate={{
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />

            {/* Hover overlay with second image */}
            {product.images[1] && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={product.images[1]}
                  alt={`${product.name} alternate view`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Favorite button */}
            <motion.button
              onClick={handleFavoriteClick}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-300 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-gray'
                }`}
              />
            </motion.button>

            {/* Badge */}
            {product.customizable && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-cool-blue text-white text-xs font-semibold rounded-full">
                Customizable
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Category tag */}
            <span className="text-xs font-medium text-cool-blue uppercase tracking-wider">
              {product.category}
            </span>

            {/* Product name */}
            <h3 className="mt-2 text-lg font-bold text-graphite group-hover:text-cool-blue transition-colors duration-300">
              {product.name}
            </h3>

            {/* Short description */}
            <p className="mt-2 text-sm text-slate-gray line-clamp-2">
              {product.shortDescription}
            </p>

            {/* Features */}
            <div className="mt-3 flex flex-wrap gap-2">
              {product.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-soft-gray text-xs text-slate-gray rounded-md"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Price and CTA */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-gray">Starting at</span>
                <p className="text-xl font-bold text-deep-indigo">
                  {formatPrice(product.startingPrice)}
                </p>
              </div>

              <motion.div
                className="flex items-center gap-2 text-cool-blue font-semibold text-sm"
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                Customize
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>

          {/* Bottom accent bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cool-blue to-deep-indigo"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
