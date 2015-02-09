# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('wellspring', '0002_auto_20150208_1851'),
    ]

    operations = [
        migrations.AddField(
            model_name='reportsection',
            name='report',
            field=models.ForeignKey(db_column='REPORT_ID', default=1, to='wellspring.Report'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='reportsubsection',
            name='report_section',
            field=models.ForeignKey(db_column='REPORT_SECTION_ID', default=1, to='wellspring.ReportSection'),
            preserve_default=False,
        ),
    ]
