<?php

namespace App\Http\Controllers\Front\Products;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductAttribute;
use Illuminate\Http\Request;

class SingleProductDetailsController extends Controller
{
        protected function singleproductpage($slug){
         if(!$product=Product::where('slug',$slug)->first()->toArray()){
             return response()->json(['status'=>404,'msg'=>'Product Not found']);
         }else{
           try{
            $singleproduct=Product::with(array('category'=>function($query){
                 $query->select('id','category_name','slug','category_discount')->where('is_enabled',1);
             },'brand'=>function($query){
                 $query->select('id','brand','shop_id')->where('is_enabled',1);
             },'productattributes'=>function($query){
                 $query->where('is_enabled',1);
             },'productimages'=>function($query){
                 $query->where('is_enabled',1);
             }))->where('slug',$slug)->first()->toArray();
            //  $relatedproducts=;
             $getrelatedproducts=Product::where('is_enabled',1)->where('category_id',$singleproduct['category']['id'])->where('id','!=',$singleproduct['id'])->inRandomOrder()->get();

            //  $getrelatedproducts=Product::where(['is_enabled'=>1,'category_id'=>$singleproduct['category']['id']])->where('id','!=',$singleproduct['id'])->inRandomOrder()->get();
            //  if(!$getrelatedproducts){
            //      //  $relatedproducts="No Related Products were Found";
            //  }else{
            //      $relatedproducts=$getrelatedproducts;
            //  }
             return response()->json(['status'=>200,'product'=>$singleproduct,'relatedproducts'=>$getrelatedproducts]);
              } catch (\Throwable $th) {
                return response()->json(['status'=>401,'msg'=>'An exception occurred while fetching product details '.$th->getMessage()]);
              }
         }
    }
    protected function stock_based_of_product_size(Request $request,$id){
        if(!ProductAttribute::where('id',$id)->first()){
            return response()->json(['status'=>404,'msg'=>'product not found']);
        }else{
            try {
                // dd($request['size']);
                $discounted_price=Product::getdiscountedattrprice($request['product_id'],$request['size']);
                $stock=ProductAttribute::where('id',$id)->first()->toArray();
                return response()->json(['status'=>200,'stock'=>$stock,'discountedattrprice'=>$discounted_price]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>404,'msg'=>'an exception occurred while fetching stock based of size '.$th->getMessage()]);
            }

    }
}
}
