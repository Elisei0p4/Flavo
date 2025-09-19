from rest_framework import serializers
from .models import FAQ


class ErrorResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(required=False)
    errors = serializers.DictField(child=serializers.ListField(child=serializers.CharField()), required=False)

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ('id', 'question', 'answer')