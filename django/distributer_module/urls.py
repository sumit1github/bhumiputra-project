from django.urls import path
from . import views


urlpatterns = [
    path('dashboard/', views.DashBoard.as_view()),
    
]