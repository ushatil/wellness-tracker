import logging
from datetime import datetime
from django.core.exceptions import ValidationError
from wellspring.services import device_service, vest_service
from wellspring.models import Report, ReportSection, ReportSubSection

LOGGER = logging.getLogger(__name__)

def add_report(device_uuid, report_rating, section_ratings):
    '''
    section_ratings: should be a dictionary of the form:
    {vest_section_name : (section_rating, 
                        {
                        subsection_name: subsection_rating,
                        subsection_name: subsection_rating
                        })
    }
    Section Ratings are ints in [1, 2, 3, 4, 5]
    Subsection Ratings are floats
    '''
    LOGGER.debug("Report submitted for UUID: " + device_uuid)
    
    for vest_section in vest_service.VEST_SECTIONS:
        if vest_section not in section_ratings:
            LOGGER.error("Report section missing: " + vest_section)
            LOGGER.error("UUID: " + device_uuid)
            raise ValidationError("Report Section missing: " + vest_section)
        
        for vest_subsection in vest_service.VEST_SECTIONS[vest_section]:
            if vest_subsection not in section_ratings[vest_section][1]:
                LOGGER.error("Report subsection missing: " + vest_subsection)
                LOGGER.error("UUID: " + device_uuid)
                raise ValidationError("Report SubSection missing: " + vest_subsection)
            
    report_rating = int(report_rating)
    if not (report_rating >= 1 and report_rating <= 5):
        LOGGER.error("Invalid Report Rating: " + str(report_rating))
        LOGGER.error("UUID: " + device_uuid)
        raise ValidationError("Invalid Report Rating: " + str(report_rating))
            
    device = device_service.get_by_device_uuid(device_uuid)
    result = Report(device = device, report_rating = report_rating, timestamp = datetime.now())
    
    for section_name in section_ratings:
        section_rating = int(section_ratings[section_name][0])
        
        if not (section_rating >= 1 and section_rating <=5):
            LOGGER.error("Invalid Section Rating: " + str(section_rating))
            LOGGER.error("UUID: " + device_uuid)
            raise ValidationError("Invalid Section Rating: " + str(section_rating))
        
        report_section = ReportSection(vest_section = vest_service.get_by_name_vest_section(section_name),
                                       section_rating = section_rating, report = result)
        
        for subsection_name in section_ratings[section_name][1]:
            subsection_rating = float(section_ratings[section_name][1][subsection_name])
            
            if not (subsection_rating >= 0 and subsection_rating <= 100):
                LOGGER.error("Invalid SubSection Rating: " + str(subsection_rating))
                LOGGER.error("UUID: " + device_uuid)
                raise ValidationError("Invalid SubSection Rating: " + str(subsection_rating))
                
            report_subsection = ReportSubSection(vest_subsection = vest_service.get_by_name_vest_subsection(subsection_name),
                                                 subsection_rating = subsection_rating, report_section = report_section)
            
    result.save()
    return result

def get_all_reports(device_uuid):
    LOGGER.debug("Getting all reports for UUID: " + device_uuid)
    return list(Report.objects.filter(device=device_service.get_by_device_uuid(device_uuid)))

def get_reports_since_date(device_uuid, since_date):
    LOGGER.debug("Getting reports for UUID: " + device_uuid + " Since Date: " + str(since_date))
    return list(Report.objects.filter(device=device_service.get_by_device_uuid(device_uuid), timestamp__gt=since_date))