from django.urls import path

from .views import PatientDashboardView

app_name = "dashboard"

urlpatterns = [
    path("patient/dashboard/", PatientDashboardView.as_view(), name="patient-dashboard"),
]
