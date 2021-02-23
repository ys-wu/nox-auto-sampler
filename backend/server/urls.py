from django.conf.urls import include, url
from django.urls import path
from rest_framework.routers import DefaultRouter

from server import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'series', views.SeriesViewSet)

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    path('setting/', views.Setting.as_view()),
]
