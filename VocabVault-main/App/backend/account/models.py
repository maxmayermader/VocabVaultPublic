from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator
# from cards.models import Card

# Create your models here.
class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    saved_card_sets = models.ManyToManyField('cards.CardSet', blank=True, related_name='saved_by')
    friends = models.ManyToManyField('self', blank=True)
    stats = models.OneToOneField('AccStats', on_delete=models.CASCADE, null=True, blank=True)
    
    

    def __str__(self):
        return self.user.username
    
    def get_cards_by_progress_range(self, min_progress, max_progress):
        return Vocabulary.objects.filter(
            acc_stats__stats_account=self,
            progress__gte=min_progress,
            progress__lte=max_progress
        ).select_related('word', 'word__target_language')
    
class AccStats(models.Model):
    stats_account = models.OneToOneField(Account, on_delete=models.CASCADE)
    num_card_sets = models.IntegerField(default=0, null=True)
    current_streak = models.IntegerField(default=0, null=True)
    longest_streak = models.IntegerField(default=0, null=True)
    vocab_count = models.IntegerField(default=0, null=True)
    vocab_count_goal = models.IntegerField(default=0, null=True)
    target_language = models.ManyToManyField('cards.Language', blank=True)
    # vocab = models.ForeignKey('Vocabulary', on_delete=models.CASCADE, null=True)
    


    def __str__(self):
        return self.stats_account.user.username
    
class Vocabulary(models.Model):
    acc_stats = models.ForeignKey(AccStats, on_delete=models.CASCADE, null=True, blank=True, related_name='vocabularies')
    word = models.ForeignKey('cards.Card', on_delete=models.CASCADE)
    progress = models.IntegerField(default=0, validators=[MaxValueValidator(5)])

    class Meta:
        unique_together = ['acc_stats', 'word']

    def __str__(self):
        return self.word.target + ' - ' + self.acc_stats.stats_account.user.username