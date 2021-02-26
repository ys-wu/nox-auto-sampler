from django.http import JsonResponse
from django.views import View

import json
import redis

host = 'redis'
r = redis.Redis(host=host, port=6379, db=0)
r.set('status', 'mock')


class Mock(View):

  def get(self, request):
    print('GET OK')
    return JsonResponse('OK', safe=False)

  def post(self, request):
    try:
      data = json.loads(request.body)
      print('Receive post mock data:', data)
      if data['status'] == 'idle':
        r.set('status', 'idle')
      elif data['status'] == 'mock':
        r.set('status', 'mock')
        r.lpush('mock_data', json.dumps(data))
      elif data['status'] == 'run':
        r.set('status', 'run')
      print('Post mock data successed')
      return JsonResponse(data, safe=False)
    except:
      print('Error in handle mock post')
      return JsonResponse({'Message': 'Post mock data fail'})
