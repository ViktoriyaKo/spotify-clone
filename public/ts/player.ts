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
const playPrev = document.querySelector('.play-prev');
const play = document.querySelector('.play-btn-player');
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

// TEST:
function playAudio(track: any) {
  audio.src = track.preview_url;
  if (isPlay === false) {
    audio.play();
    isPlay = true;
    // play.classList.add('pause');
  } else {
    audio.pause();
    isPlay = false;
    // play.classList.remove('pause');
  }
  audio.play();
  isPlay = true;
}

async function playPlayer(idTrack: string) {
  const res = await axios({
    method: 'PATCH',
    url: '/api/v1/spotyApi/startPlayer',
    data: {
      idTrack,
    },
  });
  if (res.status === 202) {
    title.innerHTML = res.data.track.name;
    artist.innerHTML = res.data.track.artists[0].name;
    imgPlayer.src = res.data.track.album.images[1].url;
    totalDuration.innerHTML = time(+res.data.track.duration_ms);
    playAudio(res.data.track);
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
