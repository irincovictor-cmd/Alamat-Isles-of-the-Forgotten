from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import PlayerSave
from .serializers import RegisterSerializer, SaveSerializer

User = get_user_model()


@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    return Response({'status': 'ok', 'service': 'alamat-api', 'version': '0.1'})


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    ser = RegisterSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    user = ser.save()
    token, _ = Token.objects.get_or_create(user=user)
    PlayerSave.objects.get_or_create(user=user, defaults={'data': {}})
    return Response(
        {'token': token.key, 'username': user.username},
        status=status.HTTP_201_CREATED,
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    token, _ = Token.objects.get_or_create(user=user)
    PlayerSave.objects.get_or_create(user=user, defaults={'data': {}})
    return Response({'token': token.key, 'username': user.username})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response({'detail': 'Logged out'})


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def save_view(request):
    save, _ = PlayerSave.objects.get_or_create(user=request.user, defaults={'data': {}})
    if request.method == 'GET':
        return Response(SaveSerializer(save).data)
    # PUT — replace payload
    data = request.data.get('data', request.data)
    if not isinstance(data, dict):
        return Response({'detail': 'data must be an object'}, status=status.HTTP_400_BAD_REQUEST)
    save.data = data
    save.save(update_fields=['data', 'updated_at'])
    return Response(SaveSerializer(save).data)
