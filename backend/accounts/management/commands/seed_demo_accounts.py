from django.core.management.base import BaseCommand

from accounts.models import User


class Command(BaseCommand):
    help = "Create the local demo accounts used by the frontend showcase."

    DEMO_USERS = (
        {
            "mobile": "9900000000",
            "name": "Site Administrator",
            "email": "admin@medicare.com",
            "role": User.Role.ADMIN,
            "password": "admin123",
        },
        {
            "mobile": "9800000000",
            "name": "Dr. Ayesha Khan",
            "email": "doctor@medicare.com",
            "role": User.Role.DOCTOR,
            "status": User.Status.APPROVED,
            "password": "doctor123",
            "degree": "MBBS, MD (Cardiology)",
            "college": "AIIMS Delhi",
            "experience": 14,
            "speciality": "Cardiologist",
        },
        {
            "mobile": "9700000000",
            "name": "Rahul Sharma",
            "email": "patient@medicare.com",
            "role": User.Role.PATIENT,
            "password": "patient123",
            "gender": "Male",
            "blood_group": "B+",
            "birthdate": "1994-05-12",
            "address": "Maninagar, Ahmedabad",
        },
    )

    def handle(self, *args, **options):
        for raw_data in self.DEMO_USERS:
            data = raw_data.copy()
            password = data.pop("password")
            mobile = data["mobile"]
            user, created = User.objects.get_or_create(mobile=mobile, defaults=data)
            if created:
                user.set_password(password)
                user.save(update_fields=["password"])
                self.stdout.write(self.style.SUCCESS(f"Created {user.role} demo account: {mobile}"))
            else:
                self.stdout.write(f"Demo account already exists: {mobile}")
