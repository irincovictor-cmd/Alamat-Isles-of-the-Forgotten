"""Server-rendered pages: landing, register, login, logout and the game itself."""
from django.conf import settings
from django.contrib.auth import login as auth_login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.db import IntegrityError, transaction
from django.shortcuts import redirect, render
from django.urls import reverse
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import FormView

from . import rules
from .forms import LoginForm, RegisterForm
from .models import PlayerSave

AUTH_BACKEND = 'game.accounts.CaseInsensitiveBackend'


def safe_next(request, default='play'):
    """Honour ?next= only when it points back at this site (no open redirects)."""
    target = request.POST.get('next') or request.GET.get('next') or ''
    if target and url_has_allowed_host_and_scheme(
            target, allowed_hosts={request.get_host()}, require_https=request.is_secure()):
        return target
    return reverse(default)


def home(request):
    return redirect('play' if request.user.is_authenticated else 'login')


class SignInView(LoginView):
    template_name = 'game/login.html'
    authentication_form = LoginForm
    redirect_authenticated_user = True

    def get_default_redirect_url(self):
        return reverse('play')


class RegisterView(FormView):
    template_name = 'game/register.html'
    form_class = RegisterForm

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(safe_next(request))
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['next'] = self.request.POST.get('next') or self.request.GET.get('next') or ''
        return ctx

    def form_valid(self, form):
        try:
            with transaction.atomic():
                user = form.save()
                PlayerSave.objects.get_or_create(user=user, defaults={'data': {}})
        except IntegrityError:  # two people registered the same name at once
            form.add_error('username', 'That username is already taken.')
            return self.form_invalid(form)
        auth_login(self.request, user, backend=AUTH_BACKEND)
        return redirect(safe_next(self.request))


@never_cache
@login_required
@ensure_csrf_cookie
def play(request):
    return render(request, 'game/play.html', {
        'username': request.user.get_username(),
        'game_data': rules.client_data(),
        'game_config': {
            'saveUrl': reverse('api-save'),
            'loginUrl': reverse('login'),
            'username': request.user.get_username(),
        },
    })
