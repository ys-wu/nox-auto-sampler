from django.db import models


class Series(models.Model):
  created = models.DateTimeField(auto_now_add=True)
  name = models.CharField(default='NO/N2', max_length=100)
  date = models.DateField()

# - AmbTemp
# - AmbRH
# - AmbPres
# - Method
# - StdID
# - StdConc
# - StdPre
# - InstName
# - InstID
# - MeasRange
# - MeasAveTime
# - MeasGasFlow
# - MeasNOBkg
# - MeasNOxBkg
# - MeasNOCoef
# - MeasNO2Coef
# - MeasNOxCoef
