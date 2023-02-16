import axios from 'axios';

const btnCreatePlaylist = document.querySelector('.btn-create-playlist');
const inputName = document.querySelector('.input-name');
const btnSave = document.querySelector('.btn-save-details');
const error = document.querySelector('.modal-error');
const name = document.querySelector('.playlist-name');
const playlists = document.querySelectorAll('.dropdown-menu-playlists');
const removeTrackBtn = document.querySelectorAll('.remove-item');
const deletePlaylistBtn = document.querySelector('.btn-delete-playlist');

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

async function deletePlaylist() {
    const res = await axios({
        method: 'DELETE',
        url: '/api/v1/spotyApi/deletePlaylist',
        data: {
            playlistId
        }
      });
      if (res.data.status === 'success') {
        window.setTimeout(() => {
            location.assign(`/library/playlists`);
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
            showMessage('Playlist renamed');
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
        showMessage('Added to playlist');
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
        showMessage('Deleted from playlist');
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

deletePlaylistBtn?.addEventListener('click', deletePlaylist);