import re

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User, normalize_mobile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "mobile",
            "email",
            "role",
            "status",
            "gender",
            "blood_group",
            "birthdate",
            "address",
            "degree",
            "college",
            "experience",
            "speciality",
            "hospital_name",
            "fee",
            "rating",
            "is_available",
            "created_at",
        )
        read_only_fields = ("id", "role", "status", "created_at")


class TokenSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()


class AuthResponseSerializer(serializers.Serializer):
    user = UserSerializer()
    tokens = TokenSerializer(required=False)
    message = serializers.CharField(required=False)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            "name",
            "mobile",
            "email",
            "password",
            "role",
            "gender",
            "blood_group",
            "birthdate",
            "address",
            "degree",
            "college",
            "experience",
            "speciality",
        )
        extra_kwargs = {
            "name": {"required": True},
            "mobile": {"required": True},
            "email": {"required": False, "allow_blank": True},
            "role": {"required": False, "default": User.Role.PATIENT},
            "birthdate": {"required": False, "allow_null": True},
            "experience": {"required": False, "allow_null": True},
        }

    def validate_mobile(self, value):
        mobile = normalize_mobile(value)
        if not re.fullmatch(r"\+?[0-9]{7,15}", mobile):
            raise serializers.ValidationError("Enter a valid mobile number (7 to 15 digits).")
        if User.objects.filter(mobile=mobile).exists():
            raise serializers.ValidationError("An account with this mobile number already exists.")
        return mobile

    def validate_role(self, value):
        if value not in (User.Role.PATIENT, User.Role.DOCTOR):
            raise serializers.ValidationError("You can register only as a patient or doctor.")
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        if attrs.get("role") == User.Role.DOCTOR:
            required = {
                "degree": "Degree is required for doctor registration.",
                "college": "College or university is required for doctor registration.",
                "experience": "Years of experience is required for doctor registration.",
                "speciality": "Speciality is required for doctor registration.",
            }
            errors = {field: message for field, message in required.items() if attrs.get(field) in (None, "")}
            if errors:
                raise serializers.ValidationError(errors)
        return attrs

    def create(self, validated_data):
        role = validated_data.get("role", User.Role.PATIENT)
        validated_data["status"] = User.Status.PENDING if role == User.Role.DOCTOR else User.Status.APPROVED
        password = validated_data.pop("password")
        return User.objects.create_user(password=password, **validated_data)


class LoginSerializer(serializers.Serializer):
    mobile = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        mobile = normalize_mobile(attrs.get("mobile"))
        user = authenticate(self.context.get("request"), mobile=mobile, password=attrs.get("password"))
        if user is None:
            raise serializers.ValidationError("Invalid mobile number or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")
        if user.role == User.Role.DOCTOR and user.status != User.Status.APPROVED:
            raise serializers.ValidationError("Your doctor account is awaiting admin approval.")
        if user.status == User.Status.SUSPENDED:
            raise serializers.ValidationError("This account has been suspended.")
        attrs["user"] = user
        return attrs
