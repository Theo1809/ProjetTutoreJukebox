<?php

namespace app\Models;


class Musique extends \Illuminate\Database\Eloquent\Model
{
  
    protected $table = "musique";
    protected $primaryKey = "id";
    public $timestamps = false;
    protected $fillable = ['titre', 'genre', 'description', 'studio', 'album', 'artiste','chemin','ig_image'];

    public function Playlist() {
        return $this->belongsToMany('app\Models\Appartient');
    }
}