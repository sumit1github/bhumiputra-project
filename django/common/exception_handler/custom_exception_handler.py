from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging
import traceback

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    # Let DRF handle the exception first
    response = exception_handler(exc, context)

    if response is None:
        # Log full traceback for debugging
        logger.error("Unhandled exception", exc_info=exc)

        # Optionally extract traceback as string
        tb = traceback.format_exc()

        return Response(
            {
                "detail": "Internal server error",
                "error": str(exc),         # include exception message
                "trace": tb                # include full traceback (optional; for development only)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
