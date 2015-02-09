# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.AutoField(db_column='ID', serialize=False, primary_key=True)),
                ('device_uuid', models.CharField(unique=True, db_column='DEVUCE_UUID', max_length=200)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.AutoField(db_column='ID', serialize=False, primary_key=True)),
                ('report_rating', models.IntegerField(db_column='REPORT_RATING')),
                ('timestamp', models.DateTimeField(db_column='REPORT_TIMESTAMP')),
                ('device', models.ForeignKey(db_column='DEVICE_ID', to='wellspring.Device')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ReportSection',
            fields=[
                ('id', models.AutoField(db_column='ID', serialize=False, primary_key=True)),
                ('section_rating', models.IntegerField(db_column='SECTION_RATING')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ReportSubSection',
            fields=[
                ('id', models.AutoField(db_column='ID', serialize=False, primary_key=True)),
                ('subsection_rating', models.FloatField(db_column='SUBESCTION_RATING')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Value',
            fields=[
                ('id', models.AutoField(db_column='ID', serialize=False, primary_key=True)),
                ('value_name', models.CharField(db_column='VALUE_NAME', max_length=50)),
                ('value_description', models.TextField(db_column='VALUE_DESCRIPTION')),
                ('device', models.ForeignKey(db_column='DEVICE_ID', to='wellspring.Device')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='VestSection',
            fields=[
                ('section_name', models.CharField(unique=True, db_column='SECTION_NAME', serialize=False, primary_key=True, max_length=50)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='VestSubSection',
            fields=[
                ('subsection_name', models.CharField(unique=True, db_column='SUBSECTION_NAME', serialize=False, primary_key=True, max_length=50)),
                ('section_name', models.ForeignKey(db_column='VEST_SECTION_NAME', to='wellspring.VestSection')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='value',
            name='vest_subsection',
            field=models.ForeignKey(db_column='VEST_SUBSECTION_ID', to='wellspring.VestSubSection'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='reportsubsection',
            name='vest_subsection',
            field=models.ForeignKey(db_column='VEST_SUBSECTION', to='wellspring.VestSubSection'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='reportsection',
            name='vest_section',
            field=models.ForeignKey(db_column='VEST_SECTION', to='wellspring.VestSection'),
            preserve_default=True,
        ),
    ]
