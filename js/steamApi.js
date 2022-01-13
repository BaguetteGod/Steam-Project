const SteamAPI = require('steamapi');
const steam = new SteamAPI('FD8B557124DE6B0353B2BA16F6A632C2');
const fs = require('fs');
const { setMaxListeners } = require('process');
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

// request.open('GET', 'playerData.json', false);
// request.send(null);
// let playerData = JSON.parse(request.responseText);

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

// && recBinarySearch(idData, friendTwo.steamID) !== false
// const addFriendsOwnedGames = async () => {
//     for (const i in friendData) {
//         const friend = friendData[i];
//         let ownedGames;
//         try {
//             ownedGames = await steam.getUserOwnedGames(friend.steamID);
//             console.log(ownedGames);
//         } catch (e) {
//             console.log(friend.steamID);
//             console.error(e);
//         } finally {
//             continue;
//         }
//     }
// }
// addFriendsOwnedGames();

// let player = [];
// const getFriendsOfFriends = async () => {
//     for (let i = 1; i < playerData.length; i++) {
//         console.log(playerData[i].steamID);
//         const playerSummary = await steam.getUserSummary(playerData[i].steamID);
//         if (playerSummary.visibilityState !== 3) {
//             continue
//         } else {
//             try {
//                 const moreFriends = await steam.getUserFriends(playerData[i].steamID);
//                 console.log(moreFriends);
//             } catch (e) {
//                 console.error(e);
//             } finally {
//                 continue
//             }

//         }
//         // playerData = moreFriends.map(f => ({steamID: f.steamID}));
//         // console.log(players)
//     }
//     // console.log(players);
// }

// const getFriendsOfFriends = async () => {
//     for (const i in playerData) {
//         const data = playerData[i];
//         let playerSummary;
//         try {
//             playerSummary = await steam.getUserSummary(data.steamID);
//             console.log(playerSummary);
//         } catch (err) {
//             console.warn('getUserSummary', err);
//             return;
//         }
        
//         if (playerSummary.visibilityState !== 3) continue;
        
//         try {
//             const moreFriends = await steam.getUserFriends(data.steamID);
//             console.log(moreFriends);
//         } catch (err) {
//             console.warn('getUserFriends', err);
//             return;
//         }
//     };
// }


// async function run () {
//     try {
//         await getFriendsOfFriends();
//     } catch (e) {
//         console.error(e);
//     } finally {
//         console.log('Fucking work');
//     } 
// }

// run();

// showFriends = async () => {
//     const badFriends = await steam.getUserSummary(newId);
//     console.log(badFriends);
//     const moreFriends = await steam.getUserFriends(newId);
//     console.log(moreFriends);
//     const goodId = await steam.getUserSummary(badId);
//     console.log(goodId);
//     // const badFriend = await steam.getUserFriends(badId);
//     // console.log(badFriend);
// }   

// showFriends();