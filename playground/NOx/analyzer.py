import socket
import sys
import os
from datetime import datetime
import time # time sample is 1s


def get_items_to_df(ip, port, command, response_limit=3):

  try:
    # build the connection
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(response_limit)
    s.connect((ip, port))
    s.settimeout(response_limit)
    # send current command
    s.send(command)
    s.settimeout(response_limit)
    # obtain the raw data
    data_raw = s.recv(2048)
    # decode the raw data to utf-8
    return data_raw.decode('utf-8')

  except:
    return 'Fail'


if __name__ == '__main__':
  while True:
    ip = '169.254.109.100'
    port = 9880
    command = b'no\r'
    print(get_items_to_df(ip, port, command))
    time.sleep(1)
