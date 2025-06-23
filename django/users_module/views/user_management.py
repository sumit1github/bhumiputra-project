from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from django.utils.decorators import method_decorator

from utils import serilalizer_error_list
from .. swagger_doc import get_swagger_api_details
from ..controller import UserController
from users_module.serializers import (
    UserListSerializer, 
    UserCreateSerializer
)
from auth_module.models import User
from auth_module.custom_decorator import access_limited_to

@method_decorator(access_limited_to('ADMIN,IT'), name='dispatch')
class UserFilter(APIView):
    """
    userList
    filter
    """

    @swagger_auto_schema(**get_swagger_api_details("user_filter_get"))
    def get(self, request):
        uc = UserController()
        user_list = uc.user_list_filter(request.GET.dict())
        if not user_list['error']:
            return Response({
                "status": 200,
                "user_list": UserListSerializer(user_list["user_list"], many=True).data
            })
        else:
            return Response({
                "status": 400,
                "message": user_list["message"]
            })

    @swagger_auto_schema(**get_swagger_api_details("user_create_post"))
    def post(self, request):
        data = request.data
        serializer = UserCreateSerializer(data = data)
        if serializer.is_valid():
            cleaned_data = serializer.validated_data
            cleaned_data["role"] = cleaned_data["roles"]
            cleaned_data.pop("roles",[])
            uc = UserController()
            user_create = uc.add_new_user(cleaned_data)

            if not user_create['error']:
                return Response({
                    "status": 200,
                    "user": UserListSerializer(user_create["user"]).data
                })
            else:
                return Response({
                    "status": 400,
                    "message": user_create["message"]
                })
        else:
            error_list = serilalizer_error_list(serializer.errors)
            return Response(
                {
                    "status":400,
                    "error": error_list,
                }
            )
        
    @swagger_auto_schema(**get_swagger_api_details("user_create_put"))
    def put(self, request):
        pk = request.GET.get("pk",None)
        if pk is None:
            return Response({"status": 400, "message": "Need to send Primary Key (pk) in user prams"})
        
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"status": 400, "message": "User not found"})

        serializer = UserCreateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"status": 200, "message": "User updated successfully"})
        else:
            error_list = serilalizer_error_list(serializer.errors)
            return Response(
                {
                    "status":400,
                    "error": error_list,
                }
            )
        
    @swagger_auto_schema(**get_swagger_api_details("user_inactive_delete"))
    def delete(self, request):
        pk = request.GET.get("pk",None)
        if pk is None:
            return Response({"status": 400, "message": "Need to send Primary Key (pk) in user prams"})
        uc = UserController()
        user_inactive = uc.inactive_user(pk)

        if not user_inactive['error']:
            return Response({
                "status": 200,
                "message": user_inactive["message"]
            })
        else:
            return Response({
                "status": 400,
                "message": user_inactive["message"]
            })