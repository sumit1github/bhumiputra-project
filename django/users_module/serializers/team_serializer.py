from rest_framework import serializers

from auth_module.models import User

class TeamViewSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "id_prefix",
            "full_name",
            "date_joined",
            "parent",
            "wallet_balance",
            "achiver_level",
            "invite_tokens",
        ]