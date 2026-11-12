"""
ALAMAT — Django settings.

Django is the main application: it serves the game page, owns accounts (sign up /
sign in) and stores progress. Configuration comes from environment variables, and
from a local `.env` file if one exists (copy .env.example). Never commit `.env`.
"""
from pathlib import Path
import os

from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent


def _load_dotenv(path: Path) -> None:
    """Tiny .env reader (KEY=VALUE lines). Real environment variables win."""
    if not path.is_file():
        return
    for line in path.read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, _, value = line.partition('=')
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_dotenv(BASE_DIR / '.env')


def _csv(name: str, default: str = '') -> list[str]:
    return [v.strip() for v in os.environ.get(name, default).split(',') if v.strip()]


_DEV_KEY = 'django-insecure-alamat-dev-only-change-me-in-production'
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', _DEV_KEY)
DEBUG = os.environ.get('DJANGO_DEBUG', '1') == '1'
if not DEBUG and SECRET_KEY == _DEV_KEY:
    raise ImproperlyConfigured('Set DJANGO_SECRET_KEY when DJANGO_DEBUG is not 1.')

ALLOWED_HOSTS = _csv('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1')
CSRF_TRUSTED_ORIGINS = _csv('DJANGO_CSRF_TRUSTED_ORIGINS')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'game',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
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

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.environ.get('DJANGO_DB_PATH', str(BASE_DIR / 'db.sqlite3')),
    }
}

# ---- accounts -------------------------------------------------------------
AUTHENTICATION_BACKENDS = ['game.accounts.CaseInsensitiveBackend']
# Consistent password policy for browser and API registration.
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
     'OPTIONS': {'min_length': 8}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]
import sys
if 'test' in sys.argv:  # fast hashing for the test suite only
    PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
LOGIN_URL = 'login'
LOGIN_REDIRECT_URL = 'play'
LOGOUT_REDIRECT_URL = 'login'

# Sign-in throttle: after this many failures for the same IP + username, lock out
# for LOGIN_LOCKOUT_SECONDS. Uses the cache below (swap for a shared cache when
# running several workers).
LOGIN_MAX_FAILURES = int(os.environ.get('ALAMAT_LOGIN_MAX_FAILURES', '8'))
LOGIN_LOCKOUT_SECONDS = int(os.environ.get('ALAMAT_LOGIN_LOCKOUT_SECONDS', '300'))
CACHES = {'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}}

# Cookies: secure by default outside DEBUG (override only if TLS is terminated elsewhere).
_secure = os.environ.get('DJANGO_SECURE_COOKIES', '0' if DEBUG else '1') == '1'
SESSION_COOKIE_SECURE = _secure
CSRF_COOKIE_SECURE = _secure
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# The browser game is served by this same Django site, so no CORS setup is needed.
# (If a client is ever hosted elsewhere, add django-cors-headers back with an explicit
# origin allow-list — never CORS_ALLOW_ALL_ORIGINS together with credentials.)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',    # scripts / curl (gives 401s)
        'rest_framework.authentication.SessionAuthentication',  # the game page (CSRF-protected)
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
}
