from django.http import JsonResponse
from django.views import View

import json
import redis

host = 'redis'
r = redis.Redis(host=host, port=6379, db=0)
r.set('mock', 'off')


class Mock(View):

  def post(self, request):
    try:
      data = json.loads(request.body)
      print('Receive post mock data:', data)
      if data['mock'] == 'on':
        r.set('mock', 'on')
        r.lpush('mock_data', json.dumps(data))
      elif data['mock'] == 'off':
        r.set('mock', 'off')
      return JsonResponse(data)
    except:
      print('Error in handle mock post')
      return JsonResponse({'Message': 'Post mock data fail'})
