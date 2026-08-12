from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = "Load the school data fixture into the database."

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.WARNING(
                "Loading school_data.json..."
            )
        )

        call_command(
            "loaddata",
            "school_data.json",
            verbosity=2
        )

        self.stdout.write(
            self.style.SUCCESS(
                "School data loaded successfully."
            )
        )