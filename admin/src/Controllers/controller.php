<?php

namespace app\Controllers;
use Illuminate\Pagination\Paginator;
use app\Models\Playlist;
use app\Models\Reclamation;
use app\Models\Musique;
use app\Models\Appartient;

class controller{
    public function __construct($container){
        $this->container = $container;
    }
    public function checkPlaylist($request, $response){
           $playlist = Playlist::select("*")->orderBy('id')->get();
$playlist2 = Playlist::all()->random(2);
  return $this->container->view->render($response, "checkPlaylist.html.twig", ['playlist'=>$playlist , 'playlist2'=>$playlist2]);
    }
        public function createPlaylist($request, $response){
  return $this->container->view->render($response, "createPlaylist.html.twig");
    }
       
        public function checkReclam($request, $response){
     $reclam = Reclamation::all();
  return $this->container->view->render($response, "checkReclam.html.twig", ['reclam'=>$reclam]);
    }


    public function toto($request, $response, $args){
        $reclam2 = Reclamation::find(intVal($args['id']));
            $reclam2->delete();
        $reclam = Reclamation::all();
 return $this->container->view->render($response, "checkReclam.html.twig", ['reclam'=>$reclam]);
    
      }

public function ajouter($request, $response){
  return $this->container->view->render($response, "ajoutMusique.html.twig");
    }

 public function declarer($request, $response){
  return $this->container->view->render($response, "declarerJukebox.html.twig");
    }
 public function check($request, $response, $args){
        $music = Appartient::select("musique.*")->leftJoin('musique', 'appartient.id_musique', '=', 'musique.id')->where('appartient.id_playlist',intVal($args['id']))->get();
        $this->container->view->render($response, 'playlist.html.twig', ['music'=>$music]);
      }

    public function voir($request, $response){
           $playlist = Playlist::select("*")->orderBy('id')->get();
$playlist2 = Playlist::all()->random(2);
  return $this->container->view->render($response, "checkPlaylist.html.twig", ['playlist'=>$playlist , 'playlist2'=>$playlist2]);
    }
 public function addMusic($request, $response){
           $music = Musique::all();
  return $this->container->view->render($response, "addMusique.html.twig", ['music'=>$music]);
    }


}