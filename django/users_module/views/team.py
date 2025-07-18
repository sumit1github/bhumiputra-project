from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response


from auth_module.models import User
from users_module.serializers import TeamViewSerializer

class TeamView(APIView):
    """
    To view direct team members of a user.
    This view retrieves all users who have the specified user as their parent.
    """
    def get(self, request, pk):

        direct_users = User.objects.filter(parent_id = pk[7:] if len(pk) >= 8 else "")
        return Response({
            "users": TeamViewSerializer(direct_users, many=True).data,
            "status": 200
        })