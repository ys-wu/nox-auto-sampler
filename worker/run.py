import redis
import json
from time import sleep


def get_valve():
  return -1


def process_mock_data (data):
  new_data = {};
  new_data['power'] = data['power']
  new_data['nox'] = {
    'no': data['no'],
    'nox': data['nox'],
    'noxRange': 200,
    'aveTime': 60,
    'noBkg': 0.2,
    'noxBkg': 0.25,
    'noCoef': 1.02,
    'no2Coef': 0.98,
    'noxCoef': 1.05
  }
  new_data['mfc'] = {
    'set': data['mfcSet'],
    'read': data['mfcRead']
  }
  new_data['valve'] = get_valve()
  return new_data


if __name__ == '__main__':

  print("Worker stated ...")

  host = 'redis'
  r = redis.Redis(host=host, port=6379, db=0)
  r.set('status', 'idle')
  r.set('mock', 'off')
  while r.llen('mock_data') > 0:
    r.rpop('mock_data')
  while r.llen('data') > 0:
    r.rpop('data')

  data = None
  keep_list_length = 10

  while True:
    
    if r.get('mock') == b'on' and r.llen('mock_data') > 0:
      while r.llen('mock_data') > 0:
        data = r.rpop('mock_data')
      data = json.loads(data)
      data = process_mock_data(data)
      print('Worker produce mock data', data)
    elif r.get('mock') == b'off':
      while r.llen('mock_data') > 0:
        r.rpop('mock_data')
      data = None

    if r.get('status') == b'run':
      pass
    
    if data:
      print(data)
      r.lpush('data', json.dumps(data))
    
    # pop old data in queue
    while r.llen('mock_data') > keep_list_length:
      r.rpop('mock_data')
    while r.llen('data') > keep_list_length:
      r.rpop('data')

    sleep(1)
