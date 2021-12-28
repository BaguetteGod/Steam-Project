import json
from sort import *
from search import recBinarySearch

with open('steam.json', 'r') as file:
    oldData = json.load(file)


# Vars for json file
appid = [x['appid'] for x in oldData]
name = [x['name'] for x in oldData]
release_date = [x['release_date'] for x in oldData]
english = [x['english'] for x in oldData]
developer = [x['developer'] for x in oldData]
publisher = [x['publisher'] for x in oldData]
platforms = [x['platforms'] for x in oldData]
required_age = [x['required_age'] for x in oldData]
categories = [x['categories'] for x in oldData]
genres = [x['genres'] for x in oldData]
steamspy_tags = [x['steamspy_tags'] for x in oldData]
achievements = [x['achievements'] for x in oldData]
positive_ratings = [x['positive_ratings'] for x in oldData]
negative_ratings = [x['negative_ratings'] for x in oldData]
average_playtime = [x['average_playtime'] for x in oldData]
median_playtime = [x['median_playtime'] for x in oldData]
owners = [x['owners'] for x in oldData]
price = [x['price'] for x in oldData]


newData = mergeSort(oldData, 'name')
print(recBinarySearch(newData, 'Counter-Strike', 'name'))

