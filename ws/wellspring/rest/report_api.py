import logging
import datetime
from wellspring.rest.wellspring_rest_base import *
from wellspring.services import report_service

LOGGER = logging.getLogger(__name__)

def post_report(request):
    return handle_rest_request(request, report_post_handler, ["POST"])

def get_stats(request, days):
    pathParams = {"days" : days}
    return handle_rest_request(request, stats_handler, ["GET"], pathParams)
    
def report_post_handler(request, response, device_uuid, pathParams):
    responseBody = build_base_wellspring_message()
    
    requestBody = get_request_body(request)
    
    verify_object_type(requestBody, "WellspringReport")
    verify_object_member(requestBody, "overall")
    verify_object_member(requestBody, "reportSections")
    
    report_rating = requestBody["overall"]
    
    section_ratings = {}
    
    for reportSection in requestBody["reportSections"]:
        verify_object_type(reportSection, "WellspringReportSection")
        verify_object_member(reportSection, "name")
        verify_object_member(reportSection, "overall")
        verify_object_member(reportSection, "subsections")
        
        overall = reportSection["overall"]
        name = reportSection["name"]
        
        subsectionsDict = {}
        for subsection in reportSection["subsections"]:
            verify_object_type(subsection, "WellspringReportSubsection")
            verify_object_member(subsection, "name")
            verify_object_member(subsection, "rating")
            
            subsectionsDict[subsection["name"]] = subsection["rating"]
            
        section_ratings[name] = (overall, subsectionsDict)
    
    report_service.add_report(device_uuid, report_rating, section_ratings)
    
    responseBody["message"] = "Report succesfully posted"
    response.content = jsonify(responseBody)
    return response

def stats_handler(request, response, device_uuid, pathParams):
    days = pathParams["days"]
    allReports = report_service.get_reports_since_date(device_uuid, datetime.datetime.now() - datetime.timedelta(days = abs(int(days))))
    
    sectionRatings = {
                      "MOOD" : [],
                      "EQUILIBRIUM" : [],
                      "SUPPORT" : [],
                      "LIFESTYLE" : []
                      }
    
    for report in allReports:
        timestamp = report.timestamp
        sectionRatings["MOOD"].append(create_statistic(timestamp, report.report_rating))
        
        for reportSection in report.reportsection_set.all():
            sectionName = reportSection.vest_section.section_name
            sectionRating = reportSection.section_rating
            sectionRatings[sectionName].append(create_statistic(timestamp, sectionRating))
    
    fullStatistics = []        
    for section in sectionRatings:
        fullStatistics.append(create_statistic_list(section, sectionRatings[section]))
            
    responseBody = {
                    "type" : "WellspringFullStatistics",
                    "fullStatistics" : fullStatistics
                    }
            
    response.content = jsonify(responseBody)
    
    return response

def create_statistic(timestamp, rating):
    return {
            "type" : "WellspringStatistic",
            "rating" : rating,
            "time" : timestamp.isoformat()
            }
    
def create_statistic_list(sectionName, statistics):
    return {
            "type" : "WellspringCategoryStatistics",
            "category" : sectionName,
            "categoryStatistics" : statistics
            }