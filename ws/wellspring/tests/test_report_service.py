from django.test import TestCase
import datetime
from wellspring.services import device_service, vest_service, report_service
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from wellspring.exceptions import DeviceNotRegistered

sarah_uuid = "Android@SarahHTCXXX464"
john_uuid = "IOS@JohnIPhoneXXX221"
chen_uuid = "Windows8@ChenMotorollaXXX141"
wrong_uuid = "Windows8@WrongWindowsPhoneXXX090"

class ReportServiceTest(TestCase):
    def setUp(self):
        sarah = device_service.add_device(sarah_uuid)
        john = device_service.add_device(john_uuid)
        chen = device_service.add_device(chen_uuid)
        
        for vest_section in vest_service.VEST_SECTIONS:
            vest_service.add_section(vest_section)
            for vest_subsection in vest_service.VEST_SECTIONS[vest_section]:
                vest_service.add_subsection(vest_section, vest_subsection)
                
        self.initial_report_ratings = {"LIFESTYLE" : (3, 
                                           {
                                            "DIET": 44.5,
                                            "EXERCISE": 10.78,
                                            "MEDITATION": 99.9,
                                            "RECREATION": 66
                                            }),
                            "SUPPORT" : ("4",
                                           {
                                            "PROFESSIONALS": "33.3",
                                            "FAMILY": "20",
                                            "FRIENDS": "14.333",
                                            "COLLEAGUES": "76.6"
                                            }),
                            "EQUILIBRIUM" : (5,
                                             {
                                              "SCHOOL": 88.4,
                                              "WORK": 95.5,
                                              "SELF": 65,
                                              "HOME":76.6
                                              }
                                         )
                            }
        self.initial_report = report_service.add_report(sarah_uuid, 2, self.initial_report_ratings)
        self.initial_report_id = self.initial_report.id
                
    def test_add_report_validation(self):
        invalid_report_ratings_1 = {"LIFESTYLE" : (3, 
                                           {
                                            "DIET": 44.5,
                                            "EXERCISE": 10.78,
                                            "MEDITATION": 99.9,
                                            "RECREATION": 66
                                            }),
                            "SUPPORT" : ("4",
                                           {
                                            "PROFESSIONALS": "33.3",
                                            "FRIENDS": "14.333",
                                            "COLLEAGUES": "76.6"
                                            }),
                            "EQUILIBRIUM" : (5,
                                             {
                                              "SCHOOL": 88.4,
                                              "WORK": 95.5,
                                              "SELF": 65,
                                              "HOME":76.6
                                              }
                                         )
                            }
        
        invalid_report_ratings_2 =  {"LIFESTYLE" : (3, 
                                           {
                                            "DIET": 44.5,
                                            "EXERCISE": 10.78,
                                            "MEDITATION": 99.9,
                                            "RECREATION": 66
                                            }),
                            "SUPPORT" : ("4",
                                           {
                                            "PROFESSIONALS": "33.3",
                                            "FAMILY": "20",
                                            "FRIENDS": "14.333",
                                            "COLLEAGUES": "76.6"
                                            })
                            }
        
        invalid_report_ratings_3 = {"LIFESTYLE" : (3, 
                                           {
                                            "DIET": 44.5,
                                            "EXERCISE": 106.5,
                                            "MEDITATION": 99.9,
                                            "RECREATION": 66
                                            }),
                            "SUPPORT" : ("4",
                                           {
                                            "PROFESSIONALS": "33.3",
                                            "FAMILY": "20",
                                            "FRIENDS": "14.333",
                                            "COLLEAGUES": "76.6"
                                            }),
                            "EQUILIBRIUM" : (5,
                                             {
                                              "SCHOOL": 88.4,
                                              "WORK": 95.5,
                                              "SELF": 65,
                                              "HOME":76.6
                                              }
                                         )
                            }
        
        self.assertRaises(ValidationError, report_service.add_report, device_uuid=sarah_uuid, report_rating = 2, section_ratings = invalid_report_ratings_1)
        self.assertRaises(ValidationError, report_service.add_report, device_uuid=sarah_uuid, report_rating = 2, section_ratings = invalid_report_ratings_2)
        self.assertRaises(ValidationError, report_service.add_report, device_uuid=sarah_uuid, report_rating = 2, section_ratings = invalid_report_ratings_3)
        self.assertRaises(ValidationError, report_service.add_report, device_uuid=sarah_uuid, report_rating = 6, section_ratings = self.initial_report_ratings)
        
    def test_get_all_reports(self):
        report_service.add_report(sarah_uuid, 2, self.initial_report_ratings)
        report_service.add_report(john_uuid, 2, self.initial_report_ratings)
        sarah_reports = report_service.get_all_reports(sarah_uuid)
        john_reports = report_service.get_all_reports(john_uuid)
        chen_reports = report_service.get_all_reports(chen_uuid)
        
        self.assertEqual(len(sarah_reports), 2)
        self.assertEqual(len(john_reports), 1)
        self.assertEqual(len(chen_reports), 0)
        self.assertRaises(DeviceNotRegistered, report_service.get_all_reports, device_uuid = wrong_uuid)
        
        report = sarah_reports[0]
        self.assertEqual(report.report_rating, 2)
        for report_section in report.reportsection_set.all():
            section_name = report_section.vest_section.section_name
            self.assertEqual(report_section.section_rating, int(self.initial_report_ratings[section_name][0]))
            
            for report_subsection in report_section.reportsubsection_set.all():
                subsection_name = report_subsection.vest_subsection.subsection_name
                self.assertEqual(report_subsection.subsection_rating,
                                 float(self.initial_report_ratings[section_name][1][subsection_name]))
    
    def test_get_report_since_date(self):
        old_report = report_service.add_report(sarah_uuid, 5, self.initial_report_ratings)
        
        two_weeks_ago = datetime.datetime.now() - datetime.timedelta(days = 14)
        one_week_ago = datetime.datetime.now() - datetime.timedelta(days = 7)
        
        old_report.timestamp = two_weeks_ago
        old_report.save()
        
        reports_since = report_service.get_reports_since_date(sarah_uuid, one_week_ago)
        
        self.assertEqual(len(reports_since), 1)
        self.assertEqual(reports_since[0].report_rating, 2)