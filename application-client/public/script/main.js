const playlist = []
let pseudo = ""
let id = ""
let token = ""
let socket;

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

function showMusique(musique) {
    let content = "";
    musique.forEach(msq => content += `
    <div class="card mb-3">
        <div class="row no-gutters">
        <div class="col-md-2">
            <img src="${msq["albumPic"]}" class="card-img" alt="...">
        </div>
        <div class="col-md-8">
            <div class="card-body">
            <h5 class="card-title">${msq["titre"]}</h5>
            <p>Nom de l'artiste : ${msq["artistName"]}</p>
            <p>Nom de l'album : ${msq["albumTitle"]}</p>
            <button class="btn btn-primary" text="ajouter" id="${msq["url"]}" onclick="ajouterMusique('${msq["url"].replace(/\n|\r/g,'').replace("'", "")}, ${msq["titre"]}, ${msq["albumPic"]}')" onclick="this.disabled = 'disabled'">ajouter</button>
            </div>
        </div>
        </div>
    </div>`)
    $("#playlist").html(content);

}

/**
 * permet d'envoyer une musique au jukebox
 * en fonction du message de retour renvoyer par le serveur un message est envoyé pour tous les utilisateurs 
 * en ligne ou en cas d'erreur un message d'erreur uniquement a la personne ayant mis le msg
 * @param {*} musique 
 */
function ajouterMusique(musique, titre, image) {
        $.ajax({
            url: "https://jukebox-musique.herokuapp.com/ajouterMusique",
            method: 'POST',
            data: {
                "musique": musique,
                "titre": titre,
                "image": image,
                "pseudo": pseudo,
                "token": token
                
            },
        }).then(function(data) {
           if(data === "true") {
                $.notify("Votre musique a été envoyé", "info")
           }else{
                $.notify("Un problème est survenu", "error")
           }
        })
}

function askPseudo() {
    let content = `
    <div>
        <label class="h1">Entrer un pseudo</label>
        <input type=text id="pseudo" class="input-group-text"></input>
        <button onclick="connection()" class="btn btn-primary">valider</button>
    </div>
    `;
    $("#playlist").html(content);
}




function connection() {
    let tab = window.location.href.split("/")
    token = tab[3]
    let room = token
    console.log(token)
    socket = io.connect("https://projetjukebox.herokuapp.com/")
    pseudo = document.getElementById("pseudo").value
    let content = `
            <div class="card mb-3">
                <div class="row no-gutters">
                    <div class="card-body">
                        <h5 class="card-title">information JukeBox</h5>
                        <div>
                            <h6>Musique actuelle : </h4><p id="titrejuke"></p>
                            <h7>Nombre de musique dans la file d'attente : </h7><p id="nbFile">0</p>
                        </div>
                    </div>
                </div>
            </div>`
    $("#infoJuke").html(content)

    id = generateUUID()
    socket.on('connect', function() {
        socket.emit('user', {'pseudo': pseudo, 'id_user': id})
        socket.emit('room', room)
        $.notify(pseudo+" vous êtes avec nous !", "success")

        socket.on('NewMusique', function (data) {
            data = JSON.stringify(Object.values(data)).replace("]",'').replace("[",'').replace('"', '').split(',')
            $.notify(data[1]+" est ajoutée dans la file grace a "+data[3], "success")
            document.getElementById("nbFile").innerText = parseInt(data[5].replace('"', "").replace("'", "").replace(' "',""));
            
        })
        socket.on('currentMusique', function(data) {
            data = JSON.stringify(Object.values(data)).replace("]",'').replace("[",'').replace('"', '').split(',')
            $.notify("Musique jouée : "+data[1], 'info')
            document.getElementById("titrejuke").innerText = data[1]
        })

    })

    document.getElementById("nav").innerHTML = "Jukebox - "+pseudo
    let urlPlaylist = "https://jukeboxapimusic.herokuapp.com/playlist?token=1"
    if(token !== null) {
        urlPlaylist = "https://jukeboxapimusic.herokuapp.com/playlist?token="+token;
    }
    
    sendXhr(urlPlaylist).then(function (data) {
        console.log(data)
        showMusique(data)
    })
}

function generateUUID()
{
	let d = new Date().getTime();
	
	if( window.performance && typeof window.performance.now === "function" )
	{
		d += performance.now();
	}
	
	let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
	{
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});

return ""+uuid;
}


$(document).ready( () => {
    askPseudo()
})
