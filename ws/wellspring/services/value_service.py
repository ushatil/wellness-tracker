import logging
import random
from wellspring.models import Device, Value
from wellspring.services import device_service, vest_service
from django.core.exceptions import PermissionDenied

LOGGER = logging.getLogger(__name__)

def add_value_by_string_params(name, description, device_uuid, vest_subsection_name):
    LOGGER.debug("Adding value by String Params")
    device = device_service.get_by_device_uuid(device_uuid)
    vest_subsection = vest_service.get_by_name_vest_subsection(vest_subsection_name)
    return add_value_by_domain_objects(name, description, device, vest_subsection)

def add_value_by_domain_objects(name, description, device, vest_subsection):
    LOGGER.debug("Adding value by Domain Objects")
    result = Value(device = device, vest_subsection = vest_subsection, value_name = name, value_description = description)
    result.save()
    return result

def get_all_values_for_device(device_uuid):
    LOGGER.debug("Getting all values for device: " + device_uuid)
    device = device_service.get_by_device_uuid(device_uuid)
    return list(device.value_set.all())

def get_value_by_id(device_uuid, value_id):
    LOGGER.debug("Getting value by ID: " + str(value_id))
    value = Value.objects.get(id = value_id)
    
    if value.device.device_uuid != device_uuid:
        LOGGER.error("Value access attempted with incorrect UUID!")
        LOGGER.error("Value ID: " + str(value_id))
        LOGGER.error("Value owned by UUID: " + value.device.device_uuid)
        LOGGER.error("Access attempted by UUID: " + device_uuid)
        raise PermissionDenied()
    
    return value

def delete_value(device_uuid, value_id):
    LOGGER.info("Deleting value. ID: " + str(value_id))
    get_value_by_id(device_uuid, value_id).delete()
    
def update_value(value_id, device_uuid, name, description, vest_subsection_name):
    LOGGER.debug("Updating value. ID: " + str(value_id))
    value = get_value_by_id(device_uuid, value_id)
    value.value_name = name
    value.value_description = description
    
    vest_subsection = vest_service.get_by_name_vest_subsection(vest_subsection_name)
    value.vest_subsection = vest_subsection
    
    value.save()
    return value

def get_value_for_subsection(vest_subsection_name, device_uuid):
    '''Will return None if no such value exists
    '''
    
    vest_subsection = vest_service.get_by_name_vest_subsection(vest_subsection_name)
    device = device_service.get_by_device_uuid(device_uuid)
    
    if not Value.objects.filter(device = device, vest_subsection = vest_subsection).exists():
        return None
    
    values = list(Value.objects.filter(device = device, vest_subsection = vest_subsection))
    return values[random.randint(0, len(values)-1)]