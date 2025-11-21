# Deployment Guide

## Overview

This guide covers deploying Sticker & Magnet Lab to production. The architecture uses:
- **Frontend**: Static hosting (S3 + CloudFront, Vercel, Netlify, etc.)
- **Backend**: AWS Lambda with Function URLs
- **Database**: Amazon DynamoDB
- **Storage**: Amazon S3
- **Email**: Amazon SES

---

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Node.js 18+** and npm
4. **Python 3.11+** and pip
5. **Domain** (optional but recommended)

---

## Step 1: Set Up AWS Resources

### 1.1 S3 Bucket (Already Exists)

The S3 bucket `layout-tool-randr` is already configured. Ensure it has:
- Public read access for product images
- CORS configuration for uploads:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 1.2 DynamoDB Tables

Run the database setup script:

```bash
cd backend
pip install -r requirements.txt
python database_setup.py
```

This creates:
- `sticker_magnet_lab_products`
- `sticker_magnet_lab_pricing_stickers`
- `sticker_magnet_lab_pricing_magnets`
- `sticker_magnet_lab_pricing_fridge_magnets`
- `sticker_magnet_lab_orders`
- `sticker_magnet_lab_contacts`

### 1.3 SES Email Setup

1. Verify sender email: `orders@rrinconline.com`
2. Verify recipient emails if in sandbox mode
3. Request production access when ready

---

## Step 2: Deploy Lambda Functions

### 2.1 Create Lambda Functions

For each function in `backend/lambda_functions/`:

1. Go to AWS Lambda Console
2. Click "Create function"
3. Choose "Author from scratch"
4. Configure:
   - **Function name**: `sticker-magnet-lab-{function-name}`
   - **Runtime**: Python 3.11
   - **Architecture**: x86_64

### 2.2 Lambda Configuration

For each function:

**Memory**: 256 MB (512 MB for upload function)
**Timeout**: 30 seconds (60 seconds for order creation)

**Environment Variables:**
```
PRODUCTS_TABLE=sticker_magnet_lab_products
PRICING_STICKERS_TABLE=sticker_magnet_lab_pricing_stickers
PRICING_MAGNETS_TABLE=sticker_magnet_lab_pricing_magnets
PRICING_FRIDGE_MAGNETS_TABLE=sticker_magnet_lab_pricing_fridge_magnets
ORDERS_TABLE=sticker_magnet_lab_orders
CONTACTS_TABLE=sticker_magnet_lab_contacts
S3_BUCKET=layout-tool-randr
FROM_EMAIL=orders@rrinconline.com
STAFF_EMAILS=arturo@rrinconline.com,ramonecardonna@gmail.com
```

### 2.3 IAM Permissions

Attach a policy with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/sticker_magnet_lab_*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::layout-tool-randr/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "arn:aws:lambda:*:*:function:sticker-magnet-lab-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

### 2.4 Enable Function URLs

For each Lambda function:

1. Go to Configuration > Function URL
2. Click "Create function URL"
3. Auth type: NONE
4. Enable CORS
5. Copy the URL for frontend configuration

### 2.5 Upload Function Code

For each function:

1. Copy the code from the corresponding `.py` file
2. Paste into the Lambda console code editor
3. Click "Deploy"

Or use AWS CLI:
```bash
cd backend/lambda_functions
zip get_products.zip get_products.py
aws lambda update-function-code \
  --function-name sticker-magnet-lab-get-products \
  --zip-file fileb://get_products.zip
```

---

## Step 3: Deploy Frontend

### 3.1 Configure Environment

Create `.env` file in `frontend/`:

```env
VITE_API_PRODUCTS=https://abc123.lambda-url.us-east-1.on.aws/
VITE_API_PRICING=https://def456.lambda-url.us-east-1.on.aws/
VITE_API_UPLOAD=https://ghi789.lambda-url.us-east-1.on.aws/
VITE_API_ORDERS=https://jkl012.lambda-url.us-east-1.on.aws/
VITE_API_CONTACT=https://mno345.lambda-url.us-east-1.on.aws/
VITE_S3_BUCKET=layout-tool-randr
VITE_SITE_URL=https://stickersmagnetlab.com
```

### 3.2 Build Frontend

```bash
cd frontend
npm install
npm run build
```

This creates a `dist/` folder with the production build.

### 3.3 Deploy to Hosting

#### Option A: AWS S3 + CloudFront (Recommended)

1. Create S3 bucket for static hosting
2. Upload `dist/` contents
3. Create CloudFront distribution
4. Configure SSL certificate
5. Point domain to CloudFront

```bash
# Upload to S3
aws s3 sync dist/ s3://stickersmagnetlab.com/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id XXXXX \
  --paths "/*"
```

#### Option B: Vercel

```bash
npm i -g vercel
vercel --prod
```

#### Option C: Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## Step 4: DNS Configuration

### Domain Setup

1. Register domain `stickersmagnetlab.com` (if not done)
2. Point DNS to your hosting:
   - CloudFront: Create ALIAS record to distribution
   - Vercel/Netlify: Follow their DNS instructions

### SSL Certificate

- AWS: Use ACM (free) with CloudFront
- Vercel/Netlify: Automatic SSL

---

## Step 5: Testing

### Test Checklist

- [ ] Homepage loads correctly
- [ ] All product pages display
- [ ] Customizer works (upload, edit, preview)
- [ ] Cart add/remove/update
- [ ] Checkout form validation
- [ ] Order creation (check DynamoDB)
- [ ] Email notifications sent
- [ ] Contact form works
- [ ] Mobile responsiveness
- [ ] SEO meta tags present

### Test API Endpoints

```bash
# Test products
curl https://your-lambda-url/api/products

# Test pricing
curl "https://your-lambda-url/api/pricing?type=sticker&size=5x5"

# Test contact form
curl -X POST https://your-lambda-url/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"general","message":"Test message"}'
```

---

## Step 6: Post-Deployment

### Monitoring

1. Enable CloudWatch Logs for Lambda functions
2. Set up CloudWatch Alarms for errors
3. Configure billing alerts

### Backups

1. Enable DynamoDB Point-in-Time Recovery
2. Schedule regular backups
3. Test restore procedures

### Security

1. Review IAM permissions (least privilege)
2. Enable AWS WAF on CloudFront
3. Regular security audits

---

## Troubleshooting

### Common Issues

**CORS Errors**
- Check Lambda Function URL CORS settings
- Verify S3 bucket CORS configuration

**500 Errors**
- Check CloudWatch Logs for Lambda errors
- Verify environment variables
- Check IAM permissions

**Email Not Sending**
- Verify SES sender identity
- Check SES sandbox status
- Review CloudWatch Logs

**Images Not Uploading**
- Check S3 bucket permissions
- Verify Lambda IAM role
- Check file size limits

---

## Rollback Procedure

1. Keep previous deployment artifacts
2. Revert Lambda function code
3. Restore database from backup if needed
4. Update DNS if necessary

---

## Future Enhancements

1. **Stripe Integration**: Add payment processing
2. **Admin Dashboard**: Order management interface
3. **Order Tracking**: Customer order status page
4. **Email Marketing**: Newsletter integration
5. **Analytics**: Google Analytics / Mixpanel
