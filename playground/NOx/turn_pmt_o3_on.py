import socket
from time import sleep


ip = "169.254.1.100"
port = 9880

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(3)
s.connect((ip, port))

command = b'set ozonator on\r'
s.send(command)
s.settimeout(3)
print(s.recv(2048).decode('utf-8'))

command = b'set pmt on\r'
s.send(command)
s.settimeout(3)
print(s.recv(2048).decode('utf-8'))

command = b'ozonator\r'
s.send(command)
s.settimeout(3)
print(s.recv(2048).decode('utf-8'))

command = b'pmt status\r'
s.send(command)
s.settimeout(3)
print(s.recv(2048).decode('utf-8'))
