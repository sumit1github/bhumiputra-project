from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from django.utils.decorators import method_decorator


from utils import serilalizer_error_list
from .. swagger_doc import get_swagger_api_details
from ..controller import UserController
from users_module.serializers import (
    ProfileDetailsSerializer
)
from .models import UserProfile
from auth_module.custom_decorator import access_limited_to

@method_decorator(access_limited_to('ADMIN,IT'), name='dispatch')
class Profile(APIView):

    model_class = UserProfile

    @swagger_auto_schema(**get_swagger_api_details("get_user_profile"))
    def get(self, request, pk):
        """
        Get user profile details
        """
        try:
            profile = self.model_class.objects.get(user__id=pk)
            serializer = ProfileDetailsSerializer(profile)
            return Response({
                "status": 200,
                "profile": serializer.data
            })
        except self.model_class.DoesNotExist:
            return Response({
                "status": 404,
                "message": "Profile not found."
            })
        except Exception as e:
            return Response({
                "status": 500,
                "message": f"Unexpected error: {str(e)}"
            })