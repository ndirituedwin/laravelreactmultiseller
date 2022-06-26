<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Section extends Model
{
    use HasFactory,SoftDeletes;
    protected $dates=['deleted_at'];
    protected $fillable=['section','admin_id','shop_id','slug','is_enabled'];
    public function admin(){
        return $this->belongsTo(Admin::class);
    }
    public function shop(){
        return $this->belongsTo(Shop::class);
    }
    public function categories(){
        return $this->hasMany(Category::class,'section_id')->where(['parent_id'=>0,'is_enabled'=>1])->with('subcategories');
    }

    public function products(){
        return $this->hasMany(Product::class);
    }
    

}