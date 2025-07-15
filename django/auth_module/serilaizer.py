from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth.hashers import make_password

from . import models

class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField(
        required = True,
        help_text="Enter Email."
    )

    password = serializers.CharField(
        max_length=100,
        required=True,
        allow_blank=False,
        trim_whitespace=True,
        help_text="Password"
    )

        

class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    def get_roles(self, obj):
        
        return obj.get_roles_list

    class Meta:
        model = models.User
        exclude = ["password"]



class ForgotPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField(
        required=False,
        help_text="Email"
    )
    
class NewPasswordSerializer(serializers.Serializer):

    password1 = serializers.CharField(max_length = 255, required =True)
    password2 = serializers.CharField(max_length = 255, required =True)

    def validate(self, data):
        # Check if the passwords match
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("The passwords do not match.")
        
        if len(data['password1']) < 6:
            raise serializers.ValidationError("Your Password is very weak")
        
        return data