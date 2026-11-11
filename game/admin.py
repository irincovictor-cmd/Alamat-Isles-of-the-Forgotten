from django.contrib import admin
from .models import PlayerSave


@admin.register(PlayerSave)
class PlayerSaveAdmin(admin.ModelAdmin):
    list_display = ('user', 'updated_at', 'created_at')
    readonly_fields = ('updated_at', 'created_at')
