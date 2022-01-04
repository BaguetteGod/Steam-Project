const navContainer = document.getElementById('navContainer')
const navElements = navContainer.getElementsByClassName('navElement')

for (let i = 0; i < navElements.length; i++) {
    navElements[i].addEventListener('click', function() {
      let current = document.getElementsByClassName('active');
      current[0].className = current[0].className.replace(' active', '');
      this.className += ' active';
    });
}

