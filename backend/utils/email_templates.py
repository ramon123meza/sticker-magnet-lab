"""
HTML email templates for Sticker & Magnet Lab.

Templates included:
- Order confirmation (customer)
- New order notification (staff)
- Contact form auto-reply (customer)
- Contact form notification (staff)
"""

from typing import Any, Dict, List


# Company branding colors
BRAND_PRIMARY = '#667eea'
BRAND_SECONDARY = '#764ba2'
BRAND_SUCCESS = '#28a745'
BRAND_WARNING = '#ffc107'
BRAND_DANGER = '#dc3545'
BRAND_INFO = '#17a2b8'


def get_base_styles() -> str:
    """
    Get common base CSS styles for all emails.

    Returns:
        CSS style string
    """
    return """
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 30px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px 10px 0 0;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            color: rgba(255,255,255,0.9);
            margin: 10px 0 0 0;
            font-size: 16px;
        }
        .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
        }
        .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .warning-box {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 8px;
            color: #856404;
        }
        .success-box {
            background: #d4edda;
            border: 1px solid #28a745;
            padding: 15px;
            border-radius: 8px;
            color: #155724;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background: #f8f9fa;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
        }
        a {
            color: #667eea;
        }
    </style>
    """


def format_currency(amount: float) -> str:
    """
    Format a number as USD currency.

    Args:
        amount: Numeric amount

    Returns:
        Formatted currency string
    """
    try:
        return f"${float(amount):,.2f}"
    except (ValueError, TypeError):
        return "$0.00"


def get_customer_confirmation_html(order: Dict[str, Any]) -> str:
    """
    Generate HTML for customer order confirmation email.

    Args:
        order: Order data dictionary containing:
            - orderId: Order identifier
            - orderDate: ISO timestamp
            - customerInfo: Customer details including name
            - items: List of order items
            - subtotal: Order subtotal
            - shipping: Shipping cost
            - total: Order total

    Returns:
        Complete HTML email body
    """
    order_id = order.get('orderId', 'N/A')
    customer_name = order.get('customerInfo', {}).get('name', 'Valued Customer')
    order_date = order.get('orderDate', '')[:10]
    items = order.get('items', [])
    subtotal = float(order.get('subtotal', 0))
    shipping = float(order.get('shipping', 0))
    total = float(order.get('total', 0))

    # Build items table rows
    items_html = ""
    for item in items:
        product_type = item.get('productType', '').replace('_', ' ').title()
        size = item.get('size', '')
        quantity = item.get('quantity', 0)
        total_price = float(item.get('totalPrice', 0))

        items_html += f"""
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">
                    <strong>{product_type}</strong><br>
                    <span style="color: #666; font-size: 14px;">Size: {size}</span>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">{quantity}</td>
                <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right;">{format_currency(total_price)}</td>
            </tr>
        """

    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - {order_id}</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, {BRAND_PRIMARY} 0%, {BRAND_SECONDARY} 100%); border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Sticker & Magnet Lab</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Order Confirmation</p>
        </div>

        <!-- Content -->
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Thank you for your order, {customer_name}!</h2>

            <p style="font-size: 16px;">We've received your order and it's being processed. Below are your order details.</p>

            <!-- Order Info Box -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <table style="width: 100%;">
                    <tr>
                        <td style="padding: 5px 0;"><strong>Order Number:</strong></td>
                        <td style="padding: 5px 0; text-align: right; color: {BRAND_PRIMARY}; font-weight: 600;">{order_id}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0;"><strong>Order Date:</strong></td>
                        <td style="padding: 5px 0; text-align: right;">{order_date}</td>
                    </tr>
                </table>
            </div>

            <!-- Order Items -->
            <h3 style="color: #333; border-bottom: 3px solid {BRAND_PRIMARY}; padding-bottom: 10px; margin-top: 30px;">Order Items</h3>

            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 12px; text-align: left;">Product</th>
                        <th style="padding: 12px; text-align: center;">Qty</th>
                        <th style="padding: 12px; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                </tbody>
            </table>

            <!-- Order Summary -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <table style="width: 100%;">
                    <tr>
                        <td style="padding: 8px 0;">Subtotal:</td>
                        <td style="padding: 8px 0; text-align: right;">{format_currency(subtotal)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0;">Shipping:</td>
                        <td style="padding: 8px 0; text-align: right;">{format_currency(shipping) if shipping > 0 else 'FREE'}</td>
                    </tr>
                    <tr style="border-top: 2px solid #ddd;">
                        <td style="padding: 12px 0; font-size: 18px;"><strong>Total:</strong></td>
                        <td style="padding: 12px 0; text-align: right; font-size: 22px; color: {BRAND_PRIMARY}; font-weight: 700;">{format_currency(total)}</td>
                    </tr>
                </table>
            </div>

            <!-- Production Notice -->
            <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h4 style="margin: 0 0 10px 0; color: #856404;">Production & Shipping</h4>
                <p style="margin: 0; color: #856404;">
                    Your order will be produced within <strong>3-5 business days</strong>.
                    You will receive a notification with tracking information once your order ships.
                </p>
            </div>

            <p style="font-size: 16px;">If you have any questions about your order, please don't hesitate to contact us.</p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 25px; background: #ffffff; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
                Thank you for choosing Sticker & Magnet Lab!<br>
                <a href="mailto:orders@rrinconline.com" style="color: {BRAND_PRIMARY};">orders@rrinconline.com</a>
            </p>
            <p style="color: #999; font-size: 12px; margin: 15px 0 0 0;">
                This email was sent regarding order {order_id}
            </p>
        </div>
    </div>
</body>
</html>
"""


def get_staff_notification_html(order: Dict[str, Any]) -> str:
    """
    Generate HTML for staff order notification email.

    Args:
        order: Order data dictionary containing full order details
            including customer info, shipping address, and items with artwork URLs

    Returns:
        Complete HTML email body for staff
    """
    order_id = order.get('orderId', 'N/A')
    order_date = order.get('orderDate', '')
    customer_info = order.get('customerInfo', {})
    shipping = customer_info.get('shippingAddress', {})
    items = order.get('items', [])
    total = float(order.get('total', 0))

    # Format address
    address_lines = [shipping.get('street', '')]
    if shipping.get('apartment'):
        address_lines.append(shipping.get('apartment'))
    address_lines.append(f"{shipping.get('city', '')}, {shipping.get('state', '')} {shipping.get('zip', '')}")
    address_lines.append(shipping.get('country', 'USA'))
    address_html = '<br>'.join(filter(None, address_lines))

    # Build items table
    items_html = ""
    for i, item in enumerate(items, 1):
        product_type = item.get('productType', '').replace('_', ' ').title()
        size = item.get('size', '')
        quantity = item.get('quantity', 0)
        total_price = float(item.get('totalPrice', 0))
        artwork_url = item.get('artworkUrl', item.get('artworkS3Url', ''))
        instructions = item.get('instructions', '') or 'None'

        items_html += f"""
            <tr>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">{i}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">{product_type}</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">{size}</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">{quantity}</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">{format_currency(total_price)}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">
                    <a href="{artwork_url}" target="_blank" style="color: #007bff; font-weight: 600;">Download</a>
                </td>
            </tr>
            <tr>
                <td colspan="6" style="padding: 10px 12px; border: 1px solid #ddd; background: #fafafa;">
                    <strong>Special Instructions:</strong> {instructions}
                </td>
            </tr>
        """

    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Order - {order_id}</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <!-- Alert Header -->
        <div style="background: {BRAND_DANGER}; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">NEW ORDER RECEIVED</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Action Required</p>
        </div>

        <!-- Content -->
        <div style="background: #fff; padding: 25px; border: 1px solid #ddd; border-top: none;">
            <!-- Order Summary Box -->
            <div style="background: linear-gradient(135deg, {BRAND_PRIMARY} 0%, {BRAND_SECONDARY} 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <table style="width: 100%;">
                    <tr>
                        <td>
                            <h2 style="margin: 0; font-size: 22px;">Order #{order_id}</h2>
                            <p style="margin: 5px 0 0 0; opacity: 0.9;">Received: {order_date}</p>
                        </td>
                        <td style="text-align: right;">
                            <span style="font-size: 28px; font-weight: 700;">{format_currency(total)}</span>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Two Column Layout -->
            <table style="width: 100%; margin-bottom: 25px;">
                <tr>
                    <td style="width: 50%; vertical-align: top; padding-right: 15px;">
                        <!-- Customer Info -->
                        <h3 style="color: #333; border-bottom: 3px solid {BRAND_INFO}; padding-bottom: 10px; margin-top: 0;">Customer Information</h3>
                        <table style="width: 100%;">
                            <tr>
                                <td style="padding: 8px 0;"><strong>Name:</strong></td>
                                <td>{customer_info.get('name', 'N/A')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong>Email:</strong></td>
                                <td><a href="mailto:{customer_info.get('email', '')}" style="color: {BRAND_PRIMARY};">{customer_info.get('email', 'N/A')}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong>Phone:</strong></td>
                                <td>{customer_info.get('phone', 'Not provided')}</td>
                            </tr>
                        </table>
                    </td>
                    <td style="width: 50%; vertical-align: top; padding-left: 15px;">
                        <!-- Shipping Address -->
                        <h3 style="color: #333; border-bottom: 3px solid {BRAND_INFO}; padding-bottom: 10px; margin-top: 0;">Shipping Address</h3>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                            {address_html}
                        </div>
                    </td>
                </tr>
            </table>

            <!-- Order Items -->
            <h3 style="color: #333; border-bottom: 3px solid {BRAND_INFO}; padding-bottom: 10px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background: #343a40; color: white;">
                        <th style="padding: 12px; text-align: center; width: 40px;">#</th>
                        <th style="padding: 12px; text-align: left;">Product</th>
                        <th style="padding: 12px; text-align: center;">Size</th>
                        <th style="padding: 12px; text-align: center;">Qty</th>
                        <th style="padding: 12px; text-align: right;">Price</th>
                        <th style="padding: 12px; text-align: center;">Artwork</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                </tbody>
            </table>

            <!-- Total Bar -->
            <div style="background: {BRAND_SUCCESS}; color: white; padding: 20px; border-radius: 5px; text-align: right;">
                <span style="font-size: 18px;">Order Total: </span>
                <span style="font-size: 28px; font-weight: 700;">{format_currency(total)}</span>
            </div>

            <!-- Notes -->
            <div style="margin-top: 20px; padding: 15px; background: {BRAND_WARNING}20; border-left: 4px solid {BRAND_WARNING}; border-radius: 0 5px 5px 0;">
                <p style="margin: 0; color: #856404;">
                    <strong>Important:</strong> Artwork download links are valid for <strong>7 days</strong>.
                    Please download all artwork files promptly.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 15px; color: #666; font-size: 12px;">
            <p>This notification was sent to staff members at Sticker & Magnet Lab</p>
        </div>
    </div>
</body>
</html>
"""


def get_contact_auto_reply_html(contact: Dict[str, Any]) -> str:
    """
    Generate HTML for contact form auto-reply email.

    Args:
        contact: Contact form data containing:
            - name: Contact name
            - subject: Message subject
            - message: Message content

    Returns:
        Complete HTML email body
    """
    name = contact.get('name', 'Customer')
    subject = contact.get('subject', 'General Inquiry')
    message = contact.get('message', '')

    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting Us</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, {BRAND_PRIMARY} 0%, {BRAND_SECONDARY} 100%); border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Sticker & Magnet Lab</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">We've Received Your Message</p>
        </div>

        <!-- Content -->
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Thank you for reaching out, {name}!</h2>

            <p style="font-size: 16px;">
                We've received your message and will get back to you as soon as possible,
                typically within <strong>1-2 business days</strong>.
            </p>

            <!-- Message Summary -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px 0; color: #555;">Your Message Summary:</h3>
                <p style="margin: 5px 0;"><strong>Subject:</strong> {subject}</p>
                <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid {BRAND_PRIMARY};">
                    <p style="margin: 0; white-space: pre-wrap;">{message}</p>
                </div>
            </div>

            <p style="font-size: 16px;">
                In the meantime, feel free to browse our products or check out our FAQ section for quick answers.
            </p>

            <!-- What to Expect -->
            <div style="background: #d4edda; border: 1px solid #28a745; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h4 style="margin: 0 0 10px 0; color: #155724;">What happens next?</h4>
                <ul style="margin: 0; padding-left: 20px; color: #155724;">
                    <li>Our team will review your message</li>
                    <li>We'll respond via email within 1-2 business days</li>
                    <li>For urgent matters, you can also call us directly</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 25px; background: #ffffff; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
                Thank you for choosing Sticker & Magnet Lab!<br>
                <a href="mailto:orders@rrinconline.com" style="color: {BRAND_PRIMARY};">orders@rrinconline.com</a>
            </p>
            <p style="color: #999; font-size: 12px; margin: 15px 0 0 0;">
                This is an automated response. Please do not reply directly to this email.
            </p>
        </div>
    </div>
</body>
</html>
"""


def get_contact_notification_html(contact: Dict[str, Any]) -> str:
    """
    Generate HTML for staff contact form notification email.

    Args:
        contact: Contact form data containing:
            - contactId: Contact reference ID
            - name: Contact name
            - email: Contact email
            - subject: Message subject
            - message: Message content
            - timestamp: Submission timestamp

    Returns:
        Complete HTML email body for staff
    """
    contact_id = contact.get('contactId', 'N/A')
    name = contact.get('name', 'Unknown')
    email = contact.get('email', 'Unknown')
    subject = contact.get('subject', 'No Subject')
    message = contact.get('message', '')
    timestamp = contact.get('timestamp', '')

    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Contact Form Submission</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: {BRAND_INFO}; color: white; padding: 20px; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0; font-size: 22px;">New Contact Form Submission</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Received: {timestamp}</p>
        </div>

        <!-- Content -->
        <div style="background: #fff; padding: 25px; border: 1px solid #ddd; border-top: none;">
            <!-- Reference Info -->
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <table style="width: 100%;">
                    <tr>
                        <td><strong>Reference ID:</strong></td>
                        <td style="text-align: right; font-family: monospace;">{contact_id}</td>
                    </tr>
                </table>
            </div>

            <!-- Contact Information -->
            <h3 style="color: #333; border-bottom: 3px solid {BRAND_INFO}; padding-bottom: 10px;">Contact Information</h3>
            <table style="width: 100%; margin-bottom: 25px;">
                <tr>
                    <td style="padding: 10px 0; width: 100px;"><strong>Name:</strong></td>
                    <td style="padding: 10px 0;">{name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0;"><strong>Email:</strong></td>
                    <td style="padding: 10px 0;">
                        <a href="mailto:{email}" style="color: {BRAND_PRIMARY};">{email}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0;"><strong>Subject:</strong></td>
                    <td style="padding: 10px 0;">{subject}</td>
                </tr>
            </table>

            <!-- Message -->
            <h3 style="color: #333; border-bottom: 3px solid {BRAND_INFO}; padding-bottom: 10px;">Message</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; white-space: pre-wrap; margin-bottom: 25px;">
{message}
            </div>

            <!-- Quick Reply Button -->
            <div style="text-align: center; margin: 25px 0;">
                <a href="mailto:{email}?subject=Re: {subject}"
                   style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, {BRAND_PRIMARY} 0%, {BRAND_SECONDARY} 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: 600;">
                    Reply to {name}
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 15px; color: #666; font-size: 12px;">
            <p>This notification was sent to staff members at Sticker & Magnet Lab</p>
        </div>
    </div>
</body>
</html>
"""
