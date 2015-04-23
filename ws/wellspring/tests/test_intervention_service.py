from django.test import TestCase
from wellspring.services import intervention_service

class ReportServiceTest(TestCase):
    def test_interventions(self):
        intervention_service.get_intervention("SELF")
        intervention_service.get_intervention("WORK")
        intervention_service.get_intervention("RECREATION")
        intervention_service.get_intervention("MEDITATION")
    