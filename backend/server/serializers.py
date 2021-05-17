from rest_framework import serializers

from server.models import Series, Sample, SeriesTemplate, SampleTemplate


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
      # 'stv',
      'noxRange',
      'aveTime',
      'noBkg',
      'noxBkg',
      'noCoef',
      'no2Coef',
      'noxCoef', 
    )


class SampleSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = Sample
    fields = (
      'url', 
      'id', 
      'created',
      'index',
      'sampleType',
      'position',
      'sampleId',
      'noInputConc',
      'no2InputConc',
      'noxInputConc',
      'noMeasConc',
      'no2MeasConc',
      'noxMeasConc',
      'noMeasCoef',
      'no2MeasCoef',
      'noxMeasCoef',
      'noRevised',
      'no2Revised',
      'noxRevised',
      'bias',
      'bottleType',
      'bottlePres',
      'operator',
      'remark',
      'series',
      'stable',
      'updateDate',
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


class SampleTemplateSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = SampleTemplate
    fields = (
      'url',
      'id',
      'created',
      'index',
      'sampleType',
      'name',
      'position',
      'sampleId',
      'noInputConc',
      'noxInputConc',
      'bias',
      'bottleType',
      'bottlePres',
      'operator',
      'remark',
      'series',
    )
