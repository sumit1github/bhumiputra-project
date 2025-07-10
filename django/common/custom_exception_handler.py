from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
import traceback
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    # First, call DRF's built-in handler
    response = drf_exception_handler(exc, context)

    if isinstance(exc, ValidationError):
        logger.warning("Validation error occurred", exc_info=exc)

        custom_response = {
            "status": "error",
            "message": "Validation failed",
            "errors": exc.detail,  # or `response.data` if you prefer
        }
        return Response(custom_response, status=status.HTTP_400_BAD_REQUEST)

    if response is not None:
        return response

    # Log unhandled exceptions
    logger.error("Unhandled exception", exc_info=exc)

    error_data = {
        "detail": "Internal server error",
        "error": str(exc)
    }

    error_data["trace"] = traceback.format_exc()
        

    return Response(error_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
