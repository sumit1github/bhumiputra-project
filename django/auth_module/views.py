from django.shortcuts import render, redirect
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.hashers import make_password
from django.contrib import messages
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import AllowAny


from . import models as common_model
from . import serilaizer as common_serializer
from utils import serilalizer_error_list
from . import swagger_doc

class Login(APIView):

    model= common_model.User
    serializer_class = common_serializer.LoginSerializer
    swagger_doc_item = swagger_doc.login_post
    permission_classes = [AllowAny]

    def set_token_expiration(self, token):
        expiration_time = timezone.now() + timedelta(minutes=60)  # Set 60 minutes expiration
        token.created = expiration_time
        token.save()
        return token

    @swagger_auto_schema(
        tags=swagger_doc_item['tag'],
        operation_id=swagger_doc_item['url_name'],
        operation_description=swagger_doc_item['description'],
        request_body=openapi.Schema(
            required=swagger_doc_item['required_fields'],
            type=openapi.TYPE_OBJECT,
            properties = swagger_doc_item['fields'],
        ),
        responses=swagger_doc_item['responses'],
        
    )

    def post(self, request):
        resp ={}
        user = None
        serilizer = self.serializer_class(data =request.data)
        if serilizer.is_valid():
            email = serilizer.validated_data.get('email', None)
            password = serilizer.validated_data.get('password')

            seach_dict = {
                'email': email,
            }
            if not "@" in email:
                seach_dict = {
                    'contact1': email,
                }
            
            try:
                user = self.model.objects.get(**seach_dict)
                print(user)
            except common_model.User.DoesNotExist:

                user = None
                return Response({"status":400,"error":["Login Failed..",]})

        else:
            return Response({"status":400,"error":serilizer.errors})

        if user.check_password(password):
            pass  # Credentials are valid
        else:
            user = None  # Incorrect password
    
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            self.set_token_expiration(token)
            resp['access_token']= str(token.key)
            resp['status']= 200
            resp['user']= common_serializer.UserSerializer(user).data
        else:
            resp['status']= 400
            resp['message']= "Login Failed or Account Not Found"
        
        return Response(resp)
    


class LogOut(APIView):

    swagger_doc_item = swagger_doc.logout_get

    @swagger_auto_schema(
        tags=swagger_doc_item['tag'],
        operation_id=swagger_doc_item['url_name'],
        operation_description=swagger_doc_item['description'],
        responses=swagger_doc_item['responses'],
        
    )

    def get(self, request):
        token, created = Token.objects.get_or_create(user=request.user)
        token.delete()
        return Response({
            "status":200,
            "message":"Logout Successful",
        })
    