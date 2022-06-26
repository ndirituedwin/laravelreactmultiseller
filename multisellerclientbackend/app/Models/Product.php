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
    public function carts(){
        return $this->hasMany(Cart::class);
    }
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
    public static function productssortparams(){

        return [
            'Latest Products',
            'Product Name A-Z',
            'Product Name Z-A',
            'Lowest Price First',
            'Highest Price First',

        ];
        // return $sortproduct;
    }
    public static function  getdiscountedattrprice($product_id,$size){
        $productattrprice=Productattribute::where(['product_id'=>$product_id,'size'=>$size])->first()->toArray();
        $prodductdetails=Product::select('id','category_id','product_discount')->where('id',$product_id)->first()->toArray();
        $catdetails=Category::select('id','category_discount')->where('id',$prodductdetails['category_id'])->first()->toArray();

        if($prodductdetails['product_discount']>0){
            //sellingprice
       $discountedprice=$productattrprice['price']-($productattrprice['price']*$prodductdetails['product_discount']/100);
           $discount=$productattrprice['price']-$discountedprice;
       //  dd($discountedprice);
   }else if($catdetails['category_discount']>0){
       $discountedprice=$productattrprice['price']-($productattrprice['price']*$catdetails['category_discount']/100);
       $discount=$productattrprice['price']-$discountedprice;

      }else{
          $discountedprice=$productattrprice['price'];
          $discount=0;
      }
      return array('discount'=>$discount,'productprice' =>$productattrprice['price'] ,'discounted_price'=> $discountedprice);
    }
}