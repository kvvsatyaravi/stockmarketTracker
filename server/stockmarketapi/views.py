from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
import datetime
import time
from .Scripts import Apis
from .Scripts.Functions import fetchExchangeData
from bs4 import BeautifulSoup
from stockmarketapi.models import StockInfo,User
from django.shortcuts import get_object_or_404, render, HttpResponseRedirect

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

@api_view(['GET'])
def getStockLivePrice(request):
    startTime = time.time()
    url = request.query_params['stockUrl']
    html_parser = "html.parser"
    nsePrice = '-'
    bsePrice = '-'

    try:
        soup = BeautifulSoup(requests.get(url, timeout=60).text, html_parser)
        bsePrice = soup.select("div.inprice1.bsecp")
        bsePrice = bsePrice[0].get_text()
        nsePrice = soup.select("div.inprice1.nsecp")
        nsePrice = nsePrice[0].get_text()

    except IndexError:
        if soup.select("div#sp_low"):
            nsePrice = soup.select("div#sp_low")[0].get_text()
            bsePrice = soup.select("div#sp_low")[0].get_text()
        else:
            nsePrice = soup.select("div.nsestkcp.bsestkcp")[0].get_text()
            bsePrice = soup.select("div.nsestkcp.bsestkcp")[0].get_text()

    finally:
        endTime = time.time()
        # get the execution time
        elapsed_time = int(endTime - startTime)
        elapsed_time = str(datetime.timedelta(seconds=elapsed_time))

        responseData = {
            "nsePrice":nsePrice,
            "bsePrice":bsePrice,
            "executedTime":elapsed_time
        }
        
        return Response({
        'response':"true",
        'data':responseData
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
    searchUrl = "https://www.moneycontrol.com/mccode/common/autosuggestion_solr.php?classic=true&query="+request.query_params['fundName']+"&type="+request.query_params['type']+"&format=json&main=true"
    Data = fetchAllData.getSearchSuggestions(searchUrl)
    return Response({
        'response':"true",
        'data':Data
        })

@api_view(["Get"])
def bseStocksData(request):
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
def nseStocksData(request):
    startTime = time.time()
    nseIndexsUrls = ["https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=N&indicesID=136&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true"]
    
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

@api_view(["post"])
def StocksData(request):
    startTime = time.time()
    data = fetchAllData.StockOperations(
        request.data["operationType"], request.data["recordDetails"]
    )
    endTime = time.time()
    # get the execution time
    elapsed_time = int(endTime - startTime)
    elapsed_time = str(datetime.timedelta(seconds=elapsed_time))
    print(data)
    return Response({**data, "response": True,"executedTime":elapsed_time})



