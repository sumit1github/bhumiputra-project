from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.db import transaction
from decimal import Decimal

from utils import serilalizer_error_list, paginate
from .. swagger_doc import get_swagger_api_details
from ..controller import UserController
from users_module.serializers import (
    UserListSerializer, 
    UserCreateSerializer,
    InviteUserSerializer,
    UserDetailUpdateSerializer
)
from auth_module.models import User
from auth_module.custom_decorator import access_limited_to
from ..constants import JOINING_COMISSION

@method_decorator(access_limited_to('ADMIN,IT'), name='dispatch')
class UserFilter(APIView):
    """
    userList
    filter
    """

    @swagger_auto_schema(**get_swagger_api_details("user_filter_get"))
    def get(self, request):
        uc = UserController()

        query_dict = {k: v for k, v in request.GET.dict().items() if k != 'page'}
        user_list = uc.user_list_filter(query_dict)

        if not user_list['error']:
            page, pagemator_meta_data = paginate(
                request,
                user_list['user_list'],
                20
            )
            
            return Response({
                "status": 200,
                "user_list": UserListSerializer(page, many=True).data,
                "pagination_meta_data": pagemator_meta_data
            })
        else:
            return Response({
                "status": 400,
                "error": {
                    "message": user_list["message"]
                }
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
        

@method_decorator(access_limited_to('ADMIN,IT'), name='dispatch')
class InviteUser(APIView):

    @transaction.atomic
    def distribute_joining_rewards(self, new_user):
        """
        Optimized: Distribute joining rewards to up to 23 parent users using bulk_update.
        
        Args:
            new_user (User): The newly joined user (who has a parent chain).
        """
        current_user = new_user.parent
        level = 1
        users_to_update = []

        while current_user and level <= 23:
            reward = JOINING_COMISSION.get(level)
            if not current_user.wallet_balance or not current_user.wallet_balance.isnumeric():
                current_user.wallet_balance = Decimal(0.00)
            if reward:
                current_user.wallet_balance += Decimal(reward)
                users_to_update.append(current_user)
            current_user = current_user.parent
            level += 1

        if users_to_update:
            User.objects.bulk_update(users_to_update, ['wallet_balance'])

    @swagger_auto_schema(**get_swagger_api_details("user_invite_post"))
    def post(self, request):

        serializer = InviteUserSerializer(data=request.data)
        joining_level_of_parent_user = None
        try:
            parent_user = User.objects.get(id=request.data.get("parent",""))
            
        except:
            return Response({
                "status": 400,
                "error": {
                    "parent": "Parent user does not exist."
                }
            })
        joining_level_of_parent_user = parent_user.joining_level if (parent_user.joining_level and parent_user.joining_level.isnumeric()) else 0
        if serializer.is_valid():
            cleaned_data = serializer.validated_data
            uc = UserController()

            # adding the joining level of the new user => joining_level_of_parent_user + 1
            cleaned_data["joining_level"] = joining_level_of_parent_user + 1

            user_add = uc.invite_user(cleaned_data)
            

            if not user_add['error']:
                self.distribute_joining_rewards(user_add["user"])
                return Response({
                    "status": 200,
                    "message": user_add["message"],
                })
            else:
                return Response({
                    "status": 400,
                    "message": user_add["message"]
                })
        else:
            error_list = serilalizer_error_list(serializer.errors)
            return Response(
                {
                    "status":400,
                    "error": error_list,
                }
            )
        
@method_decorator(access_limited_to('ADMIN,IT'), name='dispatch')
class UserDetailsUpdateView(APIView):
    serializer_class = UserDetailUpdateSerializer
    
    @swagger_auto_schema(**get_swagger_api_details("user_details_get"))
    def get(self, request, pk):
        
        if pk is None:
            return Response({"status": 400, "error": {
                "pk": "Primary Key (pk) is required to fetch user details."
            }})
        
        uc = UserController()
        user_details = uc.user_details(pk)

        try:
            return Response({
                "status": 200,
                "user": self.serializer_class(user_details["user"]).data
            })
        except User.DoesNotExist:
            return Response({"status": 400, "error": {
                "user": "User not found."
            }})
        
    @swagger_auto_schema(**get_swagger_api_details("user_details_update_post"))
    def post(self, request, pk):

        user = User.objects.get(id=pk)
        if user is None:
            return Response({"status": 400, "error": {
                "pk": "Primary Key (pk) is required to update user details."
            }})
        serializer = self.serializer_class(data=request.data, instance=user, partial=True)
        if serializer.is_valid():
            cleaned_data = serializer.validated_data

            uc = UserController()
            user_update = uc.update_user(pk, cleaned_data)

            if not user_update['error']:

                return Response({
                    "status": 200,
                    "message": user_update["message"],
                })
            else:
                return Response({
                    "status": 400,
                    "message": user_update["message"]
                })
            
        else:
            error_list = serilalizer_error_list(serializer.errors)
            return Response(
                {
                    "status":400,
                    "error": error_list,
                }
            )