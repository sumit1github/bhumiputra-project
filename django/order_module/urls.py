from django.urls import path
from . import views


urlpatterns = [
    path('create/', views.OrderCreation.as_view()),
    path('list/', views.OrderList.as_view()),
    
]