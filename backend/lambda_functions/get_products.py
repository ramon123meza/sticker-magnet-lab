"""
Lambda function to retrieve products from DynamoDB.

Endpoint: GET /api/products
Query params: ?type=sticker|magnet|fridge (optional)

Returns all products or filtered by product type.
"""

import json
import os
import logging
from decimal import Decimal
from typing import Any, Dict, List, Optional

import boto3
from botocore.exceptions import ClientError

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
PRODUCTS_TABLE = os.environ.get('PRODUCTS_TABLE', 'sticker_magnet_lab_products')


class DecimalEncoder(json.JSONEncoder):
    """Custom JSON encoder for Decimal types."""

    def default(self, obj: Any) -> Any:
        if isinstance(obj, Decimal):
            # Convert to float for JSON serialization
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
            'Access-Control-Allow-Methods': 'GET,OPTIONS'
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }


def filter_products_by_type(products: List[Dict], product_type: str) -> List[Dict]:
    """
    Filter products by type.

    Args:
        products: List of product dictionaries
        product_type: Type to filter by ('sticker', 'magnet', 'fridge')

    Returns:
        Filtered list of products
    """
    type_mapping = {
        'sticker': ['sticker', 'die_cut_sticker', 'vinyl_sticker'],
        'magnet': ['magnet', 'die_cut_magnet', 'flat_magnet'],
        'fridge': ['fridge_magnet', 'refrigerator_magnet']
    }

    allowed_types = type_mapping.get(product_type.lower(), [product_type.lower()])

    return [
        product for product in products
        if product.get('productType', '').lower() in allowed_types
    ]


def get_all_products() -> List[Dict]:
    """
    Retrieve all products from DynamoDB.

    Returns:
        List of product dictionaries

    Raises:
        ClientError: If DynamoDB operation fails
    """
    table = dynamodb.Table(PRODUCTS_TABLE)

    products = []
    last_evaluated_key = None

    # Handle pagination for large datasets
    while True:
        if last_evaluated_key:
            response = table.scan(ExclusiveStartKey=last_evaluated_key)
        else:
            response = table.scan()

        products.extend(response.get('Items', []))

        last_evaluated_key = response.get('LastEvaluatedKey')
        if not last_evaluated_key:
            break

    return products


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Main Lambda handler for GET /api/products.

    Args:
        event: API Gateway event
        context: Lambda context

    Returns:
        API Gateway response with products list
    """
    logger.info(f"Received event: {json.dumps(event)}")

    # Handle OPTIONS request for CORS preflight
    if event.get('httpMethod') == 'OPTIONS':
        return build_cors_response(200, {'message': 'CORS preflight successful'})

    try:
        # Extract query parameters
        query_params = event.get('queryStringParameters') or {}
        product_type: Optional[str] = query_params.get('type')

        logger.info(f"Query parameters: {query_params}")

        # Retrieve products from DynamoDB
        products = get_all_products()

        # Filter by type if specified
        if product_type:
            valid_types = ['sticker', 'magnet', 'fridge']
            if product_type.lower() not in valid_types:
                return build_cors_response(400, {
                    'success': False,
                    'error': f"Invalid product type. Must be one of: {', '.join(valid_types)}",
                    'products': []
                })

            products = filter_products_by_type(products, product_type)
            logger.info(f"Filtered to {len(products)} products of type '{product_type}'")

        # Sort products by name for consistent ordering
        products.sort(key=lambda x: x.get('name', ''))

        logger.info(f"Returning {len(products)} products")

        return build_cors_response(200, {
            'success': True,
            'count': len(products),
            'products': products
        })

    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        logger.error(f"DynamoDB error: {error_code} - {error_message}")

        return build_cors_response(500, {
            'success': False,
            'error': 'Database error occurred',
            'details': error_message,
            'products': []
        })

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)

        return build_cors_response(500, {
            'success': False,
            'error': 'Internal server error',
            'details': str(e),
            'products': []
        })


# For local testing
if __name__ == '__main__':
    # Test event
    test_event = {
        'httpMethod': 'GET',
        'queryStringParameters': None
    }

    result = lambda_handler(test_event, None)
    print(json.dumps(json.loads(result['body']), indent=2))
