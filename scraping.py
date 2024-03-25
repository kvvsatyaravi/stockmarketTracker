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



