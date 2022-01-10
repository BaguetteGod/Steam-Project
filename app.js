// Variables
const navContainer = document.getElementById('navContainer');
const navElements = navContainer.getElementsByClassName('navElement');
const mpContainer = document.getElementById('mpContainer');

const regex = /;/g;

let divs = ['mostplayed', 'planning', 'recommended', 'friends'];
let visibleId = null;

// Load JSON file
let request = new XMLHttpRequest();
request.open('GET', 'steam.json', false);
request.send(null);
let data = JSON.parse(request.responseText);
let dataSize = data.length

// JSON sorted data variables
const names = mergeSort(data, 'name');
const mpSorted = mergeSort(data, 'average_playtime').reverse()

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
    var div, i, id;
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
function addInfo(name, playtime, tags, price) {
    const newContainer = document.createElement('div');
    newContainer.classList.add('gameContainer');

    const newTitle = document.createElement('div');
    const newContent = document.createTextNode(name);
    newTitle.appendChild(newContent);
    newTitle.classList.add('mpTitle');
    newContainer.appendChild(newTitle);

    const newPlaytime = document.createElement('div');
    const playtimeText = document.createTextNode(`Average playtime: ${playtime} hours`);
    newPlaytime.appendChild(playtimeText);
    newPlaytime.classList.add('mpInfo');
    newContainer.appendChild(newPlaytime);

    const newTags = document.createElement('div');
    const tagText = document.createTextNode(`Tags: ${tags}`);
    newTags.appendChild(tagText);
    newTags.classList.add('mpInfo');
    newContainer.appendChild(newTags);

    const newPrice = document.createElement('div');
    const priceText = document.createTextNode(`Price: ${price}€`);
    newPrice.appendChild(priceText);
    newPrice.classList.add('mpInfo');
    newContainer.appendChild(newPrice);

    mpContainer.appendChild(newContainer);
}

// For loop to execute functions to dynamically add data to maincontent
for (let i = 0; i < 10; i++) {
    let tag = mpSorted[0].steamspy_tags;
    let newTag = tag.replace(regex, ', ');
    addInfo(mpSorted[i].name, mpSorted[i].average_playtime, newTag, mpSorted[i].price);
}

