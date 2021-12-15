import json

with open('steam.json', 'r') as file:
    data = []
    oldData = json.load(file)

# Variabele maken voor de informatie in json file
appid = [x['appid'] for x in oldData]
name = [x['name'] for x in oldData]
release_date = [x['release_date'] for x in oldData]
# ...

def sort(list):
    return sorted(list)

