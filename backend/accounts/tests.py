from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class AuthenticationApiTests(APITestCase):
    patient_payload = {
        "name": "Aarav Patel",
        "mobile": "9876543210",
        "email": "aarav@example.com",
        "password": "StrongPass123!",
        "role": "patient",
        "gender": "Male",
        "blood_group": "O+",
    }

    def test_patient_registration_hashes_password_and_returns_tokens(self):
        response = self.client.post(reverse("accounts:register"), self.patient_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data["tokens"])
        self.assertIn("refresh", response.data["tokens"])
        user = User.objects.get(mobile="9876543210")
        self.assertTrue(user.check_password("StrongPass123!"))
        self.assertNotEqual(user.password, "StrongPass123!")
        self.assertEqual(user.status, User.Status.APPROVED)

    def test_duplicate_mobile_is_rejected(self):
        User.objects.create_user(mobile="9876543210", password="StrongPass123!", name="Existing")

        response = self.client.post(reverse("accounts:register"), self.patient_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("mobile", response.data)

    def test_doctor_registration_is_pending_and_does_not_return_tokens(self):
        payload = {
            **self.patient_payload,
            "mobile": "9123456789",
            "role": "doctor",
            "degree": "MBBS",
            "college": "AIIMS Delhi",
            "experience": 5,
            "speciality": "Cardiology",
        }

        response = self.client.post(reverse("accounts:register"), payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn("tokens", response.data)
        self.assertEqual(response.data["user"]["status"], User.Status.PENDING)

    def test_login_returns_tokens_and_me_requires_bearer_token(self):
        User.objects.create_user(
            mobile="9876543210",
            password="StrongPass123!",
            name="Aarav Patel",
            role=User.Role.PATIENT,
        )

        login = self.client.post(
            reverse("accounts:login"),
            {"mobile": "9876543210", "password": "StrongPass123!"},
            format="json",
        )

        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['tokens']['access']}")
        me = self.client.get(reverse("accounts:me"))
        self.assertEqual(me.status_code, status.HTTP_200_OK)
        self.assertEqual(me.data["mobile"], "9876543210")

    def test_invalid_login_is_rejected(self):
        User.objects.create_user(
            mobile="9876543210",
            password="StrongPass123!",
            name="Aarav Patel",
        )

        response = self.client.post(
            reverse("accounts:login"),
            {"mobile": "9876543210", "password": "wrong-password"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_pending_doctor_cannot_login(self):
        User.objects.create_user(
            mobile="9123456789",
            password="StrongPass123!",
            name="Pending Doctor",
            role=User.Role.DOCTOR,
            status=User.Status.PENDING,
        )

        response = self.client.post(
            reverse("accounts:login"),
            {"mobile": "9123456789", "password": "StrongPass123!"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("approval", str(response.data).lower())

    def test_swagger_and_schema_are_available(self):
        schema = self.client.get(reverse("schema"))
        docs = self.client.get(reverse("swagger-ui"))

        self.assertEqual(schema.status_code, status.HTTP_200_OK)
        self.assertIn(b"/api/auth/login/", schema.content)
        self.assertIn(b"/api/patient/dashboard/", schema.content)
        self.assertEqual(docs.status_code, status.HTTP_200_OK)
