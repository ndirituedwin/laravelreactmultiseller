<?php

namespace App\Http\Controllers\Front\Products;

use App\Models\Brand;
use App\Models\Product;
use App\Models\Section;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use phpDocumentor\Reflection\DocBlock\Tags\Throws;

class IndexController extends Controller
{

    protected function homepage(){
        try {
            if(!$getsections=Section::with(array('categories'))->where('is_enabled',1)->get()->toArray()){
                return response()->json(['status'=>199,'msg'=>"Sections Not found"]);
            }else{
                return response()->json(['status'=>200,'sections'=>$getsections]);
            }
         } catch (\Throwable $th) {
        return response()->json(['status'=>201,'msg'=>"An exception occurred while fetching sections $th->getMessage()"]);
        }




    }
    protected function featured(){
        try {
            $featuredproducts=Product::where(['is_featured'=>1,'is_enabled'=>1])->count();
            if (!$featuredproducts>0) {
                return response()->json(['status'=>199,'msg'=>"No featured Products were found"]);
            }else{
                $featuredproductsschunk=Product::with(array('category'=>function($query){
                    $query->select('id','category_name','category_discount','slug');
                }))->where(['is_featured'=>1,'is_enabled'=>1])->get()->toArray();
                // $featuredproductsschunk=Product::where(['is_featured'=>1,'is_enabled'=>1])->get()->toArray();
                if (!$featuredproductsschunk) {
                    return response()->json(['status'=>200,'msg'=>"No featured Products were found"]);
                }else{
                    $chunk=array_chunk($featuredproductsschunk,20);
                    $chunk=$chunk[0];
                    return response()->json(['status'=>201,'featuredproductscount'=>$featuredproducts,'featuredproductschunk'=>$chunk]);
                }
            }

        } catch (\Throwable $th) {
           return response()->json(['status'=>202,'msg'=>"An exception occurred while fetching featured products $th->getMessage()"]);

        }
    }
    protected function latestproducts(){
        try {
            $latestproducts=Product::where(['is_enabled'=>1])->orderby('created_at','DESC')->limit(20)->get()->toArray();
            if (!$latestproducts) {
                return response()->json(['status'=>208,'msg'=>"No lates Products were found"]);
            }else{
                return response()->json(['status'=>209,'latestproducts'=>$latestproducts]);
            }
        } catch (\Throwable $th) {
           return response()->json(['status'=>210,'msg'=>"An exception occurred while fetching latest products $th->getMessage()"]);
        }
    }
    protected function fetchbrands(){
        try {
         $brandsandproducts=Brand::with(array('products'))->where('is_enabled',1)->get()->toArray();
         $categories=Category::with('subcategories')->where(['is_enabled'=>1,'parent_id'=>0])->get()->toArray();

         return response()->json(['status'=>200,'categories'=>$categories,'brands'=>$brandsandproducts]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching brands $th->getMessage()"]);
        }
    }
}