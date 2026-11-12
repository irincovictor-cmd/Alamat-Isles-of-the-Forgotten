"""Interactive, terminal-only administrator account setup.

Run: python manage.py setupadmin
Uses Django's built-in createsuperuser, including its secure password prompt.
No web endpoint or public admin registration is exposed.
"""
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Interactively create a separate Django administrator account (terminal only)."

    def handle(self, *args, **options):
        User = get_user_model()
        if not self.stdin_is_interactive():
            raise CommandError(
                "Admin setup requires an interactive terminal. "
                "Run 'python manage.py setupadmin' in Command Prompt or PowerShell."
            )

        self.stdout.write(self.style.WARNING(
            "Create an administrator only on a computer/server you control. "
            "Never use public game registration for admin access."
        ))
        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write(
                "A superuser already exists. You can still create another with a NEW username. "
                "To change a password, use 'python manage.py changepassword <username>'."
            )
        self.stdout.write("Choose a unique username and a strong password.")
        call_command("createsuperuser", interactive=True, stdout=self.stdout)
        self.stdout.write(self.style.SUCCESS(
            "Admin setup complete if Django reported successful creation. "
            "Log in to /admin/ or /play/ with the new account."
        ))

    @staticmethod
    def stdin_is_interactive():
        import sys
        return bool(getattr(sys.stdin, "isatty", lambda: False)())
