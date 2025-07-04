from drf_yasg import openapi

from .serializers import ProductSerializer


api_details = {
    "get_all_products" : {
        'tag':["Product Module"],
        "url_name": "Get All Products",
        "required_fields" : [],
        "responses" : {200: 'Success', 400: 'Bad Request'},
        "description" : "Get a list of all products",
        "manual_parameters":[
            openapi.Parameter("page", openapi.IN_QUERY, required=False, type=openapi.TYPE_INTEGER, description="Page number for pagination."),
        ]
    },
    "product_create_post" : {
        'tag':["Product Module"],
        "url_name": "Create Product",
        "required_fields" : ["name", "price", "description"],
        "responses" : {200: 'Success', 400: 'Bad Request'},
        "description" : "Create a new product",
        "manual_parameters": [],
        "request_body": ProductSerializer
    },
    "product_update_patch" : {
        'tag':["Product Module"],
        "url_name": "Update Product",
        "required_fields" : ["id"],
        "responses" : {200: 'Success', 400: 'Bad Request'},
        "description" : "Update an existing product",
        "manual_parameters": [
            openapi.Parameter("pid", openapi.IN_QUERY, required=True, type=openapi.TYPE_INTEGER, description="Product ID to update."),
        ],
        "request_body": ProductSerializer
    },
    "product_delete" : {
        'tag':["Product Module"],
        "url_name": "Delete Product",
        "required_fields" : ["id"],
        "responses" : {200: 'Success', 400: 'Bad Request'},
        "description" : "Delete a product by ID",
        "manual_parameters": [
            openapi.Parameter("pid", openapi.IN_QUERY, required=True, type=openapi.TYPE_INTEGER, description="Product ID to delete."),
        ],
    },
    "product_details_get" : {
        'tag':["Product Module"],
        "url_name": "Product Detail",
        "required_fields" : ["id"],
        "responses" : {200: 'Success', 400: 'Bad Request'},
        "description" : "Get details of a product by ID",
        "manual_parameters": [
            openapi.Parameter("pid", openapi.IN_QUERY, required=True, type=openapi.TYPE_INTEGER, description="Product ID to get details."),
        ],
    }
}


def get_swagger_api_details(function_name):
    return api_details[function_name]
