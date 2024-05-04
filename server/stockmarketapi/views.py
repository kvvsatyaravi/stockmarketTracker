from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from bs4 import BeautifulSoup
import json
import datetime
import time
from .Scripts import Apis

# import FetchAllData
        
fetchAllData = Apis.Api()

@api_view(['GET'])
def allStocksData(request):
    responseData = fetchAllData.allStocksData()
    return Response(responseData)


@api_view(['GET'])
def getMutualFundData(request):
    startTime = time.time()
    mfData = fetchAllData.MutualFundsTracker("https://www.moneycontrol.com/mutual-funds/tata-digital-india-fund-direct-plan/portfolio-overview/MTA1147")
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

