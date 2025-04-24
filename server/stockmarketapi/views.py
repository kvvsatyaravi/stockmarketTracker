from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
import datetime
import time
from .Scripts import Apis
from Scripts.Functions import fetchExchangeData

# import FetchAllData
        
fetchAllData = Apis.Api()

@api_view(['GET'])
def allStocksData(request):
    responseData = fetchAllData.allStocksData()
    return Response(responseData)


@api_view(['GET'])
def getMutualFundData(request):
    startTime = time.time()
    mfData = fetchAllData.MutualFundsTracker("https://www.moneycontrol.com/mutual-funds/"+request.query_params['fundName']+"/portfolio-overview/"+request.query_params['fundid'])
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
    fundUrl = "https://www.moneycontrol.com/mutual-funds/nav/"+request.query_params['fundName']+"/returns/"+request.query_params['fundid']
    returnData = fetchAllData.mutualFundsPerformanceData(fundUrl)
    return Response({
        'response':"true",
        'data':returnData
        })

@api_view(["Get"])
def getSearchSuggerstions(request):
    searchUrl = "https://www.moneycontrol.com/mccode/common/autosuggestion_solr.php?classic=true&query="+request.query_params['fundName']+"&type=2&format=json&main=true"
    Data = fetchAllData.getSearchSuggestions(searchUrl)
    return Response({
        'response':"true",
        'data':Data
        })

@api_view(["Get"])
def bseStocksData():
    startTime = time.time()
    bseIndexsUrls = ["https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=B&indicesID=67&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true"]
    data = fetchExchangeData(bseIndexsUrls)
    endTime = time.time()
    # get the execution time
    elapsed_time = int(endTime - startTime)
    elapsed_time = str(datetime.timedelta(seconds=elapsed_time))
    responseData = {
        "bse":{
            "result":"success",
            "data":data,
            "stocksCount":len(data),
            "lastUpdated":str(datetime.datetime.now()),
            "executedTime":elapsed_time
        }
    }
    return Response(responseData)

@api_view(["get"])
def nseStocksData():
    startTime = time.time()
    nseIndexsUrls = [
        "https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=N&indicesID=136&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true",
        "https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=N&indicesID=111&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true",
        "https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=N&indicesID=114&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true",
        "https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=N&indicesID=7&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true",
        "https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=N&indicesID=135&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true"]
    
    data = fetchExchangeData(nseIndexsUrls)
    endTime = time.time()
    # get the execution time
    elapsed_time = int(endTime - startTime)
    elapsed_time = str(datetime.timedelta(seconds=elapsed_time))
    responseData = {
        "nse":{
            "result":"success",
            "data":data,
            "stocksCount":len(data),
            "lastUpdated":str(datetime.datetime.now()),
            "executedTime":elapsed_time
        }
    }
    return Response(responseData)

