import axios from 'axios';

const btnFollowArtist = document.querySelector('.btn-follow-artist');
const pathname = window.location.pathname.split('/');
const artistId = pathname[pathname.length - 1];

async function toggleFollowArtist() {
    if(btnFollowArtist?.classList.contains('active')) {
        btnFollowArtist.textContent = 'Unfollow';
        btnFollowArtist.classList.remove('active');
        const res = await axios({
            method: 'DELETE',
            url: '/api/v1/spotyApi/unfollowArtist',
            data: {
              artistId
            },
          });
          if (res.data.status === 'success') {
            window.setTimeout(() => {
              location.assign('/');
            }, 1500);
          }
    } else {
        (<Element>btnFollowArtist).textContent = 'Follow';
        btnFollowArtist?.classList.add('active');
        const res = await axios({
            method: 'PUT',
            url: '/api/v1/spotyApi/followArtist',
            data: {
              artistId
            },
          });
          if (res.data.status === 'success') {
            window.setTimeout(() => {
              location.assign('/');
            }, 1500);
          }
    }
}

btnFollowArtist?.addEventListener('click', toggleFollowArtist);