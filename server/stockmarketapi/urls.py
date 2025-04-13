from django.urls import path
from . import views

urlpatterns = [
    path('getMutualFundData/', views.getMutualFundData, name='getMutualFundData'),
    path('allStocksData/',views.allStocksData,name='allStocksData'),
    path('mutualFundReturnData/',views.getFundPerformanceData,name='mutualFundReturnData'),
    path('searchSuggestion',views.getSearchSuggerstions,name='searchSuggestion')
]