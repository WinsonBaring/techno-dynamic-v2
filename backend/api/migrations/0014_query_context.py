# Generated by Django 4.2.1 on 2023-11-08 16:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_file_lesson_lesson_files'),
    ]

    operations = [
        migrations.AddField(
            model_name='query',
            name='context',
            field=models.TextField(blank=True, default=''),
        ),
    ]
