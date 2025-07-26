from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from order_module.models import Order

class OrderCreateSerializer(serializers.Serializer):

    customer = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
        allow_null=True,
        trim_whitespace=True,
        help_text="Need to pass product pk."
    )

    products_info = serializers.JSONField(
        required=True,
        help_text='List of products with quantity. Example: [{"p_id": 1, "qty": 2}, {"p_id": 3, "qty": 1}]'
    )

class OrderListSerializer(serializers.ModelSerializer):
    
    uid = serializers.SerializerMethodField()

    def get_uid(self, obj):
        
        return obj.uid
    
    class Meta:
        model = Order
        fields = [
            "id",
            "uid",
            "total_amount",
            "order_date"
        ]
