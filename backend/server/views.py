from django.http import JsonResponse
from django.views import View
from rest_framework import viewsets

import json

from server.models import Series
from server.serializers import SeriesSerializer


setting_url = '/app/setting/setting.json'


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
