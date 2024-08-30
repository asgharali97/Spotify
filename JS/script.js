// Global Variables
let songs;
let currentSong = new Audio();
let currentFolder;

// Functions
// Converting seconds into minutes and seconds
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
// Fetch all songs 
async function getSongs(folder) {
  currentFolder = folder;
  let a = await fetch(`/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
          songs.push(element.href.split(`/${folder}/`)[1])
      }
  }
  let songList = document.querySelector('.song-list').getElementsByTagName('ul')[0]
  songList.innerHTML = ''
  for (const song of songs) {
    let cleanedSongTitle = song.replaceAll("%20", " ");
    let songTitle = cleanedSongTitle.length > 8 ? cleanedSongTitle.substring(0, 14) + '...' : cleanedSongTitle;
    songList.innerHTML = songList.innerHTML + ` <li>
    <div class="info">
     <img class="invert" src="../svgs/music.svg" alt="" />
     <div class="title">
     <h4 data-full-title="${cleanedSongTitle}">${songTitle}</h4>
     </div>
        </div>
        <div class="playNow">
        <span>Play Now</span>
        <img class="invert playNow-img" src="../svgs/play.svg" alt="">
        </div>
        </li>` ;
  }
    // Displaying song name when load
      let songInfoTitle = document.querySelector(".song-details>h4")
      let str = String(songs)
      let clean = str.replaceAll("%20"," ")
      let title = clean.length > 8 ? clean.substring(0,20) : clean
      songInfoTitle.innerHTML = title

  //  Adding event listener to play song
  let li = Array.from(document.querySelector('.song-list').getElementsByTagName("li"))
  li.forEach((e) => {
    e.addEventListener('click', () => {
      // Displaying song name when song play
      let songInfoTitle = document.querySelector(".song-details>h4")
      let str = e.querySelector('.title').firstElementChild.getAttribute('data-full-title')
      let clean = str.replaceAll("%20"," ")
      let title = clean.length > 8 ? clean.substring(0,20) : clean
      songInfoTitle.innerHTML = title
      // Playing song 
      PlayMusic(e.querySelector('.title').firstElementChild.getAttribute('data-full-title'))
    })
  }
  )
  
}


// Music Playing function

function PlayMusic(track, pause = false) {
  currentSong.src = `/${currentFolder}/` + track
  if (!pause) {
      currentSong.play()
      img.src = '../svgs/pause.svg'
  }

}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card-wrap">
            <div class="card">
              <div class="img">
                <img
                  class="card-img"
                  src='/songs/${folder}/cover.jpg'
                  alt="Thumbnail"
                />
              </div>
              <div class="card-info">
                <h5>
                ${response.title}
                </h5>
              </div>
            </div>
          </div>`
          
        }
       
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card-wrap")).forEach(e => { 
        e.addEventListener("click", async item => {
          // Display the image in SongInfo when card clicked 
          let songInfoImg = document.querySelector('.song-info-img')
          songInfoImg.src = `/songs/${item.currentTarget.dataset.folder}/cover.jpg` 
          songs.push( await getSongs(`songs/${item.currentTarget.dataset.folder}`))
          PlayMusic(songs[0])

        })
    })
}
async function main() {
  await getSongs('songs/chill')
  await displayAlbums()
  PlayMusic(songs[0],true)
}


main()

// Event Listeners
// Event Listeners on Play song button
const play = document.querySelector('.play-song')

const img = document.querySelector('.play-song-img')
play.addEventListener('click', () => {
  if (currentSong.paused) {
    currentSong.play()
    img.src = '../svgs/pause.svg'
  } else {
    currentSong.pause()
    img.src = '../svgs/play.svg'
  }
})

// Event Listeners on Volume to change volume
const volume = document.querySelector('.sound-progress')
volume.addEventListener('change', (e) => {
  currentSong.volume = e.target.value / 100
})

// Event Listeners on Volume icon to mute volume
const volumeIcon = document.querySelector('.sound-svg')
volumeIcon.addEventListener('click', (e) => {
  if (e.target.src.includes('/svgs/sound.svg')) {
    currentSong.volume = 0
    e.target.src = '/svgs/mute.svg'
  } else {
    currentSong.volume = 1
    e.target.src = '/svgs/sound.svg'
  }
})

// Event Listeners on time update of song
const totalTime = document.querySelector('.total-song-time')
const currTime = document.querySelector('.song-time')
const progressBar = document.querySelector('.progress-bar')
currentSong.addEventListener('timeupdate', () => {
  // Giving value to the progress bar to update
  progressBar.value = (currentSong.currentTime / currentSong.duration) * 100
  // changing the color of progress bar
  progressBar.style.accentColor = "#1ed55f"
  // Displaying time
  currTime.innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}`
  totalTime.innerHTML = `${secondsToMinutesSeconds(currentSong.duration)}`
  //changing the svg pause to play and progress bar value  when song end 
  if(currentSong.currentTime === currentSong.duration){
    currentSong.pause()
    img.src = '../svgs/play.svg'
    progressBar.value = 0
  }
})

progressBar.addEventListener('click', (e) => {
  currentSong.currentTime = (e.target.value / 100) * currentSong.duration
})

// Event Listeners on next song and previous song
const prevSong = document.querySelector('.prev-song')
const nextSong = document.querySelector('.next-song')

prevSong.addEventListener('click', () => {
  currentSong.pause()
  const index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
  if (index -1 >= 0) {
    PlayMusic(songs[index - 1])
    let songInfoTitle = document.querySelector(".song-details>h4")
    let str = songs[index -1]
    let clean = str.replaceAll("%20"," ")
    let title = clean.length > 8 ? clean.substring(0,20) : clean
    songInfoTitle.innerHTML = title

  }
})

nextSong.addEventListener('click', () => {
  currentSong.pause()
  const index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
  if (index + 1 < songs.length) {
    PlayMusic(songs[index + 1])
    let songInfoTitle = document.querySelector(".song-details>h4")
    let str = songs[index + 1]
    let clean = str.replaceAll("%20"," ")
    let title = clean.length > 8 ? clean.substring(0,20) : clean
    songInfoTitle.innerHTML = title
  }
})

// AddEventListener for  Repeat song 
let repeatBtn = document.querySelector('.repeat-song');
let rSvg = document.querySelector('.repeat-svg');
let isRepeating = false;
repeatBtn.addEventListener('click',()=>{
  if(currentSong.duration > 0){
    isRepeating = !isRepeating
    currentSong.loop = isRepeating
  }
  if(isRepeating){
    rSvg.style.fill = '#1ed55f'
  }
  else{
    rSvg.style.fill = '#b3b3b3'
  }
})

// AddEventListener to shuffle button for play next song 
let shuffleBtn = document.querySelector('.shuffle-song');
let shuffleSvg = document.querySelector('.shuffle-svg');
let isShuffle = false;
let currIndex = 0;

shuffleBtn.addEventListener('click', ()=>{
  isShuffle = !isShuffle
  if(isShuffle){
    shuffleSvg.style.fill = '#1ed55f'
  }else{
    shuffleSvg.style.fill = '#b3b3b3'
  }
})
// AddEventListener on currentSong when end 
currentSong.addEventListener('ended',()=>{
  if(isShuffle){
    currIndex = (currIndex + 1) % songs.length
    if(songs[currIndex]){
      PlayMusic(songs[currIndex])
      // Changing name when song change
      let songInfoTitle = document.querySelector(".song-details>h4")
      let str = songs[currIndex]
      let clean = str.replaceAll("%20"," ")
      let title = clean.length > 8 ? clean.substring(0,20) : clean
      songInfoTitle.innerHTML = title
    }
  }
  else{
    console.log('false');
  }
  })