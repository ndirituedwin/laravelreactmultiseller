<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use HasFactory , SoftDeletes;
    protected $fillable=['admin_id','brand','shop_id','slug','status'];

    public  function admin(){
        return $this->belongsTo(Admin::class);
    }
    public  function shop(){
        return $this->belongsTo(Shop::class);
    }
    public function products(){
        return $this->hasMany(Product::class);
    }

}