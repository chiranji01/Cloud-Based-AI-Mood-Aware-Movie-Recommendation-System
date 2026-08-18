"""
ASGI config for MoodFlix backend project.

It exposes the ASGI callable as a module-level variable named `application`.
"""

import os

from django.core.asgi import get_asgi_application


# settings.py is now directly inside the backend folder
os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'settings'
)

application = get_asgi_application()