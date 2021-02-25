from django.conf.urls import include, url
from django.urls import path
from rest_framework.routers import DefaultRouter

from mock import views

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browsable API.
urlpatterns = [
    path('', views.Mock.as_view()),
]
