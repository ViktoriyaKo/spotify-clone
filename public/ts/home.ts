const asideBlock = document.querySelector('.aside-block') as HTMLDivElement;
const shadowAside = document.querySelector('.shadow-aside') as HTMLDivElement;
const openAside = document.querySelector('.open-aside') as HTMLDivElement;
console.log('test', openAside);
if (openAside) {
  console.log(openAside);
  openAside.addEventListener('click', () => {
    asideBlock.style.transform = 'translateX(0)';
    shadowAside.style.display = 'block';
  });
}

if (shadowAside) {
  shadowAside.addEventListener('click', () => {
    asideBlock.style.transform = 'translateX(-100%)';
    shadowAside.style.display = 'none';
  });
}
