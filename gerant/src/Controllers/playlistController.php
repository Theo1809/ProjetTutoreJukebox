<?php

namespace app\Controllers;

use app\Models\Musique;
use app\Models\Playlist;
use app\Models\Appartient;

class PlaylistController{

    public function __construct($container){
        $this->container = $container;
    }

    public function accessCreationPlaylist($request, $response){
        // $musiques = Musique::select("*")->orderBy('id')->get();

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, "https://jukeboxapimusic.herokuapp.com/musiques");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($curl);
        curl_close($curl);

        $musiquesDeezer = json_decode($output,true);

        $this->container->view->render($response, 'CreerPlaylist.html.twig', ['musiques'=> $musiquesDeezer]);
    }

    public function accessDeletePlaylist($request, $response,$args){
        $playlist = Playlist::select("*")->where('playlist.id','=',$args['id'])->get();
        $this->container->view->render($response, 'verificationDeletePlaylist.html.twig',["playlist"=> $playlist]);
    }

    public function accessModificationPlaylist($request, $response,$args){
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, "https://jukeboxapimusic.herokuapp.com/musiques");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($curl);
        curl_close($curl);

        $musiquesDeezer = json_decode($output,true);
        // SELECT * FROM public.appartient inner join public.musique on musique.id = appartient.id_musique where id_playlist='+req.params.id+';'
        $playlist = Playlist::
        select("*")
        // select('playlist.nom','playlist.description','playlist.auteur','playlist.image_playlist','appartient.id_musique')
        
        // ->Join('appartient','playlist.id','=','appartient.id_playlist')
        ->where('playlist.id','=',$args['id'])
        ->get();

        $musiquedeplaylist = Playlist::select('appartient.id_musique')
        ->Join('appartient','playlist.id','=','appartient.id_playlist')
        ->where('playlist.id','=',$args['id'])
        ->orderBy('id_musique')
        ->get();
        $this->container->view->render($response, 'modifierPlaylist.html.twig', ['musiques'=> $musiquesDeezer,"playlist"=> $playlist,"musiquedeplaylist"=> $musiquedeplaylist]);
    }

    public function creerPlaylist($request, $response){
        $playlist = new Playlist();

        $playlist->nom = $_POST["nom"];
        $playlist->description = $_POST["description"];
        $playlist->auteur = $_POST["auteur"];
        $playlist->image_playlist = $_POST["image_playlist"];

        $playlist->save();

        $array = $_POST["id_musique"];

        // var_dump($array);

        foreach($array as $value){
            $appartient = new appartient();
            $appartient->id_musique = $value;
            $appartient ->id_playlist = $playlist->id;
            $appartient->save();
        }
        $playlist2 = Playlist::all()->random(2);
        $playlists = Playlist::all();
        $this->container->view->render($response, "checkPlaylist.html.twig", ['playlist'=> $playlists,'playlist2' =>$playlist2]);
    }

    public function supprimerPlaylist($request,$response,$args){
        if(is_int(intval($args['id']))){

            $musiquedeplaylist = Playlist::select('appartient.id_musique')
            ->Join('appartient','playlist.id','=','appartient.id_playlist')
            ->where('playlist.id','=',$args['id'])
            ->orderBy('id_musique')
            ->get();

            // if($musiquedeplaylist){

            // }
            
            $tabavecjustedesID = [];
            foreach($musiquedeplaylist as $idmusic){
                array_push($tabavecjustedesID,$idmusic->id_musique);
            }

            // var_dump($tabavecjustedesID);

            $tabIdAppartientASupprimer = [];
            foreach($tabavecjustedesID as $musique){
                $deletedRow = Appartient::select('*')->where('id_musique','=',$musique)->where('id_playlist','=',$args['id'])->get();
                $IdAppartientASupprimer = $deletedRow[0]->id;
                array_push($tabIdAppartientASupprimer,$IdAppartientASupprimer);
            }
            // var_dump($tabIdAppartientASupprimer);
            Appartient::destroy($tabIdAppartientASupprimer);

            Playlist::destroy($args['id']);
        }


        
        
        $playlist2 = Playlist::all()->random(2);
        $playlists = Playlist::all();
        $this->container->view->render($response, "checkPlaylist.html.twig", ['playlist'=> $playlists,'playlist2' =>$playlist2]);;
    }

    public function modifierPlaylist($request, $response,$args){
        $playlist = Playlist::find(intVal($args['id']));
        if($playlist->nom != $_POST["nom"]){
            $playlist->nom = $_POST["nom"];
        }
        if($playlist->description != $_POST["description"]){
            $playlist->description = $_POST["description"];
        }
        if($playlist->auteur != $_POST["auteur"]){
            $playlist->auteur = $_POST["auteur"];
        }
        if($playlist->image_playlist != $_POST["image_playlist"]){
            $playlist->image_playlist = $_POST["image_playlist"];
        }
        $playlist->save();
        
        $listMusiqueAJourString = $_POST["id_musique"];

        $listMusiqueAJourInt = [];

        foreach($listMusiqueAJourString as $idString){
            array_push($listMusiqueAJourInt, intval($idString));
        }

        $musicAvant = Playlist::select('appartient.id_musique')
        ->Join('appartient','playlist.id','=','appartient.id_playlist')
        ->where('playlist.id','=',$playlist->id)
        ->orderBy('id_musique')
        ->get();

        $tabmusicAvant = [];
        foreach($musicAvant as $idmusic){
            array_push($tabmusicAvant,$idmusic->id_musique);
        }
        
        $musiqueSupprimer = array_diff($tabmusicAvant,$listMusiqueAJourInt);
        $musiqueAjouter = array_diff($listMusiqueAJourInt,$tabmusicAvant);

        
        $tabIdAppartientASupprimer = [];
        foreach($musiqueSupprimer as $musiqueS){
            $deletedRow = Appartient::select('*')->where('id_musique','=',$musiqueS)->where('id_playlist','=',$playlist->id)->get();
            $IdAppartientASupprimer = $deletedRow[0]->id;
            array_push($tabIdAppartientASupprimer,$IdAppartientASupprimer);
        }

        Appartient::destroy($tabIdAppartientASupprimer);

        foreach($musiqueAjouter as $musicA){
            $appartient = new appartient();
            $appartient->id_musique = $musicA;
            $appartient ->id_playlist = $playlist->id;
            $appartient->save();
        }

        
        $playlist2 = Playlist::all()->random(2);
        $playlists = Playlist::all();
        $this->container->view->render($response, "checkPlaylist.html.twig", ['playlist'=> $playlists,'playlist2' =>$playlist2]);
    }

}