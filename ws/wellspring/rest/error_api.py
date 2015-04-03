import logging
from wellspring.rest.wellspring_rest_base import handle_rest_exception
from django.http import HttpResponse

LOGGER = logging.getLogger(__name__)

def wellspring400(request):
    LOGGER.error("Bad Request. Invoking custom 403 handler")
    response = HttpResponse()
    return handle_rest_exception(response, 400, "Bad Request")

def wellspring403(request):
    LOGGER.error("Access forbidden. Invoking custom 403 handler")
    response = HttpResponse()
    return handle_rest_exception(response, 403, "Forbidden")

def wellspring404(request):
    LOGGER.error("Resource not found. Invoking custom 404 handler")
    response = HttpResponse()
    return handle_rest_exception(response, 404, "Requested resource was not found")

def wellspring500(request):
    LOGGER.error("Internal server error. Invoking custom 404 handler")
    response = HttpResponse()
    return handle_rest_exception(response, 500, "Internal Server Error")
