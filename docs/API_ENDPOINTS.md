# API Endpoints Documentation

## Overview

Sticker & Magnet Lab uses AWS Lambda functions with Function URLs for the backend API. All endpoints return JSON and support CORS for browser requests.

## Base URL

Replace `LAMBDA_URL` with your actual Lambda function URL after deployment.

---

## Endpoints

### 1. Get Products

Retrieves product catalog information.

**Endpoint:** `GET /api/products`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | No | Filter by product type: `sticker`, `magnet`, `fridge` |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productId": "die-cut-sticker",
      "productType": "sticker",
      "name": "Die-Cut Vinyl Stickers",
      "description": "High Quality Vinyl...",
      "bulletPoints": ["Feature 1", "Feature 2", "Feature 3"],
      "images": ["url1", "url2", "url3"],
      "availableSizes": ["2x2", "3x3", "4x4", ...],
      "basePrice": 18.50
    }
  ],
  "count": 3
}
```

**Example:**
```bash
curl "https://your-lambda-url/api/products?type=sticker"
```

---

### 2. Get Pricing

Retrieves pricing information for products.

**Endpoint:** `GET /api/pricing`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Product type: `sticker`, `magnet`, `fridge` |
| `size` | string | No | Specific size (e.g., `5x5`) |

**Response:**
```json
{
  "success": true,
  "data": {
    "5x5": {
      "12": 27.75,
      "25": 48.45,
      "50": 71.25,
      "75": 89.30,
      "100": 107.35,
      "200": 149.15,
      "300": 184.30,
      "600": 266.25,
      "1000": 389.85,
      "2000": 631.20,
      "3000": 854.90,
      "6000": 1268.50,
      "10000": 2163.15
    }
  },
  "productType": "sticker"
}
```

**Example:**
```bash
curl "https://your-lambda-url/api/pricing?type=sticker&size=5x5"
```

---

### 3. Upload Image

Uploads an image to S3 for order processing.

**Endpoint:** `POST /api/upload`

**Request Body:**
```json
{
  "image": "base64_encoded_image_data",
  "filename": "my-design.png",
  "sessionId": "uuid-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://layout-tool-randr.s3.amazonaws.com/orders/session_timestamp_uuid.png",
    "filename": "session_1705312800_abc123.png",
    "size": 1234567
  }
}
```

**Notes:**
- Maximum file size: 10MB (compressed client-side if larger)
- Accepted formats: JPG, PNG
- Images stored in `s3://layout-tool-randr/orders/`

---

### 4. Create Order

Creates a new order in the system.

**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-123-4567",
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
      "size": "5x5",
      "quantity": 100,
      "unitPrice": 1.07,
      "totalPrice": 107.35,
      "artworkS3Url": "https://s3.../image.png",
      "instructions": "Please cut close to edges"
    }
  ],
  "subtotal": 107.35,
  "shipping": 0.00,
  "total": 107.35,
  "sessionId": "uuid-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "SLMAG-1705312800-ABC",
    "orderDate": "2025-01-15T10:30:00Z",
    "status": "pending_payment",
    "total": 107.35,
    "emailSent": true
  }
}
```

**Order ID Format:** `SLMAG-{unix_timestamp}-{random_3_chars}`

---

### 5. Send Order Confirmation

Sends order confirmation emails. Usually triggered automatically by `create_order`.

**Endpoint:** `POST /api/send-confirmation`

**Request Body:**
```json
{
  "orderId": "SLMAG-1705312800-ABC"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customerEmailSent": true,
    "staffEmailsSent": 2
  }
}
```

**Emails Sent:**
1. Customer confirmation email
2. Staff notification to arturo@rrinconline.com
3. Staff notification to ramonecardonna@gmail.com

---

### 6. Contact Form

Submits a contact form inquiry.

**Endpoint:** `POST /api/contact`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "general",
  "message": "I have a question about bulk orders..."
}
```

**Subject Options:**
- `general` - General Inquiry
- `order` - Order Question
- `custom` - Custom Request
- `support` - Technical Support

**Response:**
```json
{
  "success": true,
  "data": {
    "referenceId": "SML-ABC123",
    "message": "Thank you for contacting us. We'll respond within 24 hours."
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "field": "email"
  }
}
```

**Error Codes:**
| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input data |
| `NOT_FOUND` | Resource not found |
| `UPLOAD_ERROR` | Image upload failed |
| `DATABASE_ERROR` | Database operation failed |
| `EMAIL_ERROR` | Email sending failed |
| `INTERNAL_ERROR` | Unexpected server error |

**HTTP Status Codes:**
| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## CORS Headers

All responses include these headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding AWS WAF rules for production.

---

## Authentication

No authentication required (guest checkout only). Session IDs are used for tracking cart and uploads.

---

## Testing

Each Lambda function can be tested locally:

```bash
# Install dependencies
pip install -r requirements.txt

# Test get_products
python lambda_functions/get_products.py

# Test get_pricing
python lambda_functions/get_pricing.py
```
