from django.db import models

# Create your models here.
class User(models.Model):
    UserID = models.AutoField(primary_key=True)
    username = models.CharField(max_length=10)
    password = models.CharField(max_length=10)

    def __str__(self):
        return self.username

class StockInfo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='UserID')
    EditDate = models.DateField()
    TargetPrice = models.FloatField()
    Priority = models.CharField(max_length=10)
    TargetType = models.CharField(max_length=10, null=True, blank=True)
    tradingType = models.CharField(max_length=20, null=True, blank=True)
    StockName = models.CharField(max_length=60, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.EditDate}"
    
class Topics(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='UserID')
    title = models.CharField(max_length=100,default='-')
    content = models.TextField()