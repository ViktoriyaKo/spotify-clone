import axios from 'axios';

const tableLikePlaylist = document.querySelector('.table-like-playlist');
// const pathname = window.location.pathname.split('/');
// const albumId = pathname[pathname.length - 1];
function updateNumberTrack() {
  const numberTrack = document.querySelectorAll('.number-track');
  if (numberTrack) {
    numberTrack.forEach((item, index) => {
      item.innerHTML = `${index + 1}`;
    });
  }
}

if (tableLikePlaylist) {
  tableLikePlaylist.addEventListener('click', async (el) => {
    const target = el.target as HTMLElement;
    if (target.closest('.heart-icon')) {
      const idTrack = target.id;
      console.log(idTrack);
      const res = await axios({
        method: 'DELETE',
        url: '/api/v1/spotyApi/deleteTrack',
        data: {
          idTrack,
        },
      });
      if (res.data.status === 'success') {
        console.log('removed track');
      }
    }
    const blockTrack = document.querySelectorAll('.chosen-track');
    const blockTrackArr = Array.from(blockTrack);
    const deleteItem = blockTrackArr.filter((item) => item.id === target.id);
    deleteItem[0].remove();
    updateNumberTrack();
    console.log(deleteItem);
  });
}
