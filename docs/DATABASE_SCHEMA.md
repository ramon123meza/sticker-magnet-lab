# Database Schema Documentation

## Overview

Sticker & Magnet Lab uses Amazon DynamoDB for all data persistence. This document describes the table schemas and data structures.

---

## Tables

### 1. Products Table

**Table Name:** `sticker_magnet_lab_products`

**Primary Key:**
- Partition Key: `productId` (String)

**Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| `productId` | String | Unique product identifier (e.g., `die-cut-sticker`) |
| `productType` | String | Category: `sticker`, `magnet-diecut`, `magnet-fridge` |
| `name` | String | Display name |
| `description` | String | Full product description |
| `bulletPoints` | List[String] | Feature bullet points (3 items) |
| `images` | List[String] | Product image URLs (3 images) |
| `availableSizes` | List[String] | Available sizes (die-cut only) |
| `fixedSize` | String | Fixed size (fridge magnets only) |
| `basePrice` | Number | Starting price |
| `createdAt` | Number | Unix timestamp |
| `updatedAt` | Number | Unix timestamp |

**Example Item:**
```json
{
  "productId": "die-cut-sticker",
  "productType": "sticker",
  "name": "Die-Cut Vinyl Stickers",
  "description": "High Quality Vinyl - Our Stickers are printed on weather resistant Vinyl material...",
  "bulletPoints": [
    "Vibrant Printing - The colors are bright and vivid...",
    "Easy to Apply - Our stickers are easy to peel off...",
    "Multi Use - The uses for these are endless..."
  ],
  "images": [
    "https://m.media-amazon.com/images/I/91OoER+O7xL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/81Lte6iULWL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/91AecVqtbRL._AC_SL1500_.jpg"
  ],
  "availableSizes": ["2x2", "3x3", "4x4", "5x5", "6x6", "7x7", "8x8", "9x9", "10x10", "11x11", "12x12", "14x14", "16x16", "18x18", "20x20", "22x22"],
  "basePrice": 18.50,
  "createdAt": 1705312800,
  "updatedAt": 1705312800
}
```

---

### 2. Pricing Tables

#### Stickers Pricing

**Table Name:** `sticker_magnet_lab_pricing_stickers`

**Primary Key:**
- Partition Key: `size` (String)
- Sort Key: `quantity` (Number)

**Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| `size` | String | Product size (e.g., `5x5`) |
| `quantity` | Number | Quantity tier (e.g., `100`) |
| `price` | Number | Price for this size/quantity |

**Example Items:**
```json
{"size": "5x5", "quantity": 12, "price": 27.75}
{"size": "5x5", "quantity": 25, "price": 48.45}
{"size": "5x5", "quantity": 50, "price": 71.25}
{"size": "5x5", "quantity": 100, "price": 107.35}
```

#### Magnets Pricing

**Table Name:** `sticker_magnet_lab_pricing_magnets`

Same structure as stickers pricing table.

#### Fridge Magnets Pricing

**Table Name:** `sticker_magnet_lab_pricing_fridge_magnets`

**Primary Key:**
- Partition Key: `productSize` (String) - e.g., `2x3`
- Sort Key: `quantity` (Number)

**Note:** Fridge magnet prices are calculated as 15% markup over the closest die-cut magnet size.

---

### 3. Orders Table

**Table Name:** `sticker_magnet_lab_orders`

**Primary Key:**
- Partition Key: `orderId` (String)

**Global Secondary Index (GSI):**
- Name: `customerEmail-index`
- Partition Key: `customerEmail` (String)

**Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| `orderId` | String | Unique order ID (e.g., `SLMAG-1705312800-ABC`) |
| `orderDate` | String | ISO 8601 timestamp |
| `status` | String | Order status |
| `customerInfo` | Map | Customer details |
| `items` | List[Map] | Order line items |
| `subtotal` | Number | Order subtotal |
| `shipping` | Number | Shipping cost (always 0) |
| `total` | Number | Order total |
| `paymentStatus` | String | Payment status |
| `sessionId` | String | User session ID |
| `createdAt` | Number | Unix timestamp |
| `updatedAt` | Number | Unix timestamp |

**Order Status Values:**
- `pending_payment` - Awaiting payment
- `paid` - Payment received
- `processing` - In production
- `shipped` - Shipped to customer
- `delivered` - Delivered
- `cancelled` - Order cancelled

**Example Item:**
```json
{
  "orderId": "SLMAG-1705312800-ABC",
  "orderDate": "2025-01-15T10:30:00Z",
  "status": "pending_payment",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "shippingAddress": {
      "street": "123 Main St",
      "apartment": "Apt 4B",
      "city": "Anytown",
      "state": "VA",
      "zip": "24017",
      "country": "USA"
    }
  },
  "items": [
    {
      "productType": "die-cut-sticker",
      "productName": "Die-Cut Vinyl Stickers",
      "size": "5x5",
      "quantity": 100,
      "unitPrice": 1.07,
      "totalPrice": 107.35,
      "artworkS3Url": "https://layout-tool-randr.s3.amazonaws.com/orders/...",
      "instructions": "Please cut close to edges"
    }
  ],
  "subtotal": 107.35,
  "shipping": 0.00,
  "total": 107.35,
  "paymentStatus": "placeholder",
  "sessionId": "abc123-def456-ghi789",
  "createdAt": 1705312800,
  "updatedAt": 1705312800
}
```

---

### 4. Contacts Table

**Table Name:** `sticker_magnet_lab_contacts`

**Primary Key:**
- Partition Key: `contactId` (String)

**Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| `contactId` | String | Unique ID (e.g., `SML-ABC123`) |
| `name` | String | Contact name |
| `email` | String | Contact email |
| `subject` | String | Subject category |
| `message` | String | Message content |
| `status` | String | `new`, `read`, `replied`, `closed` |
| `createdAt` | Number | Unix timestamp |

---

## Data Types

### Size Formats
- Die-cut: `2x2`, `3x3`, `4x4`, `5x5`, `6x6`, `7x7`, `8x8`, `9x9`, `10x10`, `11x11`, `12x12`, `14x14`, `16x16`, `18x18`, `20x20`, `22x22`
- Fridge magnets: `2x3`, `2.5x3.5`, `4.75x2`, `2.5x2.5`

### Quantity Tiers
`12`, `25`, `50`, `75`, `100`, `200`, `300`, `600`, `1000`, `2000`, `3000`, `6000`, `10000`

### Product Types
- `sticker` or `die-cut-sticker`
- `magnet-diecut` or `die-cut-magnet`
- `magnet-fridge` or `fridge-magnet-2x3`, `fridge-magnet-2.5x3.5`, etc.

---

## Capacity Planning

### Read/Write Capacity (On-Demand)
All tables use on-demand capacity mode for automatic scaling.

### Estimated Data Sizes
- Products table: ~1 KB per item, 6-10 items total
- Pricing tables: ~100 bytes per item, ~3,500 items total (16 sizes × 13 quantities × 3 products × buffer)
- Orders table: ~2-5 KB per item, grows with orders
- Contacts table: ~500 bytes per item, grows with submissions

---

## Backup Strategy

1. **Point-in-Time Recovery (PITR)**: Enable on orders table
2. **On-Demand Backups**: Schedule weekly backups
3. **Export to S3**: Monthly exports for archival

---

## Setup Script

Run the database setup script to create all tables:

```bash
cd backend
python database_setup.py
```

This script:
1. Creates all tables if they don't exist
2. Waits for tables to become active
3. Populates products from `product_information.csv`
4. Populates pricing from `size-price.csv`
5. Calculates and stores fridge magnet pricing
6. Verifies data integrity
