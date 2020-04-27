<?php

namespace app\Models;


class Jukebox extends \Illuminate\Database\Eloquent\Model
{
   
    protected $table = "jukebox";
    protected $primaryKey = "id";
    public $timestamps = false;
    protected $fillable = ['id_etablissement', 'id_playlist', 'nom', 'date_creation', 'etat'];

    public function Etablissement() {
        return $this->belongsTo('app\Models\Etablissement');
    }

    public function Playlist() {
        return $this->belongsTo('app\Models\Playlist');
    }

}