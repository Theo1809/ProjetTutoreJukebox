<?php

require_once 'vendor/autoload.php';
require_once 'src/config/config.inc.php';

use Slim\Http\Request;
use Slim\Http\Response;
use Illuminate\Database\Capsule\Manager as DB;
use app\Models\Musique;
use app\middleware\AuthMiddleware;


$container = array();


$container["flash"] = function ($container){
    return new \Slim\Flash\Messages;
};

$container['auth'] = function ($container){
    return new app\Controllers\loginController($container);
};

$container["view"] = function ($container){

    $view = new \Slim\Views\Twig(__DIR__.'/src/views');
    $router = $container->get('router');
    $uri = \Slim\Http\Uri::createFromEnvironment(new \Slim\Http\Environment($_SERVER));
    $view->addExtension(new \Slim\Views\TwigExtension($router, $uri));
 $view->getEnvironment()->addGlobal('auth', new app\Controllers\loginController($container));
    $view->getEnvironment()->addGlobal('flash', $container->flash);
    return $view;
};

$container['settings'] = $config;

//Eloquent
$app = new \Slim\App($container,[
    'settings' => [
        'debug' => true,
        'displayErrorDetails' => true
    ]
]);

/**
 * on initialise la conn
 */
$capsule = new DB();
$capsule->addConnection($container['settings']['db']);
$capsule->setAsGlobal();
$capsule->bootEloquent();

$container['db'] = function ($container) use ($capsule) {
    return $capsule;
};

session_start();

$app->get('/', function(Request $request, Response $response, $args){
    return $this->view->render($response, 'accueil.html.twig');
})->setName('accueil');

$app->get('/connection', function(Request $request, Response $response, $args){
    return $this->view->render($response, 'Connexion.html.twig');
})->setName('connexion');
$app->post('/connection', "\\app\\Controllers\\loginController:seConnecter");
$app->get('/deconnection', "\\app\\Controllers\\loginController:seDeconnecter")->setName('deconnection');
$app->get('/creercompte', "\\app\\Controllers\\utilisateurController:voir")->setName('creacompte');
$app->post('/creercompte', "\\app\\Controllers\\utilisateurController:creerCompte");



//Routes api
$app->get('/getMusic', "\\app\\Controllers\\musicController:getDeezer")->setName('getMusic');
$app->get('/getFile', "\\app\\Controllers\\musicController:testFile")->setName('getFile');


/*
$app->group('', function() {*/

$app->get('/playlist{id}', "\\app\\Controllers\\controller:check")->setName('playlist');
$app->post('/playlist{id}', "\\app\\Controllers\\controller:voir");
$app->get('/addMusic', "\\app\\Controllers\\controller:addMusic")->setName('addMusic');
$app->get('/createPlaylist', "\\app\\Controllers\\playlistController:accessCreationPlaylist")->setName('createPlaylist');
$app->post('/createPlaylist', '\\app\\Controllers\\playlistController:creerPlaylist');
$app->get('/updatePlaylist{id}', "\\app\\Controllers\\playlistController:accessModificationPlaylist")->setName('updatePlaylist');
$app->post('/updatePlaylist{id}', "\\app\\Controllers\\playlistController:modifierPlaylist");

$app->get('/verifSupprimerPlaylist{id}', "\\app\\Controllers\\playlistController:accessDeletePlaylist")->setName('supprimerPlaylist');
$app->get('/supprimerPlaylist{id}', "\\app\\Controllers\\playlistController:supprimerPlaylist")->setName('testSupprimerPlaylist');

$app->get('/checkPlaylist', "\\app\\Controllers\\controller:checkPlaylist")->setName('checkPlaylist');
$app->get('/checkJukebox', "\\app\\Controllers\\jukeboxController:showJukebox")->setName('checkJukebox');

$app->get('/updateJukebox{id}', "\\app\\Controllers\\jukeboxController:updateJukebox")->setName('updateJukebox');
$app->post('/updateJukebox{id}', "\\app\\Controllers\\jukeboxController:update");

$app->get('/ajouterJukebox', "\\app\\Controllers\\jukeboxController:ajouter")->setName('ajouterJukebox');
$app->post('/ajouterJukebox', "\\app\\Controllers\\jukeboxController:afficher");

$app->get('/ajouterMusique', "\\app\\Controllers\\controller:ajouter")->setName('ajouterMusique');

$app->get('/checkReclam', "\\app\\Controllers\\loginController:checkReclam")->setName('checkReclam');
$app->post('/checkReclam', '\\app\\Controllers\\loginController:creereclam');
$app->get('/declarer', "\\app\\Controllers\\controller:declarer")->setName('declarer');/*
})->add(new AuthMiddleware($app->getContainer()));*/


try {
    $app->run();
} catch (Throwable $e) {
    var_dump($e);
}