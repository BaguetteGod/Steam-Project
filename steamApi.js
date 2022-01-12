const SteamAPI = require('steamapi');
const steam = new SteamAPI('FD8B557124DE6B0353B2BA16F6A632C2');
const fs = require('fs');
const mySteamID = '76561198016003691'

let request = new XMLHttpRequest();
// request.open('GET', 'myFriends.json', false);
// request.send(null);
// let friendData = JSON.parse(request.responseText);

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
// friendsToJson();


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