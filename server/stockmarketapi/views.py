from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from bs4 import BeautifulSoup
import json
import datetime
import time
from . import Apis

# import FetchAllData
        
fetchAllData = Apis.Api()

@api_view(['GET'])
def allStocksData(request):
    
    startTime = time.time()
    
    nseData = fetchAllData.fetchNseAllData()
    bseData = fetchAllData.fetchBseAllData()
    
    endTime = time.time()

    # get the execution time
    elapsed_time = int(endTime - startTime)
    elapsed_time = str(datetime.timedelta(seconds=elapsed_time))
    print('Execution time:', elapsed_time)
    
    
    responseData = {
        "result":"success",
        "data":{
          "bseData":bseData,
          "nseData":nseData
        },
        "stocksCount":{
            "bseStocksCount":len(bseData),
            "nseStockCount":len(nseData)
        },
        "lastUpdated":str(datetime.datetime.now()),
        "executedTime":elapsed_time
    }

    return Response(responseData)

@api_view(['GET'])
def getMutualFundData(request):
    
    startTime = time.time()
    
    mfData = fetchAllData.MutualFundsTracker("https://www.moneycontrol.com/mutual-funds/quant-small-cap-fund-direct-plan/portfolio-holdings/MES056")
    
    endTime = time.time()

    # get the execution time
    elapsed_time = int(endTime - startTime)
    elapsed_time = str(datetime.timedelta(seconds=elapsed_time))
    print('Execution time:', elapsed_time)

    

    return Response({
        'response':"true",
        'data':mfData,
        "executedTime":elapsed_time
        })

