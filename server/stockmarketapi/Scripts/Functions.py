from bs4 import BeautifulSoup
import requests


def fetchExchangeData(urlsArr):
    payload = {}
    headers = {}
    setData = {}
    for i in urlsArr:
        response = requests.request("GET", i, headers=headers, data=payload)
        data = scrapingWebsite(response)
        setData.update(data)

    return setData

def scrapingWebsite(response):

    soup_allData = BeautifulSoup(response.text, 'html.parser')

    for eachElement in soup_allData.find_all('th'):
        if eachElement.get_text().strip() == 'Analysis'  or eachElement.get_text().strip() == 'Technical Rating':
            eachElement.decompose()

    
    for eachElement in soup_allData.find_all('td'):
        if eachElement.button  or (eachElement.a and eachElement.a.attrs['href'] == "javascript:;"):
            eachElement.decompose()

    soup_header = soup_allData.select("table > thead > tr > th")
    soup_body = soup_allData.select('tbody > tr > td')

    setData = {}
    count=0

    # print(soup_body)

    for x in soup_body:
        if count <= len(soup_body)-1:
            dummy = {}
            for y in soup_header:
                if soup_body[count].a:
                    # link = soup_body[count].a['href']
                    # name = link.replace("https://www.moneycontrol.com/india/stockpricequote/","")
                    # name = name.split("/")
                    # # print(name[1])
                    # if name[1]:
                    #     dummy[y.get_text().strip()] = name[1]
                    #     count = count + 1
                    dummy[y.get_text().strip()] = soup_body[count].get_text().replace('/n','').replace(' Ltd.','').strip()
                    count = count + 1
                else:
                    dummy[y.get_text().strip()] = soup_body[count].get_text().replace('/n','').strip()
                    count = count + 1
            
            setData[dummy['Name']] = dummy

        # print(setData)
    
    return setData