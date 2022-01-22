// Variables
const navContainer = document.getElementById('navContainer');
const navElements = navContainer.getElementsByClassName('navElement');
const mpContainer = document.getElementById('mpContainer');
const myGamesContainer = document.getElementById('myGamesContainer');
const backArrow = document.getElementById('navBack');
const gameContainers = mpContainer.getElementsByClassName('gameContainer');
const regex = /;/g;

let divs = ['mostPlayed', 'myGames', 'recommended', 'friends'];
let visibleId = 'mostPlayed';
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
let navMpClicked = false;
let navMyGamesClicked = false;
let navRecomClicked = false;
let navFriendsClicked = false;

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

// Event listener for the back arrow
backArrow.addEventListener('click', function () {
    if(gameClicked === true) {
        gameClicked = false
        if(visibleId === 'mostPlayed') {
            hideMainContent();
            showMostPlayedGames();
        }else if(visibleId === 'myGames') {
            hideMainContent();
            showMyGames();
        }
    } else {
        return;
    }
})

// Function to show div within maincontent
function show(id) {
    if (visibleId !== id) {
        visibleId = id;
        if(visibleId === 'mostPlayed') {
            navMpClicked = true;
            navMyGamesClicked = false;
            navRecomClicked = false;
            navFriendsClicked = false;
        }else if (visibleId === 'myGames') {
            navMyGamesClicked = true
            navMpClicked = false;
            navRecomClicked = false;
            navFriendsClicked = false;
        }  
    }
    hide();
    if(visibleId === 'mostPlayed'){
        hideMainContent();
        showMostPlayedGames();
    } else if (visibleId === 'myGames') {
        hideMainContent();
        showMyGames();
    }
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
    if(visibleId === 'mostPlayed') {
        playtimeText = document.createTextNode(`Community playtime: ${Math.floor(playtime / 60)} hours`);
    }else{
        playtimeText = document.createTextNode(`Total playtime: ${Math.floor(playtime / 60)} hours`);
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
        hideMainContent();
        setTimeout(showGameDetails, 600)
        gameClicked = true;
    });
    if(visibleId === 'mostPlayed') {
        mpContainer.appendChild(newContainer);
    } else if(visibleId === 'myGames') {
        myGamesContainer.appendChild(newContainer)
    }
    
}

// Function to dynamically add data to most played games maincontent
const showMostPlayedGames = async () => {
    for (let i = 0; i < 50; i++) {
        if(gameClicked === true) return;
        if(navMyGamesClicked === true) return;
        let platform = 0;
        for (const j in playTimeData[i].platforms) {
            if (playTimeData[i].platforms[j] === true)
            platform ++;
        }
        let name = playTimeData[i].name;
        let timePlayed = playTimeData[i].totalPlayTime;
        let imgSource = playTimeData[i].headerImage;
        let app = playTimeData[i].appID;
        let current = await currentPlayersOnline(app);
        if(navMyGamesClicked === true) return;
        addInfo(name, timePlayed, current, platform, imgSource);
    }
}
showMostPlayedGames();

// Function to dynamically add data to my games maincontent
const showMyGames = async () => {
    for (const i in totalPlaytime) {
        if(gameClicked === true) return;
        if(navMpClicked === true) return;
        let platform = 0;
        for (const j in totalPlaytime[i].platforms) {
            if (totalPlaytime[i].platforms[j] === true)
            platform ++;
        }
        let name = totalPlaytime[i].name;
        let timePlayed = totalPlaytime[i].playTime;
        let imgSource = totalPlaytime[i].headerImage;
        let app = totalPlaytime[i].appID;
        let current = await currentPlayersOnline(app);
        if(navMpClicked === true) return;
        addInfo(name, timePlayed, current, platform, imgSource);
    }
}

// Function to hide content in main
function hideMainContent() {
    if(visibleId === 'mostPlayed') {
        while (mpContainer.firstChild) {
            mpContainer.removeChild(mpContainer.lastChild);
          }
    } else if(visibleId === 'myGames'){
        while (myGamesContainer.firstChild) {
            myGamesContainer.removeChild(myGamesContainer.lastChild);
          }
    }
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
    const gameInfoRightCont = document.createElement('div');
    gameInfoRightCont.classList.add('gameInfoRightCont');
    const gameInfoRightContLeft = document.createElement('div')
    gameInfoRightContLeft.classList.add('gameInfoRightContLeft');
    const gameInfoRightContRight = document.createElement('div');
    gameInfoRightContRight.classList.add('gameInfoRightContRight');

    const gameInfoRdLeft = document.createElement('div');
    const gameInfoRdTextLeft = document.createTextNode('RELEASE DATE:');
    gameInfoRdLeft.appendChild(gameInfoRdTextLeft);
    gameInfoRightContLeft.appendChild(gameInfoRdLeft);
    const gameInfoRdRight = document.createElement('div');
    const gameInfoRdTextRight = document.createTextNode(gameInfo[0].releaseDate.date);
    gameInfoRdRight.appendChild(gameInfoRdTextRight);
    gameInfoRightContRight.appendChild(gameInfoRdRight);

    const gameInfoRevScoreLeft = document.createElement('div');
    const gameInfoRevTextLeft = document.createTextNode('ALL REVIEWS:');
    gameInfoRevScoreLeft.appendChild(gameInfoRevTextLeft);
    gameInfoRightContLeft.appendChild(gameInfoRevScoreLeft);
    const gameInfoRevScoreRight = document.createElement('div');
    const gameInfoRevTextRight = document.createTextNode(gameInfo[0].reviewScore);
    gameInfoRevScoreRight.appendChild(gameInfoRevTextRight);
    gameInfoRightContRight.appendChild(gameInfoRevScoreRight);

    const gameInfoDevsLeft = document.createElement('div');
    const gameInfoDevTextLeft = document.createTextNode('DEVELOPERS:');
    gameInfoDevsLeft.appendChild(gameInfoDevTextLeft);
    gameInfoRightContLeft.appendChild(gameInfoDevsLeft);

    const gameInfoDevsRight = document.createElement('div');
    for(const dev in gameInfo[0].developers) {
        let devsLength = gameInfo[0].developers.length;
        let devText; 
        if(dev == (devsLength - 1)) {
            devText = document.createTextNode(` ${gameInfo[0].developers[dev]}`);
        } else {
           devText = document.createTextNode(` ${gameInfo[0].developers[dev]},`);
        }
        gameInfoDevsRight.appendChild(devText);
    }
    gameInfoRightContRight.appendChild(gameInfoDevsRight);

    const gameInfoPubsLeft = document.createElement('div');
    const gameInfoPubTextLeft = document.createTextNode('PUBLISHERS:');
    gameInfoPubsLeft.appendChild(gameInfoPubTextLeft);
    gameInfoRightContLeft.appendChild(gameInfoPubsLeft);

    const gameInfoPubsRight = document.createElement('div');
    for(const pub in gameInfo[0].publishers) {
        let pubsLength = gameInfo[0].publishers.length;
        let pubText; 
        if(pub == (pubsLength - 1)) {
            pubText = document.createTextNode(` ${gameInfo[0].publishers[pub]}`);
        } else {
            pubText = document.createTextNode(` ${gameInfo[0].publishers[pub]},`);
        }
        gameInfoPubsRight.appendChild(pubText);
    }
    gameInfoRightContRight.appendChild(gameInfoPubsRight);

    gameInfoRightCont.appendChild(gameInfoRightContLeft);
    gameInfoRightCont.appendChild(gameInfoRightContRight);

    gameInfoRight.appendChild(gameInfoImg);
    gameInfoRight.appendChild(gameInfoDesc);
    gameInfoRight.appendChild(gameInfoRightCont);

    gameInfoCont.appendChild(gameInfoLeft);
    gameInfoCont.appendChild(gameInfoRight);

    const donutChart = document.createElement('canvas');
    donutChart.setAttribute('id', 'donut');
    const gameChart = document.createElement('canvas');
    gameChart.setAttribute('id', 'myChart');
    const histogram = document.createElement('canvas');
    histogram.setAttribute('id', 'histogram')
    gameDetailsCont.appendChild(gameInfoCont);
    gameDetailsCont.appendChild(donutChart);
    gameDetailsCont.appendChild(gameChart);
    gameDetailsCont.appendChild(histogram);

    const backgroundImg = document.createElement('img');
    backgroundImg.src = gameInfo[0].background;
    backgroundImg.classList.add('gameInfoBgImg')

    const backgroundGradient = document.createElement('div');
    backgroundGradient.classList.add('gameInfoGradient');

    if(visibleId === 'mostPlayed') {
        mpContainer.appendChild(backgroundGradient);
        mpContainer.appendChild(backgroundImg);
        mpContainer.appendChild(gameDetailsCont);
    } else if(visibleId === 'myGames') {
        myGamesContainer.appendChild(backgroundGradient);
        myGamesContainer.appendChild(backgroundImg);
        myGamesContainer.appendChild(gameDetailsCont);
    }
    showSlides(slideIndex);
    setTimeout(function(){createDonutChart(gameInfo[0].totalPositive, gameInfo[0].totalNegative)}, 500)
    setTimeout(function(){createGameChart(filteredPlaytimes)}, 500)
    setTimeout(function(){createHistogram(histogramData)}, 500)
}

// Slider for game details functionality
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