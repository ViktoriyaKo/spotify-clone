import axios from 'axios';
import EventEmmiter from './EventEmmitter';
import { time } from './search';

const btnPlayPlaylist = document.querySelector('.btn-play-playlist');
const progressBar = document.querySelector('.progress-bar') as HTMLElement;
const playTrackBtns = document.querySelectorAll('.play-btn');
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

const currentTime = document.querySelector(
  '.progress-container span'
) as HTMLElement;
const volumeBarContainer = document.querySelector(
  '.volume-bar-container'
) as HTMLElement;
const volumeBar = document.querySelector('.volume-bar-progress') as HTMLElement;
const progress = document.querySelector('.progress') as HTMLElement;
const contextUri = btnPlayPlaylist?.getAttribute('uri');

let currentTrackName;
let currentlyTrackTime = 0; // ???
let progressInterval;
let indexCurrentlyTrack: number = 0;
let trackIsPlaying = false;
let trackPositionMs = 0;
let totalDurationMs;

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
      trackPositionMs = 0;
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

      progressInterval = window.setInterval(function () {
        player.getCurrentState().then((state) => {
          if (playBtn?.classList.contains('pause')) {
            const stateTrack = state.track_window.current_track;
            // if(!currentTrackName || currentTrackName != stateTrack) {
            //   totalDurationMs = 0;
            currentTrackName = state.track_window.current_track.uri;
            // }
            console.log('track ms: ', state.position, currentTrackName);
            trackPositionMs = state.position as number;
          }
        });
        updateProgressTime(trackPositionMs);
        updateProgressBar(trackPositionMs / totalDurationMs);
      }, 1000);
    }
  );

  player.connect();
};

function updateProgressBar(progressTime: number) {
  if (!progressTime) return;
  const progressPercent = progressTime * 100;
  console.log('track progress: ', progressTime * 100, '%');
  progress.style.width = `${progressPercent}%`;
}

function updateProgressTime(duration: number) {
  currentTime.innerHTML = `${time(duration)}`;
}
//SDK END
function handleTrackPause() {
  trackIsPlaying = false;
  console.log('current statePause:', trackIsPlaying);
  clearInterval(progressInterval);
  console.log('interval cleared, track time :', currentlyTrackTime);
  //stopProgressBar()
}

// set progress
function setProgress(e) {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  const currentTimeSet = (clickX / width) * totalDurationMs;
  trackPositionMs = currentTimeSet;
  if (playBtn?.classList.contains('pause')) {
    startPlayback(playTrackBtns[indexCurrentlyTrack].id, currentTimeSet);
  }
  updateProgressBar(currentTimeSet);
}

function updateTrackDuration(duration: number) {
  totalDurationMs = duration;
  totalDuration.innerHTML = `${time(duration)}`;
}

function setActiveTrack() {
  console.log('setActiveTrack chosenTracks', chosenTracks);
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
}

function removePauseIcons() {
  playTrackBtns?.forEach((btn) => {
    btn.classList.remove('pause-icon');
  });
}

function addPauseIcon() {
  playTrackBtns?.forEach((btn, index) => {
    if (index === indexCurrentlyTrack) {
      btn.classList.add('pause-icon');
    }
  });
}

async function clickPlayerBtn() {
  if (!playBtn?.classList.contains('pause')) {
    startPlayback(playTrackBtns[indexCurrentlyTrack].id, trackPositionMs);
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

playTrackBtns.forEach((item, index) => {
  item.addEventListener('click', () => {
    indexCurrentlyTrack = index;
    if (!item.classList.contains('pause-icon')) {
      if (currentTrackName !== item.id) {
        trackPositionMs = 0;
      }
      startPlayback(playTrackBtns[indexCurrentlyTrack].id, trackPositionMs);
      playBtn?.classList.add('pause');
      btnPlayPlaylist?.classList.add('pause');
      removePauseIcons();
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
  console.log('clicked Btn skip to next');
  playBtn?.classList.add('pause');
  indexCurrentlyTrack++;
  removePauseIcons();
  addPauseIcon();
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
  console.log('index current track:' indexCurrentlyTrack)
  indexCurrentlyTrack--;
  removePauseIcons();
  addPauseIcon();
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
progressBar?.addEventListener('click', (event) => {
  setProgress(event);
});
volumeBarContainer?.addEventListener('click', (event) => {
  changeVolume(event);
});
