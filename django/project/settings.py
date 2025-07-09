from pathlib import Path
import os
from urllib.parse import urlparse
import ast

from dotenv import load_dotenv
load_dotenv()


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = str(os.getenv('SECRET_KEY'))

# SECURITY WARNING: don't run with debug turned on in production!
debug_env = os.getenv('DEBUG', 'True')  # Default to 'True' if not set
DEBUG = ast.literal_eval(debug_env)

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',
    'rest_framework',
    'drf_yasg',
    'rest_framework.authtoken',
    # 'whitenoise.runserver_nostatic',

    'auth_module',
    'users_module',
    'product_management',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'corsheaders.middleware.CorsMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
]

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

AUTH_USER_MODEL = "auth_module.User"

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
]


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'user': '50/minute',  # Limit each user to 5 requests per minute
    },
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # require login for all APIs
    ]
}

WSGI_APPLICATION = 'project.wsgi.application'
ASGI_APPLICATION = 'project.asgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

# for neon db only
tmpPostgres = urlparse(os.getenv("DATABASE_URL"))

DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.postgresql',
       'NAME': str(os.getenv('DBNAME')),
       'USER': str(os.getenv('DBUSER')),
       'PASSWORD': str(os.getenv('DBPASSWORD')),
       'HOST': '127.0.0.1',
       'PORT': '5432',
   }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': tmpPostgres.path.replace('/', ''),
#         'USER': tmpPostgres.username,
#         'PASSWORD': tmpPostgres.password,
#         'HOST': tmpPostgres.hostname,
#         'PORT': 5432,
#     }
# }
# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


#cache setting for lightweight cache
# using file based cache
# for production, you can use redis or memcached
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': os.environ.get('DJANGO_CACHE_LOCATION', '/tmp/django_cache'),
    }
}

# -------------------------------------------- cors settings --------------------------------------
CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = (
  'http://localhost:8000',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://143.110.253.200',
  'https://143.110.253.200'
)
#============================================= cors settings ======================================


# -------------------------------------------- swagger settings --------------------------------------
SWAGGER_ROOT_URL="http://localhost:8000/swagger/"

SWAGGER_SETTINGS = {
    'USE_SESSION_AUTH': False,
    'JSON_EDITOR': True,
    'api_version': '0.1',
    'enabled_methods': [
        'GET',
        'POST',
    ],
    'SECURITY_DEFINITIONS': {
        "api_key": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        },
    }
}

#============================================= swagger settings ======================================

# -------------------------------------------- django message framework --------------------------------------
from django.contrib.messages import constants as messages

MESSAGE_TAGS = {
    messages.INFO: 'alert-info',
    messages.SUCCESS: 'alert-success',
    messages.ERROR: 'alert-danger',
}
#============================================= django message framework ======================================

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"