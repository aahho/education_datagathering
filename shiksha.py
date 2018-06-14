import requests

URL = "https://www.shiksha.com/b-tech/colleges/b-tech-colleges-india"

response = requests.get(URL)
print(response, dir(response))
print(response.content)

