const SteamAPI = require('steamapi');
const steam = new SteamAPI('FD8B557124DE6B0353B2BA16F6A632C2');

steam.resolve('https://steamcommunity.com/profiles/76561198016003691/').then(id => {
    console.log(id);
});

steam.getUserFriends('76561198016003691').then(friendslist => {
    console.log(friendslist);
}).catch(e => {
    console.log(e);
});