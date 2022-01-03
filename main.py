import json
from sort import *
from search import recBinarySearch

with open('steam.json', 'r') as file:
    oldData = json.load(file)


# Vars for json file
# name = [x['name'] for x in oldData]
# release_date = [x['release_date'] for x in oldData]
# english = [x['english'] for x in oldData]
# developer = [x['developer'] for x in oldData]
# publisher = [x['publisher'] for x in oldData]
# platforms = [x['platforms'] for x in oldData]
# required_age = [x['required_age'] for x in oldData]
# categories = [x['categories'] for x in oldData]
# genres = [x['genres'] for x in oldData]
# steamspy_tags = [x['steamspy_tags'] for x in oldData]
# achievements = [x['achievements'] for x in oldData]
# positive_ratings = [x['positive_ratings'] for x in oldData]
# negative_ratings = [x['negative_ratings'] for x in oldData]
# median_playtime = [x['median_playtime'] for x in oldData]
# owners = [x['owners'] for x in oldData]
# price = [x['price'] for x in oldData]


nameData = mergeSort(oldData, 'name')
name = [x['name'] for x in nameData]
# print(name[6000:6100])
# print(recBinarySearch(nameData, 'Counter-Strike', 'name'))

appidData = mergeSort(oldData, 'appid')
appid = [x['appid'] for x in appidData]
# print(appid[:5])

playtimeData = mergeSort(oldData, 'average_playtime')
average_playtime = [x['average_playtime'] for x in playtimeData]
print(average_playtime[-5:])


