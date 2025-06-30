from drf_yasg import openapi

from .serializers import UserCreateSerializer, InviteUserSerializer, UserDetailUpdateSerializer


api_details = {
    "user_filter_get" : {
        'tag':["User Module"],
        "url_name": "User List Filter",
        "required_fields" : [],
        "responses" : {200: 'Success', 400: 'Bad Request', "user_list" :"Array","message":""},
        "description" : "Get filtered list of users",
        "manual_parameters":[
            openapi.Parameter("is_active", openapi.IN_QUERY,required=False, type=openapi.TYPE_BOOLEAN),
            openapi.Parameter("email", openapi.IN_QUERY,required=False, type=openapi.TYPE_STRING),
            openapi.Parameter("contact1", openapi.IN_QUERY,required=False, type=openapi.TYPE_STRING),
        ]
    },
    "user_create_post" : {
        'tag':["User Module"],
        "url_name": "User Add",
        "required_fields" : [],
        "responses" : {200: 'Success', 400: 'Bad Request'},
        "description" : "Add User : User List > Add User. Logged-In User with IT role only can add an user.",
        "request_body" : UserCreateSerializer
    }, 

    "user_create_put" : {
        'tag':["User Module"],
        "url_name": "User Add",
        "required_fields" : [],
        "responses" : {200: 'Success', 400: 'Bad Request'},
        "description" : "Add User : User List > update User. Logged-In User with IT role only can update an user.",
        "request_body" : UserCreateSerializer,
        "manual_parameters":[
            openapi.Parameter("pk", openapi.IN_QUERY,required=True, type=openapi.TYPE_STRING, description="Need to pass user:id.",),
        ]
    }, 
    "user_inactive_delete" : {
        'tag':["User Module"],
        "url_name": "User Inactive",
        "required_fields" : [],
        "responses" : {200: 'Success', 400: 'Bad Request'},
        "description" : "Inactive User : User List > Inactive User. Logged-In User with IT role only can inactive an user.",
        "manual_parameters":[
            openapi.Parameter("pk", openapi.IN_QUERY,required=True, type=openapi.TYPE_STRING, description="Need to pass user:id.",),
        ]
    },

    # profile
    "get_user_profile" : {
        'tag':["User Module - Profile"],
        "url_name": "Get profile details",
        "required_fields" : [],
        "responses" : {200: 'Success', 400: 'Bad Request'},
        "description" : "Inactive User : User List > Inactive User. Logged-In User with IT role only can inactive an user.",
        "manual_parameters":[
            openapi.Parameter("pk", openapi.IN_QUERY,required=True, type=openapi.TYPE_STRING, description="Need to pass user:id.",),
        ]
    },
    "user_invite_post" : {
        'tag':["User Module"],
        "url_name": "User Invite",
        "required_fields" : [],
        "responses" : {200: 'Success', 400: 'Bad Request'},
        "description" : "Add User : User List > Add User. Logged-In User with IT role only can add an user.",
        "request_body" : InviteUserSerializer
    },

    "user_details_get" : {
        'tag':["User Module"],
        "url_name": "User Details",
        "required_fields" : [],
        "responses" : {200: 'Success', 400: 'Bad Request'},
        "description" : "User Details",
        "manual_parameters":[
            openapi.Parameter("pk", openapi.IN_QUERY,required=True, type=openapi.TYPE_STRING, description="Need to pass user:id.",),
        ],

    },

    "user_details_update_post" : {
        'tag':["User Module"],
        "url_name": "User update psot",
        "required_fields" : [],
        "responses" : {200: 'Success', 400: 'Bad Request'},
        "description" : "User post",
        "manual_parameters":[
            openapi.Parameter("pk", openapi.IN_QUERY,required=True, type=openapi.TYPE_STRING, description="Need to pass user:id.",),
        ],
        "request_body" : UserDetailUpdateSerializer

    },
}

def get_swagger_api_details(function_name):
    return api_details[function_name]
