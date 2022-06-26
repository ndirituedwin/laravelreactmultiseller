<?php

namespace App\Http\Controllers\Front\Products;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\ProductAttribute;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    protected function addtocart(Request $request){
        $validator=Validator::make($request->only(['size','quantity','product_id']),[
            'size'=>'required',
            'quantity'=>'required|integer',
            'product_id'=>'required|integer',
        ]);
        if($validator->fails()){
            return response()->json(['status'=>422,'validation_errors'=>$validator->messages()]);
        }else{
            $explode=explode(';',$request['size']);
            $size=$explode[0];
            $id=$explode[1];
            if(!$proattr=ProductAttribute::where(['id'=>$id,'product_id'=>$request['product_id'],'size'=>$size])->first()->toArray()){
            return response()->json(['status'=>404,'msg'=>'Product attribute not found']);
        }else{
            try {

                  $quantity=(int) $request['quantity'];
                if($quantity<=0 || $quantity=='' || $quantity==null){
                    $quantity=1;
                }
                if($quantity>$proattr['stock']){
                    return response()->json(['status'=>410,'msg'=>'Quntity may not be greater than there is available']);

                }
                //generate session
                $session_id=Session::get('session_id');
              if(empty($session_id)){
                  $session_id=Session::getId();
                  Session::put('session_id',$session_id);
              }
              if(Auth::check()){
                  $count=Cart::where(['product_id'=>$request['product_id'],'size'=>$size,'user_id'=>Auth::user()->id])->count();
              }else{
              $count=Cart::where(['product_id'=>$request['product_id'],'size'=>$size])->count();
            }
              if($count>0){
                    return response()->json(['status'=>202,'msg'=>'cart with similar size alredy exists']);
                }
                if(Auth::check()){
                    $user_id=Auth::user()->id;
                }else{
                    $user_id=0;
                }
                $cart=Cart::create([
                    'user_id'=>$user_id,
                    'session_id'=>$session_id,
                    'product_id'=>$request['product_id'],
                    'size'=>$size,
                    'quantity'=>$quantity
                ]);
                return response()->json(['status'=>200, 'item'=>$cart,'msg'=>'Cart Item created']);
                // return response()->json(['status'=>200,'msg'=>'Cart Item created']);

            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while adding product to your cart".$th->getMessage()]);
            }
        }

}
    }
    protected function viewcart(){

        try {
            $cartitems=Cart::usercartitems();
            return response()->json(['status'=>200,'item'=>$cartitems]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching cart items ".$th->getMessage()]);
        }
    }

    protected function singleproductpage($id){
        if(!$product=Product::where('id',$id)->first()->toArray()){
            return response()->json(['status'=>404,'msg'=>'Product Not found']);
        }else{
          try{
           $singleproduct=Product::with(array('category'=>function($query){
                $query->select('id','category_name','id','category_discount')->where('is_enabled',1);
            },'brand'=>function($query){
                $query->select('id','brand','shop_id')->where('is_enabled',1);
            },'productattributes'=>function($query){
                $query->where('is_enabled',1);
            },'productimages'=>function($query){
                $query->where('is_enabled',1);
            }))->where('id',$id)->first()->toArray();
            return response()->json(['status'=>200,'product'=>$singleproduct]);
             } catch (\Throwable $th) {
               return response()->json(['status'=>401,'msg'=>'An exception occurred while fetching product details '.$th->getMessage()]);
             }
        }
   }
   protected function dicountedpriceforeachcartitem(Request $request,$id){
   if(!ProductAttribute::where(['product_id'=>$id,'size'=>$request['size']])->first()){
        return response()->json(['status'=>404,'msg'=>'product attribute  not found']);
    }else{
        try {
            // dd($request['size']);
            $discounted_price=Product::getdiscountedattrprice($id,$request['size']);
            // $stock=ProductAttribute::where('id',$id)->first()->toArray();
            // return response()->json(['status'=>200,'stock'=>$stock,'discountedattrprice'=>$discounted_price]);
            return response()->json(['status'=>200,'discountedattrprice'=>$discounted_price]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>'an exception occurred while fetching stock based of size '.$th->getMessage()]);
        }

}
}
}