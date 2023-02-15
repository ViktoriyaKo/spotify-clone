import axios from 'axios';

const btnCreatePlaylist = document.querySelector('.btn-create-playlist');
const inputName = document.querySelector('.input-name');
const btnSave = document.querySelector('.btn-save-details');
const error = document.querySelector('.modal-error');
const name = document.querySelector('.playlist-name');

if(name?.textContent) {
    (<HTMLInputElement>inputName)!.value = name.textContent;
}

const pathname = window.location.pathname.split('/');
const playlistId = pathname[pathname.length - 1];

async function createPlaylist() {
    const res = await axios({
        method: 'PUT',
        url: '/api/v1/spotyApi/createPlaylist',
      });
      if (res.data.status === 'playlist was created') {
        window.setTimeout(() => {
            location.assign(`/playlist/${res.data.playlistId}`);
          }, 200);
      }
}

async function changeDetails() {
    const playlistName = (<HTMLInputElement>inputName)?.value;
    if(playlistName.length < 1) {
        (<HTMLElement>error)!.style.display = 'block';
    } else {
        if(playlistName) {
            name!.textContent = playlistName;
        }
        const res = await axios({
            method: 'PUT',
            url: '/api/v1/spotyApi/changePlaylist',
            data: {
                playlistId,
                playlistName,
            }
          });
          if (res.data.status === 'success') {
          }
    }
}
btnCreatePlaylist?.addEventListener('click', createPlaylist);
btnSave?.addEventListener('click', changeDetails);

inputName?.addEventListener('input', function() {
    const value = (<HTMLInputElement>inputName)?.value;
    if(value.length > 100) {
        (<HTMLInputElement>inputName)!.value = value.slice(0, 99);
    }
})