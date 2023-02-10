const changingIcons = document.querySelectorAll('.changing-icon');

for(let icon of changingIcons) {
  icon.addEventListener('click', () => {
    icon.classList.toggle('active-icon');
  })
}