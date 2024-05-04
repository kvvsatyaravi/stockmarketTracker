import requests
import json
from .Functions import scrapingWebsite

def fetchBseAllData(bseAllData):
    payload = {}
    headers = {}
    setData = {}
    for i in bseAllData:
        response = requests.request("GET", i, headers=headers, data=payload)
        data = scrapingWebsite(response)
        setData.update(data)

    return setData

    
def fetchNseAllData(nseAllData):
    payload = {}
    headers = {}
    setData = {}
    for i in nseAllData:
        response = requests.request("GET", i, headers=headers, data=payload)
        data = scrapingWebsite(response)
        setData.update(data)

    return setData