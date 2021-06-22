from django.conf.urls import include, url
from django.urls import path
from rest_framework.routers import DefaultRouter

from server import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'series', views.SeriesViewSet)
router.register(r'sample', views.SampleViewSet)
router.register(r'seriestemplate', views.SeriesTemplateViewSet)
router.register(r'sampletemplate', views.SampleTemplateViewSet)

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    path('data/', views.Data.as_view()),
    path('analyzing/', views.Analyzing.as_view()), 
    path('purging/', views.Purging.as_view()),
    path('setting/', views.Setting.as_view()),
    path('log/', views.Log.as_view()),
    path('mfc/', views.Mfc.as_view()),
    path('serie_report/', views.SerieReport.as_view()),
    path('sample_report/', views.SampleReport.as_view()),
    path('seriestemplatenames/', views.SeriesTemplateNames.as_view()),
    path('sampletemplatebyname/<name>/', views.SampleTemplateName.as_view()),
    path('seriesnames/', views.SeriesNames.as_view()),
    path('samplebyname/<name>/', views.SampleName.as_view()),
    path('samplebyid/<id>/', views.SampleId.as_view()),
]
