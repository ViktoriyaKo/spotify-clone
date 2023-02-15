import axios from 'axios';

const btnCreatePlaylist = document.querySelector('.btn-create-playlist');
const inputName = document.querySelector('.input-name');
const btnSave = document.querySelector('.btn-save-details');
const error = document.querySelector('.modal-error');
const name = document.querySelector('.playlist-name');
const playlists = document.querySelectorAll('.dropdown-menu-playlists');
const removeTrackBtn = document.querySelectorAll('.remove-item');
const popupMessage = document.querySelector('.popup-message') as HTMLElement;

if(name?.textContent) {
    (<HTMLInputElement>inputName)!.value = name.textContent;
}

const pathname = window.location.pathname.split('/');
const playlistId = pathname[pathname.length - 1];

function updateNumberTrack() {
    const numberTrack = document.querySelectorAll('.number-track');
    if (numberTrack) {
      numberTrack.forEach((item, index) => {
        item.innerHTML = `${index + 1}`;
      });
    }
}

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

async function addTrackToPlaylist(event: Event) {
    const target = event.target as HTMLElement;
    const res = await axios({
        method: 'PUT',
        url: '/api/v1/spotyApi/addTrackToPlaylist',
        data: {
            playlistId: target.getAttribute('playlist-id'),
            trackUri: target.getAttribute('track-uri'),
        }
      });
      if (res.data.status === 'success') {
        popupMessage.textContent = 'Added to playlist';
        popupMessage?.classList.add('active');
        window.setTimeout(() => {
            popupMessage?.classList.remove('active')
        }, 3000)
      }
}

async function removeTrackFromPlaylist(event: Event) {
    const target = event.target as HTMLElement;
    const res = await axios({
        method: 'DELETE',
        url: '/api/v1/spotyApi/deleteTrackFromPlaylist',
        data: {
            playlistId,
            trackUri: target.getAttribute('track-uri'),
        }
      });
      if (res.data.status === 'success') {
        popupMessage.textContent = 'Deleted from playlist';
        popupMessage?.classList.add('active');
        window.setTimeout(() => {
            popupMessage?.classList.remove('active')
        }, 3000)
      }
      const blockTrack = document.querySelectorAll('.chosen-track');
      const blockTrackArr = Array.from(blockTrack);
      const deleteItem = blockTrackArr.filter((item) => item.id === target.getAttribute('track-uri'));
      deleteItem[0]?.remove();
      updateNumberTrack();
}

btnCreatePlaylist?.addEventListener('click', createPlaylist);
btnSave?.addEventListener('click', changeDetails);

inputName?.addEventListener('input', function() {
    const value = (<HTMLInputElement>inputName)?.value;
    if(value.length > 100) {
        (<HTMLInputElement>inputName)!.value = value.slice(0, 99);
    }
})

for(let playlist of playlists) {
    playlist?.addEventListener('click', addTrackToPlaylist)
}

for(let btn of removeTrackBtn) {
    btn.addEventListener('click', removeTrackFromPlaylist);
}