import requests
from bs4 import BeautifulSoup
import json

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
                link = titles[titlesCount]['href']
                name = link.replace("https://www.moneycontrol.com/india/stockpricequote/","")
                name = name.split("/")
                # print(name)
                
                dummy[y.get_text().strip()] = name[1]
                titlesCount = titlesCount +1
                count = count + 1
            else:
                dummy[y.get_text().strip()] = soup_data[count].get_text().replace('/n','').strip()
                count = count + 1

        setData.append(dummy)

    # print(setData)

    with open('data.json', 'w') as my_file:
        json.dump(setData, my_file,indent = 4)