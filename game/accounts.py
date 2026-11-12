"""Shared account logic for the web forms and the JSON API."""
from __future__ import annotations

import unicodedata

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.contrib.auth.validators import UnicodeUsernameValidator

User = get_user_model()
username_validator = UnicodeUsernameValidator()


def normalize_username(value) -> str:
    """Trim and NFKC-normalise (same normalisation Django applies on save)."""
    if not isinstance(value, str):
        value = '' if value is None else str(value)
    return unicodedata.normalize('NFKC', value.strip())


def validate_new_username(value: str) -> str:
    """Normalise + validate a username for registration. Raises ValidationError."""
    name = normalize_username(value)
    if not name:
        raise ValidationError('Please choose a username.', code='required')
    if len(name) > 150:
        raise ValidationError('Usernames can be at most 150 characters.', code='max_length')
    username_validator(name)
    if User.objects.filter(username__iexact=name).exists():
        raise ValidationError('That username is already taken.', code='unique')
    return name


class CaseInsensitiveBackend(ModelBackend):
    """
    "Ana", "ana" and "ANA" are the same player.

    An exact match always wins (covers legacy accounts that differ only by case);
    otherwise a single case-insensitive match is accepted.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)
        if username is None or password is None:
            return None
        name = normalize_username(username)
        user = User._default_manager.filter(username=name).first()
        if user is None:
            matches = list(User._default_manager.filter(username__iexact=name)[:2])
            user = matches[0] if len(matches) == 1 else None
        if user is None:
            User().set_password(password)  # keep timing similar for unknown users
            return None
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None


# ------------------------------------------------------------------ throttle
# Stored in Django's cache. The default LocMemCache is per-process; use a shared
# cache (Redis/Memcached/DB) when running several workers.

def _key(request, username: str) -> str:
    ip = (request.META.get('REMOTE_ADDR') if request is not None else '') or 'unknown'
    return f'alamat:login-fail:{ip}:{normalize_username(username).lower()}'


def login_locked(request, username: str) -> bool:
    return cache.get(_key(request, username), 0) >= settings.LOGIN_MAX_FAILURES


def record_login_failure(request, username: str) -> None:
    key = _key(request, username)
    try:
        cache.add(key, 0, settings.LOGIN_LOCKOUT_SECONDS)
        cache.incr(key)
    except ValueError:  # key expired between add and incr
        cache.set(key, 1, settings.LOGIN_LOCKOUT_SECONDS)


def clear_login_failures(request, username: str) -> None:
    cache.delete(_key(request, username))


LOCKED_MESSAGE = ('Too many failed sign-in attempts. '
                  'Please wait a few minutes and try again.')
