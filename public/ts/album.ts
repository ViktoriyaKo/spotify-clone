import axios from 'axios';

const btnAlbumLike = document.querySelector('.btn-album-like');
const popupMessage = document.querySelector('.popup-message') as HTMLElement;
const pathname = window.location.pathname.split('/');
const albumId = pathname[pathname.length - 1];


async function toggleSavedAlbum() {
    if(btnAlbumLike?.classList.contains('active')) {
        btnAlbumLike.classList.remove('active');
        const res = await axios({
            method: 'DELETE',
            url: '/api/v1/spotyApi/deleteAlbum',
            data: {
              albumId
            },
          });
          if (res.data.status === 'success') {
            popupMessage.textContent = 'Deleted from library';
            popupMessage?.classList.add('active');
            window.setTimeout(() => {
                popupMessage?.classList.remove('active');
          }, 3000)
          }
    } else {
        btnAlbumLike?.classList.add('active');
        const res = await axios({
            method: 'PUT',
            url: '/api/v1/spotyApi/saveAlbum',
            data: {
              albumId
            },
          });
          if (res.data.status === 'success') {
            popupMessage.textContent = 'Added to library';
            popupMessage?.classList.add('active');
            window.setTimeout(() => {
              popupMessage?.classList.remove('active');
            }, 3000)
          }
    }
}

btnAlbumLike?.addEventListener('click', toggleSavedAlbum)