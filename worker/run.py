import redis
import json
from time import sleep


def get_valve():
  return -1


def process_mock_data (data):
  new_data = {};
  new_data['power'] = 1
  new_data['nox'] = {
    'no': data['no'],
    'nox': data['nox'],
    'ave_time': 60,
    'no_bkg': 0.2,
    'nox_bkg': 0.25,
    'no_coef': 1.02,
    'no2_coef': 0.98,
    'nox_coef': 1.05
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

  data = None

  while True:
    
    if r.get('status') == b'mock' and r.llen('mock_data') > 0:
      while r.llen('mock_data') > 0:
        data = r.rpop('mock_data')
      data = json.loads(data)
      data = process_mock_data(data)
      print('Worker produce mock data', data)

    elif r.get('status') == b'run':
      pass
    
    if data:
      r.lpush('data', json.dumps(data))

    sleep(1)
