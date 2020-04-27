<?php

namespace app\Models;

class Utilisateur extends \Illuminate\Database\Eloquent\Model
{
    protected $table = "utilisateur";
    protected $primaryKey = "id";
    public $timestamps = false;
    protected $fillable = ['nom', 'mdp', 'mail', 'date_adhesion'];

    
}