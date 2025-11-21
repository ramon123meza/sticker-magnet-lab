import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Truck,
  Clock,
  Shield,
  Award,
  Upload,
  Sliders,
  Eye,
  Package,
  Factory,
  Zap,
  Sparkles,
  Check,
  X,
  ChevronDown,
  Play,
  Pause,
  Star,
  ArrowRight,
  MapPin,
  Heart,
} from 'lucide-react';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeInDown = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

// ============================================================================
// FLOATING SHAPES COMPONENT
// ============================================================================

const FloatingShape = ({ className, delay = 0, duration = 20 }) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Gradient Orbs */}
    <FloatingShape
      className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-cool-blue/20 to-purple-500/10 rounded-full blur-3xl"
      delay={0}
      duration={25}
    />
    <FloatingShape
      className="absolute top-40 right-[15%] w-96 h-96 bg-gradient-to-br from-blue-400/15 to-indigo-500/10 rounded-full blur-3xl"
      delay={2}
      duration={30}
    />
    <FloatingShape
      className="absolute bottom-20 left-[20%] w-64 h-64 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 rounded-full blur-3xl"
      delay={4}
      duration={22}
    />

    {/* Geometric Shapes */}
    <motion.div
      className="absolute top-32 left-[5%] w-4 h-4 bg-white/20 rounded-full"
      animate={{ y: [0, -40, 0], opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-[60%] right-[8%] w-6 h-6 border-2 border-white/20 rotate-45"
      animate={{ y: [0, 30, 0], rotate: [45, 135, 45] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
    <motion.div
      className="absolute top-[40%] left-[15%] w-3 h-3 bg-cyan-400/30 rounded-full"
      animate={{ y: [0, -25, 0], x: [0, 10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    <motion.div
      className="absolute bottom-[30%] right-[20%] w-8 h-8 border border-white/15 rounded-lg"
      animate={{ y: [0, 20, 0], rotate: [0, 90, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
    />
    <motion.div
      className="absolute top-[25%] right-[30%] w-2 h-2 bg-purple-400/40 rounded-full"
      animate={{ y: [0, -35, 0], scale: [1, 1.5, 1] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.div
      className="absolute bottom-[40%] left-[8%] w-5 h-5 border-2 border-cyan-400/20 rounded-full"
      animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
    />
  </div>
);

// ============================================================================
// HERO SECTION
// ============================================================================

const HeroSection = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-indigo via-[#252a4a] to-deep-indigo" />

      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cool-blue/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
      </div>

      {/* Floating Shapes */}
      <FloatingShapes />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container-custom text-center px-4"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeInDown} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/10">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Premium Quality, Made In-House
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Professional Custom
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Stickers & Magnets
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl mt-4 font-medium text-white/80">
              Printed In-House
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto"
          >
            Free Shipping &bull; Fast Production &bull; Premium Quality
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/design/stickers">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(58, 110, 165, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-cool-blue to-blue-600 text-white font-semibold rounded-xl text-lg shadow-lg shadow-cool-blue/30 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Design Stickers
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cool-blue"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>

            <Link to="/design/magnets">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all"
              >
                <span className="flex items-center gap-2">
                  Design Magnets
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeIn}
            className="mt-12 flex flex-wrap justify-center gap-6 text-white/60 text-sm"
          >
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              No Minimum Order
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              Free Proof Approval
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              Weather Resistant
            </span>
          </motion.div>
        </motion.div>

        {/* Floating Product Mockups */}
        <motion.div
          style={{ y: y1 }}
          className="absolute -left-10 top-1/3 hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [-5, -8, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl flex items-center justify-center"
          >
            <span className="text-6xl">🎨</span>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: y2 }}
          className="absolute -right-5 top-1/2 hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [5, 10, 5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="w-40 h-40 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl flex items-center justify-center"
          >
            <span className="text-5xl">✨</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-white/50"
        >
          <span className="text-xs mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// ============================================================================
// TRUST BAR SECTION
// ============================================================================

const TrustBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const trustItems = [
    { icon: Truck, text: "Free Shipping on All Orders" },
    { icon: Clock, text: "3-5 Day Production" },
    { icon: MapPin, text: "Made in USA" },
    { icon: Shield, text: "100% Satisfaction Guarantee" },
  ];

  return (
    <section ref={ref} className="relative py-6 bg-gradient-to-r from-soft-gray via-white to-soft-gray border-y border-gray-100">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
        >
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="flex items-center justify-center gap-3 py-3"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cool-blue to-deep-indigo rounded-lg flex items-center justify-center shadow-md">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm md:text-base font-medium text-graphite whitespace-nowrap">
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// PRODUCT CATEGORIES SECTION
// ============================================================================

const ProductCard = ({ image, title, description, price, buttonText, link, delay }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <motion.img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Floating Badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: delay + 0.3, type: "spring" }}
          className="absolute top-4 right-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-deep-indigo shadow-md"
        >
          Starting at {price}
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-graphite mb-3 group-hover:text-cool-blue transition-colors">
          {title}
        </h3>
        <p className="text-slate-gray text-sm leading-relaxed mb-6">
          {description}
        </p>

        <Link to={link}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 bg-gradient-to-r from-cool-blue to-deep-indigo text-white font-semibold rounded-xl shadow-md hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2"
          >
            {buttonText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-cool-blue/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

const ProductCategories = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const products = [
    {
      image: "https://m.media-amazon.com/images/I/91OoER+O7xL._AC_SL1500_.jpg",
      title: "Die-Cut Vinyl Stickers",
      description: "Weather-resistant vinyl stickers cut to any shape. Perfect for laptops, water bottles, cars, and more.",
      price: "$18.50",
      buttonText: "Design Your Stickers",
      link: "/design/stickers"
    },
    {
      image: "https://cdn.shopify.com/s/files/1/0530/5892/8802/files/MG_Second_Image.jpg?v=1703793082",
      title: "Die-Cut Magnets",
      description: "Custom shape magnets with strong magnetic backing. Ideal for fridges, cars, and promotional use.",
      price: "$19.43",
      buttonText: "Design Your Magnets",
      link: "/design/magnets"
    },
    {
      image: "https://cdn.shopify.com/s/files/1/0530/5892/8802/files/MGFM_Second_Image.jpg?v=1697563087",
      title: "Premium Fridge Magnets",
      description: "Fixed-size rectangular magnets with thick magnetic backing. Perfect for photos and gifts.",
      price: "$22.34",
      buttonText: "Design Your Magnets",
      link: "/design/fridge-magnets"
    }
  ];

  return (
    <section ref={ref} className="section-padding bg-soft-gray relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-30" />

      <div className="container-custom relative">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-4 py-1 bg-cool-blue/10 text-cool-blue text-sm font-semibold rounded-full mb-4"
          >
            Our Products
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-graphite mb-4"
          >
            Choose Your <span className="gradient-text">Product Type</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-slate-gray text-lg max-w-2xl mx-auto"
          >
            Premium quality products printed in-house with fast turnaround and free shipping
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} delay={index * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// HOW IT WORKS SECTION
// ============================================================================

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: Upload,
      title: "Upload Your Design",
      description: "Upload any image in JPG or PNG format",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Sliders,
      title: "Customize Size & Quantity",
      description: "Choose from 16 sizes and 13 quantity options",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Eye,
      title: "Preview & Order",
      description: "See exactly how your product will look",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Package,
      title: "Fast Delivery",
      description: "Receive your order in 3-5 business days",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section ref={ref} className="section-padding bg-white relative overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-4 py-1 bg-deep-indigo/10 text-deep-indigo text-sm font-semibold rounded-full mb-4"
          >
            Simple Process
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-graphite mb-4">
            How It <span className="gradient-text">Works</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-gray text-lg max-w-2xl mx-auto">
            Get your custom stickers and magnets in just 4 easy steps
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 to-green-500" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Step Number */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center z-10`}
                >
                  <step.icon className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center font-bold text-graphite">
                    {index + 1}
                  </div>
                </motion.div>

                <div className="text-center">
                  <h3 className="text-lg font-bold text-graphite mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-gray text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// VIDEO PLAYER COMPONENT
// ============================================================================

const VideoPlayer = ({ src, title, large = false }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative rounded-2xl overflow-hidden shadow-medium hover:shadow-large transition-all duration-500 bg-graphite ${large ? 'aspect-video' : 'aspect-[4/3]'}`}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <AnimatePresence>
        {(!isPlaying || isHovered) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-graphite" />
              ) : (
                <Play className="w-6 h-6 text-graphite ml-1" />
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h4 className="text-white font-semibold text-sm md:text-base">{title}</h4>
      </div>
    </motion.div>
  );
};

// ============================================================================
// VIDEO GALLERY - MAGNETS
// ============================================================================

const VideoGalleryMagnets = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const videos = [
    {
      src: "https://layout-tool-randr.s3.us-east-1.amazonaws.com/Final+Video.mov",
      title: "Die-Cut Magnets Overview"
    },
    {
      src: "https://layout-tool-randr.s3.us-east-1.amazonaws.com/Video+Feb+09+2023%2C+12+11+14+PM.mov",
      title: "Fridge Magnet Demo"
    },
    {
      src: "https://layout-tool-randr.s3.us-east-1.amazonaws.com/Video+Feb+09+2023%2C+11+43+07+AM.mov",
      title: "Magnet Cutting Process"
    }
  ];

  return (
    <section ref={ref} className="section-padding bg-gradient-to-b from-white to-soft-gray">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-4 py-1 bg-purple-100 text-purple-600 text-sm font-semibold rounded-full mb-4"
          >
            Video Gallery
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-graphite mb-4">
            See Our <span className="gradient-text">Magnets in Action</span>
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <VideoPlayer key={index} {...video} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// VIDEO GALLERY - STICKERS
// ============================================================================

const VideoGalleryStickers = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-soft-gray">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-4 py-1 bg-cyan-100 text-cyan-600 text-sm font-semibold rounded-full mb-4"
          >
            Featured
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-graphite mb-4">
            Premium <span className="gradient-text">Vinyl Stickers</span>
          </motion.h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <VideoPlayer
            src="https://layout-tool-randr.s3.us-east-1.amazonaws.com/Video+Jan+31+2023%2C+1+57+14+PM.mov"
            title="See our vinyl stickers applied to a car - weather resistant and long-lasting"
            large
          />
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// WHY CHOOSE US SECTION
// ============================================================================

const WhyChooseUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Factory,
      title: "In-House Production",
      description: "We manufacture everything ourselves, ensuring quality control at every step",
      color: "bg-blue-500"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free shipping on ALL orders, no minimum purchase required",
      color: "bg-green-500"
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description: "3-5 business days production time, rush options available",
      color: "bg-orange-500"
    },
    {
      icon: Award,
      title: "Premium Materials",
      description: "Weather-resistant vinyl, strong magnetic backing, vibrant colors",
      color: "bg-purple-500"
    }
  ];

  return (
    <section ref={ref} className="section-padding bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cool-blue/5 to-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-4 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-full mb-4"
          >
            Why Choose Us
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-graphite mb-4">
            The <span className="gradient-text">Sticker & Magnet Lab</span> Difference
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-gray text-lg max-w-2xl mx-auto">
            We're not just another print shop - we're craftsmen dedicated to quality
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-large transition-all duration-500"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5 shadow-md`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </motion.div>
              <h3 className="text-lg font-bold text-graphite mb-2 group-hover:text-cool-blue transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-gray text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// COMPARISON SECTION
// ============================================================================

const ComparisonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    { name: "Competitive Pricing", us: true, stickerMule: false, vistaprint: true },
    { name: "Free Shipping", us: true, stickerMule: false, vistaprint: false },
    { name: "3-5 Day Production", us: true, stickerMule: true, vistaprint: false },
    { name: "In-House Production", us: true, stickerMule: true, vistaprint: false },
    { name: "Premium Materials", us: true, stickerMule: true, vistaprint: false },
    { name: "No Minimum Order", us: true, stickerMule: false, vistaprint: false },
    { name: "Custom Die-Cut Shapes", us: true, stickerMule: true, vistaprint: false },
    { name: "Easy Online Designer", us: true, stickerMule: true, vistaprint: true },
  ];

  const CheckIcon = () => (
    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
      <Check className="w-5 h-5 text-green-600" />
    </div>
  );

  const XIcon = () => (
    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto">
      <X className="w-5 h-5 text-red-500" />
    </div>
  );

  return (
    <section ref={ref} className="section-padding bg-gradient-to-b from-soft-gray to-white">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-4 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full mb-4"
          >
            Compare
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-graphite mb-4">
            Why We're <span className="gradient-text">Better</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-gray text-lg max-w-2xl mx-auto">
            See how we stack up against the competition
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-large overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-4 bg-gradient-to-r from-deep-indigo to-cool-blue text-white">
            <div className="p-4 md:p-6 font-semibold text-left">Features</div>
            <div className="p-4 md:p-6 font-bold text-center border-l border-white/20">
              <span className="hidden md:inline">Sticker & Magnet Lab</span>
              <span className="md:hidden">Us</span>
              <div className="text-xs font-normal opacity-80 mt-1 hidden md:block">Our Service</div>
            </div>
            <div className="p-4 md:p-6 font-semibold text-center border-l border-white/20">
              <span className="hidden md:inline">Sticker Mule</span>
              <span className="md:hidden">SM</span>
            </div>
            <div className="p-4 md:p-6 font-semibold text-center border-l border-white/20">
              <span className="hidden md:inline">VistaPrint</span>
              <span className="md:hidden">VP</span>
            </div>
          </div>

          {/* Rows */}
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50/50 transition-colors`}
            >
              <div className="p-4 md:p-5 text-sm md:text-base font-medium text-graphite flex items-center">
                {feature.name}
              </div>
              <div className="p-4 md:p-5 text-center border-l border-gray-100 bg-green-50/30">
                {feature.us ? <CheckIcon /> : <XIcon />}
              </div>
              <div className="p-4 md:p-5 text-center border-l border-gray-100">
                {feature.stickerMule ? <CheckIcon /> : <XIcon />}
              </div>
              <div className="p-4 md:p-5 text-center border-l border-gray-100">
                {feature.vistaprint ? <CheckIcon /> : <XIcon />}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// FAQ SECTION
// ============================================================================

const FAQItem = ({ question, answer, isOpen, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="border-b border-gray-200 last:border-0"
  >
    <button
      onClick={onClick}
      className="w-full py-5 flex items-center justify-between text-left hover:text-cool-blue transition-colors"
    >
      <span className="font-semibold text-graphite pr-4">{question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0"
      >
        <ChevronDown className="w-5 h-5 text-cool-blue" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="pb-5 text-slate-gray leading-relaxed">
            {answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What file formats do you accept?",
      answer: "We accept JPG, PNG, and PDF files. For best results, we recommend high-resolution images (300 DPI or higher) with transparent backgrounds for die-cut products. Our online design tool also supports direct uploads and provides instant previews."
    },
    {
      question: "How long does production take?",
      answer: "Standard production time is 3-5 business days. We also offer rush production options if you need your order faster. Once shipped, delivery typically takes 2-5 business days depending on your location."
    },
    {
      question: "Is shipping really free?",
      answer: "Yes! We offer free standard shipping on ALL orders within the United States. No minimum purchase required, no hidden fees. We believe in transparent pricing and want to make custom stickers and magnets accessible to everyone."
    },
    {
      question: "What's your return policy?",
      answer: "We stand behind our products with a 100% satisfaction guarantee. If you're not completely happy with your order, contact us within 30 days and we'll make it right - either with a reprint or full refund. Your satisfaction is our priority."
    },
    {
      question: "Can I get a sample first?",
      answer: "While we don't offer free samples, our lowest quantity option is very affordable and serves as a great way to test our quality. Many customers order a small batch first to verify colors and quality before placing larger orders."
    },
    {
      question: "What's the minimum order?",
      answer: "We have no minimum order requirement! You can order as few as you need. Whether it's a single sticker for personal use or thousands for a business campaign, we've got you covered with competitive pricing at every quantity level."
    }
  ];

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-4 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full mb-4"
          >
            FAQ
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-graphite mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-gray text-lg max-w-2xl mx-auto">
            Everything you need to know about our products and services
          </motion.p>
        </motion.div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft p-6 md:p-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              {...faq}
              index={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// FINAL CTA SECTION
// ============================================================================

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-indigo via-[#252a4a] to-deep-indigo" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 left-[10%] w-72 h-72 bg-cool-blue/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-10 right-[10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/10 mb-6">
              <Heart className="w-4 h-4 text-red-400" />
              Join thousands of happy customers
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Ready to Create Something
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Amazing?
            </span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/70 mb-10"
          >
            Start designing your custom stickers and magnets today.
            Free shipping, fast production, premium quality guaranteed.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/design/stickers">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(58, 110, 165, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="group px-10 py-5 bg-white text-deep-indigo font-bold rounded-xl text-lg shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2"
              >
                Start Designing Stickers
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link to="/design/magnets">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group px-10 py-5 bg-transparent text-white font-bold rounded-xl text-lg border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all flex items-center justify-center gap-2"
              >
                Design Custom Magnets
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={fadeIn}
            className="mt-12 flex flex-wrap justify-center gap-8 text-white/60"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span>5-Star Reviews</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// SEO COMPONENT
// ============================================================================

const SEO = () => (
  <Helmet>
    {/* Primary Meta Tags */}
    <title>Custom Stickers & Magnets | Professional Printing | Sticker & Magnet Lab</title>
    <meta name="title" content="Custom Stickers & Magnets | Professional Printing | Sticker & Magnet Lab" />
    <meta name="description" content="Create professional custom stickers and magnets with free shipping, 3-5 day production, and premium quality. Design die-cut vinyl stickers and custom magnets online. Made in USA." />
    <meta name="keywords" content="custom stickers, die-cut stickers, vinyl stickers, custom magnets, fridge magnets, car magnets, promotional products, sticker printing, magnet printing" />
    <meta name="robots" content="index, follow" />
    <meta name="language" content="English" />
    <meta name="author" content="Sticker & Magnet Lab" />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://stickermagnetlab.com/" />
    <meta property="og:title" content="Custom Stickers & Magnets | Professional Printing | Sticker & Magnet Lab" />
    <meta property="og:description" content="Create professional custom stickers and magnets with free shipping, 3-5 day production, and premium quality. Design online today!" />
    <meta property="og:image" content="https://stickermagnetlab.com/og-image.jpg" />
    <meta property="og:site_name" content="Sticker & Magnet Lab" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://stickermagnetlab.com/" />
    <meta name="twitter:title" content="Custom Stickers & Magnets | Sticker & Magnet Lab" />
    <meta name="twitter:description" content="Create professional custom stickers and magnets with free shipping and fast production." />
    <meta name="twitter:image" content="https://stickermagnetlab.com/twitter-image.jpg" />

    {/* Canonical URL */}
    <link rel="canonical" href="https://stickermagnetlab.com/" />

    {/* Structured Data - Organization */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Sticker & Magnet Lab",
        "url": "https://stickermagnetlab.com",
        "logo": "https://stickermagnetlab.com/logo.png",
        "description": "Professional custom sticker and magnet printing services",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": "English"
        },
        "sameAs": []
      })}
    </script>

    {/* Structured Data - Product */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Custom Die-Cut Vinyl Stickers",
        "description": "Weather-resistant vinyl stickers cut to any shape. Perfect for laptops, water bottles, cars, and more.",
        "brand": {
          "@type": "Brand",
          "name": "Sticker & Magnet Lab"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": "18.50",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock",
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "USD"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 3,
                "maxValue": 5,
                "unitCode": "DAY"
              }
            }
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "1250"
        }
      })}
    </script>

    {/* Structured Data - LocalBusiness */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Sticker & Magnet Lab",
        "@id": "https://stickermagnetlab.com",
        "url": "https://stickermagnetlab.com",
        "priceRange": "$",
        "image": "https://stickermagnetlab.com/storefront.jpg",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      })}
    </script>
  </Helmet>
);

// ============================================================================
// MAIN HOME COMPONENT
// ============================================================================

const Home = () => {
  return (
    <>
      <SEO />
      <main className="overflow-hidden">
        <HeroSection />
        <TrustBar />
        <ProductCategories />
        <HowItWorks />
        <VideoGalleryMagnets />
        <VideoGalleryStickers />
        <WhyChooseUs />
        <ComparisonSection />
        <FAQSection />
        <CTASection />
      </main>
    </>
  );
};

export default Home;
