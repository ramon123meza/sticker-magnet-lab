"""
Utility modules for Sticker & Magnet Lab backend.
"""

from .email_templates import (
    get_customer_confirmation_html,
    get_staff_notification_html,
    get_contact_auto_reply_html,
    get_contact_notification_html
)

__all__ = [
    'get_customer_confirmation_html',
    'get_staff_notification_html',
    'get_contact_auto_reply_html',
    'get_contact_notification_html'
]
