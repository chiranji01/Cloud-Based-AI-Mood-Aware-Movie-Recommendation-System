"""
WSGI config for MoodFlix backend project.

It exposes the WSGI callable as a module-level variable named `application`.
"""

import os

from django.core.wsgi import get_wsgi_application


# settings.py is now directly inside the backend folder
os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'settings'
)

application = get_wsgi_application()