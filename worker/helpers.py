from gpiozero import LED
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import adafruit_mcp4725

import sys
from time import sleep
from datetime import datetime
import redis
from docxtpl import DocxTemplate

from INA219 import INA219


template_dir = sys.path[0]
template_file = 'serie_report.docx'
template = template_dir + '/' + template_file
doc = DocxTemplate(template)

ina219 = INA219(addr=0x42)

VALVES = [
  LED(4), LED(5), LED(6), LED(7), LED(8), 
  LED(9), LED(10), LED(26), LED(12), LED(13), 
  LED(14), LED(15), LED(16), LED(17), LED(18), 
  LED(19), LED(20), LED(21), LED(22), LED(23), 
  LED(24), LED(25), 
]

def check_ups_current():
  # 0: power off
  # 1: power on
  # 2: UPS error
  try: 
    current = ina219.getCurrent_mA()
    is_power_on = 1 if (current > 0) else 0
  except:
    is_power_on = 2

ANALYZER = {
  # 'ip': '192.168.1.100',
  # 'ip': '169.254.109.100',
  'ip': '169.254.1.100',
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

# Create the I2C bus
i2c = busio.I2C(board.SCL, board.SDA)
# Create the ADC object using the I2C bus
ads = ADS.ADS1115(i2c, address=0x48)
# Create single-ended input on channel 0
chan = AnalogIn(ads, ADS.P0)

# Initialize MCP4725.
dac = adafruit_mcp4725.MCP4725(i2c, address=0x60)
dac.raw_value = 0
dac.normalized_value = 1.0

def init_workder(r):
  print("Worker stated ...")
  r.set('status', 'idle')
  r.set('mock', 'off')
  r.set('analyzing', 'false')
  r.set('purging', 'false')
  r.set('serie_report', 'false')
  r.set('valve', -1)
  while r.llen('mock_data') > 0:
    r.rpop('mock_data')
  while r.llen('data') > 0:
    r.rpop('data')

def get_valve(r):
  return int(r.get('valve'))

def set_valve(position):
  for valve in VALVES:
    valve.off()
  if position >= 0:
    VALVES[position].on()
    print(f'Worker opened vavle {position}')
  else:
    print('Worker turn off all valves.')

def set_mfc(r):
  try:
    mfc_set = float(r.get('mfc'))
    dac.raw_value = int(max(min(4095.0, 4096.0 * mfc_set / 2), 0.0))
  except:
    dac.raw_value = 0

def read_mfc():
  return chan.voltage / 5 * 2

def get_mfc(r):
  try:
    mfc_set = float(r.get('mfc'))
  except:
    mfc_set = None
  try:
    read = read_mfc()
  except:
    read = None
  return {
    'set': mfc_set,
    'read': read,
  }

def turn_off_valves_mfc():
  for valve in VALVES:
    valve.off()
  dac.raw_value = 0 

turn_off_valves_mfc()

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

def get_nox(s):
  # try:
  nox = []
  for i in range(len(nox_parsers)):
    s.send(ANALYZER['commands'][i])
    s.settimeout(3)
    string = s.recv(2048).decode('utf-8')
    nox.append(nox_parsers[i](string))
  data = {
    'no': nox[0], # ppm
    'nox': nox[1], # ppm
    'noxRange': nox[2], # ppm
    'aveTime': nox[3], # sec
    'noBkg': nox[4], # ppm
    'noxBkg': nox[5], # ppm
    'noCoef': nox[6],
    'no2Coef': nox[7],
    'noxCoef': nox[8],
  }
  return data
  # except:
  #   return None

def process_data(r, s):
  data = {}
  data['datetime'] = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
  data['nox'] = get_nox(s)
  if data['nox'] is None:
    return None
  data['valve'] = get_valve(r)
  data['mfc'] = get_mfc(r)
  data['power'] = check_ups_current()
  return data


def process_mock_data(r, data):
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
    'noxCoef': 1.05,
  }
  new_data['mfc'] = {
    'set': 1.0,
    'read': 0.9,
  }
  new_data['valve'] = get_valve(r)
  return new_data


def save_serie_report(data):
  serie = data[0]
  samples = data[1]

  serie_id = samples[0]['series'] or '/'
  date = serie['created'].split('T')[0] or '/'
  temp = serie.get('ambTemp', '/') or '/'
  rh = serie.get('ambRh', '/') or '/'
  atm_pres = serie.get('ambPress', '/') or '/'
  range_ = serie.get('noxRange', '/') or '/'
  ave_time = serie.get('aveTime', '/') or '/'
  flow = serie.get('balanceFlow', '/') or '/'
  no_bkg = serie.get('noBkg', '/') or '/'
  nox_bkg = serie.get('noxBkg', '/') or '/'
  bkg = f"{no_bkg}, {nox_bkg}" if (no_bkg != '/') or (nox_bkg != '/') else '/'
  no_c = serie.get('noCoef', '/') or '/'
  no2_c = serie.get('no2Coef', '/') or '/'
  nox_c = serie.get('noxCoef', '/') or '/'
  
  try:
    std_sample = [d for d in samples if d['sampleType'] == '校准'][0]
  except:
    std_sample = {}
  std_id = std_sample.get('sampleId', '/') or '/'
  std_no = std_sample.get('noInputConc', '/') or '/'
  std_nox = std_sample.get('noxInputConc', '/') or '/'
  if (std_nox != '/') and (std_no != '/'):
    std_no2 = std_nox - std_no
  std_conc = f"{std_no}, {std_no2}" or '/'
  pres = std_sample.get('bottlePres', '/') or '/'

  results = [
    (
      str((d['index'] + 1) or '/') + '，' +
      str(d['sampleType'] or '/') + '，' +
      str(d['position'] or '/') + '，' +
      str(d['sampleId'] or '/') + '，' +
      str(d['bottleType'] or '/') + '，' +
      str(d['noInputConc'] or '/') + '，' +
      str(d['no2InputConc'] or '/') + '；' +
      str(d['noMeasCoef'] or '/') + '，' +
      str(d['no2MeasCoef'] or '/') + '；' +
      str(d['noRevised'] or '/') + '，' +
      str(d['no2Revised'] or '/') + '；' +
      str(d['bottlePres'] or '/') + '。'
    ) for d in samples
  ]
  results = '\n'.join(results) or '/'

  context = {
    'date': date,
    'temp': temp,
    'rh': rh,
    'atm_pres': atm_pres,
    'std_id': std_id,
    'std_conc': std_conc,
    'pres': pres,
    'range': range_,
    'ave_time': ave_time,
    'flow': flow,
    'bkg': bkg,
    'no_c': no_c,
    'no2_c': no2_c,
    'nox_c': nox_c,
    'serie_id': serie_id,
    'results': results,
  }

  doc.render(context)
  
  dttm = datetime.now().strftime("%Y%m%d%H%M%S")
  output_dir = '/home/pi/nox-auto-sampler/reports/'
  output_file = '序列报告'
  output = output_dir + output_file
  output = f'{output}_{dttm}.docx'
  doc.save(output)
