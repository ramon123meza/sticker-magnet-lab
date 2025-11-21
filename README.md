# Sticker & Magnet Lab

A professional, production-ready e-commerce platform for custom stickers and magnets. Built with modern web technologies and designed to compete with industry leaders like Sticker Mule.

## Features

- **Custom Design Studio**: Interactive Fabric.js-powered canvas editor for designing stickers and magnets
- **Product Catalog**: Die-cut stickers, die-cut magnets, and premium fridge magnets
- **Dynamic Pricing**: Real-time price calculations with volume discounts
- **Shopping Cart**: Persistent cart with session management
- **Guest Checkout**: No account required - simple, frictionless checkout
- **SEO Optimized**: Meta tags, structured data, sitemap, and clean URLs
- **Responsive Design**: Mobile-first approach, works on all devices
- **Fast Performance**: Code splitting, lazy loading, optimized bundles

## Tech Stack

### Frontend
- **React 18** with hooks and functional components
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive styling
- **Framer Motion** for smooth animations
- **Fabric.js** for the interactive canvas editor
- **Zustand** for state management (cart)
- **React Router v6** for navigation
- **React Helmet Async** for SEO

### Backend (AWS Serverless)
- **AWS Lambda** (Python 3.11+) for API endpoints
- **DynamoDB** for data persistence
- **S3** for image storage
- **SES** for transactional emails

## Project Structure

```
sticker-magnet-lab/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Button, Input, Modal, etc.
│   │   │   ├── layout/          # Header, Footer, Navigation
│   │   │   ├── product/         # Product cards, galleries
│   │   │   ├── cart/            # Cart drawer, items
│   │   │   ├── checkout/        # Checkout forms
│   │   │   └── editor/          # Canvas editor components
│   │   ├── contexts/            # React contexts (Cart, Session, UI)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Page components
│   │   ├── services/            # API service layer
│   │   ├── utils/               # Utility functions
│   │   ├── data/                # Static data (pricing, products)
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                     # AWS Lambda functions
│   ├── lambda_functions/
│   │   ├── get_products.py      # GET /api/products
│   │   ├── get_pricing.py       # GET /api/pricing
│   │   ├── upload_image_to_s3.py# POST /api/upload
│   │   ├── create_order.py      # POST /api/orders
│   │   ├── send_order_confirmation.py
│   │   └── contact_form.py      # POST /api/contact
│   ├── utils/
│   │   └── email_templates.py
│   ├── database_setup.py        # DynamoDB table creation
│   └── requirements.txt
│
├── docs/                        # Documentation
│   ├── API_ENDPOINTS.md
│   ├── DATABASE_SCHEMA.md
│   └── DEPLOYMENT_GUIDE.md
│
├── size-price.csv               # Pricing data
├── product_information.csv      # Product data
└── README.md                    # This file
```

## Quick Start

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Backend Setup

See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for detailed AWS setup instructions.

1. **Set up DynamoDB tables:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python database_setup.py
   ```

2. **Deploy Lambda functions** - Copy each function to AWS Lambda console

3. **Configure environment variables** - Update API endpoints in frontend

## Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_PRODUCTS=https://your-lambda-url/products
VITE_API_PRICING=https://your-lambda-url/pricing
VITE_API_UPLOAD=https://your-lambda-url/upload
VITE_API_ORDERS=https://your-lambda-url/orders
VITE_API_CONTACT=https://your-lambda-url/contact
VITE_S3_BUCKET=layout-tool-randr
VITE_SITE_URL=https://stickersmagnetlab.com
```

## Available Scripts

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Backend

| Command | Description |
|---------|-------------|
| `python database_setup.py` | Create DynamoDB tables and seed data |

## Products

### Die-Cut Stickers
- Custom sizes: 2x2 to 22x22 inches
- Weather-resistant vinyl
- Cut to any shape

### Die-Cut Magnets
- Same sizes as stickers
- Strong magnetic backing
- Durable and long-lasting

### Fridge Magnets
- Fixed sizes: 2x3, 2.5x3.5, 4.75x2, 2.5x2.5 inches
- Thick magnetic backing
- Premium photo quality

## Pricing

All pricing is loaded from `size-price.csv`. Quantity tiers:
- 12, 25, 50, 75, 100, 200, 300, 600, 1000, 2000, 3000, 6000, 10000

Fridge magnets are priced at 15% markup over die-cut magnets.

## Company Information

**Sticker & Magnet Lab**
A division of R and R Imports INC

- Address: 5271 Lee Hwy, Troutville, VA 24017
- Email: orders@rrinconline.com
- Phone: 276-706-0463
- Website: https://stickersmagnetlab.com

## License

Proprietary - All rights reserved by R and R Imports INC

## Support

For technical support or questions, contact:
- Email: orders@rrinconline.com
- Phone: 276-706-0463
