<?php

namespace app\Controllers;

use Faker\Provider\tr_TR\DateTime;

use app\Models\Utilisateur;

class utilisateurController
{
  

    public function __construct($container)
    {
        $this->container = $container;
    }

    
    
    public function voir($request, $response,$args)
	{
        return $this->container->view->render($response, "utilisateur/creationCompte.html.twig");

    }
    public function creerCompte($request, $response) {
         
                $user= new Utilisateur();
                $user->nom = $_POST["nom"];
                $user->mdp = password_hash($_POST["mdp"], PASSWORD_DEFAULT);
                $user->mail = $_POST["mail"];
                $user->date_adhesion = date("Y/m/d");
                $user->save();
               
                return $this->container->view->render($response, "accueil.html.twig");
           
    }


}