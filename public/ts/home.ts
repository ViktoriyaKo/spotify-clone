import spotyApi from '../../spoApi/getCollections';

const asideBlock = document.querySelector('.aside-block') as HTMLDivElement;
const shadowAside = document.querySelector('.shadow-aside') as HTMLDivElement;
const openAside = document.querySelector('.open-aside') as HTMLDivElement;
const nav = document.querySelectorAll('nav .nav-link');
const tableLikePlaylist = document.querySelector('.table-like-playlist');

if (openAside) {
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
// navigation buttons:
if (nav) {
  nav.forEach((item) => {
    item.addEventListener('click', (e) => {
      nav.forEach((item) => {
        item.classList.remove('color-active');
      });
      if (!item.closest('.color-active')) {
        item.classList.add('color-active');
      }
    });
  });
}

if (tableLikePlaylist) {
  tableLikePlaylist.addEventListener('click', async (el) => {
    const target = el.target as HTMLElement;
    if (target.closest('.heart-svg-table')) {
      console.log(target.id);
      // await spotyApi.removeUserSavedTrack(target.id);
    }
  });
}
// spotyApi.removeUserSavedTrack()
