import logging
from wellspring.rest.wellspring_rest_base import *
from wellspring.services import report_service

LOGGER = logging.getLogger(__name__)

def post_report(request):
    return handle_rest_request(request, report_post_handler, "POST")
    
def report_post_handler(request, response, device_uuid, id):
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