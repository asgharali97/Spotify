let songs ;
let currentSong = new Audio();
let currentFolder;
async function getSongs(folder){
    currentFolder = folder
    const res = await fetch(`http://127.0.0.1:5500/${folder}`);
    const data = await  res.text();
    const div = document.createElement('div');
    div.innerHTML = data;
    const a = document.getElementsByTagName('a')
    for (let i = 0; i < a.length; i++) {
        const element = a[i];
        if(element.href.endsWith('.mp3')){
          console.log( songs.push(element.href.split('')[0])); 
        }
    document.body.appendChild(div)
}
}

async function main() {
    let get = await getSongs()
    console.log(get);
}

main()