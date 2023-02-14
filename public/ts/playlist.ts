import axios from 'axios';

const btnCreatePlaylist = document.querySelector('.btn-create-playlist');

btnCreatePlaylist?.addEventListener('click', async () => {
    const res = await axios({
        method: 'PUT',
        url: '/api/v1/spotyApi/createPlaylist',
      });
      console.log(res)
      if (res.data.status === 'playlist was created') {
        window.setTimeout(() => {
            location.assign(`/playlist/${res.data.playlistId}`);
          }, 200);
      }
})