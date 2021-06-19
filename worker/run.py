import redis
import socket
import json
from time import sleep

from datetime import datetime

from helpers import (
  init_workder,
  get_valve,
  set_valve,
  set_mfc,
  turn_off_valves_mfc,
  process_data,
  process_mock_data,
  save_serie_report,
)


ip = "169.254.1.100"
port = 9880

while True:
  try:
    r = redis.Redis(host='localhost', port=6379, db=0) 
    r.get('status')
    init_workder(r)
    break
  except:
    print('Connecting to Redis...')
  sleep(1)


print(f"NOx Analyzer IP: {ip}")
while True:
  try:  
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)
    s.connect((ip, port))
    break
  except:
    print('Connecting to NOx analyzer...')
  sleep(1)

turn_off_valves_mfc()


if __name__ == '__main__':

  data = None
  keep_list_length = 10

  while True:

    try:

      set_mfc(r)
      
      if r.get('mock') == b'on' and r.llen('mock_data') > 0:
        while r.llen('mock_data') > 0:
          data = r.rpop('mock_data')
        data = json.loads(data)
        data = process_mock_data(r, data)
        print('Worker produce mock data', data)
      
      if r.get('status') == b'run':
        data = process_data(r, s)
        print('System is running...', data)
        if r.get('analyzing') == b'true':
          if r.get('purging') == b'true':
            set_valve(0)
          else:
            position = get_valve(r)
            set_valve(position)
        elif r.get('analyzing') == b'manual_valve':
          position = get_valve(r)
          set_valve(position)
        else:
          set_valve(-1)
          r.set('valve', -1)
      else:
        turn_off_valves_mfc()

      if data:
        # print('Worker is measuring:', data)
        r.lpush('data', json.dumps(data))
      else:
        sleep(0.5)
      
      # pop old data in queue
      while r.llen('mock_data') > keep_list_length:
        r.rpop('mock_data')
      while r.llen('data') > keep_list_length:
        r.rpop('data')

      if (r.get('serie_report') != b'false') and (r.get('serie_report') is not None):
        try:
          data = json.loads(r.get('serie_report'))
          save_serie_report(data)
        except:
          print('Serie report save fail.')
        finally:
          r.set('serie_report', 'false')

      # sleep(1)
    
    except:
      try:
        r = redis.Redis(host='localhost', port=6379, db=0) 
        r.get('status')
        init_workder(r)
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1)
        s.connect((ip, port))
      except:
        print(datetime.now(), 'Reconnecting ...')
      sleep(1)
