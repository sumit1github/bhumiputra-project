from drf_yasg import openapi


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
}


def get_swagger_api_details(function_name):
    return api_details[function_name]
