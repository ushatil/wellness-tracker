# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('wellspring', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='vestsubsection',
            old_name='section_name',
            new_name='vest_section',
        ),
    ]
