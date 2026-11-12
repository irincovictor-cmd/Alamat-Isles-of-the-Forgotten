from django.conf import settings
from django.db import models


class PlayerSave(models.Model):
    """One cloud save slot per user (MVP). Payload matches the HTML prototype state."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='alamat_save',
    )
    # JSON blob compatible with localStorage format from the prototype
    data = models.JSONField(default=dict, blank=True)
    # Incremented on every successful save. Clients send the revision they last saw
    # so an old browser tab cannot silently overwrite newer progress (HTTP 409).
    revision = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Player save'
        verbose_name_plural = 'Player saves'

    def __str__(self):
        return f'Save<{self.user.username}> @ {self.updated_at:%Y-%m-%d %H:%M}'
