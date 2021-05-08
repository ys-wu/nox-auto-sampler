from gpiozero import LED

import socket

import redis


VALVES = [
  LED(4), LED(5), LED(6), LED(7), LED(8), 
  LED(9), LED(10), LED(11), LED(12), LED(13), 
  LED(14), LED(15), LED(16), LED(17), LED(18), 
  LED(19), LED(20), LED(21), LED(22), LED(23), 
  LED(24), LED(25), 
]

ANALYZER = {
  'ip': '169.254.109.100',
  'port': 9880,
  'commands': [
    b'no\r',
    b'nox\r',
    b'range nox\r',
    b'avg time\r',
    b'no bkg\r',
    b'nox bkg\r',
    b'no coef\r',
    b'no2 coef\r',
    b'nox coef\r',
  ]
}

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(1)
s.connect((ANALYZER['ip'], ANALYZER['port']))


def init_workder():
  print("Worker stated ...")
  r = redis.Redis(host='localhost', port=6379, db=0)
  r.set('status', 'idle')
  r.set('mock', 'off')
  r.set('analyzing', 'false')
  r.set('purging', 'false')
  r.set('valve', -1)
  while r.llen('mock_data') > 0:
    r.rpop('mock_data')
  while r.llen('data') > 0:
    r.rpop('data')

def get_valve():
  pass

def set_valve(position):
  for valve in range(VALVES):
    valve.off()
  VALVES[position].on()  
  print(f'Worker opened vavle {position}')

def get_mfc():
  pass

def set_mfc():
  pass

def turn_off_valves_mfc():
  pass

nox_parsers = [
  lambda string: float(string.split(' ')[1]) / 1000,
  lambda string: float(string.split(' ')[1]) / 1000,
  lambda string: int(float(string.split(' ')[3]) / 1000),
  lambda string: int(float(string.split(' ')[3])),
  lambda string: float(string.split(' ')[2]) / 1000,
  lambda string: float(string.split(' ')[2]) / 1000,
  lambda string: float(string.split(' ')[2].split('*')[0]),
  lambda string: float(string.split(' ')[2].split('*')[0]),
  lambda string: float(string.split(' ')[2].split('*')[0]),
]

def get_nox():
  nox = []
  for i in range(len(ANALYZER['commands'])):
    s.send(ANALYZER['commands'][i])
    s.settimeout(3)
    string = s.recv(2048).decode('utf-8')
    nox.append(nox_parsers[i](string))
  data = {
    'no': nox[0], # ppm
    'nox': nox[1], # ppm
    'noxRange': nox[2], # ppm
    'aveTime': nox[3], # sec
    'noBkg': nox[4],
    'noxBkg': nox[5],
    'noCoef': nox[6],
    'no2Coef': nox[7],
    'noxCoef': nox[8],
  }
  return data

def process_data():
  data = {}
  data['nox'] = get_nox()
  return data


def process_mock_data(data):
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
