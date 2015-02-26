import logging
from wellspring.models import Device
from wellspring.exceptions import DeviceNotRegistered
from django.core.exceptions import ObjectDoesNotExist

LOGGER = logging.getLogger(__name__)

def add_device(device_uuid):
    LOGGER.info("Adding device. UUID: " + device_uuid)
    result = Device(device_uuid = device_uuid)
    result.save()
    return result

def get_all_devices():
    LOGGER.debug("Getting all devices")
    return list(Device.objects.all())

def get_by_device_id(id):
    LOGGER.debug("Getting device by ID: " + str(id))
    try:
        return Device.objects.get(id = id)
    except ObjectDoesNotExist:
        raise DeviceNotRegistered("Specified device is not registered")

def get_by_device_uuid(device_uuid):
    LOGGER.debug("Getting device by UUID: " + device_uuid)
    try:
        return Device.objects.get(device_uuid = device_uuid)
    except ObjectDoesNotExist:
        raise DeviceNotRegistered("Specified device is not registered")
    
def get_id_by_device_uuid(device_uuid):
    try:
        return get_by_device_uuid(device_uuid).id
    except ObjectDoesNotExist:
        raise DeviceNotRegistered("Specified device is not registered")

def device_exists(device_uuid):
    return Device.objects.filter(device_uuid=device_uuid).exists()