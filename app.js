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

// Give the navbar highlight effects + show corresponding div
for (let i = 0; i < navElements.length; i++) {
    navElements[i].addEventListener('click', function () {
        let current = document.getElementsByClassName('active');
        current[0].className = current[0].className.replace(' active', '');
        this.className += ' active';
        show(divs[i])
    });
};

// Function to show div within maincontent
function show(id) {
    if (visibleId !== id) {
        visibleId = id;
    }
    hide();
};

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
};

// Functions to dynamically add data from JSON file to the maincontent section
function addTitle(name) {
    const newTitle = document.createElement('div');
    const newContent = document.createTextNode(name);
    newTitle.appendChild(newContent);
    newTitle.classList.add('mpTitle');
    mpContainer.appendChild(newTitle);
};

function addInfo(playtime, tags, price) {
    const newPlaytime = document.createElement('div');
    const playtimeText = document.createTextNode(`Average playtime: ${playtime} hours`);
    newPlaytime.appendChild(playtimeText);
    newPlaytime.classList.add('mpInfo');
    mpContainer.appendChild(newPlaytime);

    const newTags = document.createElement('div');
    const tagText = document.createTextNode(`Tags: ${tags}`);
    newTags.appendChild(tagText);
    newTags.classList.add('mpInfo');
    mpContainer.appendChild(newTags);

    const newPrice = document.createElement('div');
    const priceText = document.createTextNode(`Price: ${price}€`);
    newPrice.appendChild(priceText);
    newPrice.classList.add('mpInfo');
    mpContainer.appendChild(newPrice);
};

// For loop to execute functions to dynamically add data to maincontent
for (let i = 0; i < 10; i++) {
    let tag = data[0].steamspy_tags;
    let newTag = tag.replace(regex, ', ');
    addTitle(data[i].name);
    addInfo(data[i].average_playtime, newTag, data[i].price);
};
