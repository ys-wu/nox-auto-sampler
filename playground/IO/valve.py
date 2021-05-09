from gpiozero import LED
from time import sleep

for i in range(4, 27):
  led = LED(i)
  print(i)
  print('ON')
  led.on()
  sleep(2)
  print('OFF')
  led.off()
  sleep(2)
