from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

from . import accounts

User = get_user_model()


class RegisterForm(UserCreationForm):
    """Sign-up: trims/normalises the username, rejects case-variant duplicates."""

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update(
            autocomplete='username', autofocus=True, autocapitalize='none', spellcheck='false')
        self.fields['username'].help_text = (
            'Up to 150 characters: letters, digits and @/./+/-/_ only. '
            'Not case-sensitive: "Ana" and "ana" are the same player.')
        self.fields['password1'].widget.attrs.update(autocomplete='new-password')
        self.fields['password2'].widget.attrs.update(autocomplete='new-password')
        self.fields['password2'].help_text = 'Type the same password again.'

    def clean_username(self):
        return accounts.validate_new_username(self.cleaned_data.get('username', ''))

    def _post_clean(self):
        super()._post_clean()
        # Django attaches password-rule errors to the confirmation field. Keep only the
        # "doesn't match" error there and show the rule errors under the password field.
        if 'password2' in self._errors:
            errs = self.errors.as_data()['password2']
            del self._errors['password2']
            for e in errs:
                self.add_error('password2' if e.code == 'password_mismatch' else 'password1', e)


class LoginForm(AuthenticationForm):
    """Sign-in with brute-force throttling and case-insensitive usernames."""

    error_messages = {
        **AuthenticationForm.error_messages,
        'invalid_login': "That username and password don't match. "
                         "Passwords are case-sensitive.",
        'locked': accounts.LOCKED_MESSAGE,
    }

    def __init__(self, request=None, *args, **kwargs):
        super().__init__(request, *args, **kwargs)
        self.fields['username'].widget.attrs.update(
            autocomplete='username', autofocus=True, autocapitalize='none', spellcheck='false')
        self.fields['password'].widget.attrs.update(autocomplete='current-password')

    def clean(self):
        username = accounts.normalize_username(self.data.get('username', ''))
        if username and accounts.login_locked(self.request, username):
            raise forms.ValidationError(self.error_messages['locked'], code='locked')
        try:
            cleaned = super().clean()
        except forms.ValidationError:
            if username:
                accounts.record_login_failure(self.request, username)
            raise
        accounts.clear_login_failures(self.request, username)
        return cleaned
