"""
Lambda function to create order records in DynamoDB.

Endpoint: POST /api/orders
Body: Full order payload with customer info and items

Creates an order record and triggers email notifications.
"""

import json
import os
import uuid
import random
import string
import logging
from datetime import datetime
from decimal import Decimal, InvalidOperation
from typing import Any, Dict, List, Optional

import boto3
from botocore.exceptions import ClientError

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
lambda_client = boto3.client('lambda')

# Configuration
ORDERS_TABLE = os.environ.get('ORDERS_TABLE', 'sticker_magnet_lab_orders')
SEND_CONFIRMATION_FUNCTION = os.environ.get('SEND_CONFIRMATION_FUNCTION', 'sticker_magnet_lab_send_order_confirmation')


class DecimalEncoder(json.JSONEncoder):
    """Custom JSON encoder for Decimal types."""

    def default(self, obj: Any) -> Any:
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)


def build_cors_response(status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Build HTTP response with CORS headers.

    Args:
        status_code: HTTP status code
        body: Response body dictionary

    Returns:
        Formatted API Gateway response
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }


def generate_order_id() -> str:
    """
    Generate a unique order ID.

    Format: SLMAG-{timestamp}-{random_3_chars}

    Returns:
        Unique order ID string
    """
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=3))
    return f"SLMAG-{timestamp}-{random_chars}"


def convert_to_decimal(value: Any) -> Decimal:
    """
    Convert a value to Decimal for DynamoDB compatibility.

    Args:
        value: Value to convert (float, int, string)

    Returns:
        Decimal value
    """
    if isinstance(value, Decimal):
        return value
    try:
        return Decimal(str(value)).quantize(Decimal('0.01'))
    except (InvalidOperation, ValueError):
        return Decimal('0.00')


def validate_customer_info(customer_info: Dict) -> List[str]:
    """
    Validate customer information.

    Args:
        customer_info: Customer information dictionary

    Returns:
        List of validation errors (empty if valid)
    """
    errors = []

    required_fields = ['name', 'email']
    for field in required_fields:
        if not customer_info.get(field):
            errors.append(f"Missing required customer field: {field}")

    # Validate email format (basic check)
    email = customer_info.get('email', '')
    if email and '@' not in email:
        errors.append("Invalid email format")

    # Validate shipping address
    shipping = customer_info.get('shippingAddress', {})
    required_shipping = ['street', 'city', 'state', 'zip']
    for field in required_shipping:
        if not shipping.get(field):
            errors.append(f"Missing required shipping field: {field}")

    return errors


def validate_items(items: List[Dict]) -> List[str]:
    """
    Validate order items.

    Args:
        items: List of order items

    Returns:
        List of validation errors (empty if valid)
    """
    errors = []

    if not items:
        errors.append("Order must contain at least one item")
        return errors

    for i, item in enumerate(items):
        required_fields = ['productType', 'size', 'quantity', 'unitPrice', 'totalPrice']
        for field in required_fields:
            if field not in item:
                errors.append(f"Item {i + 1}: Missing required field '{field}'")

        # Validate quantity is positive
        quantity = item.get('quantity', 0)
        if not isinstance(quantity, (int, float)) or quantity <= 0:
            errors.append(f"Item {i + 1}: Invalid quantity")

        # Validate prices are positive
        if item.get('unitPrice', 0) < 0:
            errors.append(f"Item {i + 1}: Invalid unit price")
        if item.get('totalPrice', 0) < 0:
            errors.append(f"Item {i + 1}: Invalid total price")

    return errors


def prepare_order_record(body: Dict) -> Dict:
    """
    Prepare the order record for DynamoDB.

    Args:
        body: Request body with order data

    Returns:
        Formatted order record
    """
    now = datetime.utcnow()
    order_id = generate_order_id()

    # Process items
    items = []
    subtotal = Decimal('0.00')

    for item in body.get('items', []):
        unit_price = convert_to_decimal(item.get('unitPrice', 0))
        quantity = int(item.get('quantity', 0))
        total_price = convert_to_decimal(item.get('totalPrice', unit_price * quantity))

        processed_item = {
            'productType': item.get('productType', ''),
            'size': item.get('size', ''),
            'quantity': quantity,
            'unitPrice': unit_price,
            'totalPrice': total_price,
            'artworkS3Url': item.get('artworkS3Url', ''),
            'instructions': item.get('instructions', '')
        }
        items.append(processed_item)
        subtotal += total_price

    # Get shipping cost (default free)
    shipping = convert_to_decimal(body.get('shipping', 0))
    total = subtotal + shipping

    # Process customer info
    customer_info = body.get('customerInfo', {})
    shipping_address = customer_info.get('shippingAddress', {})

    order_record = {
        'orderId': order_id,
        'orderDate': now.isoformat() + 'Z',
        'status': 'pending_payment',
        'customerInfo': {
            'name': customer_info.get('name', ''),
            'email': customer_info.get('email', ''),
            'phone': customer_info.get('phone', ''),
            'shippingAddress': {
                'street': shipping_address.get('street', ''),
                'apartment': shipping_address.get('apartment', ''),
                'city': shipping_address.get('city', ''),
                'state': shipping_address.get('state', ''),
                'zip': shipping_address.get('zip', ''),
                'country': shipping_address.get('country', 'USA')
            }
        },
        'items': items,
        'subtotal': subtotal,
        'shipping': shipping,
        'total': total,
        'paymentStatus': 'placeholder',
        'createdAt': now.isoformat() + 'Z',
        'updatedAt': now.isoformat() + 'Z'
    }

    return order_record


def save_order_to_dynamodb(order_record: Dict) -> None:
    """
    Save order record to DynamoDB.

    Args:
        order_record: Order record to save

    Raises:
        ClientError: If save fails
    """
    table = dynamodb.Table(ORDERS_TABLE)
    table.put_item(Item=order_record)


def trigger_confirmation_email(order_record: Dict) -> bool:
    """
    Trigger the send_order_confirmation Lambda function.

    Args:
        order_record: Order record to send

    Returns:
        True if invocation successful, False otherwise
    """
    try:
        # Convert Decimals to floats for JSON serialization
        payload = json.loads(json.dumps(order_record, cls=DecimalEncoder))

        lambda_client.invoke(
            FunctionName=SEND_CONFIRMATION_FUNCTION,
            InvocationType='Event',  # Asynchronous invocation
            Payload=json.dumps({'order': payload})
        )
        logger.info(f"Triggered confirmation email for order {order_record['orderId']}")
        return True

    except ClientError as e:
        logger.error(f"Failed to trigger confirmation email: {str(e)}")
        return False


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Main Lambda handler for POST /api/orders.

    Args:
        event: API Gateway event
        context: Lambda context

    Returns:
        API Gateway response with order confirmation
    """
    logger.info(f"Received order creation request")

    # Handle OPTIONS request for CORS preflight
    if event.get('httpMethod') == 'OPTIONS':
        return build_cors_response(200, {'message': 'CORS preflight successful'})

    try:
        # Parse request body
        body = event.get('body', '')

        if isinstance(body, str):
            try:
                body = json.loads(body)
            except json.JSONDecodeError:
                return build_cors_response(400, {
                    'success': False,
                    'error': 'Invalid JSON in request body'
                })

        # Validate customer info
        customer_info = body.get('customerInfo', {})
        customer_errors = validate_customer_info(customer_info)

        if customer_errors:
            return build_cors_response(400, {
                'success': False,
                'error': 'Invalid customer information',
                'details': customer_errors
            })

        # Validate items
        items = body.get('items', [])
        item_errors = validate_items(items)

        if item_errors:
            return build_cors_response(400, {
                'success': False,
                'error': 'Invalid order items',
                'details': item_errors
            })

        # Prepare order record
        order_record = prepare_order_record(body)

        # Save to DynamoDB
        save_order_to_dynamodb(order_record)
        logger.info(f"Order {order_record['orderId']} saved to DynamoDB")

        # Trigger confirmation email (async, non-blocking)
        email_triggered = trigger_confirmation_email(order_record)

        # Return success response
        return build_cors_response(201, {
            'success': True,
            'message': 'Order created successfully',
            'orderId': order_record['orderId'],
            'orderDate': order_record['orderDate'],
            'total': float(order_record['total']),
            'status': order_record['status'],
            'emailNotificationSent': email_triggered
        })

    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        logger.error(f"DynamoDB error: {error_code} - {error_message}")

        return build_cors_response(500, {
            'success': False,
            'error': 'Failed to create order',
            'details': error_message
        })

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)

        return build_cors_response(500, {
            'success': False,
            'error': 'Internal server error',
            'details': str(e)
        })


# For local testing
if __name__ == '__main__':
    test_order = {
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
                'productType': 'die_cut_sticker',
                'size': '5x5',
                'quantity': 50,
                'unitPrice': 1.43,
                'totalPrice': 71.25,
                'artworkS3Url': 's3://layout-tool-randr/orders/test-123.png',
                'instructions': 'Please cut carefully around the edges'
            }
        ],
        'shipping': 0
    }

    test_event = {
        'httpMethod': 'POST',
        'body': json.dumps(test_order)
    }

    print("Testing order creation...")
    # Note: This will fail without AWS credentials configured
    # result = lambda_handler(test_event, None)
    # print(json.dumps(json.loads(result['body']), indent=2))
