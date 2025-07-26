from django.urls import path
from . import views

urlpatterns = [
    path('get_all_products', views.GetAllProducts.as_view()),
    path('product_create_update_delete_detail', views.productCreateDetailUpdateDelete.as_view()),
    path('get_joining_packages', views.JoiningProductList.as_view()),

]


