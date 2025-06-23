from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache


from users_module.constants import roles

class AllRoles(APIView):

    def get(self, request):

        return Response({
            "status": 200,
            "role_list": cache.get_or_set('roles', roles, timeout=2592000)
        })
