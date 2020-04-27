
function afficherFormulaire(){
    let form = document.getElementById("form")
    form.style.display = 'block'
}

function cacherFormulaire(){
    let form = document.getElementById("form")
    form.style.display = 'none'
}

function toggleFormulaire(){
    let btnclose = document.getElementById("closeform")
    btnclose.addEventListener("click", cacherFormulaire())

    let btnopen = document.getElementById("openform")
    btnopen.addEventListener("click", afficherFormulaire())
}

function hideAll() {
    let musics = document.getElementsByClassName("cardMusic")
    for (let i = 0; i<musics.length; i++){
        musics[i].style.display= 'none'
    }
}

function showAll() {
    let musics = document.getElementsByClassName("cardMusic")
    for (let i = 0; i<musics.length; i++){
        musics[i].style.display= 'block'
    }
}

function buttonAll(){
    let button = document.getElementById("All")
    button.addEventListener("click", function () {
        showAll()
    })
}


function comparaison(rech, music) {
    let trouve = false
    rech.toLowerCase()
    let recherche = rech.toLowerCase().split(' ')
    let musicTitre = music.getAttribute("titreMusic").toLowerCase().split(' ')
    let musicArtiste = music.getAttribute("artisteMusic").toLowerCase().split(' ')
    let musicAlbum = music.getAttribute("albumMusic").replace(/,/g, " ").toLowerCase().split(' ')

    recherche.forEach(function (mot) {

        musicTitre.forEach(function (titre) {
            if (mot == titre) {
                trouve = true
            }
        })

        musicArtiste.forEach(function (titre) {
            if (mot == titre) {
                trouve = true
            }
        })

        musicAlbum.forEach(function (descr) {
            if (mot == descr) {
                trouve = true
            }
        })

    })

    return trouve

}


function afficherRecherche(champRecherche) {
    let musics = document.getElementsByClassName("cardMusic")
    let trouve = 0
    let champ = champRecherche.value
    hideAll()

    Array.from(musics).forEach(function (music) {
        if (comparaison(champ, music)){
            music.style.display = "block"
            trouve ++
        }
    })
    but = document.getElementById("buttons")
    if (trouve == 0){
        alert("Pas de musiques correspondant à votre recherche")
    }else {
        if(trouve == 1){but.innerHTML = "1 résultat trouvé"}
        else {
            but.innerHTML = trouve + " résultats trouvés"
        }
    }
}


function recherche(){
    let recherche = document.getElementById("rechercheButton")
    recherche.addEventListener("click", function () {
        let champ = document.getElementById("rechercheChamp")
        afficherRecherche(champ)
    })

}




window.onload = function selection() {
    buttonAll()
    recherche()
    toggleFormulaire()

}