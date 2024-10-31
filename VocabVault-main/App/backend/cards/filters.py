from dataclasses import field
from django_filters import rest_framework as filters
from rest_framework import viewsets
from .models import CardSet
from .serializers import CardSetSerializer

class CardSetFilter(filters.FilterSet):
    class Meta:
        model = CardSet
        fields = {
            'title': ['icontains'],
            # 'language': ['icontains'] #TODO: Fix this
        }


class CardSetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CardSet.objects.all()
    serializer_class = CardSetSerializer
    filterset_class = CardSetFilter