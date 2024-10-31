# cards/urls.py

from django.urls import path
from django.views.generic import TemplateView
from .views import (AllCardSets, AllCardSetsPerPage, CreateCardSet, GetCardSet, deleteCardSet, updateCardSet, getTranslation, 
                    GetUserCardSet, getCard, get_card_with_progress, updateCardWithProgress, translateAndAddToVocab, getTempCardSet)

urlpatterns = [
    path('cards/CardSets/', AllCardSets, name = 'allCardSets'),
    path('cards/createCardSet', CreateCardSet, name = 'createCardSet'),
    path('cards/getCardSet/<str:pk>', GetCardSet, name = 'getCard'),
    path('cards/deleteCardSet/<str:pk>', deleteCardSet, name='deleteCardSet'),
    path('cards/updateCardSet/<str:pk>', updateCardSet, name='putCardSet'),
    path('cards/cardsByPage/<int:pk>', AllCardSetsPerPage, name='cardsByPage'),
    # path('cards/trans/', getTranslation, name='getTranslations'),
    path('cards/user-card-set/<str:pk>', GetUserCardSet, name='user-card-set'),
    path('cards/getCard/<str:pk>', getCard, name='getCard'),
    path('cards/card-with-progress/<str:pk>/<str:uid>', get_card_with_progress, name='card_with_progress'),
    path('cards/update-card-with-progress/<str:pk>/<str:uid>', updateCardWithProgress, name='update_card_with_progress'),
    path('cards/trans/<str:uid>', translateAndAddToVocab, name='translateAndAddToVocab'),
    path('cards/tempCardSet', getTempCardSet, name='tempCardSet')
]