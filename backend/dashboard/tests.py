from datetime import timedelta

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Appointment, MedicalReport, PatientNotification, Payment


User = get_user_model()


class PatientDashboardApiTests(APITestCase):
    def setUp(self):
        self.patient = User.objects.create_user(
            mobile="9876500000",
            password="StrongPass123!",
            name="Aarav Patel",
            role=User.Role.PATIENT,
        )
        self.doctor = User.objects.create_user(
            mobile="9876500001",
            password="StrongPass123!",
            name="Dr. Meera Shah",
            role=User.Role.DOCTOR,
            status=User.Status.APPROVED,
            speciality="Cardiologist",
            hospital_name="City Care Hospital",
            fee=800,
            rating=4.8,
            experience=12,
        )
        today = timezone.localdate()
        Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            hospital_name="City Care Hospital",
            date=today + timedelta(days=2),
            time="10:30 AM",
            turn=3,
            status=Appointment.Status.CONFIRMED,
            reason="Follow-up",
            fee=800,
        )
        Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            hospital_name="City Care Hospital",
            date=today - timedelta(days=10),
            time="11:00 AM",
            turn=1,
            status=Appointment.Status.COMPLETED,
            fee=800,
        )
        MedicalReport.objects.create(
            patient=self.patient,
            title="Blood Test",
            report_type="Laboratory",
            summary="Normal results",
            doctor_name=self.doctor.name,
            report_date=today - timedelta(days=3),
        )
        Payment.objects.create(
            patient=self.patient,
            amount=800,
            payment_type="consultation",
            status=Payment.Status.PENDING,
            date=today,
            reference="PAY-TEST-1",
        )
        PatientNotification.objects.create(
            patient=self.patient,
            title="Appointment confirmed",
            message="Your appointment is confirmed.",
            read=False,
        )
        self.url = reverse("dashboard:patient-dashboard")

    def test_patient_dashboard_returns_all_home_sections(self):
        self.client.force_authenticate(user=self.patient)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["summary"]["total_appointments"], 2)
        self.assertEqual(response.data["summary"]["upcoming_appointments"], 1)
        self.assertEqual(response.data["summary"]["completed_appointments"], 1)
        self.assertEqual(response.data["summary"]["unread_notifications"], 1)
        self.assertEqual(response.data["summary"]["pending_payments"], 1)
        self.assertEqual(response.data["next_appointment"]["doctor_name"], "Dr. Meera Shah")
        self.assertEqual(len(response.data["upcoming_appointments"]), 1)
        self.assertEqual(len(response.data["recent_reports"]), 1)
        self.assertEqual(len(response.data["recent_payments"]), 1)
        self.assertEqual(len(response.data["notifications"]), 1)
        self.assertEqual(response.data["recommended_doctors"][0]["speciality"], "Cardiologist")

    def test_dashboard_is_for_patients_only(self):
        self.client.force_authenticate(user=self.doctor)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_dashboard_requires_authentication(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
