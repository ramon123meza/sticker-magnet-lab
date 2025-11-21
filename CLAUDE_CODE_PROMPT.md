# Sticker & Magnet Lab - Production-Ready E-Commerce Application

## Project Overview
Build a professional, production-ready custom sticker and magnet e-commerce platform called **"Sticker & Magnet Lab"** with suggested domain: **stickersmagnetlab.com**. This application should compete directly with industry leaders like Sticker Mule, offering custom die-cut stickers, die-cut magnets, and fixed-size fridge magnets with a modern, intuitive user experience.

## Tech Stack Requirements

### Frontend
- **Framework**: Vite + React 18+ with modern hooks
- **Styling**: Tailwind CSS for responsive, mobile-first design
- **State Management**: React Context API or Zustand for shopping cart and session management
- **Image Handling**: 
  - HTML5 Canvas API or Fabric.js for interactive image editor
  - Browser-based image compression (browser-image-compression library)
  - Client-side image validation and resizing
- **Routing**: React Router v6
- **Icons**: Lucide React or React Icons
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with optimized production build settings

### Backend Architecture (AWS Serverless)
- **API Gateway**: REST API endpoints
- **Lambda Functions**: Python 3.11+ runtime
- **Database**: DynamoDB for all data persistence
- **Storage**: S3 bucket `layout-tool-randr` for image uploads
- **Email**: AWS SES for transactional emails
- **Authentication**: Session-based (no user accounts required - guest checkout only)

### File Structure to Generate
```
/frontend
  /src
    /components
      /common (Button, Input, Select, Modal, etc.)
      /layout (Header, Footer, Navigation)
      /product (ProductCard, ProductGrid, ProductDetail)
      /cart (CartDrawer, CartItem, CartSummary)
      /editor (ImageCanvas, SizeSelector, QuantitySelector, InstructionsInput)
      /checkout (CheckoutForm, AddressForm, PaymentPlaceholder)
    /contexts (CartContext, SessionContext)
    /hooks (useCart, useImageUpload, useProducts)
    /pages (Home, ProductListing, CustomizerPage, Cart, Checkout, Contact, ThankYou)
    /services (api.js with Lambda endpoint placeholders)
    /utils (imageCompression, validation, pricing)
    /assets (logo, icons)
    App.jsx
    main.jsx
  vite.config.js
  tailwind.config.js
  package.json

/backend
  /lambda_functions
    create_order.py
    send_order_confirmation.py
    upload_image_to_s3.py
    get_products.py
    get_pricing.py
    contact_form.py
  database_setup.py
  requirements.txt
  
/docs
  API_ENDPOINTS.md
  DEPLOYMENT_GUIDE.md
  DATABASE_SCHEMA.md
```

---

## Core Functionality Requirements

### 1. Product Catalog System

#### Product Types
**A. Die-Cut Stickers** (Vinyl Decal Stickers)
- Custom sizes from 2" to 22" (2x2, 3x3, 4x4, 5x5, 6x6, 7x7, 8x8, 9x9, 10x10, 11x11, 12x12, 14x14, 16x16, 18x18, 20x20, 22x22)
- User uploads artwork and system automatically cuts to shape
- Quantity packages: 12, 25, 50, 75, 100, 200, 300, 600, 1000, 2000, 3000, 6000, 10000
- Weather-resistant vinyl material
- **Pricing**: Use exact values from `DIE CUT STICKERS PRICING` section in size-price.csv

**B. Die-Cut Magnets**
- Same sizes and quantities as stickers
- Strong magnetic backing
- **Pricing**: Use exact values from `DIE CUT MAGNETS PRICING` section in size-price.csv

**C. Fixed-Size Fridge Magnets** (Premium rectangular magnets)
- **2x3 Inch Fridge Magnet** (fixed rectangular canvas)
- **2.5" x 3.5" Refrigerator Magnet** (fixed rectangular canvas)
- **4.75" x 2" Fridge Magnet** (fixed rectangular canvas)
- **2.5" x 2.5" Fridge Magnet** (fixed square canvas)
- Same quantity packages as die-cut products
- **Pricing**: 15% markup over die-cut magnet prices (calculate dynamically based on closest size)
- Thicker magnetic backing than die-cut magnets

#### Product Data Integration
- Use `product_information.csv` for product descriptions, bullet points, and image galleries
- Each product should have a dedicated product detail page with:
  - High-quality product images (image1, image2, image3 from CSV)
  - Generic description adapted for Sticker & Magnet Lab branding
  - Three key bullet points highlighting features
  - Clear call-to-action buttons

### 2. Advanced Image Canvas Editor

#### Canvas Requirements
- **Interactive Design Area**: Users can upload images (.jpg, .png only) and manipulate them
- **Smart Auto-Fit**: System intelligently centers and scales uploaded images to fit selected size
- **Manual Adjustment Controls**:
  - Drag to reposition image within canvas
  - Scale slider (zoom in/out while maintaining aspect ratio)
  - Rotate control (90-degree increments)
  - Reset button to restore auto-fit
- **Real-Time Preview**: Show mockup with selected product type and size proportions
- **Canvas Sizing**:
  - Die-cut products: Square canvas matching selected dimensions
  - Fixed fridge magnets: Rectangular canvas matching exact product dimensions (e.g., 2x3 aspect ratio)
- **Visual Feedback**:
  - Dashed borders showing print area
  - Grid overlay option for alignment
  - Zoom controls for detailed editing

#### Image Processing Requirements
- **Client-Side Validation**:
  - Only accept .jpg, .jpeg, .png formats
  - Minimum resolution: 300 DPI equivalent for selected size
  - Display warning if resolution is too low
- **Automatic Compression**:
  - If uploaded image > 10MB, automatically compress to ~9MB
  - Maintain visual quality (target 85-90% quality)
  - Use progressive compression with browser-image-compression library
  - Show compression progress indicator
- **Upload to S3**:
  - Generate unique filename: `{session_id}_{timestamp}_{product_type}.png`
  - Store in `layout-tool-randr` bucket under `/orders/` prefix
  - Return S3 URL to store in order data

### 3. Dynamic Pricing System

#### Pricing Logic
- **Real-Time Price Calculation**: Update total price instantly when user changes:
  - Product type (sticker/die-cut magnet/fridge magnet)
  - Size selection
  - Quantity package
- **Price Display**:
  - Show unit price and total package price
  - Display "Price per piece: $X.XX" for transparency
  - Show bulk discount savings (e.g., "Save 35% with 100 qty vs 12 qty")
- **DynamoDB Pricing Tables**:
  - `products`: Product metadata and base information
  - `pricing_stickers`: Size/quantity matrix from CSV
  - `pricing_magnets`: Size/quantity matrix from CSV
  - `pricing_fridge_magnets`: Calculated 15% markup prices

### 4. Multi-Item Shopping Cart

#### Cart Functionality
- **Session-Based Persistence**: Use session storage to maintain cart across page refreshes
- **Add to Cart Flow**:
  1. User completes customization (upload, size, qty, instructions)
  2. Click "Add to Cart" - smooth animation moves item to cart icon
  3. Cart badge updates with item count
  4. User can continue shopping or proceed to checkout
- **Cart Drawer/Page**:
  - Display thumbnail of uploaded artwork
  - Show product type, size, quantity, price per item
  - Include optional instructions field (editable)
  - Update quantity or remove items
  - Show cart subtotal and "Free Shipping" badge
  - "Continue Shopping" and "Proceed to Checkout" buttons
- **Cart State Management**:
  - Each cart item structure:
    ```javascript
    {
      id: uuid(),
      productType: 'die-cut-sticker',
      size: '5x5',
      quantity: 100,
      price: 107.35,
      imageUrl: 's3://...',
      imageData: base64Thumbnail, // for quick display
      instructions: 'Optional custom instructions...',
      addedAt: timestamp
    }
    ```

### 5. Guest Checkout System

#### Checkout Requirements
- **No Login Required**: All purchases as guest
- **Checkout Form Fields**:
  - Full Name (required)
  - Email Address (required, validated)
  - Phone Number (required, formatted)
  - Shipping Address:
    - Street Address (required)
    - Apartment/Suite (optional)
    - City (required)
    - State (dropdown, required)
    - ZIP Code (required, validated)
    - Country (default: USA)
- **Order Review Section**:
  - Summary of all cart items with thumbnails
  - Itemized pricing breakdown
  - Subtotal
  - Shipping: **FREE** (prominently displayed)
  - Total Amount Due
- **Payment Section** (PLACEHOLDER FOR NOW):
  - Display Stripe Elements UI mockup
  - Show "Payment processing will be enabled soon" message
  - Include placeholder for Stripe integration:
    ```javascript
    // TODO: Integrate Stripe
    // const stripe = loadStripe('pk_test_...');
    // const elements = stripe.elements();
    ```
  - For now: "Place Order" button submits order without payment

### 6. Order Processing Workflow

#### Order Submission (Lambda: `create_order.py`)
- Generate unique order ID: `SLMAG-{timestamp}-{random}`
- Create DynamoDB order record:
  ```python
  {
    'orderId': 'SLMAG-1234567890-ABC',
    'orderDate': '2025-01-15T10:30:00Z',
    'status': 'pending_payment',
    'customerInfo': {
      'name': 'John Doe',
      'email': 'john@example.com',
      'phone': '555-0123',
      'shippingAddress': {...}
    },
    'items': [
      {
        'productType': 'die-cut-sticker',
        'size': '5x5',
        'quantity': 100,
        'unitPrice': 1.07,
        'totalPrice': 107.35,
        'artworkS3Url': 's3://layout-tool-randr/orders/...',
        'instructions': '...'
      }
    ],
    'subtotal': 214.70,
    'shipping': 0.00,
    'total': 214.70,
    'paymentStatus': 'placeholder',
    'createdAt': timestamp
  }
  ```

#### Email Notifications (Lambda: `send_order_confirmation.py`)
**Using AWS SES:**
- **Sender**: orders@rrinconline.com
- **Customer Email**:
  - Subject: "Order Confirmation - Sticker & Magnet Lab"
  - Include order number, items summary, artwork thumbnails, total
  - Estimated production time (3-5 business days)
  - Contact information
- **Staff Notification Emails** (sent to both):
  - arturo@rrinconline.com
  - ramonecardonna@gmail.com
  - Subject: "New Order - SLMAG-XXXXX"
  - Full order details including customer info
  - Direct S3 links to all uploaded artwork files (pre-signed URLs, valid 7 days)
  - Shipping address
  - Special instructions if provided

### 7. Contact Form

#### Contact Page (Lambda: `contact_form.py`)
- **Form Fields**:
  - Name (required)
  - Email (required, validated)
  - Subject (dropdown: General Inquiry, Order Question, Custom Request, Technical Support)
  - Message (textarea, required, min 20 characters)
  - reCAPTCHA v3 (optional but recommended)
- **Email Routing**:
  - Send to both staff emails (arturo@rrinconline.com, ramonecardonna@gmail.com)
  - Auto-reply to customer confirming message received
  - Include submission timestamp and reference number

---

## Frontend Design Guidelines

### Brand Identity
- **Logo**: Use https://layout-tool-randr.s3.us-east-1.amazonaws.com/logo_sticker_magnet_lab.png as primary logo
- **Color Scheme**: 
🎨 Palette A — “Modern Premium Tech” (Highly Recommended)

Perfect for a sleek, professional, trustworthy design.

Primary Colors

Deep Indigo – #1B1F3B
(Brand main color, premium, strong, perfect for headers)

Cool Blue – #3A6EA5
(Highlight color, call-to-action buttons, accents)

Secondary Colors

Soft Sky – #D7E8FF
(Light backgrounds, cards, product sections)

Slate Gray – #4B5563
(Subheadings, icons, secondary text)

Neutral Base

Pure White – #FFFFFF

Soft Gray – #F4F5F7

Graphite – #111827
(Optional dark mode background)

Why this palette works

Balances premium + modern

Blue tones emphasize trust and precision (perfect for printing services)

Light neutrals make colorful product artwork shine

Works well with minimalistic typography logos
- **Typography**:
  - Headings: Bold, modern sans-serif (Inter, Poppins)
  - Body: Clean, readable (Inter, system fonts)
  - Maintain WCAG AA accessibility standards

### Page Layouts

#### Homepage
- **Hero Section**:
  - Large headline: "Professional Custom Stickers & Magnets - Printed In-House"
  - Subheadline: "Free Shipping • Fast Production • Premium Quality"
  - CTA buttons: "Design Stickers" | "Design Magnets"
  - Background: Subtle geometric pattern or gradient
- **Product Categories** (3 cards):
  - Die-Cut Vinyl Stickers
  - Die-Cut Magnets
  - Premium Fridge Magnets
  - Each card: image, description, "Get Started" button
- **Video Gallery Section**:
  - **Magnets Showcase**:
    - Title: "See Our Magnets in Action"
    - Grid of 3 videos:
      1. Die-cut magnets overview: https://layout-tool-randr.s3.us-east-1.amazonaws.com/Final+Video.mov
      2. Fridge magnet demo: https://layout-tool-randr.s3.us-east-1.amazonaws.com/Video+Feb+09+2023%2C+12+11+14+PM.mov
      3. Magnet cutting process: https://layout-tool-randr.s3.us-east-1.amazonaws.com/Video+Feb+09+2023%2C+11+43+07+AM.mov
  - **Stickers Showcase**:
    - Title: "Premium Vinyl Stickers"
    - Video: Car sticker application: https://layout-tool-randr.s3.us-east-1.amazonaws.com/Video+Jan+31+2023%2C+1+57+14+PM.mov
  - Videos should have play/pause controls, be muted by default
- **Why Choose Us Section** (4 columns):
  - In-House Production
  - Free Shipping on All Orders
  - Fast Turnaround (3-5 days)
  - Premium Materials
- **Comparison Section**:
  - "Why We're Better Than [Sticker Mule, VistaPrint, etc.]"
  - Side-by-side table: pricing, production time, quality
- **Trust Badges**: SSL secure, satisfaction guarantee

#### Product Listing Pages
- Grid layout of product cards
- Each card: product image, title, starting price, "Customize" button
- Filters: Product type, size range, quantity
- Sort by: Price, Popularity

#### Product Detail Page
- Large image gallery (3 images from CSV)
- Product name and description
- Key features (bullet points from CSV)
- Price calculator preview
- "Start Customizing" CTA
- Related products section

#### Customizer/Editor Page (MAIN APPLICATION)
- **Left Panel** (30% width):
  - Product type selector (tabs)
  - Size dropdown (with visual size reference)
  - Quantity package selector (show per-piece price)
  - Current price display (large, bold)
  - Additional instructions (expandable textarea)
  - "Add to Cart" button (sticky at bottom)
- **Center Canvas** (50% width):
  - Interactive image editor
  - Zoom controls (+/- buttons)
  - Rotation controls
  - Reset button
  - Download preview button
- **Right Panel** (20% width):
  - Upload area (drag & drop or click)
  - File requirements notice
  - Uploaded image thumbnail list (if multiple designs)
  - Tips & guidelines

#### Cart Page
- Full-page cart view
- Each item: thumbnail, details, price, quantity, remove
- Order summary sidebar
- "Continue Shopping" and "Checkout" buttons

#### Checkout Page
- Two-column layout:
  - Left: Shipping form
  - Right: Order summary (sticky)
- Progress indicator (Shipping → Payment → Confirmation)
- Trust badges near payment section

#### Thank You Page (Post-Order)
- Order confirmation number
- Expected ship date
- Email confirmation notice
- "Track Order" placeholder
- "Continue Shopping" link

### Mobile Responsiveness
- Hamburger navigation on mobile
- Stacked single-column layouts
- Touch-optimized canvas controls
- Bottom sheet for cart on mobile
- Ensure all CTAs are thumb-friendly (min 44px height)

---

## SEO Optimization Requirements

### On-Page SEO
- **Meta Tags** for every page:
  ```html
  <title>Custom Stickers & Magnets | Free Shipping | Sticker & Magnet Lab</title>
  <meta name="description" content="Professional custom die-cut stickers and magnets. In-house production, free shipping, 3-5 day turnaround. Better quality than Sticker Mule. Order now!">
  <meta name="keywords" content="custom stickers, die cut stickers, vinyl stickers, custom magnets, fridge magnets, sticker printing, cheap stickers, sticker mule alternative">
  ```
- **Structured Data** (JSON-LD):
  - Product schema for all products
  - Organization schema
  - Breadcrumb schema
  - Review schema (prepare for future)
- **Heading Hierarchy**:
  - One H1 per page (main title)
  - Logical H2, H3 structure
  - Include target keywords naturally
- **Image Optimization**:
  - All images have descriptive alt text
  - Use WebP format with fallbacks
  - Lazy loading for below-fold images
  - Responsive images with srcset
- **URL Structure**:
  - `/stickers/die-cut` - Die-cut stickers
  - `/magnets/die-cut` - Die-cut magnets
  - `/magnets/fridge` - Fridge magnets
  - `/customize/[product-type]` - Customizer
  - `/cart`, `/checkout`, `/contact`
- **Internal Linking**:
  - Link product pages to each other
  - Breadcrumb navigation
  - Related products sections
- **Content Strategy**:
  - Include competitor keywords: "sticker mule alternative", "better than vistaprint", "cheap custom stickers"
  - Use long-tail keywords: "custom die cut vinyl stickers", "waterproof outdoor stickers", "bulk magnet printing"
  - Add FAQ section on homepage

### Technical SEO
- **Performance**:
  - Lighthouse score target: 90+ (Performance, Accessibility, Best Practices, SEO)
  - Code splitting with React.lazy()
  - Minify CSS/JS in production build
  - Enable Gzip/Brotli compression
- **sitemap.xml** generation
- **robots.txt** with proper directives
- **Open Graph tags** for social sharing
- **Canonical URLs** on all pages
- **Page Speed**: Optimize for Core Web Vitals (LCP, FID, CLS)

---

## Backend Implementation Details

### Lambda Functions

#### 1. `get_products.py`
```python
# Returns all products from DynamoDB products table
# Endpoint: GET /api/products
# Optional query params: ?type=sticker|magnet|fridge
```

#### 2. `get_pricing.py`
```python
# Returns pricing matrix for specific product type and size
# Endpoint: GET /api/pricing?type=sticker&size=5x5
# Returns all quantity tiers with prices
```

#### 3. `upload_image_to_s3.py`
```python
# Handles image upload to S3
# Endpoint: POST /api/upload
# Accepts base64 encoded image
# Returns S3 URL
# Generates unique filename with session ID
```

#### 4. `create_order.py`
```python
# Creates order record in DynamoDB
# Endpoint: POST /api/orders
# Accepts full order payload
# Returns order ID and confirmation
# Triggers email notification function
```

#### 5. `send_order_confirmation.py`
```python
# Sends emails via SES
# Triggered by create_order Lambda
# Sends to customer + both staff emails
# Includes order details and S3 artwork links
```

#### 6. `contact_form.py`
```python
# Processes contact form submissions
# Endpoint: POST /api/contact
# Sends email to staff
# Returns success confirmation
```

### DynamoDB Schema

#### Table: `products`
```
Partition Key: productId (String)
Attributes:
  - productType: String (sticker, magnet-diecut, magnet-fridge)
  - name: String
  - description: String
  - bulletPoints: List
  - images: List
  - availableSizes: List (for die-cut) or fixedSize: String (for fridge)
  - basePrice: Number
```

#### Table: `pricing_stickers`
```
Partition Key: size (String) e.g., "5x5"
Sort Key: quantity (Number) e.g., 100
Attributes:
  - price: Number (from CSV)
```

#### Table: `pricing_magnets`
```
Same structure as pricing_stickers
```

#### Table: `orders`
```
Partition Key: orderId (String)
Attributes:
  - orderDate: String (ISO timestamp)
  - status: String
  - customerInfo: Map
  - items: List
  - subtotal: Number
  - shipping: Number
  - total: Number
  - paymentStatus: String
  - createdAt: Number (Unix timestamp)
  - updatedAt: Number
```

### database_setup.py Script
```python
"""
Run locally with AWS credentials configured:
python database_setup.py

Creates all DynamoDB tables and populates with data from CSVs
"""
import boto3
import csv
import json
from decimal import Decimal

# Script should:
# 1. Create all tables if they don't exist
# 2. Read product_information.csv and populate products table
# 3. Read size-price.csv and populate pricing tables
# 4. Calculate and populate fridge magnet pricing (15% markup)
# 5. Verify all data inserted correctly
# 6. Print summary of created resources
```

### api.js (Frontend Service)
```javascript
// src/services/api.js
const API_ENDPOINTS = {
  products: 'REPLACE_WITH_LAMBDA_URL', // get_products
  pricing: 'REPLACE_WITH_LAMBDA_URL',  // get_pricing
  upload: 'REPLACE_WITH_LAMBDA_URL',   // upload_image_to_s3
  orders: 'REPLACE_WITH_LAMBDA_URL',   // create_order
  contact: 'REPLACE_WITH_LAMBDA_URL'   // contact_form
};

// Provide wrapper functions for all API calls
export const api = {
  getProducts: async (type) => { /* ... */ },
  getPricing: async (type, size) => { /* ... */ },
  uploadImage: async (imageFile) => { /* ... */ },
  createOrder: async (orderData) => { /* ... */ },
  submitContact: async (formData) => { /* ... */ }
};
```

---

## Company Information & Footer

### Footer Content
- **Company Section**:
  - Parent Company: R and R Imports INC
  - Address: 5271 Lee Hwy, Troutville VA 24017
  - Email: orders@rrinconline.com
  - Phone: 276-706-0463
- **Links Section**:
  - About Us
  - Contact
  - Shipping & Returns (placeholder page)
  - Privacy Policy (placeholder page)
  - Terms of Service (placeholder page)
- **Our Products Section**:
  - Die-Cut Stickers
  - Die-Cut Magnets
  - Fridge Magnets
- **Other Products**:
  - Visit our parent company: [www.rrinconline.com](https://www.rrinconline.com)
- **Social Media Icons** (placeholder for future):
  - Facebook, Instagram, Twitter
- **Copyright**: © 2025 Sticker & Magnet Lab. A division of R and R Imports INC. All rights reserved.

---

## Development Priorities

### Phase 1: Core Frontend (Build This Now)
1. ✅ Project setup with Vite + React + Tailwind
2. ✅ Component library (buttons, inputs, cards, modals)
3. ✅ Layout components (Header, Footer, Navigation)
4. ✅ Homepage with hero, product categories, video galleries
5. ✅ Product listing pages with filtering
6. ✅ Product detail pages with image galleries
7. ✅ Advanced canvas-based image editor with:
   - Upload functionality
   - Drag, scale, rotate controls
   - Real-time preview
   - Client-side image compression (for files > 10MB)
8. ✅ Dynamic size/quantity/price selector with live updates
9. ✅ Shopping cart with session persistence
10. ✅ Checkout form (shipping information only)
11. ✅ Payment placeholder UI (Stripe mockup)
12. ✅ Thank you / confirmation page
13. ✅ Contact form page
14. ✅ Responsive mobile design for all pages
15. ✅ SEO optimization (meta tags, structured data, sitemap)

### Phase 2: Backend Setup (Manual Deployment)
1. ⏸️ `database_setup.py` script with CSV data import
2. ⏸️ Lambda function code files (6 functions)
3. ⏸️ API Gateway configuration documentation
4. ⏸️ DynamoDB table schemas
5. ⏸️ S3 bucket setup guide
6. ⏸️ SES email templates
7. ⏸️ Deployment guide with manual steps

### Phase 3: Integration (Future)
1. ⏸️ Connect frontend to Lambda endpoints
2. ⏸️ Test full order flow
3. ⏸️ Stripe integration
4. ⏸️ Order tracking system
5. ⏸️ Admin dashboard

---

## Key Differentiators (Competitive Advantages)

1. **In-House Production**: Emphasize that we manufacture everything ourselves (not outsourced)
2. **Free Shipping**: Always free on all orders (major competitive advantage)
3. **Fast Turnaround**: 3-5 business days production time
4. **Premium Materials**: Weather-resistant vinyl, strong magnetic backing
5. **Better Pricing**: Competitive or better than Sticker Mule especially on bulk orders
6. **No Account Required**: Frictionless guest checkout
7. **Professional Quality**: Highlight vibrant printing, durability, and long-lasting products

---

## Quality Standards

### Code Quality
- Use TypeScript or PropTypes for type safety
- Follow React best practices (hooks, functional components)
- Implement error boundaries
- Add loading states for all async operations
- Handle edge cases (network errors, invalid uploads, etc.)
- Write clean, commented code
- Use ESLint + Prettier for consistent formatting

### User Experience
- Smooth transitions and animations (Framer Motion)
- Clear error messages with recovery suggestions
- Loading indicators for all async actions
- Form validation with helpful error messages
- Confirmation dialogs for destructive actions
- Keyboard navigation support
- Screen reader friendly (ARIA labels)

### Performance
- Code splitting for faster initial load
- Lazy load images and components
- Optimize bundle size (target < 500KB initial JS)
- Use React.memo() for expensive components
- Debounce search and filter inputs
- Prefetch product data on hover

### Testing Considerations
- Unit tests for utility functions (pricing calculations, validation)
- Integration tests for cart operations
- End-to-end test scenarios for full order flow
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile device testing (iOS, Android)

---

## Deliverables Checklist

### Frontend Application
- [x] Fully functional React application with all pages
- [x] Interactive image canvas editor
- [x] Shopping cart with session management
- [x] Responsive design (mobile, tablet, desktop)
- [x] SEO optimized (meta tags, structured data, sitemap)
- [x] Payment placeholder with Stripe UI mockup
- [x] Video galleries integrated
- [x] Contact form
- [x] Professional design matching brand identity

### Backend Files (For Manual Deployment)
- [ ] `database_setup.py` - Complete with CSV parsing
- [ ] 6 Lambda function files with full implementation
- [ ] `api.js` with endpoint placeholders
- [ ] `requirements.txt` for Python dependencies
- [ ] DynamoDB schema documentation
- [ ] Deployment guide with step-by-step instructions

### Documentation
- [ ] `README.md` - Project overview and setup instructions
- [ ] `API_ENDPOINTS.md` - API documentation
- [ ] `DEPLOYMENT_GUIDE.md` - Manual deployment steps
- [ ] `DATABASE_SCHEMA.md` - DynamoDB table structures
- [ ] Environment variables template (`.env.example`)

---

## Critical Implementation Notes

1. **Image Compression Logic**:
   - MUST happen client-side before upload
   - Target ~9MB after compression if original > 10MB
   - Use progressive compression to maintain quality
   - Show progress bar during compression
   - Validate file size after compression

2. **Canvas Editor**:
   - Use HTML5 Canvas API or Fabric.js (recommended)
   - Support touch gestures for mobile
   - Auto-fit uploaded image intelligently
   - Maintain aspect ratio during scaling
   - Export final canvas as high-res PNG for S3

3. **Pricing Calculations**:
   - MUST match CSV exactly (no rounding errors)
   - Use Decimal type in Python for precision
   - Cache pricing data in frontend to reduce API calls
   - Show savings comparison (e.g., "Save $50 with 200 qty vs 100 qty")

4. **Session Management**:
   - Generate unique session ID on first visit
   - Store in localStorage (persist across tabs)
   - Include session ID in all API calls
   - Use for S3 filename prefixes
   - Clear session after order completion

5. **Email Templates**:
   - Use HTML emails (not plain text)
   - Include inline CSS (Gmail compatibility)
   - Show order summary table
   - Link to artwork S3 URLs (pre-signed, 7-day expiry)
   - Professional branding

6. **Error Handling**:
   - Graceful fallbacks for all API failures
   - User-friendly error messages (no technical jargon)
   - Retry logic for transient errors
   - Log errors to console for debugging
   - Show "Something went wrong" page for critical errors

---

## Success Metrics (For Future Implementation)

- Page load time < 3 seconds
- Lighthouse scores > 90 across all categories
- Mobile conversion rate > 2%
- Average order value > $150
- Cart abandonment rate < 60%
- Email deliverability > 95%
- Zero critical bugs in production

---

## Build Instructions for Claude Code

**FOCUS NOW**: Build the complete frontend application with all features listed in Phase 1. Create a production-ready, visually stunning, and fully functional React app that can be deployed immediately. The backend Lambda functions and database setup scripts should be provided as separate files with clear documentation for manual deployment.

**Key Priorities**:
1. Beautiful, modern UI that rivals or exceeds Sticker Mule
2. Smooth, intuitive image editor with all manipulation controls
3. Real-time price updates as user changes options
4. Seamless shopping cart experience
5. Mobile-first responsive design
6. SEO optimization throughout
7. Professional copywriting and messaging
8. Video galleries prominently featured
9. Clear CTAs guiding users to conversion

**Do NOT**:
- Overcomplicate the setup (keep Vite configuration simple)
- Use unnecessary libraries (stick to core stack)
- Create authentication systems (guest checkout only)
- Implement actual payment processing (placeholder only)
- Build admin panels (not in scope yet)

**Output Structure**:
Generate the complete application with all files, provide clear README with setup instructions, and separate backend files with deployment documentation.

This is a real business application that will go live and generate revenue. Code quality, user experience, and professional appearance are paramount.
