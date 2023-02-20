import axios from 'axios';

const btnFollowArtist = document.querySelector('.btn-follow-artist');
const pathname = window.location.pathname.split('/');
const artistId = pathname[pathname.length - 1];

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

async function toggleFollowArtist() {
    if(btnFollowArtist?.classList.contains('active')) {
        btnFollowArtist.textContent = 'Follow';
        btnFollowArtist.classList.remove('active');
        const res = await axios({
            method: 'DELETE',
            url: '/api/v1/spotyApi/unfollowArtist',
            data: {
              artistId
            },
          });
          if (res.data.status === 'success') {
            showMessage('Deleted from library');
          }
    } else {
        (<Element>btnFollowArtist).textContent = 'Following';
        btnFollowArtist?.classList.add('active');
        const res = await axios({
            method: 'PUT',
            url: '/api/v1/spotyApi/followArtist',
            data: {
              artistId
            },
          });
          if (res.data.status === 'success') {
            showMessage('Added to library')
          }
    }
}

btnFollowArtist?.addEventListener('click', toggleFollowArtist);