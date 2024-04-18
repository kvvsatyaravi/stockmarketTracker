from bs4 import BeautifulSoup
from selenium import webdriver

driver = webdriver.Chrome()
driver.get("https://www.moneycontrol.com/markets/indian-indices/")
soup = BeautifulSoup(driver.page_source,'lxml')

soup_body = soup.select("#indicesTableData tr td")
print(soup_body)
# print(html)
# Get the page source after interactions
# element = driver.find_element(By.ID, "indicesTableData")
# print(element)
# Parse the page source with Beautiful Soup

driver.quit()

### code for extracting mutaul funds table data

# import requests
# from bs4 import BeautifulSoup
# import json

# class Api:
#     """
#     A class used to store constants
#     """
#     def __init__(self, title_info=None, link_info=None, date_info=None, news_info=None):
#         """
#         Initializes the constants
#         """
#         self.html_parser = "html.parser"
#         self.url = [
#             "https://www.moneycontrol.com/mutual-funds/quant-small-cap-fund-direct-plan/portfolio-overview/MES056"
#         ]
#         self.AllData = ["https://www.niftyindices.com/market-data/equity-stock-watch?Iname=NIFTY%20TOTAL%20MKT"]


# # dummy = {}

# # soup = BeautifulSoup(requests.get(Api().url[0], timeout=60).text, Api().html_parser)
# soup_allData = BeautifulSoup(requests.get(Api().AllData[0], timeout=60).text, Api().html_parser)

# # soup_body = soup.select("table#equityCompleteHoldingTable > tbody > tr > td")
# # soup_header = soup.select("table#equityCompleteHoldingTable > thead > tr > th")

# print(soup_allData)


# setData = []


# # print(soup_body)
# count=0

# for x in soup_body:
#     if count <= len(soup_body)-1:
#         dummy = {}
#         for y in soup_header:
#             dummy[y.get_text()] = soup_body[count].get_text()
#             count = count + 1
#         setData.append(dummy)

# print(setData)

# with open('data.json', 'w') as my_file:
#     json.dump(setData, my_file,indent = 4)
