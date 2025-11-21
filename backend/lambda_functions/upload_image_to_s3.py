"""
Lambda function to handle image uploads to S3.

Endpoint: POST /api/upload
Body: {
    "image": base64_string,
    "filename": "original.png",
    "sessionId": "uuid"
}

Uploads the decoded image to S3 and returns the S3 URL.
"""

import json
import os
import base64
import uuid
import logging
import mimetypes
from datetime import datetime
from typing import Any, Dict, Optional, Tuple

import boto3
from botocore.exceptions import ClientError

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize S3 client
s3_client = boto3.client('s3')

# Configuration
S3_BUCKET = os.environ.get('S3_BUCKET', 'layout-tool-randr')
S3_PREFIX = os.environ.get('S3_PREFIX', 'orders/')
MAX_FILE_SIZE = int(os.environ.get('MAX_FILE_SIZE', 10 * 1024 * 1024))  # 10MB default

# Allowed file types
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
ALLOWED_CONTENT_TYPES = {'image/jpeg', 'image/png'}


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
        'body': json.dumps(body)
    }


def validate_file_extension(filename: str) -> Tuple[bool, str]:
    """
    Validate that the file has an allowed extension.

    Args:
        filename: Original filename

    Returns:
        Tuple of (is_valid, extension)
    """
    if not filename:
        return False, ''

    # Extract extension
    if '.' not in filename:
        return False, ''

    extension = filename.rsplit('.', 1)[-1].lower()
    return extension in ALLOWED_EXTENSIONS, extension


def detect_image_type(image_data: bytes) -> Optional[str]:
    """
    Detect image type from binary data using magic bytes.

    Args:
        image_data: Raw image bytes

    Returns:
        Image type ('png' or 'jpeg') or None if not recognized
    """
    # PNG magic bytes
    if image_data[:8] == b'\x89PNG\r\n\x1a\n':
        return 'png'

    # JPEG magic bytes
    if image_data[:2] == b'\xff\xd8':
        return 'jpeg'

    return None


def generate_unique_filename(session_id: str, original_filename: str, extension: str) -> str:
    """
    Generate a unique filename for S3 storage.

    Format: {session_id}_{timestamp}_{uuid}.{extension}

    Args:
        session_id: User session ID
        original_filename: Original uploaded filename
        extension: File extension

    Returns:
        Unique filename string
    """
    timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4())[:8]

    # Sanitize session_id
    safe_session_id = ''.join(c for c in session_id if c.isalnum() or c in '-_')[:50]

    return f"{safe_session_id}_{timestamp}_{unique_id}.{extension}"


def decode_base64_image(base64_string: str) -> bytes:
    """
    Decode base64 image string to bytes.

    Handles both plain base64 and data URL format.

    Args:
        base64_string: Base64 encoded image string

    Returns:
        Decoded image bytes

    Raises:
        ValueError: If decoding fails
    """
    # Handle data URL format (e.g., "data:image/png;base64,...")
    if ',' in base64_string and base64_string.startswith('data:'):
        base64_string = base64_string.split(',', 1)[1]

    # Remove any whitespace
    base64_string = base64_string.strip()

    try:
        return base64.b64decode(base64_string)
    except Exception as e:
        raise ValueError(f"Invalid base64 encoding: {str(e)}")


def upload_to_s3(image_data: bytes, filename: str, content_type: str) -> str:
    """
    Upload image data to S3.

    Args:
        image_data: Raw image bytes
        filename: Filename to use in S3
        content_type: MIME content type

    Returns:
        S3 URL of uploaded file

    Raises:
        ClientError: If upload fails
    """
    s3_key = f"{S3_PREFIX}{filename}"

    s3_client.put_object(
        Bucket=S3_BUCKET,
        Key=s3_key,
        Body=image_data,
        ContentType=content_type,
        Metadata={
            'upload-timestamp': datetime.utcnow().isoformat(),
            'source': 'sticker-magnet-lab'
        }
    )

    # Generate S3 URL
    s3_url = f"s3://{S3_BUCKET}/{s3_key}"

    # Also generate HTTPS URL
    https_url = f"https://{S3_BUCKET}.s3.amazonaws.com/{s3_key}"

    return s3_url, https_url


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Main Lambda handler for POST /api/upload.

    Args:
        event: API Gateway event
        context: Lambda context

    Returns:
        API Gateway response with upload result
    """
    logger.info("Received upload request")

    # Handle OPTIONS request for CORS preflight
    if event.get('httpMethod') == 'OPTIONS':
        return build_cors_response(200, {'message': 'CORS preflight successful'})

    try:
        # Parse request body
        body = event.get('body', '')

        # Handle base64-encoded body from API Gateway
        if event.get('isBase64Encoded', False):
            body = base64.b64decode(body).decode('utf-8')

        if isinstance(body, str):
            try:
                body = json.loads(body)
            except json.JSONDecodeError:
                return build_cors_response(400, {
                    'success': False,
                    'error': 'Invalid JSON in request body'
                })

        # Extract required fields
        image_base64 = body.get('image')
        filename = body.get('filename', 'upload.png')
        session_id = body.get('sessionId', str(uuid.uuid4()))

        # Validate required fields
        if not image_base64:
            return build_cors_response(400, {
                'success': False,
                'error': 'Missing required field: image'
            })

        # Validate file extension
        is_valid_ext, extension = validate_file_extension(filename)
        if not is_valid_ext:
            return build_cors_response(400, {
                'success': False,
                'error': f'Invalid file type. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'
            })

        # Decode base64 image
        try:
            image_data = decode_base64_image(image_base64)
        except ValueError as e:
            return build_cors_response(400, {
                'success': False,
                'error': str(e)
            })

        # Validate file size
        if len(image_data) > MAX_FILE_SIZE:
            return build_cors_response(400, {
                'success': False,
                'error': f'File too large. Maximum size: {MAX_FILE_SIZE // (1024 * 1024)}MB'
            })

        # Detect actual image type from content
        detected_type = detect_image_type(image_data)
        if not detected_type:
            return build_cors_response(400, {
                'success': False,
                'error': 'Invalid image format. Only JPG and PNG are supported.'
            })

        # Use detected type for consistency
        if detected_type == 'jpeg':
            content_type = 'image/jpeg'
            extension = 'jpg'
        else:
            content_type = 'image/png'
            extension = 'png'

        # Generate unique filename
        unique_filename = generate_unique_filename(session_id, filename, extension)

        # Upload to S3
        s3_url, https_url = upload_to_s3(image_data, unique_filename, content_type)

        logger.info(f"Successfully uploaded {unique_filename} to S3")

        return build_cors_response(200, {
            'success': True,
            'message': 'Image uploaded successfully',
            's3Url': s3_url,
            'httpsUrl': https_url,
            'filename': unique_filename,
            'fileSize': len(image_data),
            'contentType': content_type
        })

    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        logger.error(f"S3 error: {error_code} - {error_message}")

        return build_cors_response(500, {
            'success': False,
            'error': 'Failed to upload image to storage',
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
    # Create a simple test image (1x1 transparent PNG)
    test_png_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

    test_event = {
        'httpMethod': 'POST',
        'body': json.dumps({
            'image': test_png_base64,
            'filename': 'test.png',
            'sessionId': 'test-session-123'
        })
    }

    print("Testing upload handler...")
    # Note: This will fail without AWS credentials configured
    # result = lambda_handler(test_event, None)
    # print(json.dumps(json.loads(result['body']), indent=2))
