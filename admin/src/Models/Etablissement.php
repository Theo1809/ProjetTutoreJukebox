<?php

namespace app\Models;


class Etablissement extends \Illuminate\Database\Eloquent\Model
{
    protected $table = "etablissement";
    protected $primaryKey = "id";
    public $timestamps = false;

    public function Proprietaire() {
        return $this->belongsTo('app\Models\Proprietaire');
    }

    public function jukebox() {
        return $this->hasMany('app\Models\Jukebox');
    }
}