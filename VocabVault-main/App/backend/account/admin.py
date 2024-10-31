from django.contrib import admin

# Register your models here.
from .models import Account, AccStats, Vocabulary

admin.site.register(Account)
admin.site.register(AccStats)
admin.site.register(Vocabulary)