import logging
from wellspring.models import VestSection, VestSubSection

LOGGER = logging.getLogger(__name__)

VEST_SECTIONS = {
                    "EQUILIBRIUM" : ["SCHOOL", "SELF", "HOME", "WORK"],
                    "SUPPORT" : ["PROFESSIONALS", "FAMILY", "FRIENDS", "COLLEAGUES"],
                    "LIFESTYLE" : ["DIET", "EXERCISE", "MEDITATION", "RECREATION"]
                    }

def add_section(name):
    LOGGER.debug("Adding VestSection: " + name)
    result = VestSection(section_name=name)
    result.save()
    return result
    
def add_subsection(section_name, subsection_name):
    LOGGER.debug("Adding VestSubSection: " + section_name + ":" + subsection_name)
    vest_section = get_by_name_vest_section(section_name)
    result = VestSubSection(vest_section=vest_section, subsection_name=subsection_name)
    result.save()
    return result

def get_all_vest_section():
    LOGGER.debug("Getting all VestSections")
    return list(VestSection.objects.all())

def get_all_vest_subsection():
    LOGGER.debug("Getting all VestSubSections")
    return list(VestSubSection.objects.all())

def get_by_name_vest_section(name):
    LOGGER.debug("Getting VestSection by name: " + name)
    return VestSection.objects.get(section_name = name)

def get_by_name_vest_subsection(name):
    LOGGER.debug("Getting VestSubSection by name: " + name)
    return VestSubSection.objects.get(subsection_name = name)