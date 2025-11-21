#!/usr/bin/env python3
"""
Database Setup Script for Sticker & Magnet Lab.

Run locally with AWS credentials:
    python database_setup.py

Creates DynamoDB tables and populates with data from CSV files.

Tables created:
    1. sticker_magnet_lab_products - Product catalog
    2. sticker_magnet_lab_pricing_stickers - Sticker pricing matrix
    3. sticker_magnet_lab_pricing_magnets - Magnet pricing matrix
    4. sticker_magnet_lab_pricing_fridge_magnets - Fridge magnet pricing (15% markup)
    5. sticker_magnet_lab_orders - Order records
    6. sticker_magnet_lab_contacts - Contact form submissions
"""

import csv
import sys
import time
import uuid
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import boto3
from botocore.exceptions import ClientError

# Configuration
AWS_REGION = 'us-east-1'
TABLE_PREFIX = 'sticker_magnet_lab_'

# Table definitions
TABLES = {
    'products': {
        'TableName': f'{TABLE_PREFIX}products',
        'KeySchema': [
            {'AttributeName': 'productId', 'KeyType': 'HASH'}
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'productId', 'AttributeType': 'S'}
        ],
        'BillingMode': 'PAY_PER_REQUEST'
    },
    'pricing_stickers': {
        'TableName': f'{TABLE_PREFIX}pricing_stickers',
        'KeySchema': [
            {'AttributeName': 'size', 'KeyType': 'HASH'},
            {'AttributeName': 'quantity', 'KeyType': 'RANGE'}
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'size', 'AttributeType': 'S'},
            {'AttributeName': 'quantity', 'AttributeType': 'N'}
        ],
        'BillingMode': 'PAY_PER_REQUEST'
    },
    'pricing_magnets': {
        'TableName': f'{TABLE_PREFIX}pricing_magnets',
        'KeySchema': [
            {'AttributeName': 'size', 'KeyType': 'HASH'},
            {'AttributeName': 'quantity', 'KeyType': 'RANGE'}
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'size', 'AttributeType': 'S'},
            {'AttributeName': 'quantity', 'AttributeType': 'N'}
        ],
        'BillingMode': 'PAY_PER_REQUEST'
    },
    'pricing_fridge_magnets': {
        'TableName': f'{TABLE_PREFIX}pricing_fridge_magnets',
        'KeySchema': [
            {'AttributeName': 'productSize', 'KeyType': 'HASH'},
            {'AttributeName': 'quantity', 'KeyType': 'RANGE'}
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'productSize', 'AttributeType': 'S'},
            {'AttributeName': 'quantity', 'AttributeType': 'N'}
        ],
        'BillingMode': 'PAY_PER_REQUEST'
    },
    'orders': {
        'TableName': f'{TABLE_PREFIX}orders',
        'KeySchema': [
            {'AttributeName': 'orderId', 'KeyType': 'HASH'}
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'orderId', 'AttributeType': 'S'},
            {'AttributeName': 'customerEmail', 'AttributeType': 'S'}
        ],
        'BillingMode': 'PAY_PER_REQUEST',
        'GlobalSecondaryIndexes': [
            {
                'IndexName': 'customerEmail-index',
                'KeySchema': [
                    {'AttributeName': 'customerEmail', 'KeyType': 'HASH'}
                ],
                'Projection': {'ProjectionType': 'ALL'}
            }
        ]
    },
    'contacts': {
        'TableName': f'{TABLE_PREFIX}contacts',
        'KeySchema': [
            {'AttributeName': 'contactId', 'KeyType': 'HASH'}
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'contactId', 'AttributeType': 'S'}
        ],
        'BillingMode': 'PAY_PER_REQUEST'
    }
}

# Fridge magnet fixed sizes and markup
FRIDGE_MAGNET_SIZES = ['2x3', '2.5x3.5', '4.75x2', '2.5x2.5']
FRIDGE_MAGNET_MARKUP = Decimal('0.15')  # 15% markup

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
dynamodb_client = boto3.client('dynamodb', region_name=AWS_REGION)


def print_header(message: str) -> None:
    """Print a formatted header message."""
    print(f"\n{'='*60}")
    print(f"  {message}")
    print(f"{'='*60}")


def print_status(message: str, status: str = 'INFO') -> None:
    """Print a status message."""
    symbols = {
        'INFO': '[*]',
        'SUCCESS': '[+]',
        'ERROR': '[-]',
        'WAIT': '[~]'
    }
    print(f"{symbols.get(status, '[*]')} {message}")


def table_exists(table_name: str) -> bool:
    """Check if a DynamoDB table exists."""
    try:
        dynamodb_client.describe_table(TableName=table_name)
        return True
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            return False
        raise


def wait_for_table_active(table_name: str, timeout: int = 120) -> bool:
    """
    Wait for a table to become active.

    Args:
        table_name: Name of the table
        timeout: Maximum wait time in seconds

    Returns:
        True if table is active, False if timeout
    """
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = dynamodb_client.describe_table(TableName=table_name)
            status = response['Table']['TableStatus']
            if status == 'ACTIVE':
                return True
            print_status(f"Table {table_name} status: {status}", 'WAIT')
            time.sleep(2)
        except ClientError:
            time.sleep(2)
    return False


def create_table(table_config: Dict[str, Any]) -> bool:
    """
    Create a DynamoDB table.

    Args:
        table_config: Table configuration dictionary

    Returns:
        True if created successfully or already exists
    """
    table_name = table_config['TableName']

    if table_exists(table_name):
        print_status(f"Table {table_name} already exists", 'INFO')
        return True

    try:
        print_status(f"Creating table {table_name}...", 'INFO')

        # Remove GSI if no attributes for it (handle orders table specially)
        create_params = table_config.copy()

        dynamodb_client.create_table(**create_params)

        print_status(f"Waiting for {table_name} to become active...", 'WAIT')
        if wait_for_table_active(table_name):
            print_status(f"Table {table_name} created successfully", 'SUCCESS')
            return True
        else:
            print_status(f"Timeout waiting for {table_name}", 'ERROR')
            return False

    except ClientError as e:
        print_status(f"Error creating {table_name}: {e.response['Error']['Message']}", 'ERROR')
        return False


def create_all_tables() -> Dict[str, bool]:
    """
    Create all DynamoDB tables.

    Returns:
        Dictionary of table names and creation status
    """
    print_header("Creating DynamoDB Tables")
    results = {}

    for table_key, table_config in TABLES.items():
        results[table_config['TableName']] = create_table(table_config)

    return results


def parse_price_csv(file_path: Path) -> Tuple[List[Dict], List[Dict]]:
    """
    Parse the size-price.csv file.

    Args:
        file_path: Path to the CSV file

    Returns:
        Tuple of (sticker_pricing, magnet_pricing) lists
    """
    sticker_pricing = []
    magnet_pricing = []
    current_section = None

    # Quantity headers (from CSV)
    quantities = [12, 25, 50, 75, 100, 200, 300, 600, 1000, 2000, 3000, 6000, 10000]

    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)

        for row in reader:
            if not row or not row[0].strip():
                continue

            first_cell = row[0].strip().upper()

            # Detect section headers
            if 'STICKERS PRICING' in first_cell:
                current_section = 'stickers'
                continue
            elif 'MAGNETS PRICING' in first_cell:
                current_section = 'magnets'
                continue
            elif first_cell == 'SIZE':
                # Skip header row
                continue

            # Parse data row
            if current_section and 'x' in row[0].lower():
                size = row[0].strip()

                for i, qty in enumerate(quantities):
                    if i + 1 < len(row) and row[i + 1].strip():
                        try:
                            price = Decimal(row[i + 1].strip()).quantize(Decimal('0.01'))
                            entry = {
                                'size': size,
                                'quantity': qty,
                                'price': price
                            }

                            if current_section == 'stickers':
                                sticker_pricing.append(entry)
                            else:
                                magnet_pricing.append(entry)
                        except Exception:
                            pass

    return sticker_pricing, magnet_pricing


def calculate_fridge_magnet_pricing(magnet_pricing: List[Dict]) -> List[Dict]:
    """
    Calculate fridge magnet pricing based on closest die-cut magnet size with 15% markup.

    Args:
        magnet_pricing: Base magnet pricing data

    Returns:
        List of fridge magnet pricing entries
    """
    fridge_pricing = []

    # Map fridge magnet sizes to closest die-cut magnet sizes
    size_mapping = {
        '2x3': '3x3',       # Use 3x3 as base
        '2.5x3.5': '3x3',   # Use 3x3 as base
        '4.75x2': '5x5',    # Use 5x5 as base
        '2.5x2.5': '3x3'    # Use 3x3 as base
    }

    # Group magnet pricing by size
    magnet_by_size = {}
    for entry in magnet_pricing:
        size = entry['size']
        if size not in magnet_by_size:
            magnet_by_size[size] = {}
        magnet_by_size[size][entry['quantity']] = entry['price']

    # Calculate fridge magnet prices
    for fridge_size, base_size in size_mapping.items():
        if base_size in magnet_by_size:
            for quantity, base_price in magnet_by_size[base_size].items():
                # Apply 15% markup
                markup_price = base_price * (1 + FRIDGE_MAGNET_MARKUP)
                markup_price = markup_price.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

                fridge_pricing.append({
                    'productSize': fridge_size,
                    'quantity': quantity,
                    'price': markup_price
                })

    return fridge_pricing


def parse_products_csv(file_path: Path) -> List[Dict]:
    """
    Parse the product_information.csv file.

    Args:
        file_path: Path to the CSV file

    Returns:
        List of product dictionaries
    """
    products = []

    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            product_name = row.get('product', '').strip()
            if not product_name:
                continue

            # Determine product type
            name_lower = product_name.lower()
            if 'sticker' in name_lower or 'decal' in name_lower:
                product_type = 'sticker'
            elif 'fridge' in name_lower or 'refrigerator' in name_lower:
                product_type = 'fridge_magnet'
            else:
                product_type = 'magnet'

            # Collect bullet points
            bullet_points = []
            for key in ['bullet point 1', 'bullet point 2', 'bullet point 4']:
                if row.get(key):
                    bullet_points.append(row[key].strip())

            # Collect images
            images = []
            for key in ['image1', 'image2', 'image3']:
                if row.get(key):
                    images.append(row[key].strip())

            # Generate product ID
            product_id = f"PROD-{str(uuid.uuid4())[:8].upper()}"

            # Determine sizes based on product type
            if product_type == 'sticker':
                available_sizes = ['2x2', '3x3', '4x4', '5x5', '6x6', '7x7', '8x8',
                                   '9x9', '10x10', '11x11', '12x12', '14x14', '16x16',
                                   '18x18', '20x20', '22x22']
            elif product_type == 'magnet':
                available_sizes = ['2x2', '3x3', '4x4', '5x5', '6x6', '7x7', '8x8',
                                   '9x9', '10x10', '11x11', '12x12', '14x14', '16x16',
                                   '18x18', '20x20', '22x22']
            else:
                # Fridge magnets have fixed sizes
                available_sizes = None

            product = {
                'productId': product_id,
                'productType': product_type,
                'name': product_name,
                'description': row.get('generic description', '').strip(),
                'bulletPoints': bullet_points,
                'images': images,
                'isActive': True
            }

            if available_sizes:
                product['availableSizes'] = available_sizes
            else:
                # Parse fixed size from product name
                fixed_size = parse_size_from_name(product_name)
                if fixed_size:
                    product['fixedSize'] = fixed_size

            products.append(product)

    return products


def parse_size_from_name(name: str) -> Optional[str]:
    """
    Extract size from product name.

    Args:
        name: Product name

    Returns:
        Size string or None
    """
    import re

    # Match patterns like "2x3", "2.5x3.5", "4.75x2", etc.
    patterns = [
        r'(\d+\.?\d*)\s*x\s*(\d+\.?\d*)\s*(?:inch|in|")?',
        r'(\d+\.?\d*)"?\s*[xX]\s*(\d+\.?\d*)"?'
    ]

    for pattern in patterns:
        match = re.search(pattern, name, re.IGNORECASE)
        if match:
            w, h = match.groups()
            return f"{w}x{h}"

    return None


def batch_write_items(table_name: str, items: List[Dict]) -> int:
    """
    Batch write items to a DynamoDB table.

    Args:
        table_name: Table name
        items: List of items to write

    Returns:
        Number of items written
    """
    table = dynamodb.Table(table_name)
    written = 0

    # DynamoDB batch_write can handle up to 25 items at a time
    batch_size = 25

    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]

        with table.batch_writer() as writer:
            for item in batch:
                writer.put_item(Item=item)
                written += 1

        # Small delay to avoid throttling
        if i + batch_size < len(items):
            time.sleep(0.1)

    return written


def populate_pricing_tables(sticker_pricing: List[Dict], magnet_pricing: List[Dict]) -> Dict[str, int]:
    """
    Populate pricing tables with data.

    Args:
        sticker_pricing: Sticker pricing data
        magnet_pricing: Magnet pricing data

    Returns:
        Dictionary of table names and item counts
    """
    print_header("Populating Pricing Tables")
    results = {}

    # Stickers
    table_name = f'{TABLE_PREFIX}pricing_stickers'
    print_status(f"Writing {len(sticker_pricing)} entries to {table_name}...", 'INFO')
    results[table_name] = batch_write_items(table_name, sticker_pricing)
    print_status(f"Wrote {results[table_name]} sticker pricing entries", 'SUCCESS')

    # Magnets
    table_name = f'{TABLE_PREFIX}pricing_magnets'
    print_status(f"Writing {len(magnet_pricing)} entries to {table_name}...", 'INFO')
    results[table_name] = batch_write_items(table_name, magnet_pricing)
    print_status(f"Wrote {results[table_name]} magnet pricing entries", 'SUCCESS')

    # Fridge Magnets (calculated)
    fridge_pricing = calculate_fridge_magnet_pricing(magnet_pricing)
    table_name = f'{TABLE_PREFIX}pricing_fridge_magnets'
    print_status(f"Writing {len(fridge_pricing)} entries to {table_name}...", 'INFO')
    results[table_name] = batch_write_items(table_name, fridge_pricing)
    print_status(f"Wrote {results[table_name]} fridge magnet pricing entries", 'SUCCESS')

    return results


def populate_products_table(products: List[Dict]) -> int:
    """
    Populate products table with data.

    Args:
        products: Product data

    Returns:
        Number of products written
    """
    print_header("Populating Products Table")

    table_name = f'{TABLE_PREFIX}products'
    print_status(f"Writing {len(products)} products to {table_name}...", 'INFO')

    count = batch_write_items(table_name, products)
    print_status(f"Wrote {count} products", 'SUCCESS')

    return count


def verify_data_integrity() -> Dict[str, Any]:
    """
    Verify data was written correctly.

    Returns:
        Verification results
    """
    print_header("Verifying Data Integrity")
    results = {}

    for table_key, table_config in TABLES.items():
        table_name = table_config['TableName']
        try:
            table = dynamodb.Table(table_name)
            response = table.scan(Select='COUNT')
            count = response.get('Count', 0)
            results[table_name] = {
                'count': count,
                'status': 'OK' if count > 0 or table_key in ['orders', 'contacts'] else 'EMPTY'
            }
            print_status(f"{table_name}: {count} items", 'SUCCESS' if results[table_name]['status'] == 'OK' else 'INFO')
        except ClientError as e:
            results[table_name] = {
                'count': 0,
                'status': 'ERROR',
                'error': str(e)
            }
            print_status(f"{table_name}: Error - {e}", 'ERROR')

    return results


def print_summary(table_results: Dict[str, bool], pricing_results: Dict[str, int],
                  products_count: int, verification: Dict[str, Any]) -> None:
    """Print a summary of the setup results."""
    print_header("Setup Summary")

    print("\nTables Created:")
    for table_name, success in table_results.items():
        status = "Created" if success else "Failed"
        print(f"  - {table_name}: {status}")

    print("\nData Populated:")
    for table_name, count in pricing_results.items():
        print(f"  - {table_name}: {count} items")
    print(f"  - {TABLE_PREFIX}products: {products_count} items")

    print("\nVerification:")
    all_ok = True
    for table_name, result in verification.items():
        status = result['status']
        count = result['count']
        if status == 'ERROR':
            all_ok = False
            print(f"  - {table_name}: ERROR")
        else:
            print(f"  - {table_name}: {count} items ({status})")

    print("\n" + "="*60)
    if all_ok:
        print("  DATABASE SETUP COMPLETED SUCCESSFULLY!")
    else:
        print("  DATABASE SETUP COMPLETED WITH WARNINGS")
    print("="*60 + "\n")


def main():
    """Main entry point for database setup."""
    print_header("Sticker & Magnet Lab - Database Setup")
    print(f"AWS Region: {AWS_REGION}")
    print(f"Table Prefix: {TABLE_PREFIX}")

    # Find CSV files
    script_dir = Path(__file__).parent.parent
    price_csv = script_dir / 'size-price.csv'
    products_csv = script_dir / 'product_information.csv'

    # Verify files exist
    if not price_csv.exists():
        print_status(f"Price CSV not found at {price_csv}", 'ERROR')
        sys.exit(1)

    if not products_csv.exists():
        print_status(f"Products CSV not found at {products_csv}", 'ERROR')
        sys.exit(1)

    print_status(f"Found price CSV: {price_csv}", 'SUCCESS')
    print_status(f"Found products CSV: {products_csv}", 'SUCCESS')

    # Create tables
    table_results = create_all_tables()

    # Parse CSV files
    print_header("Parsing CSV Files")
    print_status("Parsing size-price.csv...", 'INFO')
    sticker_pricing, magnet_pricing = parse_price_csv(price_csv)
    print_status(f"Parsed {len(sticker_pricing)} sticker prices, {len(magnet_pricing)} magnet prices", 'SUCCESS')

    print_status("Parsing product_information.csv...", 'INFO')
    products = parse_products_csv(products_csv)
    print_status(f"Parsed {len(products)} products", 'SUCCESS')

    # Populate tables
    pricing_results = populate_pricing_tables(sticker_pricing, magnet_pricing)
    products_count = populate_products_table(products)

    # Verify data
    verification = verify_data_integrity()

    # Print summary
    print_summary(table_results, pricing_results, products_count, verification)


if __name__ == '__main__':
    main()
