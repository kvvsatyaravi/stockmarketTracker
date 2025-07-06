import requests
from bs4 import BeautifulSoup
import json
from stockmarketapi.models import StockInfo,User
from rest_framework.response import Response
from django.http import Http404
from django.shortcuts import get_object_or_404
import time
import datetime

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
        # with open('data.json', 'w') as my_file:
        #     json.dump(setData, my_file,indent = 4)

        return setData

    def MutualFundsTracker(self,url):
        html_parser = "html.parser"

        soup = BeautifulSoup(requests.get(url, timeout=60).text, html_parser)
        soup_data = soup.select("table#equityCompleteHoldingTable tbody :not(tr[style='display: none;']) td")

        soup_body = soup.select("table#equityCompleteHoldingTable tbody tr:not(tr[style='display: none;'])")
        soup_header = soup.select("table#equityCompleteHoldingTable > thead > tr > th")

        setData = []

        titles = soup.select("table#equityCompleteHoldingTable tbody :not(tr[style='display: none;']) td span.port_right a")

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
    
    def getSearchSuggestions(self,url):
        payload = {}
        headers = {}
        response = requests.request("GET", url, headers=headers, data=payload)
        return json.loads(response.text)
        
    def getStockInfo(self, url):
        startTime = time.time()
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
    
            return {
                    "nsePrice":nsePrice,
                    "bsePrice":bsePrice,
                    "executedTime":elapsed_time
                }
    
    
    def StockOperations(self, type, formData):
        print(formData)
        match type:
            case "Add":
                StockInfo(
                    user=User.objects.get(UserID=formData["userID"]),
                    TargetPrice=formData["targetPrice"],
                    Priority=formData["priority"],
                    tradingType=formData["tradingType"],
                    StockName=formData["stockName"],
                    TargetType = formData["targetType"]
                ).save()
                return {"operation": type}

            case "Edit":
                stockRecord = get_object_or_404(StockInfo, id=formData["recordID"])
                
                stockRecord.user = User.objects.get(UserID=formData["userID"])
                stockRecord.TargetPrice = formData["targetPrice"]
                stockRecord.Priority = formData["priority"]
                stockRecord.tradingType = formData["tradingType"]
                stockRecord.StockName = formData["stockName"]
                stockRecord.TargetType = formData["targetType"]
                stockRecord.save()
                
                return {"operation": type}

            case "Delete":
                try:
                    getRecordId = StockInfo.objects.get(id=formData["id"])
                except StockInfo.DoesNotExist:
                    raise Http404("record not existed in DataBase")

                getRecordId.delete()
                return {"operation": type}

            case "Retrive":
                allDataDic = {}
                usersData = StockInfo.objects.all()
                allDataDic['data'] = [{'id':u.id,'targetPrice': u.TargetPrice, 'Priority': u.Priority,'tradingType':u.tradingType,'TargetType':u.TargetType,'StockName':u.StockName,'EditDate':u.EditDate} for u in usersData]
                return allDataDic

