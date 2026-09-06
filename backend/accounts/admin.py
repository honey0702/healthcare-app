from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ("-created_at",)
    list_display = ("mobile", "name", "role", "status", "is_active", "created_at")
    list_filter = ("role", "status", "is_active")
    search_fields = ("mobile", "name", "email")
    readonly_fields = ("created_at", "updated_at", "last_login")

    fieldsets = (
        (None, {"fields": ("mobile", "password")} ),
        ("Personal information", {"fields": ("name", "email", "gender", "blood_group", "birthdate", "address")} ),
        ("Professional information", {"fields": ("role", "status", "degree", "college", "experience", "speciality")} ),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")} ),
        ("Important dates", {"fields": ("last_login", "created_at", "updated_at")} ),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("mobile", "name", "password1", "password2", "role", "status", "is_staff", "is_superuser"),
        }),
    )
