import axios from 'axios';
import { time } from './search';

const changingIcons = document.querySelectorAll('.changing-icon');
const playIconBtn = document.querySelectorAll('.play-btn');
const title = document.querySelector('.song-description .title') as HTMLElement;
const artist = document.querySelector(
  '.song-description .artist'
) as HTMLElement;
const imgPlayer = document.querySelector('.imgPlayer') as HTMLImageElement;
const totalDuration = document.querySelector('.total-duration') as HTMLElement;
const currentTime = document.querySelector(
  '.progress-container span'
) as HTMLElement;
const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
const progressBar = document.querySelector('.progress-bar') as HTMLElement;
const volumeBarContainer = document.querySelector(
  '.volume-bar-container'
) as HTMLElement;
const volumeBar = document.querySelector('.volume-bar-progress') as HTMLElement;
const progress = document.querySelector('.progress') as HTMLElement;
const playBtnMain = document.querySelector('.play-btn-player');

const audio = new Audio();
const playTrackBtn = document.querySelectorAll('.play-btn');

// TEST:

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds - min * 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;
}
// Отображение currentTime в секундах
function updateProgressValue() {
  progressBar.max = audio.duration;
  progressBar.value = audio.currentTime;
  currentTime.innerHTML = formatTime(Math.floor(audio.currentTime));
  totalDuration.innerHTML = formatTime(Math.floor(audio.duration));
  if (totalDuration.innerHTML === 'NaN:NaN') {
    totalDuration.innerHTML = '0:00';
  } else {
    totalDuration.innerHTML = formatTime(Math.floor(audio.duration));
  }
}

// Progress-bar for time
function updateProgress() {
  const { duration, currentTime } = audio;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// set progress
function setProgress(event: MouseEvent) {
  const width = progressBar.clientWidth;
  const clickX = event.offsetX; // click
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// set volume
function setVolumeBar(e: MouseEvent) {
  const width = volumeBarContainer.clientWidth;
  const clickX = e.offsetX;
  audio.volume = clickX / width;
  const volumePercent = width * audio.volume;
  volumeBar.style.width = `${volumePercent}%`;
}

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

if (progressBar) {
  audio.addEventListener('timeupdate', () => {
    updateProgress();
  });
  progressBar.addEventListener('click', (event) => {
    setProgress(event);
  });
  volumeBarContainer.addEventListener('click', (event) => {
    setVolumeBar(event);
  });
}

const btnPlayPlaylist = document.querySelector('.btn-play-playlist');
const chosenTracks = document.querySelectorAll('.chosen-track');

let currentlyTrackTime = 0;
let indexCurrentlyTrack: number = 0;

function setActiveTrack() {
  Array.from(chosenTracks)[indexCurrentlyTrack]?.classList.add(
    'chosen-track-active'
  );
  const idTrack = Array.from(chosenTracks)[indexCurrentlyTrack]?.id;
  chosenTracks.forEach((item, index) => {
    if (index !== indexCurrentlyTrack) {
      item.classList.remove('chosen-track-active');
    }
  });
  return idTrack;
}

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

function addPauseIcon() {
  playTrackBtn?.forEach((btn, index) => {
    if (index === indexCurrentlyTrack) {
      btn.classList.add('pause-icon');
    }
  });
}

function removePauseIcons() {
  playTrackBtn?.forEach((btn) => {
    btn.classList.remove('pause-icon');
  });
}

function playAudio(track: any) {
  audio.src = track;
  audio.play();
}

function stopAudio() {
  audio.pause();
}

function clickPlayerBtn(track: any) {
  if (!playBtnMain?.classList.contains('pause')) {
    const idTrack = setActiveTrack();
    playAudio(idTrack);
    setInterval(updateProgressValue, 1000);
    playBtnMain?.classList.add('pause');
    btnPlayPlaylist?.classList.add('pause');
    addPauseIcon();
  } else {
    stopAudio();
    playBtnMain?.classList.remove('pause');
    btnPlayPlaylist?.classList.remove('pause');
    removePauseIcons();
  }
}

setInfoInPlayer();

playBtnMain?.addEventListener('click', clickPlayerBtn);
btnPlayPlaylist?.addEventListener('click', clickPlayerBtn);
