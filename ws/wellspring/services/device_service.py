import logging
from wellspring.models import Device

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
    return Device.objects.get(id = id)

def get_by_device_uuid(device_uuid):
    LOGGER.debug("Getting device by UUID: " + device_uuid)
    return Device.objects.get(device_uuid = device_uuid)
    
def get_id_by_device_uuid(device_uuid):
    return get_by_device_uuid(device_uuid).id