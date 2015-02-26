import logging
from django.http import HttpResponse
from wellspring.services import vest_service

LOGGER = logging.getLogger(__name__)

def hello(request):
	for vest_section in vest_service.VEST_SECTIONS:
		vest_service.add_section(vest_section)
		for vest_subsection in vest_service.VEST_SECTIONS[vest_section]:
			vest_service.add_subsection(vest_section, vest_subsection)
	return HttpResponse("<html><body>Hello!</body></html>")


