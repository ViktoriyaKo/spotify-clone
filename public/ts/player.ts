import axios from 'axios';
import { time } from './search';

const btnPlayPlaylist = document.querySelector('.btn-play-playlist');
const changingIcons = document.querySelectorAll('.changing-icon');
const playTrackBtn = document.querySelectorAll('.play-btn');
const chosenTracks = document.querySelectorAll('.chosen-track');
const title = document.querySelector('.song-description .title') as HTMLElement;
const artist = document.querySelector(
  '.song-description .artist'
) as HTMLElement;
const imgPlayer = document.querySelector('.imgPlayer') as HTMLImageElement;
const totalDuration = document.querySelector('.total-duration') as HTMLElement;
const playPrev = document.querySelector('.play-prev');
const playBtn = document.querySelector('.play-btn-player');
const playNext = document.querySelector('.play-next');
const progressBar = document.querySelector('.progress-bar') as HTMLElement;
const volumeBarContainer = document.querySelector(
  '.volume-bar-container'
) as HTMLElement;
const volumeBar = document.querySelector('.volume-bar-progress') as HTMLElement;
const progress = document.querySelector('.progress') as HTMLElement;

const audio = new Audio();
let isPlay = false;
let playNum = 0; //current track

for (let icon of changingIcons) {
  icon.addEventListener('click', () => {
    icon.classList.toggle('active-icon');
  });
}

//TEST:
// function playAudio(track: any) {
//   audio.src = track.preview_url;
//   if (isPlay === false) {
//     audio.play();
//     isPlay = true;
//     // play.classList.add('pause');
//   } else {
//     audio.pause();
//     isPlay = false;
//     // play.classList.remove('pause');
//   }
//   audio.play();
//   isPlay = true;
// }

// async function playPlayer(idTrack: string) {
//   const res = await axios({
//     method: 'PATCH',
//     url: '/api/v1/spotyApi/startPlayer',
//     data: {
//       idTrack,
//     },
//   });
//   if (res.status === 202) {
//     title.innerHTML = res.data.track.name;
//     artist.innerHTML = res.data.track.artists[0].name;
//     imgPlayer.src = res.data.track.album.images[1].url;
//     totalDuration.innerHTML = time(+res.data.track.duration_ms);
//     playAudio(res.data.track);
//   }
// }

// // Progress-bar for time
// function updateProgress() {
//   const { duration, currentTime } = audio;
//   const progressPercent = (currentTime / duration) * 100;
//   progress.style.width = `${progressPercent}%`;
// }

// // set progress
// function setProgress(event: MouseEvent) {
//   const width = progressBar.clientWidth;
//   const clickX = event.offsetX; // click
//   const duration = audio.duration;
//   audio.currentTime = (clickX / width) * duration;
// }

// // set volume
// function setVolumeBar(e: MouseEvent) {
//   const width = volumeBarContainer.clientWidth;
//   const clickX = e.offsetX;
//   audio.volume = clickX / width;
//   const volumePercent = width * audio.volume;
//   volumeBar.style.width = `${volumePercent}%`;
//   console.log(clickX);
//   console.log(volumePercent);
//   console.log(width);
// }

// // нужен fix:
// playIconBtn.forEach((item) => {
//   item.addEventListener('click', (el) => {
//     const idTrack = item.parentElement?.parentElement?.id;
//     if (idTrack) {
//       playPlayer(idTrack);
//     }
//     playIconBtn.forEach((btn) => {
//       btn.classList.remove('pause-icon');
//     });
//     item.classList.toggle('pause-icon');
//     if (item.classList.contains('pause-icon')) {
//       document.querySelectorAll('.chosen-track').forEach((value) => {
//         value.classList.remove('chosen-track-active');
//       });
//       item.parentElement?.parentElement?.classList.add('chosen-track-active');
//     } else {
//       item.parentElement?.parentElement?.classList.remove(
//         'chosen-track-active'
//       );
//     }
//     console.log(idTrack);
//   });
// });

// if (progressBar) {
//   audio.addEventListener('timeupdate', () => {
//     updateProgress();
//   });
//   progressBar.addEventListener('click', (event) => {
//     setProgress(event);
//   });
//   volumeBarContainer.addEventListener('click', (event) => {
//     setVolumeBar(event);
//   });
// }

// function toggleTrack(uriTrack: string, player: SpotifyPlayer, item: Element) {
//   if (uriTrack){
//     if(!item.classList.contains('pause-icon')) {
//       player.play([uriTrack]);
//       item.classList.add('pause-icon');
//     } else {
//       player.pause();
//       item.classList.add('play-icon');
//     } 
//   }
// }

// //@ts-ignore
// window.onSpotifyWebPlaybackSDKReady = async () => {
//   let token;
//   console.log(token)
//   const res = await axios({
//     method: 'PUT',
//     url: '/api/v1/spotyApi/getToken',
//   })
//   if(res.data.status === 'success') {
//     token = res.data.token;
//   }
// //@ts-ignore
//   const player = new SpotifyPlayer('player');
//   // @ts-ignore
//   player.addListener('ready', ({ device_id }) => {
//     console.log('Ready with Device ID', device_id);
//   });
//   // @ts-ignore
//   player.addListener('not_ready', ({ device_id }) => {
//     console.log('Device ID has gone offline', device_id);
//   });
// // @ts-ignore
//   player.addListener('initialization_error', ({ message }) => { 
//     console.error(message);
//   });
// // @ts-ignore
//   player.addListener('authentication_error', ({ message }) => {
//       console.error(message);
//   });
// // @ts-ignore
//   player.addListener('account_error', ({ message }) => {
//       console.error(message);
//   });

  
//   playBtn?.addEventListener('click', () => {
//     player.play("spotify:album:5ht7ItJgpBH7W6vJ5BqpPr");
//   })

//   console.log('player')
//   playIconBtn.forEach((item) => {
//       item.addEventListener('click', (el) => {

//         // playIconBtn.forEach((btn) => {
//         //   if(btn !== item) {
//         //     btn.classList.remove('pause-icon');
//         //   }
//         // });
//         console.log(el.target)
//         const uriTrack = item.id;
//         toggleTrack(uriTrack, player, item);
//         // if (item.classList.contains('pause-icon')) {
//         //   document.querySelectorAll('.chosen-track').forEach((value) => {
//         //     value.classList.remove('chosen-track-active');
//         //   });
//         //   item.parentElement?.parentElement?.classList.add('chosen-track-active');
//         // } else {
//         //   item.parentElement?.parentElement?.classList.remove(
//         //     'chosen-track-active'
//         //   );
//         // }
//         console.log(uriTrack);
//       });
//     });

//   player.connect(token);
// }

const contextUri = btnPlayPlaylist?.getAttribute('uri');
let currentlyTrackTime = 0;
let indexCurrentlyTrack:number = 0;

function setActiveTrack() {
  Array.from(chosenTracks)[indexCurrentlyTrack]?.classList.add('chosen-track-active');
  chosenTracks.forEach((item, index) => {
    if(index !== indexCurrentlyTrack) {
      item.classList.remove('chosen-track-active');
    }
  })
}

//CHANGE
function setInfoInPlayer() {
  chosenTracks.forEach((item, index) => {
    if(index === indexCurrentlyTrack) {
      title.textContent = item.querySelector('.name-liked-track')!.textContent;
      artist.textContent = item.querySelector('.singer-liked-track')!.textContent;
      imgPlayer.src = (<HTMLIFrameElement>item.querySelector('.icon-album'))!.src;
    }
  })
}

async function startPlayback(offset: string, time: number = 0) {
  const res = await axios({
        method: 'PUT',
        url: '/api/v1/spotyApi/startPlayback',
        data: {
          contextUri,
          offset,
          positionMs: time,
        },
      });
      if (res.status === 202) {
        console.log(`play: ${contextUri}`);
        // currentlyTrackUri = tracksUris;
      }
}

async function pausePlayback() {
  const res = await axios({
    method: 'PUT',
    url: '/api/v1/spotyApi/pausePlayback',
  });
  if (res.status === 202) {
    console.log(`pause`);
    await getCurrentlyTrack();
  }
}

async function getCurrentlyTrack() {
  const res = await axios({
    method: 'GET',
    url: '/api/v1/spotyApi/getCurrentlyTrack',
  });
  if (res.status === 202) {
    console.log(`get currently track`);
  }
  currentlyTrackTime = res.data.currentlyTrack.progress_ms;
}

function removePauseIcons() {
  playTrackBtn?.forEach((btn) => {
      btn.classList.remove('pause-icon');
  });
}

function addPauseIcon() {
  playTrackBtn?.forEach((btn, index) => {
    if(index === indexCurrentlyTrack) {
      btn.classList.add('pause-icon');
    }
  });
}

function clickPlayerBtn() {
  if(!playBtn?.classList.contains('pause')) {
    startPlayback(playTrackBtn[indexCurrentlyTrack].id, currentlyTrackTime);
    playBtn?.classList.add('pause');
    btnPlayPlaylist?.classList.add('pause');
    addPauseIcon()
    setActiveTrack();
  } else {
    pausePlayback();
    playBtn?.classList.remove('pause');
    btnPlayPlaylist?.classList.remove('pause');
    removePauseIcons();
  } 
}


playTrackBtn.forEach((item, index) => {
  item.addEventListener('click', (el) => {
    indexCurrentlyTrack = index;
    if(!item.classList.contains('pause-icon')) {
      startPlayback(playTrackBtn[indexCurrentlyTrack].id);
      playBtn?.classList.add('pause');
      btnPlayPlaylist?.classList.add('pause');
      addPauseIcon();
      setActiveTrack();
      setInfoInPlayer();
    } else {
      pausePlayback();
      item.classList.remove('pause-icon');
      playBtn?.classList.remove('pause');
      btnPlayPlaylist?.classList.remove('pause');
      removePauseIcons();
    } 
  });
});

async function skipToNext() {
  playBtn?.classList.add('pause');
  indexCurrentlyTrack++;
  addPauseIcon();
  removePauseIcons();
  setActiveTrack();
  setInfoInPlayer();
  const res = await axios({
    method: 'PUT',
    url: '/api/v1/spotyApi/skipToNextTrack',
  })
  if(res.status === 202) {
    console.log('next');
  }
}

async function skipToPrevious() {
  playBtn?.classList.add('pause');
  indexCurrentlyTrack--;
  addPauseIcon();
  removePauseIcons();
  setActiveTrack();
  setInfoInPlayer();
  const res = await axios({
    method: 'PUT',
    url: '/api/v1/spotyApi/skipToPreviousTrack',
  })
  if(res.status === 202) {
    console.log('previous');
  }
}

playBtn?.addEventListener('click', clickPlayerBtn);
btnPlayPlaylist?.addEventListener('click', clickPlayerBtn);
playNext?.addEventListener('click', skipToNext)
playPrev?.addEventListener('click', skipToPrevious);
// btnPlayPlaylist?.addEventListener('click', togglePlaylistPlayback.bind(this, btnPlayPlaylist?.getAttribute('uri'), btnPlayPlaylist));