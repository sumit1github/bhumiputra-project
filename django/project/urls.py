from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="OPEN CRM",
        default_version='v1',
        description="service",
    ),

    public=True,
    
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
       path(
        "swagger/download/",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path(
        "swagger/redoc/",
        schema_view.with_ui("redoc", cache_timeout=0),
        name="schema-redoc",
    ),
    path('admin/', admin.site.urls),
    path('auth/', include('auth_module.urls')),
    path('users/', include('users_module.urls')),
    path('system/', include('system.urls')),
    path('product/', include('product_management.urls')),
    path('', include('website.urls')),
    path('distributer/', include('distributer_module.urls')),
    path('order/', include('order_module.urls')),
    
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
