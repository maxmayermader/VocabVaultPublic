# Generated by Django 5.0.6 on 2024-08-05 15:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cards', '0002_language_rename_title_card_pos_card_definition_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='language',
            name='code',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
