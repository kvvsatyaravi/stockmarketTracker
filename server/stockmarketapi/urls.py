from django.urls import path
from . import views

urlpatterns = [
    path('getMutualFundData/', views.getMutualFundData, name='getMutualFundData'),
    path('allStocksData/',views.allStocksData,name='allStocksData')
]