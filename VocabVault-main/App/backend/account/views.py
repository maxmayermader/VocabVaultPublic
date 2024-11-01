from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.hashers import make_password
from .serializers import SignUpSerializer, AccountSerializer
from .models import Account

from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User


# Create your views here.
@api_view(['POST'])
def register(request):
    data = request.data

    print(data)

    user = SignUpSerializer(data=data)

    if user.is_valid():
        print("user valid")
        if not User.objects.filter(username=data['username']).exists() and not User.objects.filter(email=data['email']).exists():
           user = User.objects.create(
               first_name = data['first_name'],
               last_name = data['last_name'],
               username = data['username'],
               email = data['email'],
               password = make_password(data['password'])
            #    password = data['password']
           ) 
           acc = Account.objects.create(user=user)
        #    card_set = acc.card_set.create()


           return Response({
                'message': 'User registered.'},
                status=status.HTTP_200_OK
            )
        else:
            return Response({
                'error': 'User already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

    else:
        return Response(user.errors)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def currentUser(request):

    user = AccountSerializer(request.user)

    print(request)

    return Response(user.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request):
    user = request.user


    data = request.data

    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password']) 
        # user.password = data['password']

    user.save()

    serializer = AccountSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setUserGoals(request):
    data = request.data
    user = request.user
    print(user)
    
    

    


