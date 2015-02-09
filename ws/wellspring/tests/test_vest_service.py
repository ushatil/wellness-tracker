from django.test import TestCase
from wellspring.services import vest_service
from django.core.exceptions import ObjectDoesNotExist

class VestServiceTest(TestCase):
    def setUp(self):
        lifestyle = vest_service.add_section("LIFESTYLE")
        equilibrium = vest_service.add_section("EQUILIBRIUM")
        support = vest_service.add_section("SUPPORT")
        
        vest_service.add_subsection(lifestyle.section_name, "DIET")
        vest_service.add_subsection(lifestyle.section_name, "EXERCISE")
        vest_service.add_subsection(equilibrium.section_name, "SCHOOL")
        vest_service.add_subsection(equilibrium.section_name, "SELF")
        vest_service.add_subsection(support.section_name, "FAMILY")
        vest_service.add_subsection(support.section_name, "FRIENDS")        
        
    def test_sections_found_by_name(self):
        lifestyle = vest_service.get_by_name_vest_section("LIFESTYLE")
        equilibrium = vest_service.get_by_name_vest_section("EQUILIBRIUM")
        support = vest_service.get_by_name_vest_section("SUPPORT")
        
        self.assertEqual(lifestyle.section_name, "LIFESTYLE")
        self.assertEqual(equilibrium.section_name, "EQUILIBRIUM")
        self.assertEqual(support.section_name, "SUPPORT")
        self.assertRaises(ObjectDoesNotExist, callableObj=vest_service.get_by_name_vest_section, name="WRONG")
        
        # Test many-to-one relationships in the other direction
        self.assertTrue("DIET" in [subsection.subsection_name for subsection in lifestyle.vestsubsection_set.all()])
        self.assertTrue("EXERCISE" in [subsection.subsection_name for subsection in lifestyle.vestsubsection_set.all()])
        self.assertTrue("SCHOOL" in [subsection.subsection_name for subsection in equilibrium.vestsubsection_set.all()])
        self.assertTrue("SELF" in [subsection.subsection_name for subsection in equilibrium.vestsubsection_set.all()])
        self.assertTrue("FAMILY" in [subsection.subsection_name for subsection in support.vestsubsection_set.all()])
        self.assertTrue("FRIENDS" in [subsection.subsection_name for subsection in support.vestsubsection_set.all()])
        
        self.assertFalse("WRONG" in [subsection.subsection_name for subsection in lifestyle.vestsubsection_set.all()])
        self.assertFalse("WRONG" in [subsection.subsection_name for subsection in equilibrium.vestsubsection_set.all()])
        self.assertFalse("WRONG" in [subsection.subsection_name for subsection in support.vestsubsection_set.all()])

    def test_subsections_found_by_name(self):
        diet = vest_service.get_by_name_vest_subsection("DIET")
        exercise = vest_service.get_by_name_vest_subsection("EXERCISE")
        school = vest_service.get_by_name_vest_subsection("SCHOOL")
        sctn_self = vest_service.get_by_name_vest_subsection("SELF")
        family = vest_service.get_by_name_vest_subsection("FAMILY")
        friends = vest_service.get_by_name_vest_subsection("FRIENDS")
        
        self.assertEqual(diet.subsection_name, "DIET")
        self.assertEqual(diet.vest_section.section_name, "LIFESTYLE")
        
        self.assertEqual(exercise.subsection_name, "EXERCISE")
        self.assertEqual(exercise.vest_section.section_name, "LIFESTYLE")
        
        self.assertEqual(school.subsection_name, "SCHOOL")
        self.assertEqual(school.vest_section.section_name, "EQUILIBRIUM")
        
        self.assertEqual(sctn_self.subsection_name, "SELF")
        self.assertEqual(sctn_self.vest_section.section_name, "EQUILIBRIUM")
        
        self.assertEqual(family.subsection_name, "FAMILY")
        self.assertEqual(family.vest_section.section_name, "SUPPORT")
        
        self.assertEqual(friends.subsection_name, "FRIENDS")
        self.assertEqual(friends.vest_section.section_name, "SUPPORT")
        
        self.assertRaises(ObjectDoesNotExist, callableObj=vest_service.get_by_name_vest_subsection, name="WRONG")
        
    def test_sections_get_all(self):
        sections = vest_service.get_all_vest_section()
        section_names = [section.section_name for section in sections]
        
        self.assertTrue("LIFESTYLE" in section_names)
        self.assertTrue("EQUILIBRIUM" in section_names)
        self.assertTrue("SUPPORT" in section_names)
        self.assertFalse("WRONG" in section_names)
        
    def test_subsections_get_all(self):
        subsections = vest_service.get_all_vest_subsection()
        section_names = [subsection.vest_section.section_name for subsection in subsections]
        subsection_names = [subsection.subsection_name for subsection in subsections]
        
        self.assertTrue("LIFESTYLE" in section_names)
        self.assertTrue("EQUILIBRIUM" in section_names)
        self.assertTrue("SUPPORT" in section_names)
        self.assertFalse("WRONG" in section_names)
        
        self.assertTrue("DIET" in subsection_names)
        self.assertTrue("EXERCISE" in subsection_names)
        self.assertTrue("SCHOOL" in subsection_names)
        self.assertTrue("SELF" in subsection_names)
        self.assertTrue("FAMILY" in subsection_names)
        self.assertTrue("FRIENDS" in subsection_names)
        self.assertFalse("WRONG" in subsection_names)
        