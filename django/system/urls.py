from django.urls import path
from . import views

urlpatterns = [
    path('get_roles', views.AllRoles.as_view()),
]