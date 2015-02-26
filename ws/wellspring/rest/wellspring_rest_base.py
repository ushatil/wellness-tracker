import logging
import json
from django.http import HttpResponse
from django.http import HttpRequest
from wellspring.exceptions import DeviceNotRegistered
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied, ValidationError

LOGGER = logging.getLogger(__name__)

def handle_rest_request(request, handler, acceptable_method, id=None):
    '''Handler will be called as follows:
    return handler(request, response, device_uuid, id)
    handler must return the response
    
    method should be "GET", "PUT", "POST", or "DELETE"
    '''
    response = HttpResponse()
    
    LOGGER.info("Received request")
    LOGGER.info("Path: " + request.path)
    LOGGER.info("Method: " + request.method)
    
    ## Check request method
    if request.method != acceptable_method:
        LOGGER.warning("Request made with unacceptable method")
        LOGGER.warning("Path: " + request.path)
        LOGGER.warning("Method: " + request.method)
        return handle_rest_exception(response, 405, "Request method not allowed: " + request.method)
    
    ## Check request header
    try:
        device_uuid = request.META["HTTP_DEVICE"]
    except KeyError:
        LOGGER.warning("Request made without Device Header")
        LOGGER.warning("Path: " + request.path)
        return handle_rest_exception(response, 401, "Request did not contain Device header")
    
    LOGGER.info("Device: " + device_uuid)
    
    ## Request is valid; try to process request
    try:
        return handler(request, response, device_uuid, id)
    except ValidationError as e:
        LOGGER.warning("Request raised ValidationError")
        LOGGER.warning("Path: " + request.path)
        return handle_rest_exception(response, 400, "Bad request body: " +e.message)
    except DeviceNotRegistered:
        LOGGER.warning("Request raised DeviceNotRegistered")
        LOGGER.warning("Path: " + request.path)
        LOGGER.warning("UUID: " + device_uuid)
        return handle_rest_exception(response, 401, "Device is not registered")
    except PermissionDenied:
        LOGGER.warning("Request raised PermissionDenied")
        LOGGER.warning("Path: " + request.path)
        LOGGER.warning("UUID: " + device_uuid)
        return handle_rest_exception(response, 403, "Device does not have permission to access requested resources")
    except ObjectDoesNotExist:
        LOGGER.warning("Request raised ObjectDoesNotExist")
        LOGGER.warning("Path: " + request.path)
        return handle_rest_exception(response, 404, "Requested resource was not found")
    except Exception as e:
        LOGGER.error("Internal server error")
        LOGGER.error(str(e))
        LOGGER.error("Path: " + request.path)
        return handle_rest_exception(response, 500, "Internal Server Error")
        
        
        
        
def handle_rest_exception(response, status_code, message):
    responseBody = build_base_wellspring_message()
    
    responseBody["statusCode"] = status_code
    responseBody["errorFound"] = True
    responseBody["message"] = message
    
    response.status_code = status_code
    response.content = jsonify(responseBody)
    return response

def build_base_wellspring_message():
    return {
            "type" : "WellspringMessage",
           "statusCode" : 200,
           "errorFound" : False,
           "message" : ""
            }
    
def build_wellspring_list(nested_type):
    return {
            "type" : "WellspringList",
            "nestedType" : nested_type,
            "list" : []
            }

def jsonify(body):
    return json.dumps(body)

def get_request_body(request):
    return json.loads(request.body.decode())

def verify_object_type(json_object, expected_type):
    if "type" in json_object:
        if json_object["type"] != expected_type:
            raise ValidationError("Expected object of type: " + expected_type)
    else :
        raise ValidationError("JSON object must specify type")
    
def verify_object_member(json_object, member_name):
    if member_name not in json_object:
        raise ValidationError("Object must fontain field: " + member_name)