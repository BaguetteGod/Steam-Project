// Variables
const navContainer = document.getElementById('navContainer');
const navElements = navContainer.getElementsByClassName('navElement');
const mpContainer = document.getElementById('mpContainer');
const gameContainers = mpContainer.getElementsByClassName('gameContainer')
const regex = /;/g;

let divs = ['mostplayed', 'planning', 'recommended', 'friends'];
let visibleId = null;
let priceText, playtimeText, clickedGameData;


// Load JSON file
request.open('GET', 'myGames.json', false);
request.send(null);
let data = JSON.parse(request.responseText);
let dataSize = data.length

// JSON sorted data variables
const names = mergeSort(data, 'name');
const totalPlaytime = data.reverse()

// Give the navbar highlight effects + show corresponding div
for (let i = 0; i < navElements.length; i++) {
    navElements[i].addEventListener('click', function () {
        let current = document.getElementsByClassName('active');
        current[0].className = current[0].className.replace(' active', '');
        this.className += ' active';
        show(divs[i])
    })
}

// Function to show div within maincontent
function show(id) {
    if (visibleId !== id) {
        visibleId = id;
    }
    hide();
}

// Function to hide other divs within maincontent
function hide() {
    let div, i, id;
    for (i = 0; i < divs.length; i++) {
        id = divs[i];
        div = document.getElementById(id);
        if (visibleId === id) {
            div.style.display = 'flex';
        } else {
            div.style.display = 'none';
        }
    }
}

// Functions to dynamically add data from JSON file to the maincontent section in most played
function addInfo(name, playtime, price, isFree, imgSrc) {
    const newContainer = document.createElement('a');
    newContainer.classList.add('gameContainer');
    newContainer.href = '#'

    const textContainer = document.createElement('div');
    textContainer.classList.add('textContainer')

    const newImage = document.createElement('img');
    newImage.classList.add('mpImage');
    newImage.src = imgSrc;
    newContainer.appendChild(newImage);

    const newTitle = document.createElement('div');
    const newContent = document.createTextNode(name);
    newTitle.appendChild(newContent);
    newTitle.classList.add('mpTitle');
    textContainer.appendChild(newTitle);

    const newPlaytime = document.createElement('div');
    if (playtime !== 0) {
        playtimeText = document.createTextNode(`Total playtime: ${Math.floor(playtime / 60)} hours`);
    } else {
        playtimeText = document.createTextNode(`Total playtime: ${playtime} hours`);
    }
    newPlaytime.appendChild(playtimeText);
    newPlaytime.classList.add('mpInfo');
    textContainer.appendChild(newPlaytime);

    const newTags = document.createElement('div');
    const tagText = document.createTextNode('Platforms: Windows, Mac, Linux');
    newTags.appendChild(tagText);
    newTags.classList.add('mpInfo');
    textContainer.appendChild(newTags);

    const newPrice = document.createElement('div');
    if (price === 'Not Available') {
        priceText = document.createTextNode('Not Available');
    } if (isFree === true) {
        priceText = document.createTextNode('Free to play');
    } else {
        priceText = document.createTextNode(`${price}`);
    }
    newPrice.appendChild(priceText);
    newPrice.classList.add('mpInfo');
    textContainer.appendChild(newPrice);

    newContainer.appendChild(textContainer);
    mpContainer.appendChild(newContainer);
}

// Function to dynamically add data to maincontent
function showGames() {
    for (const i in totalPlaytime) {
        let name = totalPlaytime[i].name
        let timePlayed = totalPlaytime[i].playTime
        let priceUSD = totalPlaytime[i].price
        let freeToPlay = totalPlaytime[i].isFree
        let imgSource = totalPlaytime[i].headerImage
        // console.log(imgSource);
        if(priceUSD === undefined) {
            addInfo(name, timePlayed, 'Not Available', freeToPlay, imgSource);
        } else {
            addInfo(name, timePlayed, priceUSD.final_formatted, freeToPlay, imgSource);
        }
    }
}
showGames();

// For loop to get name of clicked game in most played, and return object with data for that game
for (let i = 0; i < gameContainers.length; i++) {
    gameContainers[i].addEventListener('click', function () {
        let clickedGame = this.innerText.split('\n')[0];
        clickedGameData = recBinarySearch(names, clickedGame);
        hideGames();
        showGameDetails();
    })
}

// Function to hide most played games
function hideGames() {
    let games = mpContainer.querySelectorAll('a');
    games.forEach(element => {
        element.remove();
    });
}

// Function to show details of clicked game in most played
function showGameDetails() {
    const gameDetailsCont = document.createElement('div');
    gameDetailsCont.classList.add('gameDetailsContainer');

    const gameTitle = document.createElement('div');
    const gameTitleText = document.createTextNode(clickedGameData.name);
    gameTitle.appendChild(gameTitleText);
    gameTitle.classList.add('gameTitle')

    gameDetailsCont.appendChild(gameTitle);
    mpContainer.appendChild(gameDetailsCont);
}

function hideGameDetails() {
    let gameDetailsCont = mpContainer.querySelectorAll('div');
    gameDetailsCont.forEach(element =>{
        element.remove();
    });
}