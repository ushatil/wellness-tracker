import logging
from wellspring.rest.wellspring_rest_base import *
from wellspring.services import value_service

LOGGER = logging.getLogger(__name__)

def value_endpoint_without_id(request):
    acceptable_methods = ["POST", "GET"]
    if (request.method == "POST"):
        return handle_rest_request(request, post_new_value_handler, acceptable_methods)
    if (request.method == "GET"):
        return handle_rest_request(request, get_all_values_handler, acceptable_methods)
    
    LOGGER.warning("Request made with unacceptable method")
    LOGGER.warning("Path: " + request.path)
    LOGGER.warning("Method: " + request.method)
    return handle_rest_exception(HttpResponse(), 405, "Request method not allowed: " + request.method)

def value_endpoint_with_id(request, id):
    acceptable_methods = ["DELETE", "PUT", "GET"]
    if (request.method == "GET"):
        return handle_rest_request(request, get_value_by_id_handler, acceptable_methods, id)
    if (request.method == "PUT"):
        return handle_rest_request(request, update_value_by_id_handler, acceptable_methods, id)
    if (request.method == "DELETE"):
        return handle_rest_request(request, delete_value_by_id_handler, acceptable_methods, id)
    
    LOGGER.warning("Request made with unacceptable method")
    LOGGER.warning("Path: " + request.path)
    LOGGER.warning("Method: " + request.method)
    return handle_rest_exception(HttpResponse(), 405, "Request method not allowed: " + request.method)

def get_all_values_handler(request, response, device_uuid, id):
    responseBody = build_wellspring_list("WellspringValue")
    values = value_service.get_all_values_for_device(device_uuid)
    for value in values:
        responseBody["list"].append({
                                    "type" : "WellspringValue",
                                    "id" : int(value.id),
                                    "name" : str(value.value_name),
                                    "description" : str(value.value_description),
                                    "vestSubSection" : str(value.vest_subsection.subsection_name)
                                   })
    response.content = jsonify(responseBody)
    
    return response

def post_new_value_handler(request, response, device_uuid, id):
    requestBody = get_request_body(request)
    
    verify_object_type(requestBody, "WellspringValue")
    verify_object_member(requestBody, "name")
    verify_object_member(requestBody, "description")
    verify_object_member(requestBody, "vestSubSection")
    
    new_value = value_service.add_value_by_string_params(requestBody["name"], requestBody["description"], device_uuid, requestBody["vestSubSection"])
    
    responseBody = {
                    "type" : "WellspringValue",
                    "id" : int(new_value.id),
                    "name" : str(new_value.value_name),
                    "description" : str(new_value.value_description),
                    "vestSubSection" : str(new_value.vest_subsection.subsection_name)
                    }
    response.content = jsonify(responseBody)
    return response

def get_value_by_id_handler(request, response, device_uuid, id):
    value = value_service.get_value_by_id(device_uuid, id)
    responseBody = {
                    "type" : "WellspringValue",
                    "id" : int(value.id),
                    "name" : str(value.value_name),
                    "description" : str(value.value_description),
                    "vestSubSection" : str(value.vest_subsection.subsection_name)
                   }
    response.content = jsonify(responseBody)
    return response

def update_value_by_id_handler(request, response, device_uuid, id):
    requestBody = get_request_body(request)
    
    verify_object_type(requestBody, "WellspringValue")
    verify_object_member(requestBody, "name")
    verify_object_member(requestBody, "description")
    verify_object_member(requestBody, "vestSubSection")
    verify_object_member(requestBody, "id")
    
    if int(id) != int(requestBody["id"]):
        LOGGER.error("IDs dont match")
        raise ValidationError("Request Body ID should match Request Param ID")
    
    value = value_service.update_value(int(id), device_uuid, requestBody["name"], requestBody["description"], requestBody["vestSubSection"])
    
    responseBody = {
                "type" : "WellspringValue",
                "id" : int(value.id),
                "name" : str(value.value_name),
                "description" : str(value.value_description),
                "vestSubSection" : str(value.vest_subsection.subsection_name)
               }
    response.content = jsonify(responseBody)
    return response

def delete_value_by_id_handler(request, response, device_uuid, id):
    responseBody = build_base_wellspring_message()
    value_service.delete_value(device_uuid, id)
    responseBody["message"] = "Value succesfully deleted"
    
    response.content = jsonify(responseBody)
    return response