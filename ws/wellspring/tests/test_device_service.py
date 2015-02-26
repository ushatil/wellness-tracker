from django.test import TestCase
from wellspring.services import device_service
from django.core.exceptions import ObjectDoesNotExist
from wellspring.exceptions import DeviceNotRegistered

sarah_uuid = "Android@SarahHTCXXX464"
john_uuid = "IOS@JohnIPhoneXXX221"
wrong_uuid = "Windows8@WrongWindowsPhoneXXX090"

class DeviceServiceTest(TestCase):
    def setUp(self):
        sarah = device_service.add_device(sarah_uuid)
        john = device_service.add_device(john_uuid)
        
        self.sarah_id = sarah.id
        self.john_id = john.id
        self.wrong_id = [i for i in [4, 5, 6] if i not in [sarah.id, john.id]][0]
        
    def test_devices_found_by_uuid(self):
        sarah = device_service.get_by_device_uuid(sarah_uuid)
        john = device_service.get_by_device_uuid(john_uuid)
        
        self.assertEqual(sarah.id, self.sarah_id)
        self.assertEqual(john.id, self.john_id)
        self.assertRaises(DeviceNotRegistered, device_service.get_by_device_uuid, device_uuid=wrong_uuid)
        
    def test_devices_found_by_id(self):
        sarah = device_service.get_by_device_id(self.sarah_id)
        john = device_service.get_by_device_id(self.john_id)
        
        self.assertEqual(sarah.device_uuid, sarah_uuid)
        self.assertEqual(john.device_uuid, john_uuid)
        self.assertRaises(DeviceNotRegistered, device_service.get_by_device_id, id=self.wrong_id)
        
    def test_device_id_found_by_uuid(self):
        sarah_id = device_service.get_id_by_device_uuid(sarah_uuid)
        john_id = device_service.get_id_by_device_uuid(john_uuid)
        
        self.assertEqual(sarah_id, self.sarah_id)
        self.assertEqual(john_id, self.john_id)
        self.assertRaises(DeviceNotRegistered, device_service.get_id_by_device_uuid, device_uuid=wrong_uuid)
        
    def test_devices_get_all(self):
        devices = device_service.get_all_devices()
        device_ids = [device.id for device in devices]
        device_uuids = [device.device_uuid for device in devices]
        
        self.assertTrue(self.sarah_id in device_ids)
        self.assertTrue(self.john_id in device_ids)
        self.assertFalse(self.wrong_id in device_ids)
        
        self.assertTrue(sarah_uuid in device_uuids)
        self.assertTrue(john_uuid in device_uuids)
        self.assertFalse(wrong_uuid in device_uuids)
        
    def test_does_device_exist(self):
        self.assertTrue(device_service.device_exists(sarah_uuid))
        self.assertTrue(device_service.device_exists(john_uuid))
        self.assertFalse(device_service.device_exists(wrong_uuid))