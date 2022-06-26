<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable=[
        'seller_id',
        'shop_id',
        'brand_id',
        'slug',
        'section_id',
        'category_id',
        'product_name',
        'product_code',
        'product_price',
        'product_discount',
        'product_description',
        'product_image',
        'product_color',
        'product_weight',
        'wash_care',
          'fabric',
          'pattern',
          'sleeve',
          'fit',
          'occassion',
          'meta_title',
          'meta_description',
          'meta_keywords',
          'is_featured',
          'is_enabled',
    ];
    public function section(){
        return $this->belongsTo(Section::class);
    }
    public function category(){
        return $this->belongsTo(Category::class);
    }
    public function brand(){
        return $this->belongsTo(Brand::class);
    }
    public function productattributes(){
        return $this->hasMany(ProductAttribute::class);
    }
    public function productimages(){
        return $this->hasMany(ProductImage::class);
    }
}
