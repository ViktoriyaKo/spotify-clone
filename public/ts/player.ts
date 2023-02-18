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

const contextUri = btnPlayPlaylist?.getAttribute('uri');
let currentlyTrackTime = 0;
let progressInterval;
let indexCurrentlyTrack: number = 0;
let trackIsPlaying = false;
//СДК
async function getToken() {
  let token;
  console.log(token);
  const res = await axios({
    method: 'PUT',
    url: '/api/v1/spotyApi/getToken',
  });
  if (res.data.status === 'success') {
    token = res.data.token;
  }

  return token;
}

async function setDeviceId(deviceId) {
  const res = await axios({
    method: 'PATCH',
    url: '/api/v1/spotyApi/setDeviceId',
    data: {
      deviceId,
    },
  });
  if (res.data.status === 'success') {
  }
}

window.onSpotifyWebPlaybackSDKReady = async () => {
  const token = await getToken();

  const player = new Spotify.Player({
    name: 'Spotify Copy',
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });
  console.log('player', player);
  player.addListener('ready', async ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    const res = await axios({
      method: 'PUT',
      url: '/api/v1/spotyApi/changeDevice',
      data: {
        deviceId: device_id,
      },
    });
    if (res.data.status === 'success') {
      console.log('device changed');
      await setDeviceId(device_id);
    }
  });

  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  player.addListener('initialization_error', ({ message }) => {
    console.error('initialization_error', message);
  });

  player.addListener('authentication_error', ({ message }) => {
    console.error(message);
  });

  player.addListener('account_error', ({ message }) => {
    console.error(message);
  });

  player.addListener(
    'player_state_changed',
    ({ position, duration, track_window: { current_track } }) => {
      updateTrackDuration(duration);
      //setCurrentTrackPosition();
      //@ts-ignore
      console.log('current state:', trackIsPlaying);
      console.log('Currently Playing', current_track);
      console.log('Position in Song', position);
      console.log('Duration of Song', duration);
      progressInterval = window.setInterval(function () {
        if (trackIsPlaying) {
          currentlyTrackTime += 500;
          console.log('track playing......', currentlyTrackTime);
        }
      }, 500);
    }
  );

  player.connect();
};

////////////////////////////SDK END
function handleTrackPause() {
  trackIsPlaying = false;
  console.log('current statePause:', trackIsPlaying);
  clearInterval(progressInterval);
  console.log('interval cleared, track time :', currentlyTrackTime);

  //stopProgressBar()
}
function updateTrackDuration(duration: number) {
  totalDuration.innerHTML = `${time(duration)}`;
}

function setActiveTrack() {
  Array.from(chosenTracks)[indexCurrentlyTrack]?.classList.add(
    'chosen-track-active'
  );
  chosenTracks.forEach((item, index) => {
    if (index !== indexCurrentlyTrack) {
      item.classList.remove('chosen-track-active');
    }
  });
}

//CHANGE
function setInfoInPlayer() {
  chosenTracks.forEach((item, index) => {
    if (index === indexCurrentlyTrack) {
      title.textContent = item.querySelector('.name-liked-track')!.textContent;
      artist.textContent = item.querySelector(
        '.singer-liked-track'
      )!.textContent;
      imgPlayer.src = (<HTMLIFrameElement>(
        item.querySelector('.icon-album')
      ))!.src;
    }
  });
}

async function startPlayback(offset: string, time: number = 0) {
  trackIsPlaying = true;
  console.log('contextUri:', contextUri);
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
    handleTrackPause();
    await getCurrentlyTrack();
  }
}

async function getCurrentlyTrack() {
  const res = await axios({
    method: 'GET',
    url: '/api/v1/spotyApi/getCurrentlyTrack',
  });
  if (res.status === 202) {
    console.log(res.data.currentlyTrack);
  }
  currentlyTrackTime = res.data.currentlyTrack.progress_ms;
  // return res.data.currentlyTrack.item.duration_ms;
}

function removePauseIcons() {
  playTrackBtn?.forEach((btn) => {
    btn.classList.remove('pause-icon');
  });
}

function addPauseIcon() {
  playTrackBtn?.forEach((btn, index) => {
    if (index === indexCurrentlyTrack) {
      btn.classList.add('pause-icon');
    }
  });
}

// function progressPlayer(duration: number, trackTime: number) {
//   let timeTrack = trackTime;
//   setInterval(() => {
//     timeTrack += 1000;
//     const progressPercent = (timeTrack / duration) * 100;
//     progress.style.width = `${progressPercent}%`;
//     console.log('progressPercent', progressPercent);
//     console.log('currenttimeTrack', timeTrack);
//   }, 1000);
// }

async function clickPlayerBtn() {
  if (!playBtn?.classList.contains('pause')) {
    startPlayback(playTrackBtn[indexCurrentlyTrack].id, currentlyTrackTime);
    playBtn?.classList.add('pause');
    btnPlayPlaylist?.classList.add('pause');
    addPauseIcon();
    setActiveTrack();
  } else {
    pausePlayback();
    playBtn?.classList.remove('pause');
    btnPlayPlaylist?.classList.remove('pause');
    removePauseIcons();
  }
}

// здесь
playTrackBtn.forEach((item, index) => {
  item.addEventListener('click', (el) => {
    indexCurrentlyTrack = index;
    if (!item.classList.contains('pause-icon')) {
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
  });
  if (res.status === 202) {
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
  });
  if (res.status === 202) {
    console.log('previous');
  }
}

async function changeVolume(e: MouseEvent) {
  const clickX = e.offsetX;
  volumeBar.style.width = `${clickX}%`;
  const res = await axios({
    method: 'PUT',
    url: '/api/v1/spotyApi/changeVolume',
    data: {
      volume: clickX,
    },
  });
  if (res.status === 202) {
    console.log('change Volume');
  }
}

playBtn?.addEventListener('click', clickPlayerBtn);
btnPlayPlaylist?.addEventListener('click', clickPlayerBtn);
playNext?.addEventListener('click', skipToNext);
playPrev?.addEventListener('click', skipToPrevious);
volumeBarContainer?.addEventListener('click', (event) => {
  changeVolume(event);
});
