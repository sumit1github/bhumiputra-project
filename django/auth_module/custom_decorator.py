from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse


def admin_and_superadmin_api(permissions):
    """
    Custom decorator to check if the user has access with specific permissions.
    Usage:
        @admin_and_superadmin_api('admin superadmin')
    """
    def decorator(function):
        @wraps(function)
        def wrap(request, *args, **kwargs):
            # Check if the Authorization header is present
            if "Authorization" not in request.headers:
                res = {
                    'status': status.HTTP_400_BAD_REQUEST,
                    'message': 'Authorization Token is not provided'
                }
                return Response(res, status=status.HTTP_400_BAD_REQUEST)

            user = request.user

            # Check if the user has a method 'has_access' and is callable
            if user and hasattr(user, 'has_access') and callable(user.has_access):
                # Now use the passed permissions string
                if user.has_access(permissions):
                    return function(request, *args, **kwargs)
                else:
                    res = {
                        'status': status.HTTP_403_FORBIDDEN,
                        'error': 'Permission Denied!'
                    }
                    return Response(res, status=status.HTTP_403_FORBIDDEN)
            else:
                res = {
                    'status': status.HTTP_400_BAD_REQUEST,
                    'error': 'Login Required!'
                }
                return Response(res, status=status.HTTP_400_BAD_REQUEST)

        return wrap

    return decorator

def access_limited_to14(role):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # Check if the Authorization header is present
            if "Authorization" not in request.headers:
                return JsonResponse({'detail': 'Authorization token is required.'}, 
                              status=status.HTTP_401_UNAUTHORIZED)
            
            # Check if user is authenticated
            if not request.user.is_authenticated:
                return JsonResponse({'detail': 'Authentication required.'}, 
                              status=status.HTTP_401_UNAUTHORIZED)
                
            if not request.user.has_access(role):
                return JsonResponse({'detail': 'Permission denied.'}, 
                              status=status.HTTP_403_FORBIDDEN)
                
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator

from rest_framework.authtoken.models import Token
def access_limited_to(permissions):
    """
    Custom decorator to check if the user has access with specific permissions.
    Usage:
        @admin_and_superadmin_api('admin superadmin')
    """
    def decorator(function):
        @wraps(function)
        def wrap(request, *args, **kwargs):
            # Check if the Authorization header is present
            if "Authorization" not in request.headers:
                res = {
                    'status': status.HTTP_400_BAD_REQUEST,
                    'message': 'Authorization Token is not provided'
                }
                return JsonResponse(res, status=status.HTTP_400_BAD_REQUEST)
                
            try:
                token_key = request.headers["Authorization"].split(' ')[1]
                token = Token.objects.get(key=token_key)
                user = token.user
                request.user = user

                if not user.has_access(permissions):
                    res = {
                        'status': status.HTTP_403_FORBIDDEN,
                        'error': 'Permission Denied!'
                    }
                    return JsonResponse(res, status=status.HTTP_403_FORBIDDEN)
            except Exception as e:
                return JsonResponse({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

            # Check if the user has a method 'has_access' and is callable
            if user and hasattr(user, 'has_access') and callable(user.has_access):
                # Now use the passed permissions string
                if user.has_access(permissions):
                    return function(request, *args, **kwargs)
                else:
                    res = {
                        'status': status.HTTP_403_FORBIDDEN,
                        'error': 'Permission Denied!'
                    }
                    return JsonResponse(res, status=status.HTTP_403_FORBIDDEN)
            else:
                res = {
                    'status': status.HTTP_400_BAD_REQUEST,
                    'error': 'Login Required!'
                }
                return JsonResponse(res, status=status.HTTP_400_BAD_REQUEST)

        return wrap

    return decorator