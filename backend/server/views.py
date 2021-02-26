from django.http import JsonResponse
from django.views import View
from rest_framework import viewsets

import json
import redis

from server.models import Series
from server.serializers import SeriesSerializer


setting_url = '/app/setting/setting.json'

host = 'redis'
r = redis.Redis(host=host, port=6379, db=0)
r.set('status', 'mock')


class SeriesViewSet(viewsets.ModelViewSet):
  queryset = Series.objects.all().order_by('-created')
  serializer_class = SeriesSerializer


class Setting(View):
  def get(self, request):
    with open(setting_url) as data_file:
      try:
        data = json.load(data_file)
        return JsonResponse(data, safe=False)
      except:
        return JsonResponse({'status': 'failure'}, safe=False)

  def post(self, request):
    with open(setting_url, 'w') as data_file:
      try:
        data = json.loads(request.body)
        json.dump(data, data_file)
        return JsonResponse(data, safe=False)
      except:
        return JsonResponse({'status': 'failure'}, safe=False)


class Data(View):

  def get(self, request):
    try:
      if r.get('status') != b'idle' and r.llen('data') > 0:
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
    except:
      print('Error in handle post data')
      return JsonResponse({'Message': 'Post data fail'})
