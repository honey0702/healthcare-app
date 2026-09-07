from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from accounts.models import User
from dashboard.models import Appointment, MedicalReport, PatientNotification, Payment


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
            "hospital_name": "City Care Multi-Speciality Hospital",
            "fee": 800,
            "rating": 4.8,
            "is_available": True,
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

        self.create_demo_dashboard_data()

    def create_demo_dashboard_data(self):
        patient = User.objects.get(mobile="9700000000")
        doctor = User.objects.get(mobile="9800000000")
        today = timezone.localdate()

        appointment, _ = Appointment.objects.get_or_create(
            patient=patient,
            doctor=doctor,
            date=today + timedelta(days=2),
            time="10:30 AM",
            defaults={
                "hospital_name": "City Care Multi-Speciality Hospital",
                "turn": 3,
                "status": Appointment.Status.CONFIRMED,
                "reason": "Chest pain follow-up",
                "fee": 800,
            },
        )
        MedicalReport.objects.get_or_create(
            patient=patient,
            title="Routine Blood Test",
            defaults={
                "report_type": "Laboratory",
                "summary": "All values are within the expected range.",
                "doctor_name": doctor.name,
                "report_date": today - timedelta(days=12),
            },
        )
        Payment.objects.get_or_create(
            patient=patient,
            reference="PAY-88240",
            defaults={
                "amount": 800,
                "payment_type": "consultation",
                "status": Payment.Status.PENDING,
                "method": "—",
                "date": today,
            },
        )
        PatientNotification.objects.get_or_create(
            patient=patient,
            title="Appointment confirmed",
            defaults={
                "message": f"Your appointment with {doctor.name} is confirmed for {appointment.time}.",
                "read": False,
            },
        )
        self.stdout.write(self.style.SUCCESS("Demo patient dashboard data is ready."))
