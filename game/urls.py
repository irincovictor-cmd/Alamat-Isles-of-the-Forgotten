"""JSON API, mounted at /api/ (see config/urls.py)."""
from django.urls import path

from . import views

urlpatterns = [
    path('health/', views.health, name='api-health'),
    path('auth/register/', views.register, name='api-register'),
    path('auth/login/', views.login, name='api-login'),
    path('auth/logout/', views.logout, name='api-logout'),
    path('save/', views.save_view, name='api-save'),
    path('dev/seed-roster/', views.seed_test_roster, name='api-seed-roster'),
]
