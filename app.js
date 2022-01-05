const navContainer = document.getElementById('navContainer');
const navElements = navContainer.getElementsByClassName('navElement');
const mpContainer = document.getElementById('mpContainer')

let request = new XMLHttpRequest();
request.open('GET', 'steam.json', false);
request.send(null);
let data = JSON.parse(request.responseText);

for (let i = 0; i < navElements.length; i++) {
    navElements[i].addEventListener('click', function() {
      let current = document.getElementsByClassName('active');
      current[0].className = current[0].className.replace(' active', '');
      this.className += ' active';
    });
};

// console.log(data[0]);

function addTitle (name) {
    const newTitle = document.createElement('div');
    const newContent = document.createTextNode(name)
    newTitle.appendChild(newContent);
    newTitle.classList.add('mpTitle')
    mpContainer.appendChild(newTitle)
}

function addInfo (playtime, tags, price) {
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
}

for (let i = 0; i < 10; i++) {
    addTitle(data[i]['name']);
    addInfo(data[i]['average_playtime'], data[i]['steamspy_tags'], data[i]['price'])
}