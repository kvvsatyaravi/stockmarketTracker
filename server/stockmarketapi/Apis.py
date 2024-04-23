import requests
from bs4 import BeautifulSoup
import json

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
                    if soup_body[count].a:
                        link = soup_body[count].a['href']
                        name = link.replace("https://www.moneycontrol.com/india/stockpricequote/","")
                        name = name.split("/")
                        print(name[1])
                        dummy[y.get_text().strip()] = name[1]
                        count = count + 1
                    else:
                        dummy[y.get_text().strip()] = soup_body[count].get_text().replace('/n','').strip()
                        count = count + 1
                
                setData.append(dummy)

            # print(setData)

        return setData


    def fetchBseAllData(self):
        payload = {}
        headers = {}
        response = requests.request("GET", self.bseAllData, headers=headers, data=payload)
        setData = self.scrapingWebsite(response)
        
        return setData

    
    def fetchNseAllData(self):
        payload = {}
        headers = {}
        print("testing nse data")
        response = requests.request("GET", self.nseAllData, headers=headers, data=payload)
        setData = self.scrapingWebsite(response)
        
        return setData
        
    def MutualFundsTracker(self,url):
        print(url)
        mutualFund = "quantsmallcap"
        fundUrl = "https://www.moneycontrol.com/mutual-funds/tata-digital-india-fund-direct-plan/portfolio-overview/MTA1147"

        html_parser = "html.parser"
        # url = [
        #     "https://www.moneycontrol.com/mutual-funds/tata-digital-india-fund-direct-plan/portfolio-overview/MTA1147"
        # ]


        # dummy = {}

        soup = BeautifulSoup(requests.get(url, timeout=60).text, html_parser)
        # soup_allData = BeautifulSoup(requests.get(Api().AllData[0], timeout=60).text, Api().html_parser)

        soup_body = soup.select("table#equityCompleteHoldingTable > tbody > tr > td")
        soup_header = soup.select("table#equityCompleteHoldingTable > thead > tr > th")

        setData = []

        titles = soup.select("span.port_right > a")
        print(titles)

        print(soup_body)
        count=0
        titlesCount = 0

        for x in soup_body:
            if count <= len(soup_body)-1:
                dummy = {}
                for y in soup_header:
                    if y.get_text().strip() == 'Stock Invested in':
                        link = titles[titlesCount]['href']
                        name = link.replace("https://www.moneycontrol.com/india/stockpricequote/","")
                        name = name.split("/")
                        # print(name[1])
                        dummy[y.get_text().strip()] = name[1]
                        titlesCount = titlesCount + 1
                        count = count + 1
                    else:
                        dummy[y.get_text().strip()] = soup_body[count].get_text().replace('/n','').strip()
                        count = count + 1

                setData.append(dummy)
        print(setData)
        
        return setData