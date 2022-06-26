<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\App;

class Category extends Model
{
    use HasFactory,SoftDeletes;
    protected $dates=['deleted_at'];
    protected $fillable=[
        'admin_id',
        'parent_id',
        'section_id',
        'category_name',
        'slug',
        'category_image',
        'category_discount',
        'description',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'is_enabled',
    ];
    public static function catdetails($slug){
        $catdetails=Category::Select('id','parent_id','category_name','slug','description')->with(['subcategories'=>function($query){
            $query->select('id','category_name','parent_id','slug','description')->where('is_enabled',1);
        }])->where('slug',$slug)->first()->toArray();
        $catIds=array();
        $catIds[]=$catdetails['id'];
        foreach($catdetails['subcategories'] as $key=> $subcat){
            $catIds[]=$subcat['id'];
        }
        return array('catIds'=>$catIds,'catdetails'=>$catdetails);
    }

    public function section(){
        return $this->belongsTo(Section::class)->select('id','section','is_enabled');
    }
    public function parentcategory(){
        return $this->belongsTo('App\Models\Category','parent_id')->select('id','category_name');
    }
    public function subcategories(){
        return $this->hasMany(Category::class,'parent_id')->where('is_enabled',1);
    }
    public function admin(){
        return $this->belongsTo(Admin::class)->select(['id','name','role_id']);
    }

    public function products(){
        return $this->hasMany(Product::class);
    }

}