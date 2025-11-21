"""
Lambda function to send order confirmation emails via AWS SES.

Can be triggered by:
1. create_order Lambda (async invocation)
2. Direct invocation with order data

Sends:
1. Customer confirmation email
2. Staff notification emails (to both arturo@rrinconline.com and ramonecardonna@gmail.com)
"""

import json
import os
import logging
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Any, Dict, List

import boto3
from botocore.exceptions import ClientError

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
ses_client = boto3.client('ses')
s3_client = boto3.client('s3')

# Configuration
FROM_EMAIL = os.environ.get('FROM_EMAIL', 'orders@rrinconline.com')
STAFF_EMAILS = os.environ.get('STAFF_EMAILS', 'arturo@rrinconline.com,ramonecardonna@gmail.com').split(',')
PRESIGNED_URL_EXPIRY_DAYS = int(os.environ.get('PRESIGNED_URL_EXPIRY_DAYS', 7))

# Import email templates
try:
    from utils.email_templates import (
        get_customer_confirmation_html,
        get_staff_notification_html
    )
except ImportError:
    # Inline templates for Lambda deployment
    from email_templates_inline import (
        get_customer_confirmation_html,
        get_staff_notification_html
    )


class DecimalEncoder(json.JSONEncoder):
    """Custom JSON encoder for Decimal types."""

    def default(self, obj: Any) -> Any:
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)


def generate_presigned_url(s3_url: str, expiry_days: int = 7) -> str:
    """
    Generate a pre-signed URL for an S3 object.

    Args:
        s3_url: S3 URL (s3://bucket/key format)
        expiry_days: Number of days until URL expires

    Returns:
        Pre-signed HTTPS URL
    """
    if not s3_url or not s3_url.startswith('s3://'):
        return s3_url

    try:
        # Parse S3 URL
        url_parts = s3_url.replace('s3://', '').split('/', 1)
        if len(url_parts) != 2:
            return s3_url

        bucket = url_parts[0]
        key = url_parts[1]

        # Generate pre-signed URL
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket, 'Key': key},
            ExpiresIn=expiry_days * 24 * 60 * 60  # Convert to seconds
        )
        return presigned_url

    except ClientError as e:
        logger.error(f"Failed to generate pre-signed URL for {s3_url}: {str(e)}")
        return s3_url


def format_order_items_for_email(items: List[Dict]) -> List[Dict]:
    """
    Format order items for email display, including pre-signed URLs.

    Args:
        items: List of order items

    Returns:
        Formatted items with pre-signed URLs
    """
    formatted_items = []

    for item in items:
        formatted_item = {
            'productType': item.get('productType', ''),
            'size': item.get('size', ''),
            'quantity': item.get('quantity', 0),
            'unitPrice': float(item.get('unitPrice', 0)),
            'totalPrice': float(item.get('totalPrice', 0)),
            'artworkUrl': generate_presigned_url(
                item.get('artworkS3Url', ''),
                PRESIGNED_URL_EXPIRY_DAYS
            ),
            'instructions': item.get('instructions', '')
        }
        formatted_items.append(formatted_item)

    return formatted_items


def send_email(to_emails: List[str], subject: str, html_body: str, text_body: str = '') -> bool:
    """
    Send an email via AWS SES.

    Args:
        to_emails: List of recipient email addresses
        subject: Email subject
        html_body: HTML email body
        text_body: Plain text email body (optional)

    Returns:
        True if email sent successfully, False otherwise
    """
    if not text_body:
        # Generate simple text version from HTML
        text_body = html_body.replace('<br>', '\n').replace('</p>', '\n')
        import re
        text_body = re.sub('<[^<]+?>', '', text_body)

    try:
        response = ses_client.send_email(
            Source=FROM_EMAIL,
            Destination={
                'ToAddresses': to_emails
            },
            Message={
                'Subject': {
                    'Data': subject,
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Text': {
                        'Data': text_body,
                        'Charset': 'UTF-8'
                    },
                    'Html': {
                        'Data': html_body,
                        'Charset': 'UTF-8'
                    }
                }
            }
        )
        logger.info(f"Email sent successfully. Message ID: {response['MessageId']}")
        return True

    except ClientError as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False


def send_customer_confirmation(order: Dict) -> bool:
    """
    Send order confirmation email to customer.

    Args:
        order: Order data dictionary

    Returns:
        True if sent successfully
    """
    customer_email = order.get('customerInfo', {}).get('email')
    if not customer_email:
        logger.error("No customer email found in order")
        return False

    order_id = order.get('orderId', 'Unknown')
    subject = f"Order Confirmation - Sticker & Magnet Lab - {order_id}"

    html_body = get_customer_confirmation_html(order)

    return send_email([customer_email], subject, html_body)


def send_staff_notification(order: Dict) -> bool:
    """
    Send new order notification to staff members.

    Args:
        order: Order data dictionary

    Returns:
        True if sent successfully
    """
    order_id = order.get('orderId', 'Unknown')
    subject = f"New Order - {order_id}"

    # Format items with pre-signed URLs for staff
    order_with_urls = order.copy()
    order_with_urls['items'] = format_order_items_for_email(order.get('items', []))

    html_body = get_staff_notification_html(order_with_urls)

    return send_email(STAFF_EMAILS, subject, html_body)


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Main Lambda handler for sending order confirmation emails.

    Args:
        event: Event containing order data
        context: Lambda context

    Returns:
        Result of email sending operations
    """
    logger.info("Processing order confirmation email request")

    try:
        # Extract order data from event
        order = event.get('order')

        if not order:
            # Try to get from body (if invoked via API Gateway)
            body = event.get('body', '{}')
            if isinstance(body, str):
                body = json.loads(body)
            order = body.get('order')

        if not order:
            logger.error("No order data found in event")
            return {
                'success': False,
                'error': 'No order data provided'
            }

        order_id = order.get('orderId', 'Unknown')
        logger.info(f"Processing emails for order {order_id}")

        # Send customer confirmation
        customer_sent = send_customer_confirmation(order)
        logger.info(f"Customer confirmation email: {'sent' if customer_sent else 'failed'}")

        # Send staff notification
        staff_sent = send_staff_notification(order)
        logger.info(f"Staff notification email: {'sent' if staff_sent else 'failed'}")

        return {
            'success': customer_sent or staff_sent,
            'orderId': order_id,
            'customerEmailSent': customer_sent,
            'staffEmailSent': staff_sent
        }

    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return {
            'success': False,
            'error': 'Invalid JSON in event'
        }

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return {
            'success': False,
            'error': str(e)
        }


# Inline email templates for Lambda deployment (in case import fails)
def get_customer_confirmation_html(order: Dict) -> str:
    """Generate customer confirmation email HTML."""
    order_id = order.get('orderId', '')
    customer_name = order.get('customerInfo', {}).get('name', 'Customer')
    order_date = order.get('orderDate', '')[:10]
    total = float(order.get('total', 0))
    items = order.get('items', [])

    items_html = ""
    for item in items:
        items_html += f"""
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">{item.get('productType', '')}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">{item.get('size', '')}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">{item.get('quantity', 0)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${float(item.get('totalPrice', 0)):.2f}</td>
        </tr>
        """

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Sticker & Magnet Lab</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Order Confirmation</p>
        </div>

        <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Thank you for your order, {customer_name}!</h2>

            <p>We've received your order and it's being processed. Here are your order details:</p>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Order ID:</strong> {order_id}</p>
                <p style="margin: 5px 0;"><strong>Order Date:</strong> {order_date}</p>
            </div>

            <h3 style="border-bottom: 2px solid #667eea; padding-bottom: 10px;">Order Items</h3>

            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 12px; text-align: left;">Product</th>
                        <th style="padding: 12px; text-align: left;">Size</th>
                        <th style="padding: 12px; text-align: center;">Qty</th>
                        <th style="padding: 12px; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
                        <td style="padding: 12px; text-align: right; font-weight: bold; color: #667eea; font-size: 18px;">${total:.2f}</td>
                    </tr>
                </tfoot>
            </table>

            <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #856404;">
                    <strong>Production Time:</strong> Your order will be ready within 3-5 business days.
                    You will receive a notification when your order ships.
                </p>
            </div>

            <p>If you have any questions about your order, please don't hesitate to contact us.</p>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px;">
                    Thank you for choosing Sticker & Magnet Lab!<br>
                    <a href="mailto:orders@rrinconline.com" style="color: #667eea;">orders@rrinconline.com</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    """


def get_staff_notification_html(order: Dict) -> str:
    """Generate staff notification email HTML."""
    order_id = order.get('orderId', '')
    order_date = order.get('orderDate', '')
    customer_info = order.get('customerInfo', {})
    shipping = customer_info.get('shippingAddress', {})
    total = float(order.get('total', 0))
    items = order.get('items', [])

    items_html = ""
    for item in items:
        artwork_url = item.get('artworkUrl', item.get('artworkS3Url', ''))
        instructions = item.get('instructions', 'None')

        items_html += f"""
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">{item.get('productType', '')}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">{item.get('size', '')}</td>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">{item.get('quantity', 0)}</td>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${float(item.get('totalPrice', 0)):.2f}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">
                <a href="{artwork_url}" target="_blank" style="color: #007bff;">Download Artwork</a>
            </td>
            <td style="padding: 12px; border: 1px solid #ddd; font-size: 12px;">{instructions}</td>
        </tr>
        """

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background: #dc3545; color: white; padding: 15px 20px; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">NEW ORDER RECEIVED</h1>
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-top: none;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h2 style="margin: 0 0 10px 0; color: #333;">Order #{order_id}</h2>
                <p style="margin: 0; color: #666;">Received: {order_date}</p>
            </div>

            <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Customer Information</h3>
            <table style="width: 100%; margin-bottom: 20px;">
                <tr>
                    <td style="padding: 8px 0;"><strong>Name:</strong></td>
                    <td>{customer_info.get('name', '')}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;"><strong>Email:</strong></td>
                    <td><a href="mailto:{customer_info.get('email', '')}">{customer_info.get('email', '')}</a></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;"><strong>Phone:</strong></td>
                    <td>{customer_info.get('phone', 'Not provided')}</td>
                </tr>
            </table>

            <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Shipping Address</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0;">
                    {shipping.get('street', '')}<br>
                    {shipping.get('apartment', '') + '<br>' if shipping.get('apartment') else ''}
                    {shipping.get('city', '')}, {shipping.get('state', '')} {shipping.get('zip', '')}<br>
                    {shipping.get('country', 'USA')}
                </p>
            </div>

            <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background: #343a40; color: white;">
                        <th style="padding: 12px; text-align: left;">Product</th>
                        <th style="padding: 12px; text-align: left;">Size</th>
                        <th style="padding: 12px; text-align: center;">Qty</th>
                        <th style="padding: 12px; text-align: right;">Price</th>
                        <th style="padding: 12px; text-align: left;">Artwork</th>
                        <th style="padding: 12px; text-align: left;">Instructions</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                </tbody>
            </table>

            <div style="background: #28a745; color: white; padding: 15px; border-radius: 5px; text-align: right;">
                <span style="font-size: 18px;">Order Total: </span>
                <span style="font-size: 24px; font-weight: bold;">${total:.2f}</span>
            </div>

            <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px; color: #856404;">
                <strong>Note:</strong> Artwork links are valid for 7 days. Please download promptly.
            </p>
        </div>
    </body>
    </html>
    """


# For local testing
if __name__ == '__main__':
    test_order = {
        'orderId': 'SLMAG-20240115120000-ABC',
        'orderDate': '2024-01-15T12:00:00Z',
        'customerInfo': {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone': '555-123-4567',
            'shippingAddress': {
                'street': '123 Main St',
                'apartment': 'Apt 4B',
                'city': 'New York',
                'state': 'NY',
                'zip': '10001',
                'country': 'USA'
            }
        },
        'items': [
            {
                'productType': 'Die Cut Sticker',
                'size': '5x5',
                'quantity': 50,
                'unitPrice': 1.43,
                'totalPrice': 71.25,
                'artworkS3Url': 's3://layout-tool-randr/orders/test-123.png',
                'instructions': 'Please cut carefully'
            }
        ],
        'subtotal': 71.25,
        'shipping': 0.00,
        'total': 71.25
    }

    print("Customer confirmation HTML preview generated")
    print("Staff notification HTML preview generated")
