from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from bs4 import BeautifulSoup
import json


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
                dummy[y.get_text()] = soup_body[count].get_text()
                count = count + 1
            setData.append(dummy)

    print(setData)

    with open('data.json', 'w') as my_file:
        json.dump(setData, my_file,indent = 4)

    return Response({
        'response':"true",
        'data':setData
        })

        # return Response({'message': 'Hello, world!'})
