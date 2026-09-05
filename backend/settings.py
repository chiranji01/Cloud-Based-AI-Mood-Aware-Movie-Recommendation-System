"""
Django settings for the MoodFlix backend project.
"""

from pathlib import Path

from dotenv import load_dotenv
import os
import sys

import django.db.backends.mysql.base


# =========================================================
# MySQL / MariaDB compatibility
# =========================================================

_original_check = (
    django.db.backends.mysql.base.DatabaseWrapper
    .check_database_version_supported
)


def _skip_version_check(self):
    pass


django.db.backends.mysql.base.DatabaseWrapper.check_database_version_supported = (
    _skip_version_check
)


# =========================================================
# Project paths
# =========================================================

# settings.py is now directly inside:
# Cloud-Based-AI-Recommendation-System/backend/
BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

# Main GitHub project folder:
# Cloud-Based-AI-Recommendation-System/
PROJECT_ROOT = BASE_DIR.parent

# Allows Django to access the separate recommendation folder
# located in the main project directory.
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))


# =========================================================
# Security / Development Settings
# =========================================================

SECRET_KEY = (
    'django-insecure-f%v5rqfd(hru$ffld_3#cx47p^4t@0w&'
    'ydc0#j-xkio=v^@i#w'
)

DEBUG = True

ALLOWED_HOSTS = []


# =========================================================
# Installed Applications
# =========================================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework', # Django REST Framework
    'moviesapp', # MovieLens database/API integration
    'corsheaders',
]


# =========================================================
# Middleware
# =========================================================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# =========================================================
# URL Configuration
# =========================================================

# urls.py is now directly inside backend/
ROOT_URLCONF = 'urls'


# =========================================================
# Templates
# =========================================================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',

        # backend/templates/
        'DIRS': [
            BASE_DIR / 'templates',
        ],

        'APP_DIRS': True,

        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# =========================================================
# WSGI
# =========================================================

# wsgi.py is now directly inside backend/
WSGI_APPLICATION = 'wsgi.application'


# =========================================================
# Database
# =========================================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',

        'NAME': 'movie_recommendation_db',

        'USER': 'root',

        'PASSWORD': '',

        'HOST': '127.0.0.1',

        'PORT': '3307',

        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        },
    }
}


# =========================================================
# Password Validation
# =========================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': (
            'django.contrib.auth.password_validation.'
            'UserAttributeSimilarityValidator'
        ),
    },
    {
        'NAME': (
            'django.contrib.auth.password_validation.'
            'MinimumLengthValidator'
        ),
    },
    {
        'NAME': (
            'django.contrib.auth.password_validation.'
            'CommonPasswordValidator'
        ),
    },
    {
        'NAME': (
            'django.contrib.auth.password_validation.'
            'NumericPasswordValidator'
        ),
    },
]


# =========================================================
# Internationalisation
# =========================================================

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# =========================================================
# Static and Media Files
# =========================================================

STATIC_URL = 'static/'

# Collected static files
STATIC_ROOT = BASE_DIR / 'static_cdn'

MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_DIR / 'media'


# =========================================================
# Default Primary Key
# =========================================================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
     "https://d16slr83hwnfn6.cloudfront.net",
]


