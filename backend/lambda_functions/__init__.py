"""
Lambda functions for Sticker & Magnet Lab API.

Available functions:
- get_products: Retrieve products from catalog
- get_pricing: Get pricing matrix for product types
- upload_image_to_s3: Handle image uploads
- create_order: Create new orders
- send_order_confirmation: Send email notifications
- contact_form: Process contact form submissions
"""

__all__ = [
    'get_products',
    'get_pricing',
    'upload_image_to_s3',
    'create_order',
    'send_order_confirmation',
    'contact_form'
]
