import axios from 'axios';

const tableLikePlaylist = document.querySelector('.table-like-playlist');

function updateNumberTrack() {
  const numberTrack = document.querySelectorAll('.number-track');
  if (numberTrack) {
    numberTrack.forEach((item, index) => {
      item.innerHTML = `${index + 1}`;
    });
  }
}

if (tableLikePlaylist) {
  const heartIcon = document.querySelectorAll('.heart-icon');
  heartIcon.forEach((item) => {
    item.addEventListener('click', async (e) => {
      const target = e.currentTarget as HTMLElement;
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

      const blockTrack = document.querySelectorAll('.chosen-track');
      const blockTrackArr = Array.from(blockTrack);
      const deleteItem = blockTrackArr.filter((it) => it.id === target.id);
      const amountLikedTrack = document.querySelector(
        '.amount-liked-track'
      ) as HTMLElement;
      deleteItem[0].remove();
      updateNumberTrack();
      amountLikedTrack.innerHTML = `${blockTrackArr.length - 1}`;
    });
  });
}
