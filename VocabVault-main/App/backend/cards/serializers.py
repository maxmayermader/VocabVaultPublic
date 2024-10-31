from rest_framework import serializers
from .models import CardSet, Language, Card

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'


class CardSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardSet
        fields = '__all__'

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'