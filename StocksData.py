from bs4 import BeautifulSoup
import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import datetime


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

responseData = {
    "result":"success",
    "data":Data,
    "stocksCount":len(Data),
    "lastUpdated":str(datetime.datetime.now())
}

with open('data.json', 'w') as my_file:
    json.dump(responseData, my_file,indent=4)


endTime = time.time()

# get the execution time
elapsed_time = int(endTime - startTime)
elapsed_time = str(datetime.timedelta(seconds=elapsed_time))
print('Execution time:', elapsed_time)
