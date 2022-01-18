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
median,
filteredPlaytimes;
let histogramData = [];
let gameClicked = false;

// Load JSON file
request.open('GET', './data/myGames.json', false);
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
    newContainer.addEventListener('click', function () {
        let clickedGame = this.innerText.split('\n')[0];
        clickedGameData = recBinarySearch(names, clickedGame, 'name');
        thisGamePlayTimes = recBinarySearchID(playTimeData, clickedGameData.appID);
        filteredPlaytimes = calcDataSpread(thisGamePlayTimes.playTimes.filter(Boolean));
        standardDev = getStandardDeviation(filteredPlaytimes);
        median = getMedian(filteredPlaytimes);
        range = getRange(filteredPlaytimes);
        console.log(`The standard deviation is: ${standardDev} The mean is: ${mean} The median is: ${median} The range is: ${range}`);
        hideGames();
        showGameDetails();
        createHistogram(histogramData);
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
function showGameDetails() {
    const gameDetailsCont = document.createElement('div');
    gameDetailsCont.classList.add('gameDetailsContainer');

    const gameTitle = document.createElement('div');
    const gameTitleText = document.createTextNode(clickedGameData.name);
    gameTitle.appendChild(gameTitleText);
    gameTitle.classList.add('gameTitle')
    gameDetailsCont.appendChild(gameTitle);

    const gameChart = document.createElement('canvas');
    gameChart.setAttribute('id', 'myChart');
    const histogram = document.createElement('canvas');
    histogram.setAttribute('id', 'histogram')
    gameDetailsCont.appendChild(gameChart);
    gameDetailsCont.appendChild(histogram);

    mpContainer.appendChild(gameDetailsCont);
    createGameChart();
}

function hideGameDetails() {
    let gameDetailsCont = mpContainer.querySelectorAll('div');
    gameDetailsCont.forEach(element =>{
        element.remove();
    });
}

// Calculate standard deviation of an array
function getStandardDeviation (array) {
    const n = array.length;
    mean = Math.floor(array.reduce((a, b) => a + b) / n);
    return Math.floor(Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n));
}

// Calculate median of an array
function getMedian(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

function getRange (array) {
    const max = Math.max(...array);
    const min = Math.min(...array);
    return Math.floor(max - min);
}

// Create gaussian distribution chart for game
function createGameChart() {
    let data = [];

    let scaleFactor = 500;
    (mean = 12), (sigma = 4);

    for (x = 0; x < 25; x += 1) {
        let y = gaussian(x);
        data.push({ x: x, y: y * scaleFactor });
    }

    function gaussian(x) {
        let gaussianConstant = 1 / Math.sqrt(2 * Math.PI);
        x = (x - mean) / sigma;
        return (gaussianConstant * Math.exp(-0.5 * x * x)) / sigma;
    }

    let ctx = document.getElementById('myChart').getContext('2d');
    let myLineChart = new Chart('myChart', {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Median Playtime',
                    data: data,
                    backgroundColor: 'rgba(221, 44, 0, 0.2)',
                    borderColor: 'rgba(221, 44, 0, 1)',
                    borderWidth: 2,
                    showLine: true,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 5,
                    lineTension: 0.3
                },
            ],
        },
    });
}


function calcDataSpread (array) {
    let maxValue = Math.max(...array) / 60;
    let newArray = [];
    for(const k in array){
        let cvOne = array[k] / 60;
        if (cvOne >= 0 && cvOne <= (maxValue * 0.1)) {
            newArray.push(cvOne);
        } else continue;
    }
    let maxValueTwo = Math.max(...newArray);
    for(let i = 1; i < 11; i++) {
        if(i === 1) {
            histogramData.push({x:0, y: 0});
        } else {
            histogramData.push({x: Math.ceil(maxValueTwo * 0.1 * i), y: 0});
        }
    } 
    for(const j in newArray) {
        let cvTwo = newArray[j];
        if (cvTwo >= 0 && cvTwo <= (maxValueTwo * 0.1)) {
            histogramData[0]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.1) && cvTwo <= (maxValueTwo * 0.2)) {
            histogramData[1]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.2) && cvTwo <= (maxValueTwo * 0.3)) {
            histogramData[2]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.3) && cvTwo <= (maxValueTwo * 0.4)) {
            histogramData[3]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.4) && cvTwo <= (maxValueTwo * 0.5)) {
            histogramData[4]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.5) && cvTwo <= (maxValueTwo * 0.6)) {
            histogramData[5]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.6) && cvTwo <= (maxValueTwo * 0.7)) {
            histogramData[6]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.7) && cvTwo <= (maxValueTwo * 0.8)) {
            histogramData[7]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.8) && cvTwo <= (maxValueTwo * 0.9)) {
            histogramData[8]['y'] ++;
        }else if (cvTwo > (maxValueTwo * 0.9) && cvTwo <= maxValueTwo) {
            histogramData[9]['y'] ++;
        }     
    }
    return newArray;   
}

function createHistogram(array) {
    let labels = [];
    let data = [];
    for (const i in array) {
        labels.push(array[i]['x']);
    }
    for (const j in array) {
        data.push(array[j]['y']);
    }
    const ctx = document.getElementById('histogram').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Frequency',
                    data: data,
                    backgroundColor: 'rgba(221, 44, 0, 0.1)',
                    borderColor: 'rgba(221, 44, 0, 1)',
                    borderWidth: 2,
                    barPercentage: 1,
                    categoryPercentage: 1.0
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                  display: false
                },
                // tooltip: {
                //     callbacks: {
                //         title: (toolTipItem, data) => {
                //             let t = toolTipItem[0].x; // uses the x value of this point as the title
                //             return t;
                //         },
                //         label: (toolTipItem, data) => {
                //             let l = labels[toolTipItem.index];
                //             return l;
                //         }
                //     }
                // }
            },
            scales: {
                xAxes: {
                    display: false,
                    max: data[data.length - 1],
                },
                xAxes2: {
                    labels,
                    offset: false,
                    display: true,
                    max: data[data.length],
                    ticks: {
                        autoSkip: false,
                    },
                    title: {
                        display: true,
                        text: 'Playtimes in hours'
                    }
                },
                yAxes: {
                    ticks: {
                        beginAtZero: true,
                    },
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                },
            },
        },
    });
}