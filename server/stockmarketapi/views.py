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
    fetchAllData = Apis.Api()
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
def hello_world(request):

    html_parser = "html.parser"
    url = [
        "https://www.moneycontrol.com/mutual-funds/quant-small-cap-fund-direct-plan/portfolio-overview/MES056"
    ]


    # dummy = {}

    soup = BeautifulSoup(requests.get(url[0], timeout=60).text, html_parser)
    # soup_allData = BeautifulSoup(requests.get(Api().AllData[0], timeout=60).text, Api().html_parser)

    soup_body = soup.select("table#equityCompleteHoldingTable > tbody > tr > td")
    soup_header = soup.select("table#equityCompleteHoldingTable > thead > tr > th")

    setData = []


    # print(soup_body)
    count=0

    for x in soup_body:
        if count <= len(soup_body)-1:
            dummy = {}
            for y in soup_header:
                # print(soup_body[count],", ")
                if soup_body[count].span and soup_body[count].span['class'][0] == "port_right":
                    print(count)
                #     link = soup_body[count].span.a['href']
                #     name = link.replace("https://www.moneycontrol.com/india/stockpricequote/","")
                #     name = name.split("/")
                #     # print(name[1])
                #     dummy[y.get_text().strip()] = name[1]
                #     count = count + 1
                # else:
                dummy[y.get_text().strip()] = soup_body[count].get_text().replace('/n','').strip()
                count = count + 1

            setData.append(dummy)

    # print(setData)

    # with open('data.json', 'w') as my_file:
    #     json.dump(setData, my_file,indent = 4)

    return Response({
        'response':"true",
        'data':setData
        })

        # return Response({'message': 'Hello, world!'})

