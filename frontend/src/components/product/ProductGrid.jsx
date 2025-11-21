import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { Package } from 'lucide-react';

const LoadingSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
    <div className="aspect-square skeleton" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-20 skeleton rounded" />
      <div className="h-6 w-3/4 skeleton rounded" />
      <div className="h-4 w-full skeleton rounded" />
      <div className="h-4 w-2/3 skeleton rounded" />
      <div className="flex gap-2 mt-3">
        <div className="h-6 w-16 skeleton rounded" />
        <div className="h-6 w-16 skeleton rounded" />
        <div className="h-6 w-16 skeleton rounded" />
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-8 w-20 skeleton rounded" />
        <div className="h-6 w-24 skeleton rounded" />
      </div>
    </div>
  </div>
);

const EmptyState = ({ message = 'No products found' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="col-span-full flex flex-col items-center justify-center py-16 px-4"
  >
    <div className="w-20 h-20 bg-soft-gray rounded-full flex items-center justify-center mb-4">
      <Package className="w-10 h-10 text-slate-gray" />
    </div>
    <h3 className="text-xl font-semibold text-graphite mb-2">No Products Found</h3>
    <p className="text-slate-gray text-center max-w-md">{message}</p>
  </motion.div>
);

const ProductGrid = ({
  products,
  loading = false,
  emptyMessage = 'No products match your criteria. Try adjusting your filters.',
  columns = { sm: 1, md: 2, lg: 3 }
}) => {
  const gridCols = `grid-cols-1 ${
    columns.md === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
  } ${
    columns.lg === 3 ? 'lg:grid-cols-3' : columns.lg === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'
  }`;

  if (loading) {
    return (
      <div className={`grid ${gridCols} gap-6 md:gap-8`}>
        {[...Array(6)].map((_, idx) => (
          <LoadingSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <motion.div
      className={`grid ${gridCols} gap-6 md:gap-8`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} index={index} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductGrid;
