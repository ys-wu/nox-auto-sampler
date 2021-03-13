from django.http import JsonResponse
from django.views import View
from rest_framework import viewsets

from datetime import datetime
import json
import redis

from server.models import (
  Series,
  Sample,
  SeriesTemplate,
  SampleTemplate,
)
from server.serializers import (
  SeriesSerializer, 
  SampleSerializer,
  SeriesTemplateSerializer,
  SampleTemplateSerializer,
)


setting_url = '/app/setting/setting.json'
log_url = '/app/dbdata/log.txt'

host = 'redis'
r = redis.Redis(host=host, port=6379, db=0)
r.set('status', 'idel')
r.set('mock', 'off')
r.set('analyzing', 'false')
r.set('purging', 'false')
while r.llen('mock_data') > 0:
  r.rpop('mock_data')
while r.llen('data') > 0:
  r.rpop('data')


class SeriesViewSet(viewsets.ModelViewSet):
  queryset = Series.objects.all().order_by('-created')
  serializer_class = SeriesSerializer


class SampleViewSet(viewsets.ModelViewSet):
  queryset = Sample.objects.all().order_by('-created')
  serializer_class = SampleSerializer


class SeriesTemplateViewSet(viewsets.ModelViewSet):
  queryset = SeriesTemplate.objects.all().order_by('-created')
  serializer_class = SeriesTemplateSerializer


class SampleTemplateViewSet(viewsets.ModelViewSet):
  queryset = SampleTemplate.objects.all().order_by('-created')
  serializer_class = SampleTemplateSerializer


class Setting(View):
  def get(self, request):
    with open(setting_url) as data_file:
      try:
        data = json.load(data_file)
        return JsonResponse(data, safe=False)
      except:
        return JsonResponse({'Message': 'Setting get failure'}, safe=False)

  def post(self, request):
    with open(setting_url, 'w+') as data_file:
      try:
        data = json.loads(request.body)
        json.dump(data, data_file)
        return JsonResponse(data, safe=False)
      except:
        return JsonResponse({'Message': 'Setting post failure'}, safe=False)


class Data(View):
  def get(self, request):
    try:
      r.set('status', 'run')
      if r.llen('data') > 0:
        while r.llen('data') > 0:
          data = r.rpop('data')
        data = json.loads(data)
        print('Pop data from Redis:', data)
        return JsonResponse(data)
      return JsonResponse({'Message': 'No new arrived data'})
    except:
      print('Error in handle get data')
      return JsonResponse({'Message': 'Get data fail'})

  def post(self, request):
    try:
      data = json.loads(request.body)
      print('Receive post data:', data)
      if data['status'] == 'idle':
        r.set('status', 'idle')
      return JsonResponse(data)
    except:
      print('Error in handle post data')
      return JsonResponse({'Message': 'Post data fail'})


class Analyzing(View):
  def post(self, request):
    try:
      data = json.loads(request.body)
      print('Receive post analyzing:', data)
      if data['analyzing'] == 'true':
        r.set('analyzing', 'true')
        r.set('valve', data['valve'])
      else:
        r.set('analyzing', 'false')
      return JsonResponse(data)
    except:
      print('Error in handle post data')
      return JsonResponse({'Message': 'Post analyzing fail'})


class Purging(View):
  def post(self, request):
    try:
      data = json.loads(request.body)
      print('Receive post purging:', data)
      if data['purging'] == 'true':
        r.set('purging', 'true')
      else:
        r.set('purging', 'false')
      return JsonResponse(data)
    except:
      print('Error in handle post data')
      return JsonResponse({'Message': 'Post purging fail'})


class Log(View):
   def post(self, request):
    try:
      data = json.loads(request.body)
      print('Receive log:', data)
      if data['log'] != '':
        with open(log_url, 'a+') as f:
          now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
          f.write(now + ' ' + data['log'] + '\n')
      return JsonResponse(data)
    except:
      print('Error in handle post data')
      return JsonResponse({'Message': 'Log fail'})
