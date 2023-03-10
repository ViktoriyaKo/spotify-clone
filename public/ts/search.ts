import axios from 'axios';

const searchForm = document.querySelector('.search-form') as HTMLInputElement;

export function time(duration: number) {
  const min = Math.floor(duration / 60000);
  const sec = Math.floor(Math.round(duration % 60000) / 1000);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function renderPlaylist(data: any) {
  let out = '';
  const limit = 4;

  data.forEach((item: any, index: number) => {
    if (index < limit) {
      out += `<tr class="chosen-track" id=${item.id}>            
      <th class="col-1 text-center"><span class="number-track">${
        index + 1
      }</span>
        <a class="logo-main play-btn play-icon" href="/track/${item.id}"></a>
        </svg>
      </th>
      <td class="col-8">
        <div class="d-flex gap-3 align-items-center"><img class="icon-album-search" src="${
          item.album.images[1].url
        }"/>
          <div class="d-flex flex-column"><small class="d-block">${
            item.name
          }</small><small class="text-uppercase d-block artist-name-table">${
        item.artists[0].name
      }</small></div>
        </div>
      </td>
      <td class="col-2">
        <div class="d-flex justify-content-between"><span></span>
          <div class="heart-svg-table">
            <svg class="heart-icon" id=${
              item.id
            } xmlns="http://www.w3.org/2000/svg" fill="transparent" viewbox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path>
            </svg>
          </div>
        </div>
      </td>
      <td class="col-1">${time(item.duration_ms)}</td>
      </tr>`;
    }
  });
  return out;
}

function addTrackToFavorite() {
  const tablePlaylist = document.querySelector('.table-playlist');
  if (tablePlaylist) {
    tablePlaylist.addEventListener('click', async (el) => {
      const target = el.target as HTMLElement;
      if (target.closest('.heart-icon')) {
        const idTrack = target.id;
        if (target.classList.contains('active-icon')) {
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
            console.log('removed track');
          }
        }
      }
    });
  }
}

if (searchForm) {
  searchForm.addEventListener('input', async () => {
    const searchValue = searchForm.value;
    try {
      const res = await axios({
        method: 'PATCH',
        url: '/api/v1/spotyApi/startSearch',
        data: {
          searchValue,
        },
      });
      if (res.status === 200) {
        const container = document.querySelector('.container');
        if (container) {
          if (res.data.tracks.artists.items.length > 0) {
            container.innerHTML = `<div class="row">
        <div class="col-md-5">
          <h3 class="text-white fs-4 mt-4">The best result
            <div class="my-3 p-4 rounded-3 search-bg">
            <a class="wrapper-img-track" href="/artist/${
              res.data.tracks.artists.items[0].id
            }">
            <img src=${res.data.tracks.artists.items[0].images[1].url}>
            </a>
              <p class="text-uppercase d-block text-search my-2">${
                res.data.tracks.artists.items[0].name
              }</p>
              <span class="text-uppercase">${
                res.data.tracks.artists.items[0].type
              }</span>
            </div>
          </h3>
        </div>
        <div class="col-md-7">
          <h3 class="text-white fs-4 mt-4">Tracks
            <div class="my-3">
              <table class="table table-playlist table-search">             
                <tbody class="align-middle">                     
                  ${renderPlaylist(res.data.tracks.tracks.items)}
                </tbody>
              </table>
            </div>
          </h3>
        </div>        
      </div>`;
            addTrackToFavorite();
          } else {
            container.innerHTML = `<h1 class="text-white text-center my-5">No results found</h1>
            <p class='text-white text-center'>Please make sure your words are spelled correctly or use less or different keywords.</p>`;
          }
        }
      }
    } catch (err) {
      const container = document.querySelector('.container');
      if (container) {
        container.innerHTML = `<h1 class="text-white text-center my-5">No results found</h1>
      <p class='text-white text-center'>Please make sure your words are spelled correctly or use less or different keywords.</p>`;
      }
    }
  });
}
