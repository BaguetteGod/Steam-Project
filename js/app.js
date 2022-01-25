const steamapi = require("steamapi");

// Variables
const navContainer = document.getElementById('navContainer');
const navElements = navContainer.getElementsByClassName('navElement');
const mpContainer = document.getElementById('mpContainer');
const myGamesContainer = document.getElementById('myGamesContainer');
const backArrow = document.getElementById('navBack');
const gameContainers = mpContainer.getElementsByClassName('gameContainer');
const friendsContainer = document.getElementById('friendsContainer');
const friendsOnline = document.getElementById('friendsOnline');
const friendsOffline = document.getElementById('friendsOffline');

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

request.open('GET', './data/myFriends.json', false);
request.send(null);
let friendsData = JSON.parse(request.responseText);

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
    gameClicked = false;
    hideMainContent();
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
        }else if (visibleId === 'friends') {
            navFriendsClicked = true;
            navMpClicked = false;
            navMyGamesClicked = false;
            navRecomClicked = false;
        }
    }
    hide();
    if(visibleId === 'mostPlayed'){
        hideMainContent();
        showMostPlayedGames();
    }else if (visibleId === 'myGames') {
        hideMainContent();
        showMyGames();
    }else if (visibleId === 'friends') {
        hideMainContent();
        showFriends();
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
        playtimeText = document.createTextNode(`Community playtime: ${Math.floor(playtime / 60).toLocaleString()} hours`);
    }else{
        playtimeText = document.createTextNode(`Total playtime: ${Math.floor(playtime / 60).toLocaleString()} hours`);
    }
    newPlaytime.appendChild(playtimeText);
    newPlaytime.classList.add('mpInfo');
    textContainer.appendChild(newPlaytime);

    const newOnline = document.createElement('div');
    const onlineText = document.createTextNode(`Players Online: ${currentOnline.toLocaleString()}`);
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
        if(navFriendsClicked === true) return;
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
        if(navFriendsClicked === true) return;
        addInfo(name, timePlayed, current, platform, imgSource);
    }
}
showMostPlayedGames();

// Function to dynamically add data to my games maincontent
const showMyGames = async () => {
    for (const i in totalPlaytime) {
        if(gameClicked === true) return;
        if(navMpClicked === true) return;
        if(navFriendsClicked === true) return;
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
        if(navFriendsClicked === true) return;
        addInfo(name, timePlayed, current, platform, imgSource);
    }
}

// Function to hide content in main
function hideMainContent() {
    if(visibleId === 'mostPlayed') {
        while (mpContainer.firstChild) {
            mpContainer.removeChild(mpContainer.lastChild);
          }
    }else if(visibleId === 'myGames') {
        while (myGamesContainer.firstChild) {
            myGamesContainer.removeChild(myGamesContainer.lastChild);
          }
    }else if(visibleId === 'friends') {
        while (friendsOnline.firstChild) {
            friendsOnline.removeChild(friendsOnline.lastChild);
        }
        while (friendsOffline.firstChild) {
            friendsOffline.removeChild(friendsOffline.lastChild);
        }
    }
}

// Function to show details of clicked game in most played or my games
const showGameDetails = async () => {
    let playersNow;
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

    const gameStatsTitle = document.createElement('div')
    const gameStatsTitleText = document.createTextNode('Game stats');
    gameStatsTitle.appendChild(gameStatsTitleText);
    gameStatsTitle.classList.add('gameStatsTitle');
    const gameStats = document.createElement('div');
    gameStats.classList.add('gameStatsCont');
    const innerGameStatsLeft = document.createElement('div');
    innerGameStatsLeft.classList.add('innerGameStats');
    const innerGameStatsRight = document.createElement('div');
    innerGameStatsRight.classList.add('innerGameStats');
    gameStats.appendChild(innerGameStatsLeft);

    const gameStatsPlayTimeCount = document.createElement('div');
    const gameStatsPlayTimeCountText = document.createTextNode(`${Math.floor(clickedGameData.totalPlayTime / 60).toLocaleString()}`);
    gameStatsPlayTimeCount.appendChild(gameStatsPlayTimeCountText);
    gameStatsPlayTimeCount.classList.add('gameStatsInnerTextStats');
    innerGameStatsLeft.appendChild(gameStatsPlayTimeCount);
    const gameStatsPlayTime = document.createElement('div');
    const gameStatsPlayTimeText = document.createTextNode('hours of community playtime')
    gameStatsPlayTime.appendChild(gameStatsPlayTimeText);
    gameStatsPlayTime.classList.add('gameStatsInnerTextTitle');
    innerGameStatsLeft.appendChild(gameStatsPlayTime);

    playersNow = await currentPlayersOnline(gameInfo[0].appID)
    const gameStatsPlayersNow = document.createElement('div');
    const gameStatsPlayersNowText = document.createTextNode(`${playersNow.toLocaleString()}`);
    gameStatsPlayersNow.appendChild(gameStatsPlayersNowText);
    gameStatsPlayersNow.classList.add('gameStatsInnerTextStats');
    innerGameStatsLeft.appendChild(gameStatsPlayersNow);
    const gameStatsPlayersNowTitle = document.createElement('div');
    const gameStatsPlayersNowTitleText = document.createTextNode('players online right now');
    gameStatsPlayersNowTitle.appendChild(gameStatsPlayersNowTitleText);
    gameStatsPlayersNowTitle.classList.add('gameStatsInnerTextTitle');
    innerGameStatsLeft.appendChild(gameStatsPlayersNowTitle);

    const gameStatsOwners = document.createElement('div');
    const gameStatsOwnersText = document.createTextNode(`${clickedGameData.owners.toLocaleString()}`);
    gameStatsOwners.appendChild(gameStatsOwnersText);
    gameStatsOwners.classList.add('gameStatsInnerTextStats');
    innerGameStatsLeft.appendChild(gameStatsOwners);
    const gameStatsOwnersTitle = document.createElement('div');
    const gameStatsOwnersTitleText = document.createTextNode('game owners');
    gameStatsOwnersTitle.appendChild(gameStatsOwnersTitleText);
    gameStatsOwnersTitle.classList.add('gameStatsInnerTextTitle');
    innerGameStatsLeft.appendChild(gameStatsOwnersTitle);

    const gameStatsReviewsPercent = document.createElement('div');
    const gameStatsReviewsPercentText = document.createTextNode(`${(gameInfo[0].totalPositive / gameInfo[0].totalReviews * 100).toFixed(2)}%`)
    gameStatsReviewsPercent.appendChild(gameStatsReviewsPercentText);
    gameStatsReviewsPercent.classList.add('gameStatsInnerTextStats');
    innerGameStatsLeft.appendChild(gameStatsReviewsPercent);
    const gameStatsReviewsPercentTitle = document.createElement('div');
    const gameStatsReviewsPercentTitleText = document.createTextNode('positive reviews');
    gameStatsReviewsPercentTitle.appendChild(gameStatsReviewsPercentTitleText);
    gameStatsReviewsPercentTitle.classList.add('gameStatsInnerTextTitle');
    innerGameStatsLeft.appendChild(gameStatsReviewsPercentTitle);

    gameStats.appendChild(innerGameStatsRight);
    const donutChart = document.createElement('canvas');
    donutChart.setAttribute('id', 'donut');
    innerGameStatsRight.appendChild(donutChart);
    const gameChartTitle = document.createElement('div');
    const gameChartTitleText = document.createTextNode('Playtime distribution');
    gameChartTitle.appendChild(gameChartTitleText);
    gameChartTitle.classList.add('gameStatsTitle')
    const gameChart = document.createElement('canvas');
    gameChart.setAttribute('id', 'myChart');

    const statisticalDisp = document.createElement('div');
    const statisticalDispText = document.createTextNode('Measures of dispersion (hours)');
    statisticalDisp.appendChild(statisticalDispText);
    statisticalDisp.classList.add('gameStatsTitle')
    const statDispCont = document.createElement('div');
    statDispCont.classList.add('gameStatsContTwo');
    const statDispInner = document.createElement('div');
    statDispInner.classList.add('innerGameStatsTwo');
    statDispCont.appendChild(statDispInner);
    const statDispInnerTwo = document.createElement('div');
    statDispInnerTwo.classList.add('innerGameStatsTwo');
    statDispCont.appendChild(statDispInnerTwo);
    const statDispInnerThree = document.createElement('div');
    statDispInnerThree.classList.add('innerGameStatsTwo');
    statDispCont.appendChild(statDispInnerThree);
    const statDispInnerFour = document.createElement('div');
    statDispInnerFour.classList.add('innerGameStatsTwo');
    statDispCont.appendChild(statDispInnerFour);

    const statRange = document.createElement('div');
    const statRangeText = document.createTextNode(`${range.toLocaleString()}`);
    statRange.appendChild(statRangeText);
    statRange.classList.add('gameStatsInnerTextStats');
    statDispInner.appendChild(statRange);
    const statRangeTitle = document.createElement('div');
    const statRangeTitleText = document.createTextNode('playtime range');
    statRangeTitle.appendChild(statRangeTitleText);
    statRangeTitle.classList.add('gameStatsInnerTextTitleTwo')
    statDispInner.appendChild(statRangeTitle);

    const statDeviation = document.createElement('div');
    const statDeviationText = document.createTextNode(`${standardDev.toLocaleString()}`);
    statDeviation.appendChild(statDeviationText);
    statDeviation.classList.add('gameStatsInnerTextStats');
    statDispInnerTwo.appendChild(statDeviation);
    const statDeviationTitle = document.createElement('div');
    const statDeviationTitleText = document.createTextNode('standard deviation');
    statDeviationTitle.appendChild(statDeviationTitleText);
    statDeviationTitle.classList.add('gameStatsInnerTextTitleTwo');
    statDispInnerTwo.appendChild(statDeviationTitle);

    const statAveragePlay = document.createElement('div');
    const statAveragePlayText = document.createTextNode(`${mean.toLocaleString()}`);
    statAveragePlay.appendChild(statAveragePlayText);
    statAveragePlay.classList.add('gameStatsInnerTextStats');
    statDispInnerThree.appendChild(statAveragePlay);
    const statAveragePlayTitle = document.createElement('div');
    const statAveragePlayTitleText = document.createTextNode('average playtime');
    statAveragePlayTitle.appendChild(statAveragePlayTitleText);
    statAveragePlayTitle.classList.add('gameStatsInnerTextTitleTwo');
    statDispInnerThree.appendChild(statAveragePlayTitle);

    const statMedianPlay = document.createElement('div');
    const statMedianPlayText = document.createTextNode(`${Math.floor(median).toLocaleString()}`);
    statMedianPlay.appendChild(statMedianPlayText);
    statMedianPlay.classList.add('gameStatsInnerTextStats');
    statDispInnerFour.appendChild(statMedianPlay);
    const statMedianPlayTitle = document.createElement('div');
    const statMedianPlayTitleText = document.createTextNode('median playtime');
    statMedianPlayTitle.appendChild(statMedianPlayTitleText);
    statMedianPlayTitle.classList.add('gameStatsInnerTextTitleTwo');
    statDispInnerFour.appendChild(statMedianPlayTitle);

    const histogramTitle = document.createElement('div');
    const histogramTitleText = document.createTextNode('Playtime frequency');
    histogramTitle.appendChild(histogramTitleText);
    histogramTitle.classList.add('gameStatsTitle');
    const histogram = document.createElement('canvas');
    histogram.setAttribute('id', 'histogram')
    gameDetailsCont.appendChild(gameInfoCont);
    gameDetailsCont.appendChild(gameStatsTitle);
    gameDetailsCont.appendChild(gameStats);
    gameDetailsCont.appendChild(gameChartTitle);
    gameDetailsCont.appendChild(gameChart);
    gameDetailsCont.appendChild(statisticalDisp);
    gameDetailsCont.appendChild(statDispCont);
    gameDetailsCont.appendChild(histogramTitle);
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

// Function to show friends
const appendFriends = async (name, img, state) => {
    let friendStatusText;
    const friendCont = document.createElement('a');
    friendCont.classList.add('friendCont');
    friendCont.href = '#';

    const friendImage = document.createElement('img');
    friendImage.src = img
    friendImage.classList.add('friendImage');
    friendCont.appendChild(friendImage);

    const friendInfoCont = document.createElement('div');
    friendInfoCont.classList.add('friendInfoCont');
    friendCont.appendChild(friendInfoCont);

    const friendName = document.createElement('div');
    const friendNameText = document.createTextNode(name);
    friendName.appendChild(friendNameText);
    if (state === 0) friendName.classList.add('friendNameOffline');
    else if (state === 1) friendName.classList.add('friendName');
    else friendName.classList.add('friendNameOther');
    friendInfoCont.appendChild(friendName);

    const friendStatus = document.createElement('div');
    if (state === 0) friendStatusText = document.createTextNode('Offline');
    else if (state === 1) friendStatusText = document.createTextNode('Online');
    else if (state === 2) friendStatusText = document.createTextNode('Busy');
    else if (state === 3) friendStatusText = document.createTextNode('Away');
    else if (state === 4) friendStatusText = document.createTextNode('Snooze');
    else if (state === 5) friendStatusText = document.createTextNode('Looking to trade');
    else if (state === 6) friendStatusText = document.createTextNode('Looking to play');
    friendStatus.appendChild(friendStatusText);
    if (state === 0) friendStatus.classList.add('friendStatusOffline');
    else if (state === 1) friendStatus.classList.add('friendStatus');
    else friendStatus.classList.add('friendStatusOther');
    friendInfoCont.appendChild(friendStatus);

    if (state === 0) {
        friendsOffline.appendChild(friendCont);
    } else {
        friendsOnline.appendChild(friendCont);
    }
}


let friendsList = []
const fetchFriends = async () => {
    for(const i in friendsData){
        let friendID = friendsData[i];
        let friend = await steam.getUserSummary(friendID.steamID);
        friendsList.push(friend);
    }
    friendsList = mergeSort(friendsList, 'personaState');
}
fetchFriends();

const showFriends = async () => {
    const onlineText = document.createElement('div');
    const onlineTextText = document.createTextNode('Online Friends');
    onlineText.appendChild(onlineTextText);
    onlineText.classList.add('textOnline');
    const offlineText = document.createElement('div');
    const offlineTextText = document.createTextNode('Offline Friends');
    offlineText.appendChild(offlineTextText);
    offlineText.classList.add('textOffline');
    friendsOnline.appendChild(onlineText);
    friendsOffline.appendChild(offlineText);

    for(const i in friendsList){
        let friend = friendsList[i];
        let name = friend.nickname;
        let avatar = friend.avatar.large;
        let state = friend.personaState;
        appendFriends(name, avatar, state)
    }
}