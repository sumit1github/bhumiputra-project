from django.shortcuts import render
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.db import transaction
from utils import serilalizer_error_list, paginate
from .swagger_doc import get_swagger_api_details
from decimal import Decimal

from auth_module.custom_decorator import access_limited_to
from product_management.models import Products
from product_management.serializers import ProductSerializer
from auth_module.models import User
from order_module.models import Order
from order_module.serializers import OrderCreateSerializer, OrderListSerializer, DistributeJoiningPackageSerializer
from users_module.constants import REPURCHASE_COMISSION


@method_decorator(access_limited_to("ADMIN,IT,DISTRIBUTER"), name='dispatch')
@method_decorator(transaction.atomic, name='dispatch')
class OrderCreation(APIView):

    def get_total_bv(self, products_info):
        final = 0
        for product in products_info:
            final += product.get("total_bv",0)
        return final
            

    def commision_distribution(self, user_obj, total_bv):

        current_user = user_obj.parent
        level = 1
        users_to_update = []

        while current_user and level <= 23:
            raw_comission = REPURCHASE_COMISSION.get(level)
            comission = (raw_comission * total_bv) / 100
            current_user.wallet_balance += Decimal(comission)

            users_to_update.append(current_user)# bulk update

            current_user = current_user.parent
            level += 1

        if users_to_update:
            User.objects.bulk_update(users_to_update, ['wallet_balance'])

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

        customer = data.get("customer", None)
        products_info = data.get("products_info")

        # Handle customer_id extraction safely
        customer_id = None
        if customer:
            customer_id = customer[7:] if len(customer) > 7 else customer
        
        total_price = sum(product.get("total_price", 0) for product in products_info)

        if not customer_id:
            # No customer: apply 5% discount
            final_amount = total_price * 0.95
        else:
            # Customer exists: no discount
            final_amount = total_price
        
        order_obj = Order.objects.create(
            customer_id=customer_id,
            products_info=products_info,
            distributer=request.user,
            total_amount= final_amount,
        )

        if customer and customer_id:
            customer_obj = User.objects.get(id=customer_id)
            total_bv = self.get_total_bv(products_info)
            self.commision_distribution(customer_obj, total_bv)

        return Response({
            "status": 200,
            "message": f"Order id ({order_obj.id_prefix + str(order_obj.id)}) created successfully",
        }, status=200)
    
    
class OrderList(APIView):

    serilalizer = OrderListSerializer

    def get(self, request):
        """order history"""

        filter_dict = None

        if request.user.is_distributer:
            
            filter_dict = {
                "distributer": request.user
            }
        
        if not request.user.is_distributer and not request.user.is_admin:
            filter_dict = {
                "customer": request.user
            }

        if filter_dict: 
            order_list = Order.objects.filter(**filter_dict).order_by("-id")
        else:
            order_list = Order.objects.all().order_by("-id")

        page, pagemator_meta_data = paginate(
            request,
            order_list,
            20
        )
            
        return Response({
            "status": 200,
            "order_list": OrderListSerializer(page, many=True).data,
            "pagination_meta_data": pagemator_meta_data
        })


@method_decorator(access_limited_to("ADMIN,IT,DISTRIBUTER"), name='dispatch')
@method_decorator(transaction.atomic, name='dispatch')
class DistributeJoiningPackage(APIView):

    serilalizer = DistributeJoiningPackageSerializer

    def post(self, request):
        """distribute joining package"""
        serializer = self.serilalizer(data=request.data)
        product_id = request.data.get("product_id", None)

        if not serializer.is_valid():
            return Response({
                "status": 400,
                "error": serilalizer_error_list(serializer.errors)
            }, status=200)

        try:
            customer = User.objects.get(id=serializer.validated_data['customer'][7:])
            
        except User.DoesNotExist:
            return Response({
                "status": 400,
                "message": "Customer not found."
            }, status=200)

        if customer.got_joining_package:
            return Response({
                "status": 400,
                "message": "Customer already has a joining package."
            }, status=200)
        
        Order.objects.create(
            customer=customer,
            products_info=[{"p_id":product_id, "qty": 1}],
            distributer=request.user,
            is_joinging_pakage=True,
        )

        customer.got_joining_package = True
        customer.save()

        return Response({
            "status": 200,
            "message": "Joining is distributed successfully."
        }, status=200)