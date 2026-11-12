"""JSON API: health, token auth (for non-browser clients) and cloud save."""
from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from django.conf import settings
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from . import accounts
from .models import PlayerSave
from .rules import SaveError, sanitize_save, make_creature, DATA
from .serializers import LoginSerializer, RegisterSerializer

User = get_user_model()


@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    return Response({'status': 'ok', 'service': 'alamat-api', 'version': '0.2'})


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    ser = RegisterSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    user = ser.save()
    token, _ = Token.objects.get_or_create(user=user)
    PlayerSave.objects.get_or_create(user=user, defaults={'data': {}})
    return Response({'token': token.key, 'username': user.username},
                    status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    ser = LoginSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    username, password = ser.validated_data['username'], ser.validated_data['password']
    if accounts.login_locked(request, username):
        return Response({'detail': accounts.LOCKED_MESSAGE}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    user = authenticate(request, username=username, password=password)
    if not user:
        accounts.record_login_failure(request, username)
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    accounts.clear_login_failures(request, username)
    token, _ = Token.objects.get_or_create(user=user)
    PlayerSave.objects.get_or_create(user=user, defaults={'data': {}})
    return Response({'token': token.key, 'username': user.username})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response({'detail': 'Logged out'})


def _save_response(save, data, adjusted=None, http_status=status.HTTP_200_OK):
    body = {
        'data': data,
        'exists': bool(data),
        'revision': save.revision,
        'updated_at': save.updated_at,
    }
    if adjusted:
        body['adjusted'] = adjusted
    return Response(body, status=http_status)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def save_view(request):
    with transaction.atomic():
        save, _ = PlayerSave.objects.select_for_update().get_or_create(
            user=request.user, defaults={'data': {}})

        if request.method == 'GET':
            try:  # re-validate on read so legacy/tampered rows are never served as-is
                data, _adj = sanitize_save(save.data)
            except SaveError:
                data = {}
            return _save_response(save, data)

        payload = request.data
        if not isinstance(payload, dict):
            return Response({'detail': 'Body must be a JSON object.'},
                            status=status.HTTP_400_BAD_REQUEST)
        raw = payload['data'] if 'data' in payload else payload

        if 'revision' in payload:
            rev = payload['revision']
            if isinstance(rev, bool) or not isinstance(rev, int):
                return Response({'detail': 'revision must be an integer.'},
                                status=status.HTTP_400_BAD_REQUEST)
            if rev != save.revision:
                try:
                    current, _adj = sanitize_save(save.data)
                except SaveError:
                    current = {}
                resp = _save_response(save, current, http_status=status.HTTP_409_CONFLICT)
                resp.data['detail'] = ('This account was saved somewhere else since you loaded. '
                                       'Load the latest save before saving again.')
                return resp

        try:
            clean, adjusted = sanitize_save(raw)
        except SaveError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        save.data = clean
        save.revision += 1
        save.save(update_fields=['data', 'revision', 'updated_at'])
        return _save_response(save, clean, adjusted)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def seed_test_roster(request):
    """Local development only. Give staff their own complete test collection."""
    if not settings.DEBUG or not (request.user.is_staff or request.user.is_superuser):
        return Response({'detail': 'Staff-only development tool.'},
                        status=status.HTTP_403_FORBIDDEN)
    with transaction.atomic():
        save, _ = PlayerSave.objects.select_for_update().get_or_create(
            user=request.user, defaults={'data': {}})
        rev = request.data.get('revision') if isinstance(request.data, dict) else None
        if type(rev) is not int or rev != save.revision:
            return Response({'detail': 'Save changed. Load the latest save and retry.'},
                            status=status.HTTP_409_CONFLICT)
        try:
            original, _ = sanitize_save(save.data)
        except SaveError:
            original = {}
        data = dict(original)
        roster = [make_creature(sid, DATA['limits']['starter_level'])
                  for sid in DATA['dex_order']]
        data['party'] = roster[:DATA['limits']['max_party']]
        data['storage'] = roster[DATA['limits']['max_party']:]
        data['dex'] = list(DATA['dex_order'])
        flags = dict(data.get('f', {}))
        flags['starter'] = True
        flags['bonded'] = True
        data['f'] = flags
        data, adjusted = sanitize_save(data)
        save.data = data
        save.revision += 1
        save.save(update_fields=['data', 'revision', 'updated_at'])
        return _save_response(save, data, adjusted)
