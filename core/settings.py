from pathlib import Path
import os

import dj_database_url


# ============================================================
# BASE DIRECTORY
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent


# ============================================================
# SECURITY
# ============================================================

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-local-development-key-change-in-production"
)

DEBUG = os.environ.get(
    "DEBUG",
    "True"
).lower() == "true"


ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "school-management-backend-igpt.onrender.com",
]


# Optional Render hostname
RENDER_EXTERNAL_HOSTNAME = os.environ.get(
    "RENDER_EXTERNAL_HOSTNAME"
)

if RENDER_EXTERNAL_HOSTNAME:
    if RENDER_EXTERNAL_HOSTNAME not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)


# ============================================================
# APPLICATIONS
# ============================================================

INSTALLED_APPS = [

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",

    "school",
]


# ============================================================
# MIDDLEWARE
# ============================================================

MIDDLEWARE = [

    "django.middleware.security.SecurityMiddleware",

    "corsheaders.middleware.CorsMiddleware",

    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ============================================================
# URL CONFIGURATION
# ============================================================

ROOT_URLCONF = "core.urls"


# ============================================================
# TEMPLATES
# ============================================================

TEMPLATES = [

    {
        "BACKEND":
            "django.template.backends.django.DjangoTemplates",

        "DIRS": [],

        "APP_DIRS": True,

        "OPTIONS": {

            "context_processors": [

                "django.template.context_processors.request",

                "django.contrib.auth.context_processors.auth",

                "django.contrib.messages.context_processors.messages",

            ],

        },

    },

]


# ============================================================
# WSGI
# ============================================================

WSGI_APPLICATION = "core.wsgi.application"


# ============================================================
# DATABASE
# ============================================================

DATABASE_URL = os.environ.get("DATABASE_URL")

# Render provides the RENDER environment variable.
#
# LOCAL:
#     RENDER is normally absent/None.
#     Therefore SQLite is used.
#
# RENDER:
#     RENDER=true.
#     Therefore DATABASE_URL is used for PostgreSQL.

IS_RENDER = os.environ.get(
    "RENDER",
    ""
).lower() == "true"


if IS_RENDER:

    # --------------------------------------------------------
    # PRODUCTION DATABASE - RENDER POSTGRESQL
    # --------------------------------------------------------

    if not DATABASE_URL:
        raise RuntimeError(
            "DATABASE_URL is missing on Render."
        )

    DATABASES = {

        "default": dj_database_url.parse(

            DATABASE_URL,

            conn_max_age=600,

            ssl_require=True,

        )

    }

    print("DATABASE: Production PostgreSQL")


else:

    # --------------------------------------------------------
    # LOCAL DEVELOPMENT DATABASE - SQLITE
    # --------------------------------------------------------
    #
    # IMPORTANT:
    # Even if DATABASE_URL exists on the local computer,
    # it is deliberately ignored here.
    #
    # This prevents the local machine from attempting to
    # connect to the Render PostgreSQL database.
    # --------------------------------------------------------

    DATABASES = {

        "default": {

            "ENGINE":
                "django.db.backends.sqlite3",

            "NAME":
                BASE_DIR / "db.sqlite3",

        }

    }

    print("DATABASE: Local SQLite db.sqlite3")


# ============================================================
# PASSWORD VALIDATION
# ============================================================

AUTH_PASSWORD_VALIDATORS = [

    {
        "NAME":
            "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },

    {
        "NAME":
            "django.contrib.auth.password_validation.MinimumLengthValidator",
    },

    {
        "NAME":
            "django.contrib.auth.password_validation.CommonPasswordValidator",
    },

    {
        "NAME":
            "django.contrib.auth.password_validation.NumericPasswordValidator",
    },

]


# ============================================================
# INTERNATIONALIZATION
# ============================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Africa/Nairobi"

USE_I18N = True

USE_TZ = True


# ============================================================
# STATIC FILES
# ============================================================

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = []


STORAGES = {

    "default": {

        "BACKEND":
            "django.core.files.storage.FileSystemStorage",

    },

    "staticfiles": {

        "BACKEND":
            "whitenoise.storage.CompressedManifestStaticFilesStorage",

    },

}


# ============================================================
# DEFAULT PRIMARY KEY
# ============================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ============================================================
# DJANGO REST FRAMEWORK
# ============================================================

REST_FRAMEWORK = {

    "DEFAULT_PERMISSION_CLASSES": [

        "rest_framework.permissions.AllowAny",

    ],

}


# ============================================================
# CORS
# ============================================================

CORS_ALLOWED_ORIGINS = [

    "http://localhost:3000",

    "http://127.0.0.1:3000",

    # Current Vercel deployment
    "https://school-management-system-cx99s5v8i-develop-a148.vercel.app",

    # Previous Vercel deployment
    "https://school-management-system-e8uewvses-develop-a148.vercel.app",

]


# ------------------------------------------------------------
# Vercel preview deployment support
# ------------------------------------------------------------

CORS_ALLOWED_ORIGIN_REGEXES = [

    r"^https://school-management-system-[a-z0-9-]+-develop-a148\.vercel\.app$",

]


# ------------------------------------------------------------
# Optional Vercel frontend URL from Render environment
# ------------------------------------------------------------

VERCEL_FRONTEND_URL = os.environ.get(
    "VERCEL_FRONTEND_URL"
)


if VERCEL_FRONTEND_URL:

    if VERCEL_FRONTEND_URL not in CORS_ALLOWED_ORIGINS:

        CORS_ALLOWED_ORIGINS.append(
            VERCEL_FRONTEND_URL
        )


print(
    "CORS ALLOWED ORIGINS:",
    CORS_ALLOWED_ORIGINS
)


# ============================================================
# CSRF TRUSTED ORIGINS
# ============================================================

CSRF_TRUSTED_ORIGINS = [

    "http://localhost:3000",

    "http://127.0.0.1:3000",

    "https://school-management-system-cx99s5v8i-develop-a148.vercel.app",

    "https://school-management-system-e8uewvses-develop-a148.vercel.app",

]


# ------------------------------------------------------------
# Optional Vercel frontend URL
# ------------------------------------------------------------

if VERCEL_FRONTEND_URL:

    if VERCEL_FRONTEND_URL not in CSRF_TRUSTED_ORIGINS:

        CSRF_TRUSTED_ORIGINS.append(
            VERCEL_FRONTEND_URL
        )


# ============================================================
# PRODUCTION SECURITY
# ============================================================

if not DEBUG:

    SECURE_PROXY_SSL_HEADER = (

        "HTTP_X_FORWARDED_PROTO",

        "https",

    )

    SESSION_COOKIE_SECURE = True

    CSRF_COOKIE_SECURE = True