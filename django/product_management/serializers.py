from rest_framework import serializers

from .models import Products

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ['id', 'uid', 'name', 'slug', 'brand', 'buy_price', 'sell_price', 'offer_price', 'bv_price', 'stock', 'is_joining_package']
        extra_kwargs = {
            'uid': {'required': True},
            'name': {'required': True},
            'brand': {'required': True},
            'buy_price': {'required': True},
            'sell_price': {'required': True},
            'stock': {'required': True},
            'is_joining_package': {'required': False}
        }