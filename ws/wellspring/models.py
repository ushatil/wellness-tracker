from django.db import models

class Device(models.Model):
    '''Fields:
    id: primary key int
    device_uuid: Universal Unique Identifier for a particular device
    '''
    id = models.AutoField(primary_key=True, db_column="ID")
    device_uuid = models.CharField(max_length=200, db_column="DEVUCE_UUID", unique=True)

class VestSection(models.Model):
    '''Fields:
    section_name: this unique name should be SUPPORT, LIFESTYLE, or EQUILIBRIUM
    '''
    section_name = models.CharField(primary_key = True, max_length=50, db_column="SECTION_NAME", unique=True)
    
class VestSubSection(models.Model):
    '''Fields:
    section_name: the section under which this subsection is nested
    subsection_name: the unique sub-section
    '''
    subsection_name = models.CharField(primary_key = True, max_length=50, db_column="SUBSECTION_NAME", unique=True)
    vest_section = models.ForeignKey(VestSection, db_column="VEST_SECTION_NAME")
    
class Value(models.Model):
    id = models.AutoField(primary_key=True, db_column="ID")
    device = models.ForeignKey(Device, db_column="DEVICE_ID")
    vest_subsection = models.ForeignKey(VestSubSection, db_column="VEST_SUBSECTION_ID")
    value_name = models.CharField(max_length=50, db_column="VALUE_NAME")
    value_description = models.TextField(db_column="VALUE_DESCRIPTION")
    
class Report(models.Model):
    id = models.AutoField(primary_key=True, db_column="ID")
    device = models.ForeignKey(Device, db_column="DEVICE_ID")
    report_rating = models.IntegerField(db_column="REPORT_RATING")
    timestamp = models.DateTimeField(db_column = "REPORT_TIMESTAMP")
    
class ReportSection(models.Model):
    id = models.AutoField(primary_key=True, db_column="ID")
    report = models.ForeignKey(Report, db_column="REPORT_ID")
    vest_section = models.ForeignKey(VestSection, db_column="VEST_SECTION")
    section_rating = models.IntegerField(db_column="SECTION_RATING")
    
class ReportSubSection(models.Model):
    id = models.AutoField(primary_key=True, db_column="ID")
    report_section = models.ForeignKey(ReportSection, db_column="REPORT_SECTION_ID")
    subsection_rating = models.FloatField(db_column = "SUBESCTION_RATING")
    vest_subsection = models.ForeignKey(VestSubSection, db_column = "VEST_SUBSECTION")
    
