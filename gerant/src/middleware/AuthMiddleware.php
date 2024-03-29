<?php

namespace app\middleware;

class AuthMiddleware{

    protected $container;

    public function __construct($container){
        $this->container = $container;
    }

    public function __invoke($request, $response, $next){
        if (!$this->container->auth->isConnected()){
            $this->container->flash->addMessage('error', 'Il faut se connecter pour pouvoir accéder à cette page');
            return $response->withRedirect($this->container->router->pathFor('connexion'));
        }
        $response = $next($request, $response);
        return $response;
    }
}