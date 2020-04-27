<?php

namespace app\Models;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reclamation extends \Illuminate\Database\Eloquent\Model
{
    protected $table = "reclamation";
    protected $primaryKey = "id";
    public $timestamps = false;
     use SoftDeletes;


}