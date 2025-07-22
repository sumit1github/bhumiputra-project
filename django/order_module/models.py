from django.db import models
import json

from auth_module.models import User
from product_management.models import Products
from utils import generate_unique_id

# Create your models here.
class Order(models.Model):
    id_prefix = models.CharField(max_length=10, null=True,blank=True)
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='orders', null=True, blank=True)
    distributer = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='distributor_orders', null=True, blank=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    order_date = models.DateTimeField(auto_now_add=True)
    products_info = models.JSONField(default="[]") # [{"p_id": 1, "qty": 2}, {"p_id": 3, "qty": 1}]

    class Meta:
        db_table = 'order'

    def set_products_info(self, products_list):
        self.products_info = json.dumps(products_list)

    def save(self, *args, **kwargs):
        if not self.id_prefix:
            self.id_prefix = generate_unique_id(5)

        self.products_info = json.dumps(self.products_info)

        if not self.discount and not self.customer:
            self.discount = 5.00
        
        super(Order, self).save(*args, **kwargs)

    @property
    def get_products(self):
        products_list = json.loads(self.products_info)
        product_ids = [item['p_id'] for item in products_list]
        products = Products.objects.in_bulk(product_ids)
        result = []
        for item in products_list:
            product = products.get(item['p_id'])
            if product:
                result.append({
                    "product_pk": product.id,
                    "uid": product.uid,
                    "name": product.name,
                    "brand": product.brand,
                    "quantity": item['qty'],
                    "sell_price": getattr(product, "sell_price", None),
                    "id_prefix": product.id_prefix if hasattr(product, 'id_prefix') else None,
                })
        return result
    
    @property
    def get_not_discounted_price(self):
        if self.discount:
            return self.total_amount if self.discount <= 0 else self.total_amount * (1 - self.discount / 100)