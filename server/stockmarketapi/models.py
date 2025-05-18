from django.db import models
from datetime import datetime

# Create your models here.
class User(models.Model):
    UserID = models.AutoField(primary_key=True)
    username = models.CharField(max_length=10)
    password = models.CharField(max_length=10)

    def __str__(self):
        return self.username

class StockInfo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='UserID')
    EditDate = models.DateField(default=datetime.now)
    TargetPrice = models.FloatField()
    StockName = models.CharField(max_length=50,default='-')
    Priority = models.CharField(max_length=10)
    tradingType = models.CharField(max_length=25,default='-')

    def __str__(self):
        return f"{self.user.username} - {self.EditDate}"