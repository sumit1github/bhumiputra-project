from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.db import transaction
from django.core.cache import cache


from utils import serilalizer_error_list, paginate
from .swagger_doc import get_swagger_api_details
from .models import Products
from .serializers import ProductSerializer

from auth_module.models import User
from auth_module.custom_decorator import access_limited_to


@method_decorator(access_limited_to('ADMIN,IT,DISTRIBUTER'), name='dispatch') 
class GetAllProducts(APIView):

    @swagger_auto_schema(**get_swagger_api_details("get_all_products"))
    def get(self, request):

        product_list = Products.objects.all().order_by("-id")

        if not request.user.is_distributer:
            product_list = Products.objects.all().order_by("-id")
            page, pagemator_meta_data = paginate(
                request,
                product_list,
                20
            )
            serialized_data = ProductSerializer(page, many=True).data

        else:
            serialized_data = ProductSerializer(product_list, many=True).data
            pagemator_meta_data = None

        return Response({

            "status": 200,
            "product_list": serialized_data,
            "pagination_meta_data": pagemator_meta_data
        })


@method_decorator(access_limited_to('ADMIN,IT'), name='dispatch') 
class productCreateDetailUpdateDelete(APIView):

    @swagger_auto_schema(**get_swagger_api_details("product_create_post"))
    def post(self, request):
        data = request.data
        if not data.get('name'):
            return Response({
                "status": 400,
                "error": {"name": "Product name is required"}
            })
        
        if Products.objects.filter(name=data['name']).exists():
            return Response({
                "status": 400,
                "error": {"name": "Product with this name already exists"}
            })

        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            # Clear distributor cache when new product is created
            cache.delete('distributor_products_list')
            return Response({
                "status": 200,
                "message": "Product created successfully",
                "product": serializer.data
            })
        else:
            return Response({
                "status": 400,
                "error": serilalizer_error_list(serializer.errors)
            })
        
    @swagger_auto_schema(**get_swagger_api_details("product_update_patch"))
    def patch(self, request):
        product_id = request.GET.get('pid')
        if not product_id:
            return Response({
                "status": 400,
                "error": {
                    "id": "Product ID is required to update product details."
                }
            })
        try:
            product = Products.objects.get(id=product_id)
        except Products.DoesNotExist:
            return Response({
                "status": 404,
                "error": {
                    "id": "Product with the given ID does not exist."
                }
            })
        data = request.data
        serializer = ProductSerializer(instance=product, data=data)
        if serializer.is_valid():
            serializer.save()
            # Clear distributor cache when product is updated
            cache.delete('distributor_products_list')
            return Response({
                "status": 200,
                "message": "Product updated successfully",
                "product": serializer.data
            })
        else:
            return Response({
                "status": 400,
                "error": serilalizer_error_list(serializer.errors)
            })
    
    @swagger_auto_schema(**get_swagger_api_details("product_delete"))
    def delete(self, request):
        product_id = request.data.get('pid')
        if not product_id:
            return Response({
                "status": 400,
                "error": {
                    "id": "Product ID is required to delete product."
                }
            })
        try:
            product = Products.objects.get(id=product_id)
            product.delete()
            # Clear distributor cache when product is deleted
            cache.delete('distributor_products_list')
            return Response({
                "status": 200,
                "message": "Product deleted successfully"
            })
        except Products.DoesNotExist:
            return Response({
                "status": 404,
                "error": {
                    "id": "Product with the given ID does not exist."
                }
            })
        
    @swagger_auto_schema(**get_swagger_api_details("product_details_get"))
    def get(self, request):
        product_id = request.query_params.get('pid')
        if not product_id:
            return Response({
                "status": 400,
                "error": {
                    "id": "Product ID is required to fetch product details."
                }
            })
        try:
            product = Products.objects.get(id=product_id)
            serializer = ProductSerializer(product)
            return Response({
                "status": 200,
                "product": serializer.data
            })
        except Products.DoesNotExist:
            return Response({
                "status": 400,
                "error": {
                    "id": "Product with the given ID does not exist."
                }
            })
        
@method_decorator(access_limited_to('ADMIN,IT,DISTRIBUTER'), name='dispatch') 
class JoiningProductList(APIView):
    
    def get(self, request):
        product_list = Products.objects.get_all_joining_packages().order_by("-id")
        serialized_data = ProductSerializer(product_list, many=True).data
        return Response({

            "status": 200,
            "product_list": serialized_data,
        })