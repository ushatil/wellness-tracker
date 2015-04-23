import logging
import csv
import random
from django.conf import settings

LOGGER = logging.getLogger(__name__)

def get_intervention(vest_subsection_name):
    LOGGER.debug("Getting intervention for subsection: " + str(vest_subsection_name))
    filepath = getattr(settings, "INTERVENTIONS_FILE", None)
    infile = open(filepath, mode='r')
    sheet = csv.reader(infile, quotechar='"', delimiter=',')
    
    interventions = [i[1] for i in list(sheet) if i[0] == vest_subsection_name]
    result = interventions[random.randint(0, len(interventions)-1)]
    infile.close()
    return result
    