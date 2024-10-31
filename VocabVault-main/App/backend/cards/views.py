from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .cardUtils import createTempCardSet
from rest_framework import generics, status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import CardSerializer, CardSetSerializer
from .models import CardSet, Language, Card
from .translate import translateText
from account.models import Account, AccStats, Vocabulary

from rest_framework.pagination import PageNumberPagination
from .filters import CardSetFilter
from django.db import IntegrityError
from .speech import getAudioPronunciation
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

import logging
logger = logging.getLogger(__name__)
# print(Account.objects.all.stats.vocabularies.all())


@api_view(['GET'])
def AllCardSets(request):
    cards = CardSet.objects.all()
    serializer = CardSetSerializer(cards, many = True)
    return Response(serializer.data)

@api_view(['GET'])
def AllCardSetsPerPage(request, pk=10):
    filterset = CardSetFilter(request.GET, queryset=CardSet.objects.all().order_by('title'))
    paginator = PageNumberPagination()
    paginator.page_size = pk
    result_page = paginator.paginate_queryset(filterset.qs, request)
    serializer = CardSetSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def GetCardSet(request, pk):
    card = get_object_or_404(CardSet, id=pk)
    # card = Card.objects.get(id=pk)
    serializer = CardSetSerializer(card, many = False)
    return Response(serializer.data)


@api_view(['DELETE'])
def deleteCardSet(request, pk):
    cardSet = get_object_or_404(CardSet, id=pk)

    cardSet.delete()

    return Response({ 'message': 'Card set was Deleted.' }, status=status.HTTP_200_OK)


@api_view(['GET'])
def getTranslation(request):
    data = request.data
    print(data)

    res = translateText(data["txt"], data["source"], data["target"])
    print(res)
    
    return Response(res)

@api_view(['GET']) #TODO: Add permission_classes([IsAuthenticated])
@permission_classes([IsAuthenticated])
def GetUserCardSets(request):
    card_sets = CardSet.objects.filter(created_by=request.user.account)
    serializer = CardSetSerializer(card_sets, many=True)
    return Response(serializer.data)

@api_view(['PUT']) #TODO: Add permission_classes([IsAuthenticated])
@permission_classes([IsAuthenticated])
def updateCardSet(request, pk):
    card_set = get_object_or_404(CardSet, id=pk, created_by=request.user.account)  # Ensure the user owns the card set
    data = request.data
    
    card_set.title = data.get('title', card_set.title)
    card_set.private = data.get('private', card_set.private)
    if 'language' in data:
        card_set.language = get_object_or_404(Language, id=data['language'])
    
    cards_data = data.get('cards', [])
    current_cards = set(card_set.card_data.all())
    updated_cards = set()
    
    for card_data in cards_data:
        if 'id' in card_data:
            try:
                card = Card.objects.get(id=card_data['id'])
                # Update existing card
                card.source = card_data.get('source', card.source)
                card.target = card_data.get('target', card.target)
                card.definition = card_data.get('definition', card.definition)
                card.pos = card_data.get('pos', card.pos)
                card.frequency = card_data.get('frequency', card.frequency)
                card.save()
            except Card.DoesNotExist:
                # If the card with given id doesn't exist, create a new one
                card, _ = Card.objects.get_or_create(
                    source=card_data['source'],
                    target=card_data['target'],
                    target_language=card_set.language,
                    defaults={
                        'definition': card_data.get('definition'),
                        'pos': card_data.get('pos'),
                        'frequency': card_data.get('frequency')
                    }
                )
        else:
            # Create new card or get existing one
            card, _ = Card.objects.get_or_create(
                source=card_data['source'],
                target=card_data['target'],
                target_language=card_set.language,
                defaults={
                    'definition': card_data.get('definition'),
                    'pos': card_data.get('pos'),
                    'frequency': card_data.get('frequency')
                }
            )
        
        updated_cards.add(card)
        if card not in current_cards:
            card_set.card_data.add(card)
    
    # Remove cards that are no longer in the set
    cards_to_remove = current_cards - updated_cards
    for card in cards_to_remove:
        card_set.card_data.remove(card)
    
    card_set.save()
    serializer = CardSetSerializer(card_set)
    return Response(serializer.data)

from rest_framework.permissions import IsAuthenticated

@api_view(['POST']) #TODO: Add permission_classes([IsAuthenticated])
# @permission_classes([IsAuthenticated])
def CreateCardSet(request):
    data = request.data
    givenWordSet = data.get('WordSet')
    print(data)
    # user = data.get('username') if data.get('username') else 1
    user = get_object_or_404(User, username=data.get('username'))
    user = get_object_or_404(Account, user=user)

    lang = get_object_or_404(Language, code=givenWordSet['targetLanguage'])
    
    card_set = CardSet.objects.create(
        title=givenWordSet['title'],
        created_by=user,  # Associate the card set with the current user's account
        private=givenWordSet.get('private', False),
        language=lang
    )
    
    cards_data = givenWordSet.get('cards', [])
    for card_data in cards_data:
        try:
            card, created = Card.objects.get_or_create(
                source=card_data['source'],
                target=card_data['target'],
                target_language=lang,
                defaults={
                    'definition': card_data.get('definition'),
                    'pos': card_data.get('pos'),
                    'frequency': card_data.get('frequency')
                }
            )
            if not card.pronunciation:
                print(f"Generating pronunciation for {card.target}")
                try:
                    pronunciation_file = getAudioPronunciation(card.target)
                    card.pronunciation.save(pronunciation_file.name, pronunciation_file, save=True)
                except Exception as e:
                    print(f"Error generating pronunciation for {card.target}: {str(e)}")
            card_set.card_data.add(card)
        except IntegrityError:
            pass
    
    serializer = CardSetSerializer(card_set)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

print(f"Received request for card set 2")
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def GetUserCardSet(request, pk):
    print(f"Received request for card set {pk}")
    print(request)
    try:
        # Get the card set that belongs to the user and matches the given pk
        card_set = get_object_or_404(CardSet, id=pk) #created_by=request.user.account)
        
        # Serialize the card set
        serializer = CardSetSerializer(card_set)
        
        # Return the serialized data
        res = Response(serializer.data)
        print(res)
        return res
    
    except CardSet.DoesNotExist:
        return Response(
            {"error": "Card set not found or you don't have permission to access it."},
            status=status.HTTP_404_NOT_FOUND
        )
    
@api_view(['GET'])
def getCard(request, pk):
    card = get_object_or_404(Card, id=pk)
    serializer = CardSerializer(card, many = False)
    return Response(serializer.data)



@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_card_with_progress(request, pk, uid):

    # Get the Card object
    card = get_object_or_404(Card, id=pk)
    logger.debug(f"Card found: {card}")

    # Serialize the card data
    card_serializer = CardSerializer(card)
    logger.debug(f"Username serialized: {request}")
    
    try:
        user = User.objects.get(username=uid)
        acc = Account.objects.get(user=user)
        logger.debug(f"Account found: {acc}")
    except Account.DoesNotExist:
        logger.error(f"Account for user {request.user.username} not found")
        return Response({"error": "Account not found"}, status=404)


    # Get the user's AccStats
    try:
        acc_stats = get_object_or_404(AccStats, stats_account=acc)
        logger.debug(f"AccStats found: {acc_stats}")
    except AccStats.DoesNotExist:
        logger.error(f"AccStats not found for account: {acc}")
        return Response({"error": "AccStats not found"}, status=404)
    
    # Try to get the Vocabulary object
    try:
        vocabulary = Vocabulary.objects.get(acc_stats=acc_stats, word=card)
        progress = vocabulary.progress
        logger.debug(f"Vocabulary found with progress: {progress}")
    except Vocabulary.DoesNotExist:
        progress = 0
        logger.debug("Vocabulary not found, progress set to 0")
    
    # Combine the card data and progress
    response_data = {
        'card': card_serializer.data,
        'progress': progress
    }
    
    logger.debug(f"Returning response data: {response_data}")
    return Response(response_data)


@api_view(['PUT'])
def updateCardWithProgress(request, pk, uid):
    card = get_object_or_404(Card, id=pk)
    user = get_object_or_404(User, username=uid)
    acc = get_object_or_404(Account, user=user)
    acc_stats = get_object_or_404(AccStats, stats_account=acc)
    
    data = request.data
    progress = data.get('progress')
    
    if progress is None:
        return Response({"error": "Progress is required"}, status=400)
    
    vocabulary, created = Vocabulary.objects.get_or_create(
        acc_stats=acc_stats, 
        word=card,
        defaults={'progress': progress}
    )
    
    if not created:
        vocabulary.progress = progress
        vocabulary.save()
    
    logger.debug(f"Vocabulary {'created' if created else 'updated'} with progress: {progress}")
    
    return Response({"message": "Progress updated successfully"})

@api_view(['POST'])
def translateAndAddToVocab(request, uid):
    data = request.data
    print(data)

    # res = translateText(data["txt"], data["source"], data["target"])

    user = get_object_or_404(User, username=uid)
    acc = get_object_or_404(Account, user=user)
    acc_stats = get_object_or_404(AccStats, stats_account=acc)

    lang = {"DE" : "1", "EN" : "2"}

    card, created = Card.objects.get_or_create(
        source=data["txt"],
        target=translateText(data["txt"], data["source"], data["target"]),
        target_language=Language.objects.get(id=lang[data["target"]]),
        # defaults={
        #     'definition': res.get('definition'),
        #     'pos': res.get('pos'),
        #     'frequency': res.get('frequency')
        # }
    )

    print(card)

    if created: 
        if not card.pronunciation:
            print(f"Generating pronunciation for {card.target}")
            try:
                pronunciation_file = getAudioPronunciation(card.target)
                card.pronunciation.save(pronunciation_file.name, pronunciation_file, save=True)
            except Exception as e:
                print(f"Error generating pronunciation for {card.target}: {str(e)}")
        card.save()

    vocabulary = Vocabulary.objects.get_or_create(
        acc_stats=acc_stats, 
        word=card,
        defaults={'progress': 0}
    )
    
    res = card.target
    return Response(res)

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def getTempCardSet(request):
    data = request.data
    # logger.debug(f"Received request for temporary card set: {data}")
    
    uid = data.get('username')
    # logger.debug(f"Username from request: {uid}")
    
    user = get_object_or_404(User, username=uid)
    # logger.debug(f"Found user: {user.username}")
    
    account = get_object_or_404(Account, user=user)
    # logger.debug(f"Found account for user: {account.user.username}")
    
    if not data.get('num_cards'):
        num_cards = 10  # Default to 10 if not specified
        logger.debug("No num_cards specified, defaulting to 10")
    else:
        num_cards = int(data['num_cards'])
        logger.debug(f"Number of cards requested: {num_cards}")
        
    # logger.debug(f"Generating temporary card set for {account.user.username} with {num_cards} cards")
    
    temp_card_set = createTempCardSet(account, num_cards)
    
    if not temp_card_set or not temp_card_set.card_data:
        logger.debug("No cards found for temporary card set")
        return Response({'error': 'No cards found'}, status=404)
    
    # logger.debug(f"Generated temporary card set with ID: {temp_card_set.id}")
    
    # Serialize the CardSet and its cards
    card_set_data = {
        'id': str(temp_card_set.id),
        'title': temp_card_set.title,
        'language': temp_card_set.language.language if temp_card_set.language else None,
        'card_data': [
            {
                'id': str(card.id),
                'source': card.source,
                'target': card.target,
                'definition': card.definition,
                'pos': card.pos,
                'pronunciation': card.pronunciation.url if card.pronunciation else None,
                'frequency': card.frequency
            } for card in temp_card_set.card_data  # This line is correct now
        ]
    }
    
    logger.debug(f"Returning card set data with {len(card_set_data['card_data'])} cards")
    
    return Response(card_set_data)