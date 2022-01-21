// Variables
const navContainer = document.getElementById('navContainer');
const navElements = navContainer.getElementsByClassName('navElement');
const mpContainer = document.getElementById('mpContainer');
const gameContainers = mpContainer.getElementsByClassName('gameContainer')
const regex = /;/g;

let divs = ['mostplayed', 'planning', 'recommended', 'friends'];
let visibleId = null;
let priceText, 
playtimeText, 
clickedGameData, 
thisGamePlayTimes, 
mean, 
standardDev,
variance,
median,
filteredPlaytimes,
gameInfo;
let histogramData = [];
let gameClicked = false;

// Load JSON file
request.open('GET', './data/myGames.json', false);
request.send(null);
let data = JSON.parse(request.responseText);
let dataSize = data.length

// JSON sorted data variables
const names = mergeSort(playTimeData, 'name');
const totalPlaytime = data.reverse()

// Give the navbar highlight effects + show corresponding div
for (let i = 0; i < navElements.length; i++) {
    navElements[i].addEventListener('click', function () {
        let current = document.getElementsByClassName('active');
        current[0].className = current[0].className.replace(' active', '');
        this.className += ' active';
        show(divs[i]);
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
function addInfo(name, playtime, currentOnline, platforms, imgSrc) {
    if(gameClicked === true) return;
    const newContainer = document.createElement('a');
    newContainer.classList.add('gameContainer');
    newContainer.href = '#'

    const windowsLogo = document.createElement('img');
    windowsLogo.src = './assets/windows-10-white.png'
    const macLogo = document.createElement('img');
    macLogo.src = './assets/apple-logo-white.png'
    const linuxLogo = document.createElement('img');
    linuxLogo.src = './assets/linux-white.png'

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

    const platformLogos = document.createElement('div');
    if (platforms === 1) {
        platformLogos.appendChild(windowsLogo);
    } else if (platforms === 2) {
        platformLogos.appendChild(windowsLogo);
        platformLogos.appendChild(macLogo);
    } else {
        platformLogos.appendChild(windowsLogo);
        platformLogos.appendChild(macLogo);
        platformLogos.appendChild(linuxLogo);

    }
    platformLogos.classList.add('mpPlatforms');
    textContainer.appendChild(platformLogos);

    const newPlaytime = document.createElement('div');
    if (playtime !== 0) {
        playtimeText = document.createTextNode(`Total playtime: ${Math.floor(playtime / 60)} hours`);
    } else {
        playtimeText = document.createTextNode(`Total playtime: ${playtime} hours`);
    }
    newPlaytime.appendChild(playtimeText);
    newPlaytime.classList.add('mpInfo');
    textContainer.appendChild(newPlaytime);

    const newOnline = document.createElement('div');
    const onlineText = document.createTextNode(`Players Online: ${currentOnline}`);
    newOnline.appendChild(onlineText);
    newOnline.classList.add('mpOnline');
    newContainer.appendChild(textContainer);
    newContainer.appendChild(newOnline);
    newContainer.addEventListener('click', async function () {
        let clickedGame = this.innerText.split('\n')[0];
        clickedGameData = recBinarySearch(names, clickedGame, 'name');
        filteredPlaytimes = calcDataSpread(clickedGameData.playTimes.filter(Boolean));
        standardDev = getStandardDeviation(filteredPlaytimes);
        median = getMedian(filteredPlaytimes);
        range = getRange(filteredPlaytimes);
        gameInfo = await getGameInfoById(clickedGameData.appID);
        hideGames();
        setTimeout(showGameDetails, 600)
        gameClicked = true;
    });
    mpContainer.appendChild(newContainer);
}

// Function to dynamically add data to maincontent
const showGames = async () => {
    for (const i in totalPlaytime) {
        if(gameClicked === true) return;
        let platform = 0;
        for (const j in totalPlaytime[i].platforms) {
            if (totalPlaytime[i].platforms[j] === true)
            platform ++
        }
        let name = totalPlaytime[i].name;
        let timePlayed = totalPlaytime[i].playTime;
        let imgSource = totalPlaytime[i].headerImage;
        let app = totalPlaytime[i].appID;
        let current = await currentPlayersOnline(app);
        addInfo(name, timePlayed, current, platform, imgSource);
    }
}
showGames();

// Function to hide most played games
function hideGames() {
    let games = mpContainer.querySelectorAll('a');
    games.forEach(element => {
        element.remove();
    });
}

// Function to show details of clicked game in most played
const showGameDetails = async () => {
    const gameDetailsCont = document.createElement('div');
    gameDetailsCont.classList.add('gameDetailsContainer');

    const gameTitle = document.createElement('div');
    const gameTitleText = document.createTextNode(clickedGameData.name);
    gameTitle.appendChild(gameTitleText);
    gameTitle.classList.add('gameTitle')
    gameDetailsCont.appendChild(gameTitle);

    const gameInfoCont = document.createElement('div');
    gameInfoCont.classList.add('gameInfoCont');
    const gameInfoLeft = document.createElement('div');
    gameInfoLeft.classList.add('gameInfoLeft');
    const gameInfoRight = document.createElement('div');
    gameInfoRight.classList.add('gameInfoRight');

    const gameSlider = document.createElement('div');
    gameSlider.classList.add('slideshow-container');
    const dotsDiv = document.createElement('div');
    dotsDiv.classList.add('dotCont');
    let dotCount = 0;
    for(const i in gameInfo[0].screenshots) {
        let source = gameInfo[0].screenshots[i].path_thumbnail;
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('mySlides');
        const slideImg = document.createElement('img')
        slideImg.src = source;
        slideDiv.appendChild(slideImg);
        gameSlider.appendChild(slideDiv);
        const dot = document.createElement('span');
        dot.classList.add('dot')
        dotCount ++;
        dot.setAttribute('onclick', `currentSlide(${dotCount})`);
        dotsDiv.appendChild(dot);
    }
    
    const buttonPrev = document.createElement('a');
    const buttonPrevImg = document.createElement('img');
    buttonPrevImg.src = './assets/arrow-left.png';
    buttonPrev.appendChild(buttonPrevImg);
    buttonPrev.classList.add('prev');
    gameSlider.appendChild(buttonPrev);
    buttonPrev.onclick = function minSlides() {
        showSlides((slideIndex += -1));
    }
    const buttonNext = document.createElement('a');
    const buttonNextImg = document.createElement('img');
    buttonNextImg.src = './assets/arrow-right.png';
    buttonNext.appendChild(buttonNextImg);
    buttonNext.classList.add('next');
    gameSlider.appendChild(buttonNext);
    buttonNext.onclick = function plusSlides() {
        showSlides((slideIndex += 1));
    }
    
    gameInfoLeft.appendChild(gameSlider);
    gameInfoLeft.appendChild(dotsDiv);

    const gameInfoImg = document.createElement('img');
    gameInfoImg.classList.add('gameInfoImg');
    gameInfoImg.src = gameInfo[0].headerImage;
    const gameInfoDesc = document.createElement('div')
    const gameInfoDescText = document.createTextNode(gameInfo[0].description);
    gameInfoDesc.appendChild(gameInfoDescText);
    gameInfoDesc.classList.add('gameInfoDesc');
    const gameInfoRd = document.createElement('div');
    const gameInfoRdText = document.createTextNode(`RELEASE DATE: ${gameInfo[0].releaseDate.date}`);
    gameInfoRd.appendChild(gameInfoRdText);
    gameInfoRd.classList.add('gameInfoDesc');
    const gameInfoRevScore = document.createElement('div');
    const gameInfoRevText = document.createTextNode(`ALL REVIEWS: ${gameInfo[0].reviewScore}`);
    gameInfoRevScore.classList.add('gameInfoDesc');
    gameInfoRevScore.appendChild(gameInfoRevText);
    const gameInfoDevs = document.createElement('div');
    const gameInfoDevText = document.createTextNode('DEVELOPERS:');
    gameInfoDevs.classList.add('gameInfoDesc');
    gameInfoDevs.appendChild(gameInfoDevText);
    for(const dev in gameInfo[0].developers) {
        let devsLength = gameInfo[0].developers.length;
        let devText; 
        if(dev == (devsLength - 1)) {
            devText = document.createTextNode(` ${gameInfo[0].developers[dev]}`);
        } else {
           devText = document.createTextNode(` ${gameInfo[0].developers[dev]},`);
        }
        gameInfoDevs.appendChild(devText);
    }
    const gameInfoPubs = document.createElement('div');
    const gameInfoPubText = document.createTextNode('PUBLISHERS:');
    gameInfoPubs.classList.add('gameInfoDesc');
    gameInfoPubs.appendChild(gameInfoPubText);
    for(const pub in gameInfo[0].publishers) {
        let pubsLength = gameInfo[0].publishers.length;
        let pubText; 
        if(pub == (pubsLength - 1)) {
            pubText = document.createTextNode(` ${gameInfo[0].publishers[pub]}`);
        } else {
            pubText = document.createTextNode(` ${gameInfo[0].publishers[pub]},`);
        }
        gameInfoPubs.appendChild(pubText);
    }

    gameInfoRight.appendChild(gameInfoImg);
    gameInfoRight.appendChild(gameInfoDesc);
    gameInfoRight.appendChild(gameInfoRd);
    gameInfoRight.appendChild(gameInfoRevScore);
    gameInfoRight.appendChild(gameInfoDevs);
    gameInfoRight.appendChild(gameInfoPubs);

    gameInfoCont.appendChild(gameInfoLeft);
    gameInfoCont.appendChild(gameInfoRight);

    const gameChart = document.createElement('canvas');
    gameChart.setAttribute('id', 'myChart');
    const histogram = document.createElement('canvas');
    histogram.setAttribute('id', 'histogram')
    gameDetailsCont.appendChild(gameInfoCont);
    gameDetailsCont.appendChild(gameChart);
    gameDetailsCont.appendChild(histogram);
    // createHistogram(histogramData);

    const backgroundImg = document.createElement('img');
    backgroundImg.src = gameInfo[0].background;
    backgroundImg.classList.add('gameInfoBgImg')

    const backgroundGradient = document.createElement('div');
    backgroundGradient.classList.add('gameInfoGradient');

    mpContainer.appendChild(backgroundGradient);
    mpContainer.appendChild(backgroundImg);
    mpContainer.appendChild(gameDetailsCont);
    showSlides(slideIndex);
    setTimeout(function(){createGameChart(filteredPlaytimes)}, 500)
    setTimeout(function(){createHistogram(histogramData)}, 500)
}

function hideGameDetails() {
    let gameDetailsCont = mpContainer.querySelectorAll('div');
    gameDetailsCont.forEach(element =>{
        element.remove();
    });
}
let slideIndex = 1;

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName('mySlides');
    let dots = document.getElementsByClassName('dot');
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' current', '');
    }
    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].className += ' current';
}