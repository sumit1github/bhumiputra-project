from django.shortcuts import render
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.db import transaction
from utils import serilalizer_error_list, paginate
from .swagger_doc import get_swagger_api_details

from auth_module.custom_decorator import access_limited_to

from product_management.models import Products
from product_management.serializers import ProductSerializer
from auth_module.models import User

class DashBoard(APIView):

    @swagger_auto_schema(**get_swagger_api_details("get_all_products"))
    def get(self, request):
        product_list = Products.objects.all().order_by("id")
        serialized_data = ProductSerializer(product_list).data
        return Response({
            "status": 200,
            "product_list": serialized_data,
        })