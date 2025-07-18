from django.urls import path
from . import views

app_name = 'website'

urlpatterns = [
    path('', views.IndexView.as_view(),name='index'),
    path('gallery/', views.GalleryView.as_view(), name='gallery'),
    path('contact/', views.ContactPOSTView.as_view(), name='contact'),

    # api
    path('api/contact/', views.ContactList.as_view(), name='contact_list'),
]
