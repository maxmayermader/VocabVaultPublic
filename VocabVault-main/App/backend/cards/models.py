from django.db import models
import uuid
from django.db.models.deletion import CASCADE

# Create your models here.
class CardSet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    created_by = models.ForeignKey('account.Account', null=True, blank=True, on_delete=models.CASCADE, related_name='created_card_sets')    
    private = models.BooleanField(default=False)
    language = models.ForeignKey('Language',  blank=True, null=True, on_delete=CASCADE)
    card_data = models.ManyToManyField('Card', blank=True)

    def __str__(self):
        return self.title
    

class Language(models.Model):
    id = models.AutoField(primary_key= True, unique=True, editable=False)    
    language = models.CharField(max_length=100)
    code = models.CharField(max_length=10,  blank=True, null=True)

    def __str__(self):
        return self.language + ' - ' + self.code
    

    
class Card(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source = models.CharField(max_length=100, blank=True, null=True)
    target = models.CharField(max_length=100, blank=True, null=True)
    target_language = models.ForeignKey('Language', blank=True, null=True, on_delete=CASCADE)
    definition = models.TextField(blank=True, null=True)
    pos = models.CharField(max_length=100)
    pronunciation = models.FileField(upload_to='pronunciations/', null=True, blank=True)
    frequency = models.IntegerField(blank=True, null=True)

    class Meta:
        unique_together = ['source', 'target', 'target_language']

    def __str__(self):
        return f"{self.target} - {self.source}"