from django.urls import path
from . import views

urlpatterns = [
    path('get_user_list', views.UserFilter.as_view()),
    path('invite_user', views.InviteUser.as_view()),
    path('detail_update_user/<str:pk>', views.UserDetailsUpdateView.as_view()),
    
]