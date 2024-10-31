# Generated by Django 5.0.6 on 2024-08-05 15:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_vocabulary_remove_accstats_streak'),
        ('cards', '0002_language_rename_title_card_pos_card_definition_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='saved_card_sets',
            field=models.ManyToManyField(blank=True, related_name='saved_by', to='cards.cardset'),
        ),
        migrations.AddField(
            model_name='accstats',
            name='current_streak',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AddField(
            model_name='accstats',
            name='target_language',
            field=models.ManyToManyField(blank=True, to='cards.language'),
        ),
        migrations.AddField(
            model_name='accstats',
            name='vocab_count',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AddField(
            model_name='accstats',
            name='vocab_count_goal',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='stats',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='account.accstats'),
        ),
        migrations.AlterField(
            model_name='accstats',
            name='longest_streak',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='accstats',
            name='num_card_sets',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AddField(
            model_name='vocabulary',
            name='acc_stats',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='vocabularies', to='account.accstats'),
        ),
        migrations.AddField(
            model_name='vocabulary',
            name='word',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cards.card'),
        ),
        migrations.AlterUniqueTogether(
            name='vocabulary',
            unique_together={('acc_stats', 'word')},
        ),
    ]
