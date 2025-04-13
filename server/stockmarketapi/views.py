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
    mfData = fetchAllData.MutualFundsTracker("https://www.moneycontrol.com/mutual-funds/quant-small-cap-fund-direct-plan-growth/portfolio-overview/MES056")
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

@api_view(['GET'])
def getMutualFundSuggestions(request):
    mutualFundUrlOptions = "https://www.moneycontrol.com/mccode/common/autosuggestion_solr.php?classic=true&type=2&format=json&main=true&callback=suggest1&query="
    print(request.query_params)
    muutualFundsSuggestions = requests.get(mutualFundUrlOptions+request.query_params['fund'],headers={'Accept': 'application/json'})
    return Response({
        'response':"true",
        'data':muutualFundsSuggestions
        })

@api_view(["Get"])
def getFundPerformanceData(request):
    fundUrl = "https://www.moneycontrol.com/mutual-funds/nav/kotak-focused-equity-fund-direct-plan/returns/MKM1343"
    returnData = fetchAllData.mutualFundsPerformanceData(fundUrl)
    return Response({
        'response':"true",
        'data':returnData
        })

@api_view(["Get"])
def getSearchSuggerstions(request):
    searchUrl = "https://www.moneycontrol.com/mccode/common/autosuggestion_solr.php?classic=true&query=small%20cap&type=1&format=json&main=true"
    Data = fetchAllData.getSearchSuggestions(searchUrl)
    return Response({
        'response':"true",
        'data':Data
        })