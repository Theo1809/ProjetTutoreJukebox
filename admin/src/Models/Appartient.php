<?php

namespace app\Models;


class Appartient extends \Illuminate\Database\Eloquent\Model
{
    protected $table = "appartient";
    protected $primaryKey = "id";
    public $timestamps = false;

    public function musique() {
        return $this->hasMany('app\Models\Musique');
    }

    public function playlist() {
        return $this->hasMany('app\Models\Playlist');
    }
}