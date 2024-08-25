let songs;
let currentSong = new Audio();
let currentFolder;

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
}

// Show all songs in library 
function displaySongInLibrary() {
  let songList = document.querySelector('.song-list').getElementsByTagName('ul')[0]
  console.log(songList);
  songList.innerHTML = ''
  for (const song of songs) {
    let cleanedSongTitle = song.replaceAll("%20", " ");
    let songTitle = cleanedSongTitle.length > 8 ? cleanedSongTitle.substring(0, 14) + '...' : cleanedSongTitle;
    songList.innerHTML = songList.innerHTML + ` <li>
    <div class="info">
     <img class="invert" src="../svgs/music.svg" alt="" />
        <h4>${songTitle}</h4>
        </div>
        <div class="playNow">
        <span>Play Now</span>
        <img class="invert playNow-img" src="../svgs/play.svg" alt="">
        </div>
        </li>` ;
  }

  //  Adding event listener to play song
  let li = Array.from(document.querySelector('.song-list').getElementsByTagName("li"))
  li.forEach((e) => {
    e.addEventListener('click', () => {
      // PlayMusic()
    })
  }
  )
}

async function main() {
  let get = await getSongs('songs/chill')
  displaySongInLibrary()
}


main()

