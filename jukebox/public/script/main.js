let fileDattente = [];
let start = false;
let token = ""
//envoie une requête asynchrone XHR
//params : urlSend = URL de l'api, success = fonction a appeler en cas de succés (callback)
//return une promesse
function sendXhr(urlSend) {
    return new Promise(((resolve, reject) => {
        let xhr = $.ajax({
            url: urlSend,
            method: 'GET',
            dataType: 'json'
        }).done(data => {
            resolve(data);
        }).fail(error => {
            reject("Problème de données")
        })
    }))
}

/**
 * Lance la lecture d'une nouvelle musique et créer l'element html
 * @param musique
 */
function lireMusique(musique){
    $.ajax({
        url: "https://projetjukebox.herokuapp.com/currentMusique",
        method: 'POST',
        data: {
            "musique": musique,
            "token": token
        },
    })


    if(fileDattente.length !== 0) {
        document.querySelector(".musiqueFileAttente").remove()
        $("#nbMusique").html(fileDattente.length-1)
    }

    musique = JSON.stringify(Object.values(musique)).replace("]",'').replace("[",'').replace('"', '').split(',')
    let content = `
    <div class="lecteur row">
        <div class="musiqueC col-md-auto">
            <h2 class="h2">${musique[1]}</h2>
            <div class="">
                <img src="${musique[2]}" class="card-img" alt="...">
            </div>
            <div>
                <button class="control btn btn-primary" onclick="play(this)">Pause</button>
                <button class="control btn btn-danger" onclick="resume()">Restart</button>
                <button class="btn btn-info" onclick="passerMusique()">Next</button>
                <span class="volume">
                    <a class="stick1 " id="vol0" onclick="volume(0)"></a>
                    <a class="stick2 " id="vol1" onclick="volume(0.3)"></a>
                    <a class="stick3 "  id="vol2" onclick="volume(0.5)"></a>
                    <a class="stick4" id="vol3" onclick="volume(0.7)"></a>
                    <a class="stick5 " id="vol4" onclick="volume(1)"></a>
                </span>
            </div>
           
            <div>
                <div id="progressBarControl">
                    <div id="progressBar">Pas de lecture</div>
                </div>
                    <span id="progressTime">00:00</span>
            </div>
        </div>
        <div id="nextmusique" class="nextmusique col-md-3"></div>
        <span class="sound-btn animate-sound">
                <span class="sound-btn__line sound-btn__line--first"></span>
                <span class="sound-btn__line sound-btn__line--second"></span>
                <span class="sound-btn__line sound-btn__line--third"></span>
                <span class="sound-btn__line sound-btn__line--fourth"></span>
                <span class="sound-btn__line sound-btn__line--fifth"></span>
            </span>
    </div>`
    $("#infoMusique").html(content)
    document.getElementById("musique").setAttribute('src', "https://jukeboxapimusic.herokuapp.com/getFile/?file="+musique[0])
    $("#spinkit").html("");
    if(fileDattente.length >= 2) {
        showNextMusic(fileDattente[1]);
    }


}

function passerMusique() {
    let player = document.getElementById("musique")
    player.currentTime = 100000;
}

function afficherMusiqueListeAttente(musique) {
    let content = $("#fileAttente").html()
    musique = JSON.stringify(Object.values(musique)).replace("]",'').replace("[",'').replace('"', '').split(',')
    content += `
    <div class="card mb-3 bg-light musiqueFileAttente shadow-lg" name="musiqueFileAttente"style="width:20rem">
        <div class="row no-gutters">
            <div class="col-md-4">
                <img src="${musique[2]}" class="card-img" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${musique[1]}</h5>
                </div>
            </div>
        </div>
    </div>
    `
    $("#fileAttente").html(content)
    $("#nbMusique").html(fileDattente.length-1)
}


/**
 * permet l'affichage de la prochaine musique
 * @param {*} musique
 */
function showNextMusic(musique) {
    musique = JSON.stringify(Object.values(musique)).replace("]",'').replace("[",'').replace('"', '').split(',')
    let content = `
    <h3 class="h3">Musique Suivante</h2>
    <h4 class="h4">${musique[1]}</h3>
    <div>
            <img src="${musique[2]}" class="card-img" alt="...">
    </div>
    `
    $('#nextmusique').html(content)
}
let fileAttenteTest = []
/**
 * ajout d'une musique dans la file d'attente
 * @param musique
 */
function ajouterMusique(musique) {
    console.log(musique)

    let musiqueToAdd = musique.musique
    fileAttenteTest.push(musique.musique)
    fileAttenteTest.forEach(elem => {
        if(Object.is(elem, musiqueToAdd)) {
            console.log(elem+" = "+musiqueToAdd)
        }else {
            console.log('not in')

        }
    })
    let alreadyAdd = false
    fileDattente.forEach(elem => {
        if(Object.is(elem.musique, musique.musique)) {
            alreadyAdd = true
            console.log("trouvé")
        }else {
            alreadyAdd = false
            console.log("good boy")
        }
    })

    if(!alreadyAdd){
        fileDattente.push(musique)
        afficherMusiqueListeAttente(musique)
        if(fileDattente.length === 1) {
            lireFileDattente()
        }else {
            showNextMusic(fileDattente[1])
        }
        $.ajax({
            url: "https://projetjukebox.herokuapp.com/musiqueAdd",
            method: 'POST',
            data: {
                "musique": musique,
                "taille": fileDattente.length,
                "token": token
            },
        })
    }else {
        console.log("already add")
    }
}

/**
 * permet de lire la prochaine musique de la file d'attente
 * @returns {boolean}
 */
function lireFileDattente() {
    if(lireMusique(fileDattente[0])) {
        return true
    }
}

/**
 * permet de mettre en pause ou de demarrer la musique
 * @param {*} control
 */
function play(control) {
    let player = document.getElementById("musique")

    if (player.paused) {
        player.play();
        control.textContent = 'Pause';
    } else {
        player.pause();
        control.textContent = 'Play';
    }
}

/**
 * permet de redémarrer la musique a 0
 */
function resume() {
    let player = document.getElementById("musique")
    player.currentTime = 0;
    player.pause();
}

/**
 * permet de controler le volume du jukebox
 * @param {*} vol
 */
function volume(vol) {
    let player = document.getElementById("musique")
    player.volume = vol;
    let color = "#ff9607";
    let off = "#999"
    if(vol === 1){
        document.getElementById("vol0").style.background = color;
        document.getElementById("vol1").style.background = color;
        document.getElementById("vol2").style.background = color;
        document.getElementById("vol3").style.background = color;
        document.getElementById("vol4").style.background = color;
    }else {
        if(vol === 0.7) {
            document.getElementById("vol4").style.background = off;
            document.getElementById("vol0").style.background = color;
            document.getElementById("vol1").style.background = color;
            document.getElementById("vol2").style.background = color;
            document.getElementById("vol3").style.background = color;
        }else {
            if(vol ===0.5) {
                document.getElementById("vol3").style.background = off;
                document.getElementById("vol4").style.background = off;
                document.getElementById("vol0").style.background = color;
                document.getElementById("vol1").style.background = color;
                document.getElementById("vol2").style.background = color;
            }else {
                if (vol === 0.3){
                    document.getElementById("vol2").style.background = off;
                    document.getElementById("vol3").style.background = off;
                    document.getElementById("vol4").style.background = off;
                    document.getElementById("vol0").style.background = color;
                    document.getElementById("vol1").style.background = color;
                }else {
                    document.getElementById("vol0").style.background = off;
                    document.getElementById("vol1").style.background = off;
                    document.getElementById("vol2").style.background = off;
                    document.getElementById("vol3").style.background = off;
                    document.getElementById("vol4").style.background = off;
                }
            }
        }
    }
}

/**
 * update la bar d'avancement
 * @param {*} player
 */
function update(player) {
    let duration = player.duration;    // Durée totale
    let time     = player.currentTime; // Temps écoulé
    let fraction = time / duration;
    let percent  = Math.ceil(fraction * 100);

    let progress = document.querySelector('#progressBar');

    progress.style.width = percent + '%';
    progress.textContent = percent + '%';
}

/**
 * permet d'afficher la durée restante de la musique
 * @param {*} time
 */
function formatTime(time) {
    let hours = Math.floor(time / 3600);
    let mins  = Math.floor((time % 3600) / 60);
    let secs  = Math.floor(time % 60);

    if (secs < 10) {
        secs = "0" + secs;
    }

    if (hours) {
        if (mins < 10) {
            mins = "0" + mins;
        }

        return hours + ":" + mins + ":" + secs; // hh:mm:ss
    } else {
        return mins + ":" + secs;
    }
    document.querySelector('#progressTime').textContent = formatTime(time);
}

/**
 * affiche le spin indiquant que le jukebox est on et qu'il attend une musique
 */
function afficherSpin() {

    let content = `<div class='sk-wave'>
                                <div class='sk-rect sk-rect-1'></div>
                                <div class='sk-rect sk-rect-2'></div>
                                <div class='sk-rect sk-rect-3'></div>
                                <div class='sk-rect sk-rect-4'></div>
                                <div class='sk-rect sk-rect-5'></div>
                           </div>`
    $("#spinkit").html(content);
    let butOn = document.getElementById("on")
    butOn.className = "btn btn-danger start"
    butOn.textContent = "STOP"

    let qr = `<canvas id="canvas"></canvas>
    <a href="https://projetjukebox.herokuapp.com/${token}" class="btn btn-primary"><button class="bg-gradient-primary">Ouvrir Télécomande</button></a>`
    $("#Qrcode").html(qr)
    let canvas = document.getElementById('canvas')

    QRCode.toCanvas(canvas, token, function(error) {
        if(error) console.error(error)
    })
}

function stopJukebox() {
    fileDattente = []
    let content = ``
    $("#spinkit").html(content);
    let butOn = document.getElementById("on")
    butOn.className = "btn btn-primary start"
    butOn.textContent = "START"
    let player = document.getElementById("musique")
    player.pause()
}

/**
 * lorsque la page est chargé
 */
$(document).ready( () => {
    let socket = io();
    let tab = window.location.href.split("/")
    token = tab[3]
    let room = token
    socket.on('connect', function() {
        socket.emit('room', room)
    })

    socket.on('lireMusique', function (data) {
        ajouterMusique(data)
    })
    let player = document.getElementById("musique")
    player.addEventListener('canplaythrough', function () {
        player.play()
    })

    player.addEventListener('ended', function () {
        fileDattente.shift()
        lireFileDattente()
        player.play()
    })
    document.getElementById("on").addEventListener('click', function () {
        if (fileDattente.length == 0) {
            fileDattente=[]
            start = !start
            if(start) {
                afficherSpin()
            }else {
                stopJukebox()
            }


        }
    })


})
