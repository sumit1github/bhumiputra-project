from django.db import models
from utils import generate_unique_id

class Products(models.Model):

    uid=models.CharField(max_length=255, null=True, blank=True)
    name=models.CharField(max_length=255, null=True, blank=True, unique=True)
    slug=models.CharField(max_length=255, null=True, blank=True, unique=True)

    brand=models.CharField(max_length=255, null=True, blank=True)

    buy_price=models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    sell_price=models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    offer_price=models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Offer Price is the price after discount")
    bv_price=models.IntegerField(default=0, help_text="Business Value Price") # (sell_price - buy_price)*100/25

    stock=models.IntegerField(default=1)

    class Meta:
        db_table = 'product'

    def save(self, *args, **kwargs):
        if not self.uid:
            self.uid = generate_unique_id(5)
        
        if not self.slug or self.name.lower().replace(" ", "-") != self.slug:
            self.slug = self.name.lower().replace(" ", "-")

        self.name = self.name.lower()

        self.bv_price = int((self.sell_price - self.buy_price) * 100 / 25)
        
        super(Products, self).save(*args, **kwargs)

