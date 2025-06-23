from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from auth_module.models import User
from utils.helpers import get_all_roles
from utils import serilalizer_error_list


class UserListSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    def get_roles(self, obj):
        
        return obj.get_roles_list

    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "email",
            "contact1",
            "is_staff",
            "is_active",
            "is_superuser",
            "roles"
            
        ]


class UserCreateSerializer(serializers.ModelSerializer):
    roles = serializers.ListField(required=True)

    class Meta:
        model = User
        fields = [
            "full_name",
            "email",
            "contact1",
            "roles",
            "password",
            "date_joined",
        ]

        extra_kwargs = { 
        'full_name': {'required': True},
        'email': {'required': True},
        'contact1': {'required': True},
        'password': {'required': True},
        'date_joined': {'required': True},
        'roles': {'required': True},
    }

    def validate_password(self, value):
        return make_password(value)
    
    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        return value
    
    def validate_roles(self, value):
        if isinstance(value, list):
            all_roles = set(get_all_roles())
            incoming_roles = set(value)

            if incoming_roles.issubset(all_roles):
                return ', '.join(incoming_roles)
            else:
                raise serializers.ValidationError("Invalid Roles.")
        else:
            raise serializers.ValidationError("Expecting Array.")
