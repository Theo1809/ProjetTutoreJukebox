<?php

namespace app\Controllers;

use app\Models\Jukebox;
use app\Models\Etablissement;
use app\Models\Proprietaire;

class jukeboxController{
    public function __construct($container){
        $this->container = $container;
    }

    public function showJukebox($request, $response)
    {
               $juke = Jukebox::select('jukebox.id','jukebox.nom','jukebox.etat','proprietaire.nom_proprio','proprietaire.prenom','etablissement.nom_etab','etablissement.adresse_etab')->Join('etablissement', 'jukebox.id_etablissement', '=', 'etablissement.id')->Join('proprietaire', 'etablissement.id_proprietaire', '=', 'proprietaire.id')->orderBy('jukebox.id')->get();
                
  return $this->container->view->render($response, "checkJukebox.html.twig", ['juke'=>$juke]);
    }

   public function updateJukebox($request, $response, $args)
    {
               $juke = Jukebox::select('jukebox.id','jukebox.nom','jukebox.etat','proprietaire.nom_proprio','proprietaire.prenom','etablissement.nom_etab','etablissement.adresse_etab')->Join('etablissement', 'jukebox.id_etablissement', '=', 'etablissement.id')->Join('proprietaire', 'etablissement.id_proprietaire', '=', 'proprietaire.id')->where('jukebox.id',intVal($args['id']))->orderBy('jukebox.id')->get();

  return $this->container->view->render($response, "modifJukebox.html.twig", ['juke'=>$juke]);
    }
    
      public  function update($request, $response, $args)
      {
        $juker = Jukebox::find(intVal($args['id']));
        $etab = Etablissement::find($juker->id_etablissement);
        $proprio = Proprietaire::find($juker->id_etablissement);
        $juker->nom = $_POST["nom"];
        $etab->nom_etab = $_POST["nom_etab"];
        $juker->etat = $_POST["etat"];
        $etab->adresse_etab = $_POST["adresse_etab"];
        $proprio->nom_proprio = $_POST["nom_proprio"];
        $proprio->prenom = $_POST["prenom"];
        $juker->save();
        $etab->save();
        $proprio->save();

  $juke = Jukebox::select('jukebox.id','jukebox.nom','jukebox.etat','proprietaire.nom_proprio','proprietaire.prenom','etablissement.nom_etab','etablissement.adresse_etab')->Join('etablissement', 'jukebox.id_etablissement', '=', 'etablissement.id')->Join('proprietaire', 'etablissement.id_proprietaire', '=', 'proprietaire.id')->orderBy('jukebox.id')->get();
                    
  return $this->container->view->render($response, "checkJukebox.html.twig", ['juke'=>$juke]);
      }
   public function supprimer($request, $response, $args){
        $juker = Jukebox::find(intVal($args['id']));
        $juker->delete();

  $juke = Jukebox::select('jukebox.id','jukebox.nom','jukebox.etat','proprietaire.nom_proprio','proprietaire.prenom','etablissement.nom_etab','etablissement.adresse_etab')->Join('etablissement', 'jukebox.id_etablissement', '=', 'etablissement.id')->Join('proprietaire', 'etablissement.id_proprietaire', '=', 'proprietaire.id')->orderBy('jukebox.id')->get();
  return $this->container->view->render($response, "checkJukebox.html.twig", ['juke'=>$juke]);
    
      }
public function ajouter($request, $response, $args){
        $this->container->view->render($response, 'creationJukebox.html.twig');
      }

      public  function afficher($request, $response, $args)
      {
     $juker = new Jukebox();
     //   $etab = Etablissement::select('etablissement.id');
        $juker->nom = $_POST["nom"];
        $juker->id_etablissement= $_POST["id_etablissement"];
        $juker->id_playlist = $_POST["id_playlist"];
        $juker->date_creation= date("Y/m/d");
        $juker->etat = 1;
        $juker->save();
     //   $etab->save();

  $juke = Jukebox::select('jukebox.id','jukebox.nom','jukebox.etat','proprietaire.nom_proprio','proprietaire.prenom','etablissement.nom_etab','etablissement.adresse_etab')->Join('etablissement', 'jukebox.id_etablissement', '=', 'etablissement.id')->Join('proprietaire', 'etablissement.id_proprietaire', '=', 'proprietaire.id')->orderBy('jukebox.id')->get();
                    
  return $this->container->view->render($response, "checkJukebox.html.twig", ['juke'=>$juke]);
      }

}