from django.urls import path
from . import views

urlpatterns = [
    path('get_user_list', views.UserFilter.as_view()),
    path('invite_user', views.InviteUser.as_view()),
    path('detail_update_user/<str:pk>', views.UserDetailsUpdateView.as_view()),

    # team view
    path('team/<str:pk>', views.TeamView.as_view(), name='team-view'),

    path('user_cache_search', views.UserCacheSearch.as_view(), name='user-cache-search'),

    # ----- password chnage -----
    path('user_change_password', views.UserChangePassword.as_view()),
    
]