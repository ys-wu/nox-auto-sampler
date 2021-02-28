from django.db import models


class Series(models.Model):
  created = models.DateTimeField(auto_now_add=True)
  name = models.CharField(null=True, max_length=100)
  projectName = models.CharField(null=True, max_length=100)
  method = models.CharField(null=True, max_length=100)
  instrumentName = models.CharField(null=True, max_length=100)
  assetNumber = models.CharField(null=True, max_length=100)
  balanceFlow = models.FloatField(null=True)
  ambTemp = models.FloatField(null=True)
  ambRh = models.FloatField(null=True)
  ambPress = models.FloatField(null=True)
  stv = models.FloatField(null=True)
  noxRange = models.FloatField(null=True)
  aveTime = models.FloatField(null=True)
  noBkg = models.FloatField(null=True)
  noxBkg = models.FloatField(null=True)
  noCoef = models.FloatField(null=True)
  noxCoef = models.FloatField(null=True)
