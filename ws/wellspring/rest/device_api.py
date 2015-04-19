import logging
from wellspring.rest.wellspring_rest_base import *
from wellspring.services import device_service

LOGGER = logging.getLogger(__name__)

def register_device(request):
    return handle_rest_request(request, device_post_handler, ["POST"])

def device_post_handler(request, response, device_uuid, pathParams):
    responseBody = build_base_wellspring_message()
    
    if device_service.device_exists(device_uuid):
        responseBody["message"] = "Device is already registered"
        response.content = jsonify(responseBody)
        return response
        
    device_service.add_device(device_uuid)
    responseBody["message"] = "Device newly registered"
    response.content = jsonify(responseBody)
    return response