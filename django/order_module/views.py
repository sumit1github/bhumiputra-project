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
from order_module.models import Order
from order_module.serializers import OrderCreateSerializer

@method_decorator(access_limited_to("ADMIN,IT,DISTRIBUTER"), name='dispatch')
class OrderCreation(APIView):

    def post(self, request):
        """Create order"""
        serilalizer = OrderCreateSerializer(data=request.data)
        if not serilalizer.is_valid():
            return Response({
                "status": 400,
                "message": "Invalid data",
                "errors": serilalizer_error_list(serilalizer.errors)
            }, status=400)
        data = serilalizer.validated_data

        customer = data.get("customer",None)
        products_info = data.get("products_info")


        order_obj = Order.objects.create(
            customer=customer,
            products_info=products_info
        )


        return Response({
            "status": 200,
            "message": "Order created successfully",
            "order_id": order_obj.id_prefix + str(order_obj.id),
        }, status=200)