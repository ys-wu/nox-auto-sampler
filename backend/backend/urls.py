from django.conf.urls import include, url
from rest_framework.documentation import include_docs_urls


urlpatterns = [
    url(r'^', include('server.urls')),
    url(r'^mock/', include('mock.urls')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
