import axios from 'axios';

const tablePlaylist = document.querySelector('.table-playlist');
const popupMessage = document.querySelector('.popup-message') as HTMLElement;

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
      if(target.classList.contains('active-icon')) {
        target.classList.remove('active-icon');
        const res = await axios({
          method: 'DELETE',
          url: '/api/v1/spotyApi/deleteTrack',
          data: {
            idTrack,
          },
        });
        if (res.data.status === 'success') {
          popupMessage.textContent = 'Deleted from favorite tracks';
          popupMessage?.classList.add('active');
          window.setTimeout(() => {
            popupMessage?.classList.remove('active');
          }, 3000)
        }
        if(tablePlaylist.classList.contains('table-favorite')) {
          const blockTrack = document.querySelectorAll('.chosen-track');
          const blockTrackArr = Array.from(blockTrack);
          const deleteItem = blockTrackArr.filter((item) => item.id === target.id);
          deleteItem[0]?.remove();
          updateNumberTrack();
        }
      } else {
        target.classList.add('active-icon');
        const res = await axios({
          method: 'PUT',
          url: '/api/v1/spotyApi/saveTrack',
          data: {
            idTrack,
          },
        });
        if (res.data.status === 'success') {
          popupMessage.textContent = 'Added to favorite tracks';
          popupMessage?.classList.add('active');
          window.setTimeout(() => {
            popupMessage?.classList.remove('active');
          }, 3000)
        }
      }
    }
  });
}
