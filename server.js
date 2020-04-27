
const express = require('express')
const app = express()
const mysql = require("mysql");
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors')
const axios = require('axios');
const { Client } = require('pg')
const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();
const path = require('path')
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
const fs = require('fs');
const fileUpload = require('express-fileupload');

app.use(fileUpload({
    createParentPath: true
}));

const client = new Client({
    user: 'ouycepzepwiivj',
    host: 'ec2-46-137-120-243.eu-west-1.compute.amazonaws.com',
    database: 'd5mvtgn3b2290b',
    password: '603437b728e432a98087cff342e4dc4a231c09f47b0275caf01b0cd45f528cb0',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
})

client.connect(function(err,client,done){
    if(err){
     console.log(err);
    }else{
        console.log("Connected!");
    }
})







app.use(cors())

app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  
  app.use(bodyParser.json())


  const PORT = process.env.PORT || 3000;
  const HOST = "0.0.0.0"; 
app.listen(PORT, HOST);
console.log(`API Running on http://${HOST}:${PORT}`)



  


app.get('/', function (req, res) {
    res.send('ça marche les potos');
})


app.get('/getMusic', function (req, res) {
    
    let titre = req.query.titre
    axios.get('https://api.deezer.com/search?q=track:"'+titre+'"&index=0&limit=1')
                .then(function (response) {
                    // handle success
                    console.log(response)
                    res.send(response)
                })
                .catch(function (error) {
                    // handle error
                    console.log(error)
                })
   
    
})


app.get('/getFile', function (req, res) {
    console.log(req.query.file)
    let file = req.query.file
    console.log(file)
    res.sendFile(file, { root: path.join(__dirname, './musiques') })
})


app.post('/postMusic', function (req, res) {
        console.log("PostMusic")        
        console.log("Body.music: "+req.body.file)
        console.log("Req.files: "+req.files)
        console.log("Header: "+req.headers.name)

        let mus = req.files.music
        mus.mv('./musiques/'+mus.name)

        client.query(`INSERT INTO musique (titre, chemin) VALUES ('${req.body.name}', '${mus.name}')`, function(err, result, fields) {
            if (err) {
                console.log(err)
            }else{
                console.log("insert musique réussi")
                res.sendStatus(200); //send back that everything went ok
            }
        })
        
    
})


app.get('/musiques',function (req, res) {

  
    client.query('SELECT titre,chemin,id FROM musique ORDER BY id', function(err, result, fields) {
        let tab = []
        if (err) {
            console.log(err)
        }else{
            let musiques = result.rows
            //console.log(typeof(res))
            //console.log(res)

            async function asyncForEach(array, callback) {
                for (let index = 0; index < array.length; index++) {
                    await callback(array[index], index, array);
                }
            }
            
            const start = async () => {
                await asyncForEach(musiques, async (element) => {
                    let titre = element.titre
                    let id = element.id
                    while(titre.includes("é") || titre.includes("à") || titre.includes("'") || titre.includes("è")){
                        titre = titre.replace("'","")
                        titre = titre.replace("é","e")
                        titre = titre.replace("à","a")
                        titre = titre.replace("è","e")
                    }
                
                
                    //console.log(titre)
                    axios.get('https://api.deezer.com/search?q=track:"'+titre+'"&index=0&limit=1')
                    .then(function (response) {
                        // handle success
                        if(response.data.total==0){
                            console.log("missing "+titre)
                        }
                        if(response.data == []){
                            console.log("ceci es undifined")
                        }else{
                            

                            let title = response.data['data'][0].title
                            let artistName = response.data['data'][0].artist.name
                            let artistPic = response.data['data'][0].artist.picture
                            let albumTitle = response.data['data'][0].album.title
                            let albumCover =response.data['data'][0].album.cover
                           
                            while(title.includes('"')){
                                console.log("old title: " + title)
                                title = title.replace('"',"")
                                console.log("new title: " + title)
                            }

                            tab.push(JSON.parse(
                                '{ "id": '+id+', "title" : "'+title+'", "artistName" : "'+artistName+'", "artistPic" : "'+artistPic+'", "albumTitle" : "'+albumTitle+'", "albumPic" : "'+albumCover+'"}'
                            ))
                        }
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error)
                    })
                    await waitFor(200);
                });
                //console.log("tab: "+tab)
                
            res.send(tab)
                
            }
            start();
           
        }
        
      })

})


app.put('/newToken',function (req, res) {
    console.log("request body:"+req.body)
    let oldToken = req.body.token
    let newToken = tokgen.generate()
    let id = null

    console.log("Oldtoken: "+oldToken)
    let query =`SELECT id FROM jukebox WHERE token = '${oldToken}'`
    client.query(query, function(err, result, fields) {
        if (err) {
            console.log(err)
        }else{
            if(result.rows[0]!=null){
                id = result.rows[0].id
                client.query(`UPDATE jukebox SET token = '${newToken}' WHERE id=${id}`,function(err, result, fields) {
                    if (err) {
                        console.log(err)
                    }else{
                        console.log("update effectuée")
                        res.send(newToken)
                    }
                })
                
            }else{
                res.send("Token inconnu")
            }
            
            
        }
    })        
    

})


app.get('/playlist',function (req, res) {

    let jukebox = req.query.token
    query = `SELECT musique.titre,musique.id,musique.chemin FROM ( musique INNER JOIN appartient ON musique.id = appartient.id_musique ) INNER JOIN jukebox ON appartient.id_playlist = jukebox.id_playlist WHERE jukebox.token = '${jukebox}' `

    client.query(query, function(err, result, fields) {
        let tab = []
        if (err) {
            console.log(err)
        }else{
            let musiques = result.rows
            //console.log(typeof(res))
            //console.log(res)

            async function asyncForEach(array, callback) {
                for (let index = 0; index < array.length; index++) {
                    await callback(array[index], index, array);
                }
            }
            
            const start = async () => {
                await asyncForEach(musiques, async (element) => {
                    let titre = element.titre
                    let id = element.id
                    let url = element.chemin
                    while(titre.includes("é") || titre.includes("à") || titre.includes("'") || titre.includes("è")){
                        titre = titre.replace("'","")
                        titre = titre.replace("é","e")
                        titre = titre.replace("à","a")
                        titre = titre.replace("è","e")
                    }
                
                
                    //console.log(titre)
                    axios.get('https://api.deezer.com/search?q=track:"'+titre+'"&index=0&limit=1')
                    .then(function (response) {
                        // handle success
                        if(response.data.total==0){
                            console.log("missing "+titre)
                        }
                        if(response.data == []){
                            console.log("ceci es undifined")
                        }else{

                            let title = response.data['data'][0].title
                            let artistName = response.data['data'][0].artist.name
                            let artistPic = response.data['data'][0].artist.picture_big
                            let albumTitle = response.data['data'][0].album.title
                            let albumCover =response.data['data'][0].album.cover_big
                           
                            while(title.includes('"')){
                                console.log("old title: " + title)
                                title = title.replace('"',"")
                                console.log("new title: " + title)
                            }

                            tab.push(JSON.parse(
                                '{ "id": '+id+', "titre" : "'+title+'", "artistName" : "'+artistName+'", "artistPic" : "'+artistPic+'", "albumTitle" : "'+albumTitle+'", "albumPic" : "'+albumCover+'", "url": "'+url+'" }'
                            ))
                            console.log(tab)
                            
                        }
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error)
                    })
                    await waitFor(300);
                    
                });
                //console.log("tab: "+tab)
                
            res.send(tab)
                
            }
            start();
            
            }
            
        })


})



/**const db = mysql.createConnection({
    host: "mysql",
    user: "com",
    password: "com",
    database: "com"
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log("Connected to database");
})*/






app.get("*", (req, res) => {
    res.status(400).json({ "type": "error", "error": 400, "message": "Ressource non disponible : " + req._parsedUrl.pathname });
    res.status(500).json({ "type": "error", "error": 500, "message": "Pb serveur : " + req._parsedUrl.pathname });
});


app.put("*", (req, res) => {
    res.status(400).json({ "type": "error", "error": 400, "message": "Ressource non disponible : " + req._parsedUrl.pathname });
    res.status(500).json({ "type": "error", "error": 500, "message": "Pb serveur : " + req._parsedUrl.pathname });
});


/**
 

Routes api
$app->get('/getMusic', "\\app\\Controllers\\musicController:getDeezer")->setName('getMusic');
$app->get('/getFile', "\\app\\Controllers\\musicController:testFile")->setName('getFile');
$app->get('/postMusic', "\\app\\Controllers\\musicController:post")->setName('postMusic');
$app->post('/postMusic', "\\app\\Controllers\\musicController:post");
 
 
 
 <?php
namespace app\Controllers;



use app\Models\Search as deez;
use app\Models\Musique;





class musicController{

    public function getDeezer(){

        $mus=$this->getMusic();
        $search = new deez($mus);
        $data = $search->search();
        $a = array(
            "Titre" => $data[0]->title,
            "Duree" => $data[0]->duration,
            "Auteur" => $data[0]->artist->name,
            "Photos_auteur" => $data[0]->artist->picture,
            "Photos_auteur_small" => $data[0]->artist->picture_small,
            "Photos_auteur_medium" => $data[0]->artist->picture_medium,
            "Photos_auteur_big" => $data[0]->artist->picture_big,
            "Photos_auteur_xl" => $data[0]->artist->picture_xl,
            "Titre_album" => $data[0]->album->title,
            "Cover_album" => $data[0]->album->cover,
            "Cover_album_small" => $data[0]->album->cover_small,
            "Cover_album_medium" => $data[0]->album->cover_medium,
            "Cover_album_big" => $data[0]->album->cover_big,
            "Cover_album_xl" => $data[0]->album->cover_xl,
        );
        echo json_encode($a);


    }

    public function getMusic(){
        $tab = getallheaders();
        return $tab["Musicname"];

    }

    public function testFile(){

        $file = "musiques/".file_get_contents('php://input');
        if (file_exists($file)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Length: ' . filesize($file));
            readfile($file);
            exit;
        }
        var_dump($file);


    }

    public function post(){

        //on recup le json de la requête
        $json_string = file_get_contents('php://input');
        $data = json_decode( preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $json_string), true );

        //on récupère les musiques qui auraient éventuellement le même nom ou fichier mp3
        $checktitre = Musique::select("*")->where('titre', "=", $data["titre"] )->get();
        $checkmp3 = Musique::select("*")->where('chemin', "=", $data["chemin"] )->get();


        //on vérifie donc si la musique que l'on veut insérer est bien unique, sinon on renvoie un message d'erreur

        if ($checktitre->contains("titre","=",$data["titre"])){
            echo ("Le titre existe déjà");
        }elseif ($checkmp3->contains("chemin","=",$data["chemin"])){
            echo ("Le fichier mp3 existe déjà");
        }else{
            $musique = Musique::create([
            'titre' => $data["titre"],
            'chemin' => $data["chemin"]
            ]);
            echo("Done");
        }



    }


}

 */