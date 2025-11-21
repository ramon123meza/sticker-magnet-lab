"""
Lambda function to retrieve pricing matrix from DynamoDB.

Endpoint: GET /api/pricing
Query params:
    ?type=sticker|magnet|fridge (required)
    &size=5x5 (optional)

Returns pricing data for the specified product type.
Fridge magnet prices include 15% markup over closest die-cut magnet.
"""

import json
import os
import logging
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List, Optional

import boto3
from botocore.exceptions import ClientError

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')

# Table names from environment or defaults
PRICING_STICKERS_TABLE = os.environ.get('PRICING_STICKERS_TABLE', 'sticker_magnet_lab_pricing_stickers')
PRICING_MAGNETS_TABLE = os.environ.get('PRICING_MAGNETS_TABLE', 'sticker_magnet_lab_pricing_magnets')
PRICING_FRIDGE_MAGNETS_TABLE = os.environ.get('PRICING_FRIDGE_MAGNETS_TABLE', 'sticker_magnet_lab_pricing_fridge_magnets')

# Fridge magnet markup percentage
FRIDGE_MAGNET_MARKUP = Decimal('0.15')


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
            'Access-Control-Allow-Methods': 'GET,OPTIONS'
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }


def get_table_name_for_type(product_type: str) -> Optional[str]:
    """
    Get the appropriate DynamoDB table name for a product type.

    Args:
        product_type: Product type string

    Returns:
        Table name or None if invalid type
    """
    type_to_table = {
        'sticker': PRICING_STICKERS_TABLE,
        'magnet': PRICING_MAGNETS_TABLE,
        'fridge': PRICING_FRIDGE_MAGNETS_TABLE
    }
    return type_to_table.get(product_type.lower())


def get_pricing_for_size(table_name: str, size: str) -> List[Dict]:
    """
    Get all pricing entries for a specific size.

    Args:
        table_name: DynamoDB table name
        size: Size string (e.g., '5x5')

    Returns:
        List of pricing entries for the size
    """
    table = dynamodb.Table(table_name)

    response = table.query(
        KeyConditionExpression='#size = :size',
        ExpressionAttributeNames={'#size': 'size'},
        ExpressionAttributeValues={':size': size}
    )

    return response.get('Items', [])


def get_all_pricing(table_name: str) -> Dict[str, List[Dict]]:
    """
    Get all pricing data from a table, organized by size.

    Args:
        table_name: DynamoDB table name

    Returns:
        Dictionary with sizes as keys and pricing lists as values
    """
    table = dynamodb.Table(table_name)

    pricing_data = {}
    last_evaluated_key = None

    while True:
        if last_evaluated_key:
            response = table.scan(ExclusiveStartKey=last_evaluated_key)
        else:
            response = table.scan()

        for item in response.get('Items', []):
            size = item.get('size', 'unknown')
            if size not in pricing_data:
                pricing_data[size] = []
            pricing_data[size].append({
                'quantity': int(item.get('quantity', 0)),
                'price': item.get('price')
            })

        last_evaluated_key = response.get('LastEvaluatedKey')
        if not last_evaluated_key:
            break

    # Sort quantities within each size
    for size in pricing_data:
        pricing_data[size].sort(key=lambda x: x['quantity'])

    return pricing_data


def format_pricing_response(pricing_data: Dict[str, List[Dict]], product_type: str) -> Dict[str, Any]:
    """
    Format pricing data for response.

    Args:
        pricing_data: Raw pricing data organized by size
        product_type: Product type string

    Returns:
        Formatted pricing response
    """
    # Extract available sizes and quantities
    sizes = sorted(pricing_data.keys(), key=lambda x: parse_size_for_sorting(x))

    quantities = set()
    for size_data in pricing_data.values():
        for entry in size_data:
            quantities.add(entry['quantity'])
    quantities = sorted(list(quantities))

    # Build pricing matrix
    matrix = {}
    for size, entries in pricing_data.items():
        matrix[size] = {entry['quantity']: entry['price'] for entry in entries}

    return {
        'productType': product_type,
        'availableSizes': sizes,
        'availableQuantities': quantities,
        'pricingMatrix': matrix,
        'pricingBySize': pricing_data
    }


def parse_size_for_sorting(size: str) -> tuple:
    """
    Parse size string for numerical sorting.

    Args:
        size: Size string like '5x5' or '2.5x3.5'

    Returns:
        Tuple of dimensions for sorting
    """
    try:
        parts = size.lower().replace('inch', '').replace('"', '').strip().split('x')
        return tuple(float(p.strip()) for p in parts)
    except (ValueError, AttributeError):
        return (float('inf'),)


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Main Lambda handler for GET /api/pricing.

    Args:
        event: API Gateway event
        context: Lambda context

    Returns:
        API Gateway response with pricing data
    """
    logger.info(f"Received event: {json.dumps(event)}")

    # Handle OPTIONS request for CORS preflight
    if event.get('httpMethod') == 'OPTIONS':
        return build_cors_response(200, {'message': 'CORS preflight successful'})

    try:
        # Extract query parameters
        query_params = event.get('queryStringParameters') or {}
        product_type: Optional[str] = query_params.get('type')
        size: Optional[str] = query_params.get('size')

        logger.info(f"Query parameters: type={product_type}, size={size}")

        # Validate required type parameter
        if not product_type:
            return build_cors_response(400, {
                'success': False,
                'error': 'Missing required parameter: type',
                'validTypes': ['sticker', 'magnet', 'fridge']
            })

        # Get table name for product type
        table_name = get_table_name_for_type(product_type)
        if not table_name:
            return build_cors_response(400, {
                'success': False,
                'error': f"Invalid product type: {product_type}",
                'validTypes': ['sticker', 'magnet', 'fridge']
            })

        # Retrieve pricing data
        if size:
            # Get pricing for specific size
            size_pricing = get_pricing_for_size(table_name, size)

            if not size_pricing:
                return build_cors_response(404, {
                    'success': False,
                    'error': f"No pricing found for size: {size}",
                    'productType': product_type
                })

            # Format response for single size
            pricing_entries = [
                {'quantity': int(item['quantity']), 'price': item['price']}
                for item in size_pricing
            ]
            pricing_entries.sort(key=lambda x: x['quantity'])

            response_data = {
                'success': True,
                'productType': product_type,
                'size': size,
                'pricing': pricing_entries
            }

        else:
            # Get all pricing
            pricing_data = get_all_pricing(table_name)

            if not pricing_data:
                return build_cors_response(404, {
                    'success': False,
                    'error': f"No pricing data found for type: {product_type}"
                })

            formatted_pricing = format_pricing_response(pricing_data, product_type)

            response_data = {
                'success': True,
                **formatted_pricing
            }

        logger.info(f"Returning pricing data for {product_type}")
        return build_cors_response(200, response_data)

    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        logger.error(f"DynamoDB error: {error_code} - {error_message}")

        return build_cors_response(500, {
            'success': False,
            'error': 'Database error occurred',
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
    # Test events
    test_events = [
        {'httpMethod': 'GET', 'queryStringParameters': {'type': 'sticker'}},
        {'httpMethod': 'GET', 'queryStringParameters': {'type': 'magnet', 'size': '5x5'}},
        {'httpMethod': 'GET', 'queryStringParameters': {'type': 'fridge'}},
    ]

    for event in test_events:
        print(f"\nTesting: {event['queryStringParameters']}")
        result = lambda_handler(event, None)
        print(f"Status: {result['statusCode']}")
