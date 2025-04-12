import requests
from bs4 import BeautifulSoup
import json
import datetime
import time
from .StockExchanges import fetchBseAllData,fetchNseAllData

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
        self.bseAllData = ["https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=B&indicesID=67&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true"]
        self.nseAllData = ["https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=N&indicesID=136&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true",
                           "https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=N&indicesID=111&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true",
                           "https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=N&indicesID=114&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true",
                           "https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=N&indicesID=7&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true",
                           "https://www.moneycontrol.com/markets/indian-indices/changeTableData?deviceType=web&exName=N&indicesID=135&selTab=o&subTabOT=o&subTabOPL=cl&selPage=marketTerminal&classic=true"]


    def allStocksData(self):
    
        startTime = time.time()
        
        nseData = fetchNseAllData(self.nseAllData)
        bseData = fetchBseAllData(self.bseAllData)
        
        endTime = time.time()

        # get the execution time
        elapsed_time = int(endTime - startTime)
        elapsed_time = str(datetime.timedelta(seconds=elapsed_time))
        # print('Execution time:', elapsed_time)
        
        
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
        
        return responseData
    

    def mutualFundsPerformanceData(self,url):
        html_parser = "html.parser"

        soup = BeautifulSoup(requests.get(url, timeout=60).text, html_parser)
        soup_header = soup.select("div.returns_table > table.mctable1 > thead > tr > th")
        soup_body = soup.select("div.returns_table table.mctable1 tbody tr")
        soup_data = soup.select("div.returns_table table.mctable1 tbody td")

        count=0
        setData = {}
        for x in soup_body:
            dummy = {}
            for y in soup_header:
                dummy[y.get_text().strip()] = soup_data[count].get_text().replace('/n','').strip()
                count = count + 1

            setData[soup_data[count - 7].get_text().replace('/n','').strip()] = dummy
        print(setData)
        # with open('data.json', 'w') as my_file:
        #     json.dump(setData, my_file,indent = 4)

        return setData

    def MutualFundsTracker(self,url):
        mutualFund = "quantsmallcap"
        fundUrl = "https://www.moneycontrol.com/mutual-funds/tata-digital-india-fund-direct-plan/portfolio-overview/MTA1147"

        html_parser = "html.parser"

        soup = BeautifulSoup(requests.get(url, timeout=60).text, html_parser)
        soup_data = soup.select("table#equityCompleteHoldingTable tbody :not(tr[style='display: none;']) td")

        soup_body = soup.select("table#equityCompleteHoldingTable tbody tr:not(tr[style='display: none;'])")
        soup_header = soup.select("table#equityCompleteHoldingTable > thead > tr > th")

        setData = []

        titles = soup.select("table#equityCompleteHoldingTable tbody :not(tr[style='display: none;']) td span.port_right a")

        print(soup_body)

        count=0
        titlesCount = 0

        for x in soup_body:
            dummy = {}
            for y in soup_header:
                if y.get_text().strip() == 'Stock Invested in':
                    # link = titles[titlesCount]['href']
                    # name = link.replace("https://www.moneycontrol.com/india/stockpricequote/","")
                    # name = name.split("/")
                    # print(name)
                    
                    # dummy[y.get_text().strip()] = name[1]
                    # titlesCount = titlesCount +1
                    dummy[y.get_text().strip()] = soup_data[count].get_text().replace('/n',' ').replace(' Ltd.','').strip()
                    count = count + 1
                else:
                    dummy[y.get_text().strip()] = soup_data[count].get_text().replace('/n',' ').strip()
                    count = count + 1

            setData.append(dummy)

        return setData