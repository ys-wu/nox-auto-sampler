from rest_framework import serializers

from server.models import Series, SeriesTemplate


class SeriesSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = Series
    fields = (
      'url', 
      'id', 
      'created', 
      'name',
      'projectName',
      'method',
      'instrumentName',
      'assetNumber',
      'balanceFlow',
      'ambTemp',
      'ambRh',
      'ambPress',
      'stv',
      'noxRange',
      'aveTime',
      'noBkg',
      'noxBkg',
      'noCoef',
      'no2Coef',
      'noxCoef', 
    )


class SeriesTemplateSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = SeriesTemplate
    fields = (
      'url', 
      'id', 
      'created', 
      'name',
    )
