from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from bs4 import BeautifulSoup
import json
import datetime
import time
# import FetchAllData


class Api:
    """
    A class used to store constants
    """
    def __init__(self):
        """
        Initializes the constants
        """
        self.xmlparser = "lxml"
        self.htmlparser = "html.parser"
        self.url = [
            "https://www.moneycontrol.com/mutual-funds/quant-small-cap-fund-direct-plan/portfolio-overview/MES056"
        ]
        self.bseAllData = "https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=B&indicesID=67&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true"
        self.nseAllData = "https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=N&indicesID=136&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true"

    def scrapingWebsite(self,response):

        soup_allData = BeautifulSoup(response.text, self.htmlparser)

        for eachElement in soup_allData.find_all('th'):
            if eachElement.get_text().strip() == 'Analysis'  or eachElement.get_text().strip() == 'Technical Rating':
                eachElement.decompose()

        
        for eachElement in soup_allData.find_all('td'):
            if eachElement.button  or (eachElement.a and eachElement.a.attrs['href'] == "javascript:;"):
                eachElement.decompose()

        soup_header = soup_allData.select("table > thead > tr > th")
        soup_body = soup_allData.select('tbody > tr > td')

        setData = []
        count=0

        print(soup_body)

        for x in soup_body:
            if count <= len(soup_body)-1:
                dummy = {}
                for y in soup_header:
                    dummy[y.get_text().strip()] = soup_body[count].get_text().replace('/n','').strip()
                    count = count + 1
                
                setData.append(dummy)

            # print(setData)

        return setData


    def fetchBseAllData(self):
        payload = {}
        headers = {}
        response = requests.request("GET", self.bseAllData, headers=headers, data=payload)
        Data = self.scrapingWebsite(response)
        return Data
        # with open('data/bseAllData.json', 'w') as my_file:
        #     json.dump(setData, my_file,indent = 4)

    
    def fetchNseAllData(self):
        payload = {}
        headers = {}
        response = requests.request("GET", self.nseAllData, headers=headers, data=payload)
        Data = self.scrapingWebsite(response)
        return Data
        
        
fetchAllData = Api()


@api_view(['GET'])
def allStocksData(request):
    startTime = time.time()
    
    Data = fetchAllData.fetchNseAllData()
    
    endTime = time.time()

    # get the execution time
    elapsed_time = int(endTime - startTime)
    elapsed_time = str(datetime.timedelta(seconds=elapsed_time))
    print('Execution time:', elapsed_time)
    
    responseData = {
        "result":"success",
        "data":Data,
        "stocksCount":len(Data),
        "lastUpdated":str(datetime.datetime.now()),
        "executedTime":elapsed_time
    }

    return Response(responseData)

@api_view(['GET'])
def allStocksData(request):
    startTime = time.time()
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--start-maximized")
    # chrome_options.headless = True # also works
    driver = webdriver.Chrome(options=chrome_options)

    allData = []
    setData = []
    soup_header = []

    urls = ["https://www.moneycontrol.com/markets/indian-indices/top-nse-500-companies-list/7?classic=true&categoryId=1&ex=N",
            "https://www.moneycontrol.com/markets/indian-indices/top-nsemidsml-400-companies-list/112?classic=true&categoryId=7&ex=N",
            "https://www.moneycontrol.com/markets/indian-indices/top-nsesmlcap-250-companies-list/114?classic=true&categoryId=7&ex=N"]


    for i in urls:
        driver.get(i)
        # element = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, "indicesTableData")))
        soup = BeautifulSoup(driver.page_source,'lxml')
        soup_body = soup.select("#indicesTableData tr td")
        soup_header = soup.select("#indicesTableData thead tr th")
        allData = soup_body + allData

    driver.quit()
    count=0

    for x in allData:
        if count <= len(allData)-1:
            dummy = {}
            for y in soup_header:
                dummy[y.get_text().strip()] = allData[count].get_text().replace('/n','').strip()
                count = count + 1
        setData.append(dummy)

    Data = []
    [Data.append(x) for x in setData if x not in Data]

    print(Data)

    

    # with open('data.json', 'w') as my_file:
    #     json.dump(responseData, my_file,indent=4)


    endTime = time.time()

    # get the execution time
    elapsed_time = int(endTime - startTime)
    elapsed_time = str(datetime.timedelta(seconds=elapsed_time))
    print('Execution time:', elapsed_time)
    
    responseData = {
        "result":"success",
        "data":Data,
        "stocksCount":len(Data),
        "lastUpdated":str(datetime.datetime.now()),
        "executedTime":elapsed_time
    }

    return Response(responseData)


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
