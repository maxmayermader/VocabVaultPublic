from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Account, AccStats, Vocabulary


class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "username", "password"]
        extra_kwargs = {
            "first_name": {"required": True}, 
            "last_name": {"required": True}, 
            "email": {"required": True},
            "password": {"required": True, "write_only": True, "allow_blank": False, "style": {"input_type": "password"}, "min_length": 8}
        }

    # def create(self, validated_data):
    #     print(validated_data)
    #     user = User.objects.create_user(**validated_data)
    #     return user

class AccountSerializer(serializers.ModelSerializer):
    friends = serializers.StringRelatedField( source="account.friends",many=True)
    stats = serializers.StringRelatedField(source="account.stats", many=False)

    class Meta:
        model = User
        fields = ["id","first_name", "last_name", "email", "username", "friends", "stats", "is_superuser"]

class AccStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccStats
        fields = ["num_card_sets", "current_streak", "longest_streak", "total_cards", "total_correct", "total_incorrect"]

class VocabularySerializer(serializers.ModelSerializer):
    AccStats = serializers.StringRelatedField(source="vocabulary.acc_stats", many=False)
    class Meta:
        model = Vocabulary
        fields = ["word", "progress"]


        