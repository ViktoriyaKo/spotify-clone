import axios from 'axios';

const tablePlaylist = document.querySelector('.table-playlist');

function updateNumberTrack() {
  const numberTrack = document.querySelectorAll('.number-track');
  if (numberTrack) {
    numberTrack.forEach((item, index) => {
      item.innerHTML = `${index + 1}`;
    });
  }
}

if (tablePlaylist) {
  tablePlaylist.addEventListener('click', async (el) => {
    const target = el.target as HTMLElement;
    if (target.closest('.heart-icon')) {
      const idTrack = target.id;
      console.log(target);
      if (target.classList.contains('active-icon')) {
        console.log('не содержит');
        target.classList.remove('active-icon');
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
        if (tablePlaylist.classList.contains('table-favorite')) {
          const blockTrack = document.querySelectorAll('.chosen-track');
          const blockTrackArr = Array.from(blockTrack);
          const amountLikedTrack = document.querySelector(
            '.amount-liked-track'
          );
          const deleteItem = blockTrackArr.filter(
            (item) => item.id === target.id
          );
          deleteItem[0]?.remove();
          updateNumberTrack();
          if (amountLikedTrack) {
            amountLikedTrack.innerHTML = `${blockTrackArr.length - 1}`;
          }
        }
      } else {
        target.classList.add('active-icon');
        console.log('добавить');
        const res = await axios({
          method: 'PUT',
          url: '/api/v1/spotyApi/saveTrack',
          data: {
            idTrack,
          },
        });
        if (res.data.status === 'success') {
          console.log('removed track');
        }
      }
    }
  });
}
