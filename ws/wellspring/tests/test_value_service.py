from django.test import TestCase
from wellspring.services import device_service, value_service, vest_service
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied

sarah_uuid = "Android@SarahHTCXXX464"
john_uuid = "IOS@JohnIPhoneXXX221"
wrong_uuid = "Windows8@WrongWindowsPhoneXXX090"


class DeviceServiceTest(TestCase):
    def setUp(self):
        sarah = device_service.add_device(sarah_uuid)
        john = device_service.add_device(john_uuid)
        
        lifestyle = vest_service.add_section("LIFESTYLE")
        equilibrium = vest_service.add_section("EQUILIBRIUM")
        support = vest_service.add_section("SUPPORT")
        
        diet = vest_service.add_subsection(lifestyle.section_name, "DIET")
        exercise = vest_service.add_subsection(lifestyle.section_name, "EXERCISE")
        school = vest_service.add_subsection(equilibrium.section_name, "SCHOOL")
        vest_self = vest_service.add_subsection(equilibrium.section_name, "SELF")
        family = vest_service.add_subsection(support.section_name, "FAMILY")
        friends = vest_service.add_subsection(support.section_name, "FRIENDS")
        
        self.sarah_value_1 = value_service.add_value_by_string_params("Math", "I really like math", sarah_uuid, "SCHOOL")
        self.sarah_value_2 = value_service.add_value_by_string_params("Money", "Money is very valuable", sarah_uuid, "EXERCISE")
        self.sarah_value_3 = value_service.add_value_by_string_params("Running", "I value running long distances", sarah_uuid, "EXERCISE")
        
        self.john_value_1 = value_service.add_value_by_domain_objects("Reading", "I read every day", john, school)
        self.john_value_2 = value_service.add_value_by_domain_objects("Thinking", "Thinking is very valuable", john, vest_self)
        self.john_value_3 = value_service.add_value_by_domain_objects("Discipline", "It is important to me to be disciplined", john, vest_self)
        
        self.wrong_id = [i for i in range(1, 20) if i not in [value.id for value in [self.sarah_value_1,
                                                                                     self.sarah_value_2,
                                                                                     self.sarah_value_3,
                                                                                     self.john_value_1,
                                                                                     self.john_value_2,
                                                                                     self.john_value_3]]][0]
    
    def test_get_all_values_for_device(self):
        john_values = value_service.get_all_values_for_device(john_uuid)
        sarah_values = value_service.get_all_values_for_device(sarah_uuid)
        self.assertRaises(ObjectDoesNotExist, value_service.get_all_values_for_device, device_uuid = wrong_uuid)
        
        sarah_value_names = [value.value_name for value in sarah_values]
        john_value_names = [value.value_name for value in john_values]
        
        sarah_value_descriptions = [value.value_description for value in sarah_values]
        john_value_descriptions = [value.value_description for value in john_values]
        
        sarah_value_vest_subsections = [value.vest_subsection.subsection_name for value in sarah_values]
        john_value_vest_subsections = [value.vest_subsection.subsection_name for value in john_values]
        
        sarah_value_vest_sections = [value.vest_subsection.vest_section.section_name for value in sarah_values]
        john_value_vest_sections = [value.vest_subsection.vest_section.section_name for value in john_values]
        
        self.assertTrue("Math" in sarah_value_names)
        self.assertTrue("Money" in sarah_value_names)
        self.assertFalse("Wrong" in sarah_value_names)
        
        self.assertTrue("Reading" in john_value_names)
        self.assertTrue("Thinking" in john_value_names)
        self.assertFalse("Math" in john_value_names)
        
        self.assertTrue("I really like math" in sarah_value_descriptions)
        self.assertFalse("I don't like math" in sarah_value_descriptions)
        
        self.assertTrue("Thinking is very valuable" in john_value_descriptions)
        self.assertFalse("Thinking is for brainy-types" in john_value_descriptions)
        
        self.assertTrue("SCHOOL" in sarah_value_vest_subsections)
        self.assertFalse("FAMILY" in sarah_value_vest_subsections)
        
        self.assertTrue("SELF" in john_value_vest_subsections)
        self.assertFalse("FAMILY" in john_value_vest_subsections)
        
        self.assertTrue("LIFESTYLE" in sarah_value_vest_sections)
        self.assertFalse("SUPPORT" in sarah_value_vest_sections)
        
        self.assertTrue("EQUILIBRIUM" in john_value_vest_sections)
        self.assertFalse("LIFESTYLE" in john_value_vest_sections)
        
    def test_get_value_by_id(self):
        sarah_value_1 = value_service.get_value_by_id(sarah_uuid, self.sarah_value_1.id)
        sarah_value_3 = value_service.get_value_by_id(sarah_uuid, self.sarah_value_3.id)
        john_value_2 = value_service.get_value_by_id(john_uuid, self.john_value_2.id)
        
        self.assertRaises(PermissionDenied, value_service.get_value_by_id, device_uuid = john_uuid, value_id = self.sarah_value_2.id)
        self.assertRaises(PermissionDenied, value_service.get_value_by_id, device_uuid = wrong_uuid, value_id = self.john_value_1.id)
        self.assertRaises(ObjectDoesNotExist, value_service.get_value_by_id, device_uuid = sarah_uuid, value_id = self.wrong_id)
        
        self.assertEqual(sarah_value_1, self.sarah_value_1) ## This one compares IDs
        self.assertEqual(sarah_value_3.value_name, self.sarah_value_3.value_name)
        self.assertEqual(john_value_2.device.device_uuid, john_uuid)
        self.assertEqual(john_value_2.vest_subsection.subsection_name, self.john_value_2.vest_subsection.subsection_name)
        
    def test_delete_value_by_id(self):
        sarah_value_1_id = self.sarah_value_1.id
        self.assertEqual(value_service.get_value_by_id(sarah_uuid, sarah_value_1_id), self.sarah_value_1)
        
        value_service.delete_value(sarah_uuid, self.sarah_value_1.id)
        
        ## Assert that the object was deleted
        self.assertRaises(ObjectDoesNotExist, value_service.get_value_by_id, device_uuid = sarah_uuid, value_id = sarah_value_1_id)
        
        ## Assert that security check is being made before deletion
        self.assertRaises(PermissionDenied, value_service.delete_value, device_uuid = john_uuid, value_id = self.sarah_value_2.id)
        
        ## Assert that you can't delete something that doesn't exist
        self.assertRaises(ObjectDoesNotExist, value_service.delete_value, device_uuid = john_uuid, value_id = self.wrong_id)
        
    def test_update_value(self):
        sarah_value_1_id = self.sarah_value_1.id
        original_name = self.sarah_value_1.value_name
        original_description = self.sarah_value_2.value_description
        original_vest_subsection = self.sarah_value_2.vest_subsection.subsection_name
        
        new_value_returned = value_service.update_value(sarah_value_1_id, sarah_uuid, "Latin", "I don't like math any more. I like Latin!", "FRIENDS")
        new_value = value_service.get_value_by_id(sarah_uuid, sarah_value_1_id)
        
        self.assertEqual(new_value, new_value_returned)
        self.assertEqual(new_value.value_name, new_value_returned.value_name)
        self.assertEqual(new_value.value_description, new_value_returned.value_description)
        self.assertEqual(new_value.vest_subsection.subsection_name, new_value_returned.vest_subsection.subsection_name)
        
        self.assertNotEqual(original_name, new_value.value_name)
        self.assertNotEqual(original_description, new_value.value_description)
        self.assertNotEqual(original_vest_subsection, new_value.vest_subsection)
        
        self.assertRaises(PermissionDenied, value_service.update_value, value_id = self.sarah_value_2.id,
                          device_uuid = john_uuid, name = "Treachery", description = "I like updating other people's data",
                          vest_subsection_name = "SELF")
        
        self.assertRaises(ObjectDoesNotExist, value_service.update_value, value_id = self.wrong_id,
                          device_uuid = john_uuid, name = "Stupidity", description = "I like retrieving data that doesn't exist",
                          vest_subsection_name = "SELF")
        