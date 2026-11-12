"""Browser-facing pages, mounted at the site root (see config/urls.py)."""
from django.contrib.auth.views import LogoutView
from django.urls import path

from . import web

urlpatterns = [
    path('', web.home, name='home'),
    path('play/', web.play, name='play'),
    path('login/', web.SignInView.as_view(), name='login'),
    path('register/', web.RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),  # POST only (Django >= 5)
]
