<?php

namespace app\Controllers;
use app\Models\Reclamation;
use app\Models\Utilisateur;

class loginController{


    public function __construct($container){
        $this->container = $container;
    }

    //Methode qui permet de se déconnecter 
    public function seDeconnecter($request, $response,$args){
        session_destroy();
        $this->container->flash->addMessage('info', 'Vous venez de vous déconnecter !');
        return $response->withRedirect($this->container->router->pathFor('accueil'));
    }

    public function seConnecter($request, $response,$args){
        $auth = $this->verification(
            $request->getParam('mail'),
            $request->getParam('mdp')
        );

        if(!$auth){
            $this->container->flash->addMessage('error', 'Le couple mail/mot de passe n\'est pas correct !');
            return $response->withRedirect($this->container->router->pathFor('connexion'));
        }

        $this->container->flash->addMessage('success', 'Vous êtes connecté !');
        return $response->withRedirect($this->container->router->pathFor('accueil'));
    }

    public static function isConnected(){
        return isset($_SESSION['user']);
    }

    public function verification($mail, $mdp){
        $user = utilisateur::where('mail', $mail)->first();
        if(!$user){
            return false;
        }

        if(password_verify($mdp, $user->mdp)){
            $_SESSION['user'] = $user->id;
            return true;
        }
        
        return false;
    }

       public function checkReclam($request, $response){
  return $this->container->view->render($response, "checkReclam.html.twig");
    }
 public function creereclam($request, $response){
        $reclam = new Reclamation;
        $reclam->nom_etab = $_POST["nom_etab"];
        $reclam->nom_proprio = $_POST["nom_proprio"];
        $reclam->etat = $_POST["etat"];
        $reclam->created_at = date("Y/m/d");
        $reclam->texte = $_POST["texte"];

        $reclam->save();

       
        $this->container->view->render($response, "accueil.html.twig");
    }
   /* public function monProfil($request, $response){
        if(!self::isConnected()){
            return $response->withRedirect($this->container->router->pathFor('connexion'));
        }
        $user = Utilisateur::find($_SESSION['user']);
        $this->container->view->render($response, "Profil.html.twig", ['utilisateur'=>$user]);
    }*/


}