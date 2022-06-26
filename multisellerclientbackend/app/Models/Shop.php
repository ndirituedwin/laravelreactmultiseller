<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shop extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable=['admin_id','shop','slug','is_enabled'];

    public function admin(){
        return $this->belongsTo(Admin::class);
    }
    public function section(){
        return $this->hasOne(Section::class);
    }
    public function brand(){
        return $this->hasOne(Brand::class);
    }
}