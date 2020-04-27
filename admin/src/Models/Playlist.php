<?php

namespace app\Models;


class Playlist extends \Illuminate\Database\Eloquent\Model
{
   
    protected $table = "playlist";
    protected $primaryKey = "id";
    public $timestamps = false;
    protected $fillable = ['nom', 'description', 'auteur'];

    public function Musique() {
        return $this->belongsToMany('app\Models\Appartient');
    }

    public function jukebox() {
        return $this->hasMany('app\Models\Musique');
    }
    
}