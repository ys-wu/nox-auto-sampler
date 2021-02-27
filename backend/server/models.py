from django.db import models


class Series(models.Model):
  created = models.DateTimeField(auto_now_add=True)
  name = models.CharField(default='NO/N2', max_length=100)
  # projectName = models.CharField(max_length=100)
  # method = models.CharField(max_length=100)
  # instrumentName = models.CharField(max_length=100)
  # assetNumber = models.CharField(max_length=100)
  # balanceFlow = models.FloatField()
  # ambTemp = models.FloatField()
  # ambRh = models.FloatField()
  # ambPress = models.FloatField()
  # stv = models.FloatField()
  # noxRange = models.FloatField()
  # aveTime = models.FloatField()
  # noBkg = models.FloatField()
  # noxBkg = models.FloatField()
  # noCoef = models.FloatField()
  # noxCoef = models.FloatField()
