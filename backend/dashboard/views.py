from drf_spectacular.utils import extend_schema
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User

from .models import Appointment, MedicalReport, PatientNotification, Payment
from .serializers import (
    DashboardAppointmentSerializer,
    DashboardNotificationSerializer,
    DashboardPaymentSerializer,
    DashboardReportSerializer,
    DashboardPatientSerializer,
    PatientDashboardSerializer,
    RecommendedDoctorSerializer,
)


class PatientDashboardView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @extend_schema(
        tags=["Patient Dashboard"],
        responses={200: PatientDashboardSerializer},
        summary="Get all data needed for the patient home dashboard",
        description=(
            "Returns patient summary cards, next and upcoming appointments, recent reports, "
            "recent payments, unread notifications, and recommended doctors."
        ),
    )
    def get(self, request):
        if request.user.role != User.Role.PATIENT:
            return Response(
                {"detail": "Only patient accounts can access the patient dashboard."},
                status=status.HTTP_403_FORBIDDEN,
            )

        today = timezone.localdate()
        appointments = Appointment.objects.filter(patient=request.user).select_related("doctor")
        upcoming = appointments.filter(
            date__gte=today,
            status__in=[Appointment.Status.PENDING, Appointment.Status.CONFIRMED],
        ).order_by("date", "id")
        reports = MedicalReport.objects.filter(patient=request.user)[:5]
        payments = Payment.objects.filter(patient=request.user)[:5]
        notifications = PatientNotification.objects.filter(patient=request.user, read=False)[:5]
        recommended_doctors = User.objects.filter(
            role=User.Role.DOCTOR,
            status=User.Status.APPROVED,
            is_active=True,
            is_available=True,
        ).order_by("-rating", "-experience", "name")[:4]

        upcoming_list = list(upcoming[:5])
        payload = {
            "patient": DashboardPatientSerializer(request.user).data,
            "summary": {
                "total_appointments": appointments.count(),
                "upcoming_appointments": upcoming.count(),
                "completed_appointments": appointments.filter(status=Appointment.Status.COMPLETED).count(),
                "unread_notifications": PatientNotification.objects.filter(patient=request.user, read=False).count(),
                "pending_payments": Payment.objects.filter(patient=request.user, status=Payment.Status.PENDING).count(),
            },
            "next_appointment": DashboardAppointmentSerializer(upcoming_list[0]).data if upcoming_list else None,
            "upcoming_appointments": DashboardAppointmentSerializer(upcoming_list, many=True).data,
            "recent_reports": DashboardReportSerializer(reports, many=True).data,
            "recent_payments": DashboardPaymentSerializer(payments, many=True).data,
            "notifications": DashboardNotificationSerializer(notifications, many=True).data,
            "recommended_doctors": RecommendedDoctorSerializer(recommended_doctors, many=True).data,
        }
        return Response(payload)
