from rest_framework import serializers
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from auth_module.models import User
from utils.helpers import get_all_roles
from utils import serilalizer_error_list


class UserListSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    is_distributer = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    is_it = serializers.SerializerMethodField()
    

    def get_roles(self, obj):
        
        return obj.get_roles_list
    
    def get_is_distributer(self, obj):
        return obj.is_distributer

    def get_is_admin(self, obj):
        return obj.is_admin

    def get_is_it(self, obj):
        return obj.is_it

    class Meta:
        model = User
        fields = [
            "id",
            "id_prefix",
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
            "invite_tokens",
            "is_distributer",
            "is_admin",
            "is_it"
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
            'dob',
            'gender',
            'address',
            'zip_code',
            'parent',
            "invite_tokens",
            'is_active',
        ]
        extra_kwargs = {
            'full_name': {'required': True},
            'password': {'required': True},
            'email': {'required': True},
            'contact1': {'required': True},
            'date_joined': {'required': True},
            'dob': {'required': True},
            'gender': {'required': True},
            'address': {'required': True},
            'zip_code': {'required': True},
            'parent': {'required': True},
            'contact2': {'required': False},
            'is_active': {'required': False},
            'invite_tokens': {'required': True},
        }

    def validate(self, data):
        password = data.get('password')
        confirm_password = data.pop('confirm_password', None)

        if password != confirm_password:
            raise serializers.ValidationError({"password": "Passwords do not match.", "confirm_password": "Passwords do not match."})
        
        if data.get('invite_tokens') < 0:
            raise serializers.ValidationError({"invite_tokens": "Invite tokens cannot be negative."})

        return data


class UserUpdateSerializer(serializers.ModelSerializer):

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
            "invite_tokens",
            "password",
            "wallet_balance"
            
        ]
        extra_kwargs = {
            'full_name': {'required': True},
            'email': {'required': True},
            'contact1': {'required': True},
            'age': {'required': False},
            'dob': {'required': True},
            'gender': {'required': True},
            'address': {'required': True},
            'zip_code': {'required': True},
            'contact2': {'required': False},
            'invite_tokens': {'required': True},
            'password': {'required': False},
            'wallet_balance': {'required': True},
        }

    def validate_invite_tokens(self, value):
        if value < 0:
            raise serializers.ValidationError("Invite tokens cannot be negative.")
        return value


class PasswordChangeSerializer(serializers.Serializer):
    oldPassword = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Enter your old password"
    )
    confirmPassword = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Confirm your password"
    )
    newPassword = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Confirm your password"
    )


    def validate(self, data):

        password = data.get('newPassword')
        confirmPassword = data.pop('confirmPassword', None)

        if password != confirmPassword:
            raise serializers.ValidationError({"password": "Passwords do not match.", "confirm_password": "Passwords do not match."})

        return data