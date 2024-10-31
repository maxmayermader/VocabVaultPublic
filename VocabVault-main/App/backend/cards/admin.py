from django.contrib import admin

# Register your models here.
from .models import CardSet, Language, Card

admin.site.register(CardSet)
admin.site.register(Language)
admin.site.register(Card)