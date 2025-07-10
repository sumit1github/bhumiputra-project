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
            "roles",
            "date_joined",
            "parent",
            "wallet_balance",
            "joining_level",
            "achiver_level",
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
            "is_active",
        ]

        extra_kwargs = { 
        'full_name': {'required': True},
        'email': {'required': True},
        'contact1': {'required': True},
        'password': {'required': True},
        'date_joined': {'required': True},
        'roles': {'required': True},
        'is_active': {'required': True,},
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


class InviteUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="Confirm your password"
    )

    class Meta:
        model = User
        fields = [
            'full_name',
            'password',
            'confirm_password',
            'email',
            'contact1',
            'contact2',
            'date_joined',
            'age',
            'dob',
            'gender',
            'address',
            'zip_code',
            'parent',
            'is_active'
        ]
        extra_kwargs = {
            'full_name': {'required': True},
            'password': {'required': True},
            'email': {'required': True},
            'contact1': {'required': True},
            'date_joined': {'required': True},
            'age': {'required': True},
            'dob': {'required': True},
            'gender': {'required': True},
            'address': {'required': True},
            'zip_code': {'required': True},
            'parent': {'required': True},
            'contact2': {'required': False},
            'is_active': {'required': False, 'default': True},
        }

    def validate(self, data):
        password = data.get('password')
        confirm_password = data.pop('confirm_password', None)

        if password != confirm_password:
            raise serializers.ValidationError({"password": "Passwords do not match.", "confirm_password": "Passwords do not match."})

        return data

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class UserDetailUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'full_name',
            'email',
            'contact1',
            'contact2',
            'age',
            'dob',
            'gender',
            'address',
            'zip_code',
            'is_active',
        ]
        extra_kwargs = {
            'full_name': {'required': True},
            'email': {'required': True},
            'contact1': {'required': True},
            'age': {'required': True},
            'dob': {'required': True},
            'gender': {'required': True},
            'address': {'required': True},
            'zip_code': {'required': True},
            'contact2': {'required': False},
        }
