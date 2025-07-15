from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.db import transaction
from decimal import Decimal
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token

from utils import serilalizer_error_list, paginate
from .. swagger_doc import get_swagger_api_details
from ..controller import UserController
from users_module.serializers import (
    UserListSerializer, 
    UserCreateSerializer,
    InviteUserSerializer,
    UserUpdateSerializer,
    
    
)
from auth_module.models import User
from auth_module.custom_decorator import access_limited_to
from ..constants import JOINING_COMISSION, ACHIVER_LEVELS
from auth_module.serilaizer import UserSerializer


class UserFilter(APIView):
    """
    userList
    filter
    """

    @swagger_auto_schema(**get_swagger_api_details("user_filter_get"))
    def get(self, request):
        uc = UserController()

        query_dict = {k: v for k, v in request.GET.dict().items() if k != 'page'}
        user_list = uc.user_list_filter(request, query_dict)

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
            cleaned_data["password"] = make_password(cleaned_data["password"])
            
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
            return Response({"status": 400, "message": "User not found"})\
            
        serializer = UserCreateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            cleaned_data = serializer.validated_data
            if 'password' in cleaned_data:
                cleaned_data["password"] = make_password(cleaned_data["password"])
                print(cleaned_data["password"])
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
        
@method_decorator(transaction.atomic, name='dispatch')
class InviteUser(APIView):

    def invite_token_and_achiver_level_update(self, request, current_user, parent_user):
        """ Update the achiver level of parent users based on the current user's achiver level for new invitation."""
        
        # Reduce invite token

        if not current_user.is_superuser or not current_user.has_access("ADMIN,IT"):
            current_user.invite_tokens = max(current_user.invite_tokens - 1, 0)

            if parent_user.achiver_level < 5:
                parent_user.achiver_level += 1
            
            current_user.save()

        else:

            parent_user.achiver_level += 1
            print(parent_user.achiver_level)
            
        parent_user.save()

        is_same_user = request.user.pk == current_user.pk
        if not is_same_user and (not request.user.is_superuser and not request.user.has_access("ADMIN,IT")):
            request.user.invite_tokens = max(request.user.invite_tokens - 1, 0)
            request.user.save()


    def distribute_joining_rewards(self, new_user):
        """
            Distributes joining rewards to eligible parent users based on their achiever level.

            Each parent receives a reward if:
                - They are not a superuser.
                - They are within the first 23 levels in the parent chain.
                - Their achiever level qualifies them to earn at the current level.

            Rewards are accumulated and updated in bulk for performance.
        """

        current_user = new_user.parent
        level = 1
        users_to_update = []

        while current_user and level <= 23:
            reward = JOINING_COMISSION.get(level)

            # parentUser's ALevel is 0 make it 1, if none make it 1
            current_user_achiver_level = current_user.achiver_level if (current_user.achiver_level and current_user.achiver_level != 0) else 1
            # Get the max level this user is eligible for based on their achiver_level
            max_level = ACHIVER_LEVELS.get(current_user_achiver_level)

            # Only give reward if user is eligible
            if reward and level <= max_level:
                if not current_user.wallet_balance:
                    current_user.wallet_balance = Decimal(0.00)
                current_user.wallet_balance += Decimal(reward)
                users_to_update.append(current_user)

            current_user = current_user.parent
            level += 1

        if users_to_update:
            User.objects.bulk_update(users_to_update, ['wallet_balance'])

    @swagger_auto_schema(**get_swagger_api_details("user_invite_post"))
    def post(self, request):

        if not request.user.has_access("ADMIN,IT") and int(request.user.invite_tokens) <= 0:
            return Response({
                "status": 400,
                "message": "You have no joining pins left. Please contact admin to get more pins.",
                "logout": True
            })

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
        joining_level_of_parent_user = parent_user.joining_level if parent_user.joining_level else 0

        if serializer.is_valid():
            cleaned_data = serializer.validated_data

            uc = UserController()

            # adding the joining level of the new user => joining_level_of_parent_user + 1
            cleaned_data["joining_level"] = joining_level_of_parent_user + 1

            if 'password' in cleaned_data:

                cleaned_data["password"] = make_password(cleaned_data["password"])

            user_add = uc.invite_user(cleaned_data)
            
            if request.user.is_superuser or request.user.has_access("ADMIN,IT"):
                if parent_user.achiver_level < 5:
                    parent_user.achiver_level += 1
                    parent_user.save()
            else:
                if request.user.achiver_level < 5:
                    request.user.achiver_level += 1
                    request.user.invite_tokens = max(request.user.invite_tokens - 1, 0)
                    request.user.save()

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
        
class UserDetailsUpdateView(APIView):
    
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
                "user": UserSerializer(user_details["user"]).data
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
        serializer = UserUpdateSerializer(data=request.data, instance=user, partial=True)
        if serializer.is_valid():
            cleaned_data = serializer.validated_data
            if 'password' in cleaned_data:
                cleaned_data["password"] = make_password(cleaned_data["password"])
                print(cleaned_data)

            uc = UserController()
            user_update = uc.update_user(pk, cleaned_data)

            if not user_update['error']:
            
                # need to expire the user_token if user is updated
                token, created = Token.objects.get_or_create(user=user)
                token.delete()

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