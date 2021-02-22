from rest_framework import viewsets

from server.models import Series
from server.serializers import SeriesSerializer


class SeriesViewSet(viewsets.ModelViewSet):
  queryset = Series.objects.all().order_by('-created')
  serializer_class = SeriesSerializer
