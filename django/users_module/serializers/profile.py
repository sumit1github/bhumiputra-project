from rest_framework import serializers
from django.core.exceptions import ValidationError

from users_module.models import UserProfile


class ProfileDetailsSerializer(serializers.ModelSerializer):
    salary = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = '__all__'

    def get_salary(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            if request.user.has_access('ADMIN'):
                return obj.salary
        return "NO Enough Permission"