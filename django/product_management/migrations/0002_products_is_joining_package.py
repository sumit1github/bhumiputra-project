# Generated by Django 5.2 on 2025-07-11 10:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product_management', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='products',
            name='is_joining_package',
            field=models.BooleanField(default=False, help_text='Is this product a joining package?'),
        ),
    ]
