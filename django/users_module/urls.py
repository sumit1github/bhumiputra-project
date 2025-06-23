from django.urls import path
from . import views

urlpatterns = [
    path('get_user_list', views.UserFilter.as_view()),
]