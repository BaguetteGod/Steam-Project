const SteamAPI = require('steamapi');
const steam = new SteamAPI('FD8B557124DE6B0353B2BA16F6A632C2');
const fs = require('fs');
const mySteamID = '76561198016003691'

let request = new XMLHttpRequest();
request.open('GET', './data/steamIds.json', false);
request.send(null);
let idData = JSON.parse(request.responseText);

// Function to fetch current amount of online players for a game
const currentPlayersOnline = async (appId) => {
    const playersOnline = await steam.getGamePlayers(appId);
    return playersOnline;
}

request.open('GET', './data/playTimeData.json', false);
request.send(null);
let playTimeData = JSON.parse(request.responseText);

// Function to add own friend data to a json file
let myFriends = [];
const friendsToJson = async () => {
    const friends = await steam.getUserFriends(mySteamID);
    for (const i in friends) {
        const friend = friends[i];
        let playerSummary;
        let ownedGames;
        try {
            playerSummary = await steam.getUserSummary(friend.steamID);
            ownedGames = await steam.getUserOwnedGames(friend.steamID);
            myFriends.push({
                steamID: playerSummary.steamID, 
                nickname: playerSummary.nickname,
                avatar: playerSummary.avatar,
                url: playerSummary.url,                
                personaState: playerSummary.personaState, 
                visibilityState: playerSummary.visibilityState,
                ownedGames: ownedGames
            })
        } catch (e) {
            console.error(e);
        } finally {
            continue;
        }
    }
    const jsonContent = JSON.stringify(myFriends);
    fs.writeFile("./myFriends.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    })
}

let myOwnedGames = [];
const getOwnedGames = async () => {
    const ownedGames = mergeSort(await steam.getUserOwnedGames(mySteamID), 'playTime');
    for (const i in ownedGames) {
        const game = ownedGames[i];
        let gameData;
        try {
            gameData = await steam.getGameDetails(game.appID, false);
            myOwnedGames.push({
                appID: game.appID,
                name: game.name,
                playTime: game.playTime,
                logoURL: game.logoURL,
                headerImage: gameData.header_image,
                isFree: gameData.is_free,
                platforms: gameData.platforms,
                price: gameData.price_overview,
                tags: [gameData.genres, gameData.categories],
                publishers: gameData.publishers,
                releaseData: gameData.release_date
            })
        } catch (e) {
            console.error(e);
        } finally {
            continue;
        }
    }
    const jsonContent = JSON.stringify(myOwnedGames, null, 2);
    fs.writeFile("./myGames.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    })
}
// getOwnedGames();


// const sortedIdArray = mergeSort(idData, 'steamID');
// console.log(sortedIdArray)

// const uniqueValuesSet = new Set();

// const filteredArr = sortedIdArray.filter((obj) => {
//     // check if name property value is already in the set
//     const isPresentInSet = uniqueValuesSet.has(obj.steamID);
  
//     // add name property value to Set
//     uniqueValuesSet.add(obj.steamID);
  
//     // return the negated value of
//     // isPresentInSet variable
//     return !isPresentInSet;
// });
// const jsonContent = JSON.stringify(filteredArr);
// fs.writeFile("./data/SteamIds.json", jsonContent, 'utf8', function (err) {
//     if (err) {
//         return console.log(err);
//     }
// })
let playTimeGame = [];
const getplayTimeByID = async () => {
    let counter = 23999;
    for(const j in playTimeData){
        const loggedGame = playTimeData[j];
        playTimeGame.push(loggedGame);
    }
    for(let k = 23999; k < 100000; k++){
        const currentID = idData[k].steamID;
        counter +=1
        if(counter % 1000 ===0){
            console.log(counter);
        }
        const jsonContent = JSON.stringify(mergeSort(playTimeGame, 'appID'));
        fs.writeFile("./data/playTimeData.json", jsonContent, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        }) 
        const sortedArrOne = mergeSort(playTimeGame, 'appID');
        try{
            const ownedGames = await steam.getUserOwnedGames(currentID);
            for(const i in ownedGames){
                const gameData = ownedGames[i];
                const gameInList = recBinarySearchID(sortedArrOne, gameData.appID, 'appID');
                if(gameInList !== false){
                    gameInList['totalPlayTime'] = (gameInList.totalPlayTime + gameData.playTime);
                    gameInList['playTimes'].push(gameData.playTime);
                    gameInList['owners'] += 1;
                } else {
                    playTimeGame.push({
                        appID: gameData.appID,
                        name: gameData.name,
                        totalPlayTime: gameData.playTime,
                        playTimes: [gameData.playTime],
                        owners: 1
                    })
                }
            }
        } finally {
            continue;
        } 
    }
    console.log('Done');
}
// getplayTimeByID();


getMyPlayTime = async () => {
    const ownedGames = await steam.getUserOwnedGames(mySteamID);
    for(const i in ownedGames){
        const gameData = ownedGames[i];
        playTimeGame.push({
            appID: gameData.appID,
            name: gameData.name,
            totalPlayTime: gameData.playTime,
            playTimes: [gameData.playTime],
            owners: 1
        })
    }
    const jsonContent = JSON.stringify(mergeSort(playTimeGame, 'appID'));
    fs.writeFile("./data/playTimeData.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    }) 
}
// getMyPlayTime();

let steamIdArray = [];
const getSteamIDs = async () => {
    const sortedData = mergeSort(idData, 'steamID');
    for (const i in sortedData) {
        const friend = sortedData[i];
        steamIdArray.push({
            steamID: friend.steamID
        })
    }
    console.log(steamIdArray);
    for(const j in steamIdArray){
        const friendTwo = steamIdArray[j];
        try {
            const getFriends = await steam.getUserFriends(friendTwo.steamID);
            const newSort = mergeSort(steamIdArray, 'steamID')
            if(recBinarySearch(newSort, friendTwo.steamID) !== false) continue;
            else {
                for(const k in getFriends){
                    const friendThree = getFriends[k];
                    steamIdArray.push({
                        steamID: friendThree.steamID
                    })
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            continue;
        }
    }
    const jsonContent = JSON.stringify(steamIdArray);
    fs.writeFile("./data/SteamIds.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    })
    console.log(steamIdArray);
}
// getSteamIDs();