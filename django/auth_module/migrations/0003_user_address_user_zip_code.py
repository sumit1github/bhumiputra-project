# Generated by Django 5.2 on 2025-06-26 09:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_module', '0002_user_achiver_level_user_age_user_dob_user_gender_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='address',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='zip_code',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
