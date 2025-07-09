import traceback
import logging
from django.http import JsonResponse
from django.conf import settings

logger = logging.getLogger(__name__)

class GlobalExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            return response
        except Exception as e:
            logger.error("Internal Server Error", exc_info=True)

            # Customize the message shown in production
            if settings.DEBUG:
                return JsonResponse({
                    "error": "Internal Server Error",
                    "exception": str(e),
                    "trace": traceback.format_exc()
                }, status=500)
            else:
                return JsonResponse({
                    "error": "Something went wrong. Please try again later."
                }, status=500)
