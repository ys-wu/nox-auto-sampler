from django.http import JsonResponse
from django.views import View

import json

class Mock(View):

  def get(self, request):
    print('GET OK')
    return JsonResponse('OK', safe=False)

  def post(self, request):
    try:
      data = json.loads(request.body)
      print('POST OK')
      print(data)
      return JsonResponse(data, safe=False)
    except:
      print('BAD!')
      return JsonResponse({'status': 'failure'}, safe=False)
