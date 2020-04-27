<?php

namespace app\Models;
class Proprietaire extends \Illuminate\Database\Eloquent\Model
{
  
    protected $table = "proprietaire";
    protected $primaryKey = "id";
    public $timestamps = false;
    protected $fillable = ['nom', 'prenom', 'telephone', 'mail', 'adresse'];
   
    public function Etablissement() {
        return $this->hasMany('app\Models\Musique');
    }
}