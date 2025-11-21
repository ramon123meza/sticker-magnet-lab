// Product Data for Sticker & Magnet Lab

export const SIZES = {
  dieCut: [
    '2x2', '3x3', '4x4', '5x5', '6x6', '7x7', '8x8', '9x9', '10x10',
    '11x11', '12x12', '14x14', '16x16', '18x18', '20x20', '22x22'
  ],
  fridge: ['2x3', '2.5x3.5', '4.75x2', '2.5x2.5']
};

export const QUANTITIES = [12, 25, 50, 75, 100, 200, 300, 600, 1000, 2000, 3000, 6000, 10000];

// Base pricing for Die-Cut Stickers (per size in inches)
export const STICKER_PRICES = {
  '2x2': { 12: 15.50, 25: 27.00, 50: 40.00, 75: 55.00, 100: 65.00, 200: 110.00, 300: 150.00, 600: 260.00, 1000: 380.00, 2000: 680.00, 3000: 950.00, 6000: 1750.00, 10000: 2700.00 },
  '3x3': { 12: 19.50, 25: 34.00, 50: 50.00, 75: 68.00, 100: 80.00, 200: 135.00, 300: 185.00, 600: 320.00, 1000: 420.00, 2000: 750.00, 3000: 1050.00, 6000: 1950.00, 10000: 3000.00 },
  '4x4': { 12: 23.50, 25: 41.00, 50: 61.00, 75: 82.00, 100: 95.00, 200: 160.00, 300: 220.00, 600: 380.00, 1000: 465.00, 2000: 830.00, 3000: 1160.00, 6000: 2150.00, 10000: 3300.00 },
  '5x5': { 12: 27.75, 25: 48.45, 50: 71.25, 75: 96.00, 100: 107.35, 200: 180.00, 300: 247.00, 600: 425.00, 1000: 389.85, 2000: 920.00, 3000: 1280.00, 6000: 2380.00, 10000: 3650.00 },
  '6x6': { 12: 32.00, 25: 56.00, 50: 82.00, 75: 110.00, 100: 125.00, 200: 210.00, 300: 290.00, 600: 500.00, 1000: 600.00, 2000: 1080.00, 3000: 1500.00, 6000: 2800.00, 10000: 4300.00 },
  '7x7': { 12: 36.50, 25: 64.00, 50: 94.00, 75: 126.00, 100: 145.00, 200: 245.00, 300: 335.00, 600: 580.00, 1000: 700.00, 2000: 1260.00, 3000: 1750.00, 6000: 3250.00, 10000: 5000.00 },
  '8x8': { 12: 41.00, 25: 72.00, 50: 106.00, 75: 142.00, 100: 165.00, 200: 280.00, 300: 385.00, 600: 665.00, 1000: 810.00, 2000: 1460.00, 3000: 2030.00, 6000: 3780.00, 10000: 5800.00 },
  '9x9': { 12: 46.00, 25: 80.50, 50: 118.50, 75: 160.00, 100: 186.00, 200: 315.00, 300: 435.00, 600: 750.00, 1000: 920.00, 2000: 1660.00, 3000: 2310.00, 6000: 4300.00, 10000: 6600.00 },
  '10x10': { 12: 51.00, 25: 89.25, 50: 131.50, 75: 177.50, 100: 207.00, 200: 350.00, 300: 485.00, 600: 840.00, 1000: 1030.00, 2000: 1860.00, 3000: 2600.00, 6000: 4830.00, 10000: 7420.00 },
  '11x11': { 12: 56.50, 25: 99.00, 50: 146.00, 75: 197.00, 100: 230.00, 200: 390.00, 300: 540.00, 600: 935.00, 1000: 1150.00, 2000: 2080.00, 3000: 2900.00, 6000: 5390.00, 10000: 8280.00 },
  '12x12': { 12: 62.00, 25: 109.00, 50: 160.50, 75: 217.00, 100: 253.00, 200: 430.00, 300: 595.00, 600: 1030.00, 1000: 1270.00, 2000: 2300.00, 3000: 3200.00, 6000: 5960.00, 10000: 9160.00 },
  '14x14': { 12: 74.00, 25: 130.00, 50: 191.50, 75: 259.00, 100: 302.00, 200: 515.00, 300: 710.00, 600: 1230.00, 1000: 1520.00, 2000: 2750.00, 3000: 3830.00, 6000: 7130.00, 10000: 10960.00 },
  '16x16': { 12: 87.00, 25: 152.50, 50: 225.00, 75: 304.00, 100: 355.00, 200: 605.00, 300: 835.00, 600: 1450.00, 1000: 1790.00, 2000: 3240.00, 3000: 4510.00, 6000: 8400.00, 10000: 12910.00 },
  '18x18': { 12: 100.50, 25: 176.50, 50: 260.00, 75: 351.50, 100: 410.50, 200: 700.00, 300: 965.00, 600: 1675.00, 1000: 2070.00, 2000: 3745.00, 3000: 5215.00, 6000: 9710.00, 10000: 14930.00 },
  '20x20': { 12: 115.00, 25: 202.00, 50: 298.00, 75: 402.50, 100: 470.00, 200: 800.00, 300: 1105.00, 600: 1920.00, 1000: 2375.00, 2000: 4300.00, 3000: 5990.00, 6000: 11150.00, 10000: 17140.00 },
  '22x22': { 12: 130.50, 25: 229.00, 50: 337.50, 75: 456.00, 100: 533.00, 200: 910.00, 300: 1255.00, 600: 2180.00, 1000: 2700.00, 2000: 4890.00, 3000: 6810.00, 6000: 12680.00, 10000: 19490.00 }
};

// Die-Cut Magnet prices (same as stickers + 10% markup)
export const MAGNET_PRICES = Object.fromEntries(
  Object.entries(STICKER_PRICES).map(([size, quantities]) => [
    size,
    Object.fromEntries(
      Object.entries(quantities).map(([qty, price]) => [qty, Math.round(price * 1.10 * 100) / 100])
    )
  ])
);

// Fridge Magnet prices (Die-cut magnet equivalent + 15% markup)
export const FRIDGE_MAGNET_PRICES = {
  '2x3': Object.fromEntries(
    Object.entries(STICKER_PRICES['3x3']).map(([qty, price]) => [qty, Math.round(price * 1.25 * 100) / 100])
  ),
  '2.5x3.5': Object.fromEntries(
    Object.entries(STICKER_PRICES['4x4']).map(([qty, price]) => [qty, Math.round(price * 1.25 * 100) / 100])
  ),
  '4.75x2': Object.fromEntries(
    Object.entries(STICKER_PRICES['5x5']).map(([qty, price]) => [qty, Math.round(price * 1.25 * 100) / 100])
  ),
  '2.5x2.5': Object.fromEntries(
    Object.entries(STICKER_PRICES['3x3']).map(([qty, price]) => [qty, Math.round(price * 1.25 * 100) / 100])
  )
};

// Product definitions
export const products = [
  {
    id: 'die-cut-stickers',
    slug: 'die-cut-stickers',
    name: 'Die-Cut Stickers',
    shortName: 'Stickers',
    category: 'stickers',
    type: 'die-cut',
    description: 'High Quality Vinyl - Weather resistant, sun and rain proof, very durable outdoors',
    shortDescription: 'Premium vinyl stickers cut to any shape',
    features: ['Vibrant Printing', 'Easy to Apply', 'Multi Use'],
    detailedFeatures: [
      { title: 'Vibrant Printing', description: 'Full-color digital printing with vivid, eye-catching results' },
      { title: 'Easy to Apply', description: 'Peel-and-stick application with no residue when removed' },
      { title: 'Multi Use', description: 'Perfect for laptops, water bottles, cars, windows, and more' }
    ],
    images: [
      'https://m.media-amazon.com/images/I/91OoER+O7xL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81Lte6iULWL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/91AecVqtbRL._AC_SL1500_.jpg'
    ],
    sizes: SIZES.dieCut,
    quantities: QUANTITIES,
    prices: STICKER_PRICES,
    startingPrice: 15.50,
    material: 'Premium Vinyl',
    finish: 'Glossy',
    durability: '3-5 years outdoor',
    waterproof: true,
    customizable: true
  },
  {
    id: 'die-cut-magnets',
    slug: 'die-cut-magnets',
    name: 'Die-Cut Magnets',
    shortName: 'Die-Cut Magnets',
    category: 'magnets',
    type: 'die-cut',
    description: 'Durable Magnet - Wear resistant material with solid, stiff magnetic backing',
    shortDescription: 'Custom shaped magnets with strong magnetic hold',
    features: ['Vibrant Printing', 'Strong Hold', 'Multi Use'],
    detailedFeatures: [
      { title: 'Vibrant Printing', description: 'High-quality full-color printing that won\'t fade' },
      { title: 'Strong Hold', description: 'Powerful magnetic backing holds firmly to any metal surface' },
      { title: 'Multi Use', description: 'Great for cars, refrigerators, filing cabinets, and more' }
    ],
    images: [
      'https://cdn.shopify.com/s/files/1/0530/5892/8802/files/MG_Second_Image.jpg',
      'https://cdn.shopify.com/s/files/1/0530/5892/8802/files/MG_Third_Image.jpg',
      'https://cdn.shopify.com/s/files/1/0530/5892/8802/files/MG_Fourth_Image.jpg'
    ],
    sizes: SIZES.dieCut,
    quantities: QUANTITIES,
    prices: MAGNET_PRICES,
    startingPrice: 17.05,
    material: 'Premium Magnetic Material',
    finish: 'Matte',
    durability: '5+ years',
    waterproof: true,
    customizable: true
  },
  {
    id: 'fridge-magnets',
    slug: 'fridge-magnets',
    name: 'Fridge Magnets',
    shortName: 'Fridge Magnets',
    category: 'magnets',
    type: 'fridge',
    description: 'Classic rectangular fridge magnets with premium magnetic backing - perfect for photos, artwork, and promotional items',
    shortDescription: 'Traditional rectangular magnets in popular sizes',
    features: ['Fixed Sizes', 'Premium Quality', 'Perfect for Photos'],
    detailedFeatures: [
      { title: 'Fixed Sizes', description: 'Four popular sizes perfect for standard photos and designs' },
      { title: 'Premium Quality', description: 'Thick, durable magnetic material with crisp printing' },
      { title: 'Perfect for Photos', description: 'Ideal for photo magnets, save-the-dates, and promotional items' }
    ],
    images: [
      'https://cdn.shopify.com/s/files/1/0530/5892/8802/files/MGFM_Second_Image.jpg',
      'https://cdn.shopify.com/s/files/1/0530/5892/8802/files/MGFM_Third_Image.jpg',
      'https://cdn.shopify.com/s/files/1/0530/5892/8802/files/MGFM_Fourth_Image.jpg'
    ],
    sizes: SIZES.fridge,
    quantities: QUANTITIES,
    prices: FRIDGE_MAGNET_PRICES,
    startingPrice: 24.38,
    material: 'Premium Magnetic Material',
    finish: 'Glossy',
    durability: '5+ years',
    waterproof: false,
    customizable: true
  }
];

// Helper functions
export const getProductBySlug = (slug) => products.find(p => p.slug === slug);
export const getProductById = (id) => products.find(p => p.id === id);
export const getProductsByCategory = (category) => products.filter(p => p.category === category);

export const getPrice = (product, size, quantity) => {
  if (!product || !product.prices[size] || !product.prices[size][quantity]) {
    return null;
  }
  return product.prices[size][quantity];
};

export const getPricePerUnit = (product, size, quantity) => {
  const total = getPrice(product, size, quantity);
  if (!total) return null;
  return Math.round((total / quantity) * 100) / 100;
};

export const getSavings = (product, size, quantity) => {
  const currentPrice = getPrice(product, size, quantity);
  const basePrice = getPrice(product, size, 12);
  if (!currentPrice || !basePrice) return null;

  const basePricePerUnit = basePrice / 12;
  const currentPricePerUnit = currentPrice / quantity;
  const savingsPercent = Math.round((1 - currentPricePerUnit / basePricePerUnit) * 100);

  return savingsPercent > 0 ? savingsPercent : 0;
};

export const formatPrice = (price) => {
  if (price === null || price === undefined) return '--';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export default products;
