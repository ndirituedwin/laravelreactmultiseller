<?php

namespace App\Http\Controllers\Front\Products;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductlistingController extends Controller
{
    protected function listing($slug){
      if(!Category::where('slug',$slug)->first()){
          return response()->json(['status'=>404,'msg'=>'category not found']);
      }else{
          try {
                $categorydetails=Category::catdetails($slug);
                $ca=$categorydetails['catdetails']['category_name'];
                $productssortparams=Product::productssortparams();
            //dd($categorydetails);
            $categoryproducts=Product::with('brand')->whereIn('category_id', $categorydetails['catIds'])->where(['is_enabled'=>1])->get()->toArray();

            return response()->json(['status'=>200,'productssortparams'=>$productssortparams,'catdetails'=>$ca,'productlist'=>$categoryproducts]);
          } catch (\Throwable $th) {
              return response()->json(['status'=>400,'msg'=>'An error occured while fetchimg products based On category '.$th->getMessage()]);
          }
      }

    }
    protected function sortproducts(Request $request,$slug){
        if(!Category::where('slug',$slug)->first()){
            return response()->json(['status'=>404,'msg'=>'category not found']);
        }else{
            try {
                // $categoryproducts=Product::with('brand')->whereIn('category_id', $categorydetails['catIds'])->where('status', 1);
                $categorydetails=Category::catdetails($slug);
               $categoryproducts=Product::with('brand')->whereIn('category_id', $categorydetails['catIds'])->where(['is_enabled'=>1]);

                  $data=$request['sortvalue'];
                  if($data){
                      if($data=="0"){
                        $categoryproducts->orderBy('created_at','DESC');
                      }
                      if($data=="1"){
                        $categoryproducts->orderBy('product_name','ASC');
                      }
                      if($data=="2"){
                        $categoryproducts->orderBy('product_name','DESC');
                      }
                      if($data=="3"){
                        $categoryproducts->orderBy('product_price','ASC');
                      }
                      if($data=="4"){
                        $categoryproducts->orderBy('product_price','DESC');
                      }

                  }else
                  {
                    $categoryproducts=$categoryproducts->orderBy('created_at', 'DESC');
                  }
                  $categoryproducts=$categoryproducts->get();

                return response()->json(['status'=>200,'productlist'=>$categoryproducts]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>'An error occured while sorting products based On category '.$th->getMessage()]);
            }
        }

    }
    protected function listingproductsbybrand($slug){
        if(!$brand=Brand::where('slug',$slug)->first()->toArray()){
            return response()->json(['status'=>404,'msg'=>'brand not found']);
        }else{
            try {
                $productsbybrand=Product::with(array('brand'))->where(['brand_id'=>$brand['id'],'is_enabled'=>1])->get()->toArray();
                return response()->json(['status'=>200,'brand'=>$brand['brand'],'productsbybrand'=>$productsbybrand]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>'An error occured while fetchimg products based On Brand '.$th->getMessage()]);
            }
        }
    }
}
