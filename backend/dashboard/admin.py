from django.contrib import admin

from .models import Appointment, MedicalReport, PatientNotification, Payment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("patient", "doctor", "date", "time", "status", "fee")
    list_filter = ("status", "date")
    search_fields = ("patient__name", "doctor__name", "hospital_name")


@admin.register(MedicalReport)
class MedicalReportAdmin(admin.ModelAdmin):
    list_display = ("title", "patient", "report_type", "report_date")
    list_filter = ("report_type", "report_date")
    search_fields = ("title", "patient__name", "doctor_name")


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("patient", "amount", "payment_type", "status", "date", "reference")
    list_filter = ("status", "date")
    search_fields = ("patient__name", "reference")


@admin.register(PatientNotification)
class PatientNotificationAdmin(admin.ModelAdmin):
    list_display = ("patient", "title", "read", "created_at")
    list_filter = ("read", "created_at")
    search_fields = ("patient__name", "title", "message")
