import json

with open('steam.json', 'r') as file:
    data = []
    oldData = json.load(file)
    for x in oldData:
        data.append(x)
    print(data[0]['name'])