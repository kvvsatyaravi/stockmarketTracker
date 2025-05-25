from django.urls import path
from . import views

urlpatterns = [
    path('getMutualFundData/', views.getMutualFundData, name='getMutualFundData'),
    path('getNSEData/',views.nseStocksData,name='nseStocksData'),
    path('getBSEData/',views.bseStocksData,name='bseStocksData'),
    path('mutualFundReturnData/',views.getFundPerformanceData,name='mutualFundReturnData'),
    path('searchSuggestion',views.getSearchSuggerstions,name='searchSuggestion'),
    path('getStockLivePrice/',views.getStockLivePrice,name='stockLivePrice'),
    path('stocksOperations/',views.StocksData,name='stocksOperations'),
]