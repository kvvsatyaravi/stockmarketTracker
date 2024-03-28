from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
chrome_options = Options()
#chrome_options.add_argument("--disable-extensions")
#chrome_options.add_argument("--disable-gpu")
#chrome_options.add_argument("--no-sandbox") # linux only
chrome_options.add_argument("--headless")
chrome_options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=chrome_options)
dataTags = []

urls = ["https://www.moneycontrol.com/markets/indian-indices/","https://www.moneycontrol.com/markets/indian-indices/top-nseit-companies-list/19?classic=true&categoryId=2&ex=N"]

for i in urls:

    driver.get(i)
    soup = BeautifulSoup(driver.page_source,'lxml')

    soup_body = soup.select("#indicesTableData tr td")
    dataTags = soup_body + dataTags
# print(html)
print(dataTags)

# Get the page source after interactions
# element = driver.find_element(By.ID, "indicesTableData")
# print(element)
# Parse the page source with Beautiful Soup

driver.quit()