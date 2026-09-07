from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from accounts.models import User

from .models import Appointment, MedicalReport, PatientNotification, Payment


class DashboardPatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "mobile", "email", "gender", "blood_group", "birthdate")


class DashboardAppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    doctor_speciality = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = (
            "id",
            "doctor_name",
            "doctor_speciality",
            "hospital_name",
            "date",
            "time",
            "turn",
            "status",
            "reason",
            "fee",
            "created_at",
        )

    @extend_schema_field(serializers.CharField())
    def get_doctor_name(self, obj):
        return obj.doctor.name if obj.doctor else "Doctor"

    @extend_schema_field(serializers.CharField())
    def get_doctor_speciality(self, obj):
        return obj.doctor.speciality if obj.doctor else ""


class DashboardReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalReport
        fields = ("id", "title", "report_type", "summary", "doctor_name", "report_date", "file_url")


class DashboardPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ("id", "amount", "payment_type", "status", "method", "date", "reference")


class DashboardNotificationSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(source="created_at", format="%Y-%m-%d")

    class Meta:
        model = PatientNotification
        fields = ("id", "title", "message", "read", "date")


class RecommendedDoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "speciality", "degree", "experience", "hospital_name", "fee", "rating", "is_available")


class PatientDashboardSerializer(serializers.Serializer):
    patient = DashboardPatientSerializer()
    summary = serializers.DictField()
    next_appointment = DashboardAppointmentSerializer(allow_null=True)
    upcoming_appointments = DashboardAppointmentSerializer(many=True)
    recent_reports = DashboardReportSerializer(many=True)
    recent_payments = DashboardPaymentSerializer(many=True)
    notifications = DashboardNotificationSerializer(many=True)
    recommended_doctors = RecommendedDoctorSerializer(many=True)
