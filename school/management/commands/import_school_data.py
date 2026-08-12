import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import transaction


class Command(BaseCommand):
    help = "Import school data from school_data.json"

    def handle(self, *args, **options):

        # school_data.json is located beside manage.py
        data_file = Path(__file__).resolve().parents[3] / "school_data.json"

        if not data_file.exists():
            self.stdout.write(
                self.style.ERROR(
                    f"school_data.json not found: {data_file}"
                )
            )
            return

        self.stdout.write(
            self.style.WARNING(
                f"Loading data from: {data_file}"
            )
        )

        # Try UTF-8 first, then UTF-16.
        try:
            with open(data_file, "r", encoding="utf-8") as file:
                data = json.load(file)

        except UnicodeDecodeError:

            self.stdout.write(
                self.style.WARNING(
                    "File is not UTF-8. Trying UTF-16..."
                )
            )

            with open(data_file, "r", encoding="utf-16") as file:
                data = json.load(file)

        except json.JSONDecodeError as error:

            self.stdout.write(
                self.style.ERROR(
                    f"Invalid JSON file: {error}"
                )
            )
            return

        self.stdout.write(
            f"Found {len(data)} records in school_data.json"
        )

        # Import models only after Django has loaded.
        from school.models import (
            Teacher,
            Subject,
            Student,
            Marks,
            Attendance,
        )

        # Prevent duplicate imports.
        existing_records = (
            Teacher.objects.exists()
            or Subject.objects.exists()
            or Student.objects.exists()
            or Marks.objects.exists()
            or Attendance.objects.exists()
        )

        if existing_records:

            self.stdout.write(
                self.style.WARNING(
                    "School database already contains data."
                )
            )

            self.stdout.write(
                "Import cancelled to prevent duplicate records."
            )

            return

        # Import data.
        with transaction.atomic():

            call_command(
                "loaddata",
                str(data_file),
                verbosity=1
            )

        self.stdout.write("")

        self.stdout.write(
            self.style.SUCCESS(
                "School data imported successfully!"
            )
        )

        self.stdout.write(
            f"Teachers: {Teacher.objects.count()}"
        )

        self.stdout.write(
            f"Subjects: {Subject.objects.count()}"
        )

        self.stdout.write(
            f"Students: {Student.objects.count()}"
        )

        self.stdout.write(
            f"Marks: {Marks.objects.count()}"
        )

        self.stdout.write(
            f"Attendance: {Attendance.objects.count()}"
        )