from rest_framework import serializers

from server.models import Series


class SeriesSerializer(serializers.HyperlinkedModelSerializer):

  class Meta:
    model = Series
    fields = ('url', 'id', 'created', 'name')
