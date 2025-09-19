import logging
from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError, NotAuthenticated, PermissionDenied, Http404

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):

    response = drf_exception_handler(exc, context)

    if response is not None:
        return response


    logger.exception("Unhandled exception in API: %s", exc)


    return Response({
        'detail': 'На сервере произошла непредвиденная ошибка.',
        'code': 'internal_server_error'
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
