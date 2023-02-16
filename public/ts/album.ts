import axios from 'axios';

const btnAlbumLike = document.querySelector('.btn-album-like');
const pathname = window.location.pathname.split('/');
const albumId = pathname[pathname.length - 1];

function showMessage(message: string) {
  const messageBlock = document.createElement('div');
  messageBlock.className = 'popup-message active';
  messageBlock.textContent = message;
  document.body.append(messageBlock);
  window.setTimeout(() => {
    messageBlock.classList.remove('active');
  }, 3000)
  window.setTimeout(() => {
    messageBlock.remove();
  }, 6000)
}

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
            showMessage('Deleted from library')
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
            showMessage('Added to library')
          }
    }
}

btnAlbumLike?.addEventListener('click', toggleSavedAlbum)