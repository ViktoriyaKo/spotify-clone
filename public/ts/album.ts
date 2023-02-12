import axios from 'axios';

const btnAlbumLike = document.querySelector('.btn-album-like');
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
            window.setTimeout(() => {
              location.assign('/');
            }, 1500);
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
            window.setTimeout(() => {
              location.assign('/');
            }, 1500);
          }
    }
}

btnAlbumLike?.addEventListener('click', toggleSavedAlbum)