import redis
import json
from time import sleep

from helpers import (
  init_workder,
  set_valve,
  set_mfc,
  turn_off_valves_mfc,
  process_data,
  process_mock_data,
)


r = redis.Redis(host='localhost', port=6379, db=0)


if __name__ == '__main__':
  init_workder()

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
      data = process_data()
      print('Worker produce real data', data)

    if r.get('status') == b'run':
      print('System is running...')
      if r.get('analyzing') == b'true':
        if r.get('purging') == b'true':
          set_valve(0)
        else:
          position = int(r.get('valve'))
          set_valve(position)
      elif r.get('analyzing') == b'manual_valve':
        position = int(r.get('valve'))
        set_valve(position)
      else:
        set_valve(-1)
        r.set('valve', -1)
    else:
      turn_off_valves_mfc()
    
    if data:
      # print('Worker is measuring:', data)
      r.lpush('data', json.dumps(data))
    
    # pop old data in queue
    while r.llen('mock_data') > keep_list_length:
      r.rpop('mock_data')
    while r.llen('data') > keep_list_length:
      r.rpop('data')

    sleep(1)
