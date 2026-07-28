let currSong = new Audio();
let songsarray = [];
let currFolder;
let songindex = 0
let playbtn = document.querySelector(".play");
let mutebtn = document.querySelector(".mute");
let duration = document.querySelector(".dur");
let seekbar = document.querySelector(".seekbar");
let circle = document.querySelector(".circle");
let nextbtn = document.querySelector(".right");
let previousbtn = document.querySelector(".left");
let volumeseek = document.querySelector(".volumeseek");
let volumecircle = document.querySelector(".volumecircle");
let songname = document.querySelector(".songname");


async function getSongs(folder) {
    currFolder = folder;
    let getSongs1 = await fetch(`/${folder}/`);
    let getSongs2 = await getSongs1.text();
    let getSongs3 = document.createElement("div");
    getSongs3.innerHTML = getSongs2;
    let getSongs4 = getSongs3.getElementsByTagName("a");
    songsarray = [];
    for (let index = 0; index < getSongs4.length; index++) {
        if (getSongs4[index].href.endsWith(".mp3")) {
            songsarray.push(getSongs4[index].href.split(`/${folder}/`)[1]);

        }
    }

    let songlist1 = document.querySelector(".oip");
    songlist1.innerHTML = "";
    for (let index = 0; index < songsarray.length; index++) {
        let clean1 = decodeURIComponent(songsarray[index]);
        let clean2 = clean1.replaceAll(".mp3", "");
        songlist1.innerHTML += `<li class ="nhov music">${clean2} </li>`;

    }
    let eachsong = document.querySelector(".oip").getElementsByTagName("li");
    for (let index = 0; index < songsarray.length; index++) {
        eachsong[index].addEventListener("click", () => {

            currSong.src = `/${currFolder}/` + songsarray[index];
            currSong.play();
            playbtn.src = "assets/pause.svg";

            songindex = index;
            let clean1 = decodeURIComponent(songsarray[index]);
            let clean2 = clean1.replaceAll(".mp3", "");
            songname.innerHTML = clean2;



        })

    }
    return songsarray;


}


async function displayAlbums() {
    let albums = [];
    let cards = document.querySelector(".cards");
    let displayAlbums1 = await fetch("assets/Songs/");
    let displayAlbums2 = await displayAlbums1.text();
    let displayAlbums3 = document.createElement("div");
    displayAlbums3.innerHTML = displayAlbums2
    let displayAlbums4 = displayAlbums3.getElementsByTagName("a")
    for (let index = 0; index < displayAlbums4.length; index++) {
        if (displayAlbums4[index].href.includes("/assets/Songs/")) {
            albums.push(displayAlbums4[index].href.split("/Songs/")[1]);
        }

    }
    for (let index = 0; index < albums.length; index++) {

        let albums1 = await fetch(`assets/Songs/${albums[index]}/info.json`);
        let albums2 = await albums1.json();
        cards.innerHTML += `<div data-folder=${albums[index]} class="card">
        <img src="assets/Songs/${albums[index]}/cover.jpg" alt="" class="im">
        <h2 class="txt1">${albums2.title}</h2>
        <p class="txt2">${albums2.description}</p>
        </div>`
    }
    let allCards = document.querySelectorAll(".card");

    for (let index = 0; index < albums.length; index++) {
        allCards[index].addEventListener("click", async () => {
            await getSongs("assets/Songs/" + allCards[index].dataset.folder);
            songindex = 0;

        })

    }


}
async function main() {
    await displayAlbums()
    await getSongs("assets/Songs/Alec");



    playbtn.addEventListener("click", () => {
        if (currSong.paused) {

            currSong.play();
            playbtn.src = "assets/pause.svg";
        }
        else {
            currSong.pause();
            playbtn.src = "assets/play.svg";
        }
    })
    mutebtn.addEventListener("click", () => {
        if (currSong.volume == 0) {
            currSong.volume = 1
            mutebtn.src = "assets/mute.svg";
        } else {
            currSong.volume = 0;
            mutebtn.src = "assets/unmute.svg";
        }
    })
    document.addEventListener("keydown", (e) => {
        if (e.key == " ") {
            if (currSong.paused) {
                currSong.play();
                playbtn.src = "assets/pause.svg";
            } else {
                currSong.pause();
                playbtn.src = "assets/play.svg";
            }
        }
    })
    document.addEventListener("keydown", (e) => {
        if (e.key == "m" || e.key == "M") {
            if (currSong.volume == 0) {
                currSong.volume = 1;
                mutebtn.src = "assets/mute.svg";
            } else {
                currSong.volume = 0;
                mutebtn.src = "assets/unmute.svg";
            }
        }
    })
    currSong.addEventListener("timeupdate", () => {
        let secs = Math.floor(currSong.currentTime % 60);
        let mins = Math.floor(currSong.currentTime / 60);
        let orgsecs = Math.floor(currSong.duration % 60);
        let orgmins = Math.floor(currSong.duration / 60);
        duration.innerHTML = `${mins}:${secs}/${orgmins}:${orgsecs}`;
        let percent = currSong.currentTime / currSong.duration;
        circle.style.left = percent * 100 + "%";
    })
    seekbar.addEventListener("click", (e) => {
        let percent = e.offsetX / seekbar.clientWidth;
        currSong.currentTime = percent * currSong.duration;
        circle.style.left = percent * 100 + "%";

    })
    nextbtn.addEventListener("click", () => {
        if (songindex < songsarray.length - 1) {
            songindex++;
            currSong.src = `/${currFolder}/` + songsarray[songindex];
            currSong.play();
            let clean1 = decodeURIComponent(songsarray[songindex]);
            let clean2 = clean1.replaceAll(".mp3", "");
            songname.innerHTML = clean2;
        }

    })
    previousbtn.addEventListener("click", () => {
        if (songindex > 0) {
            songindex--;
            currSong.src = `/${currFolder}/` + songsarray[songindex];
            currSong.play();
            let clean1 = decodeURIComponent(songsarray[songindex]);
            let clean2 = clean1.replaceAll(".mp3", "");
            songname.innerHTML = clean2;

        }
    })
    volumeseek.addEventListener("click", (e) => {
        let percent = e.offsetX / volumeseek.clientWidth;
        currSong.volume = percent;
        volumecircle.style.left = percent * 100 + "%"
    })
    currSong.addEventListener("ended", () => {
        if (songindex < songsarray.length - 1) {
            songindex++;
            currSong.src = `/${currFolder}/` + songsarray[songindex];
            currSong.play();
            let clean1 = decodeURIComponent(songsarray[songindex]);
            let clean2 = clean1.replaceAll(".mp3", "");
            songname.innerHTML = clean2;
            playbtn.src = "assets/pause.svg"
        }
        else {
            playbtn.src = "assets/play.svg"
        }
    })



}
main();

