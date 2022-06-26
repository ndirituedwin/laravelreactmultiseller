<?php

namespace App\Http\Controllers\Admin\Product;

use App\Models\Brand;
use App\Models\Product;
use App\Models\Section;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\ProductAttribute;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api-admins');
    }
    protected function sectioncategories(){
        try {
            if (!$sections=Section::with('categories')->where('is_enabled', 1)->get()) {
                return response()->json(['status'=>404,'msg'=>"Sections Not found"]);
            }
            if(!$brands=Brand::where('is_enabled',1)->get()){
                return response()->json(['status'=>405,'msg'=>" brands Not found"]);
            }
            return response()->json(['status'=>200,'sections'=>$sections,'brands'=>$brands]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching sections and brands".$th->getMessage()]);
        }
    }
    protected function viewproducts(){
        try {
            $products=Product::with(array('category'=>function($query){
                $query->select('id','category_name','is_enabled')->where('is_enabled',1);
            },'brand'=>function($query){
                $query->select('id','brand','is_enabled')->where('is_enabled',1);
            },'section'=>function($query){
                $query->select('id','section','is_enabled','shop_id')->where('is_enabled',1)->with(array('shop'=>function($query){
                 $query->select('id','shop','is_enabled');
                }));
            }))->get();
            return response()->json(['status'=>200,'products'=>$products]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching products ".$th->getMessage()]);
        }

    }
    protected function save(Request $request){
        $validator=Validator::make($request->all(),[
            'category_id'=>'required|numeric',
            'brand_id'=>'required|numeric',
            'product_name'=>'required|unique:products|string|max:255',
            'product_code'=>'required|regex:/^[\w-]*$/',
            'product_color'=>'required|string|max:255',
            'product_price'=>'required|numeric',
            'product_discount'=>'nullable|numeric',
            'product_weight'=>'required|string|max:255',
            'productimage'=>'nullable|image|mimes:jpeg,jpg,png|max:1999',
            'product_description'=>'required|string|max:1000',
            'wash_care'=>'nullable|string',
            'fabric'=>'nullable|string',
            'pattern'=>'nullable|string',
            'sleeve'=>'nullable|string',
            'fit'=>'nullable|string',
            'occassion'=>'nullable|string',
            'meta_title'=>'nullable|max:1000',
            'meta_description'=>'nullable|max:1000',
            'meta_keywords'=>'nullable|max:1000',
        ]);
        if ($validator->fails()) {
            return response()->json(['status'=>422,'validation_errors'=>$validator->messages()]);
        } else {
            try {
                // DB::beginTransaction();
                $image=$request->file('productimage');
                if ($request->hasFile('productimage')) {
                    $filenamexactt=$request->file('productimage')->getClientOriginalName();
                    $filename=pathinfo($filenamexactt, PATHINFO_FILENAME);
                    //get just ext
                    $filenameext=$request->file('productimage')->getClientOriginalExtension();

                    $filenametostore=$filename.'.'.time().'.'.$filenameext;
                    $large='Admin/Adminimages/ProductImages/large/'.$filenametostore;
                    $medium='Admin/Adminimages/ProductImages/medium/'.$filenametostore;
                    $small='Admin/Adminimages/ProductImages/small/'.$filenametostore;
                    Image::make($image)->resize(300, 450)->save($large);
                    Image::make($image)->resize(200, 300)->save($medium);
                    Image::make($image)->resize(100, 150)->save($small);
                    $product_image=$filenametostore;
                } else {
                    $product_image="";
                }
                try {
                    $sectionid=Category::find($request['category_id']);
                    Product::create([
                        'seller_id'=>Auth::guard('api-admins')->user()->id,
                        'section_id'=>$sectionid['section_id'],
                        'category_id'=>$request['category_id'],
                        'product_name'=>$request['product_name'],
                        'slug'=>Str::slug($request['product_name']).'-'.time(),
                        'brand_id'=>$request['brand_id'],
                        'product_code'=>$request['product_code'],
                        'product_color'=>$request['product_color'],
                        'product_price'=>($request['product_price']<0)? 1 :$request['product_price'],
                        'product_discount'=>($request['product_discount'])?$request['product_discount']:'0.00',
                        'product_weight'=>$request['product_weight'],
                        'product_image'=>$product_image,
                        'product_description'=>$request['product_description'],
                        'wash_care'=>$request['wash_care'],
                        'fabric'=>$request['fabric'],
                        'pattern'=>$request['pattern'],
                        'sleeve'=>$request['sleeve'],
                        'fit'=>$request['fit'],
                        'occassion'=>$request['occassion'],
                        'meta_title'=>$request['metatitle'],
                        'meta_description'=>$request['meta_description'],
                        'meta_keywords'=>$request['meta_keywords'],
                    ]);
                                // DB::commit();

                    return response()->json(['status'=>200,'msg'=>"product $request->product_name saved"]);
                } catch (\Throwable $th) {
                    return response()->json(['status'=>401,'msg'=>$th->getMessage()]);
                }


            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>$th->getMessage()]);

            }
        }
    }

    protected function editproductbyslug($slug){
        if (!$product=Product::where('slug', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'product not found']);
        } else {
            try {
                return response()->json(['status'=>200,'product'=>$product]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching the requested product ".$th->getMessage()]);
            }
        }
    }
    protected function updateproductbyslug(Request $request,$slug, ){
        $validator=Validator::make($request->all(), [
            'category_id'=>'required|numeric',
            'brand_id'=>'required|numeric',
            'product_name'=>'required|string|max:255',
            'product_code'=>'required|regex:/^[\w-]*$/',
            'product_color'=>'required|string|max:255',
            'product_price'=>'required|numeric',
            'product_discount'=>'nullable|numeric',
            'product_weight'=>'required|string|max:255',
            // 'productimage'=>'nullable|image|mimes:jpeg,jpg,png|max:1999',
            'product_description'=>'required|string|max:1000',
            'wash_care'=>'nullable|string',
            'fabric'=>'nullable|string',
            'pattern'=>'nullable|string',
            'sleeve'=>'nullable|string',
            'fit'=>'nullable|string',
            'occassion'=>'nullable|string',
            'meta_title'=>'nullable|string|max:1000',
            'meta_description'=>'nullable|max:1000',
            'meta_keywords'=>'nullable|max:1000',
        ]);
            if ($validator->fails()) {
                return response()->json(['status'=>422,'validation_errors'=>$validator->messages()]);
            } else {
                try {
                    $find=Product::where('slug', $slug)->first();
                    if (!$find) {
                        return response()->json(['status'=>402,'msg'=>"product not found"]);
                    } else {
                        $exists=Product::where('product_name', $request['product_name'])->where('slug', '!=', $slug)->first();
                        if ($exists) {
                            return response()->json(['status'=>403,'msg'=>"product already exists,choose another name"]);
                        } else {
                            try {
                                $image=$request->file('productimage');
                                if ($request->hasFile('productimage')) {
                                    $productimage=$find['product_image'];
                                    $large='Admin/Adminimages/ProductImages/large/'.$productimage;
                                    $medium='Admin/Adminimages/ProductImages/medium/'.$productimage;
                                    $small='Admin/Adminimages/ProductImages/small/'.$productimage;
                                    if (File::exists($large)) {
                                        File::delete($large);
                                    }
                                    if (File::exists($medium)) {
                                        File::delete($medium);
                                    }
                                    if (File::exists($small)) {
                                        File::delete($small);
                                    }
                                    $filenameext=$request->file('productimage')->getClientOriginalName();
                                    $filename=pathinfo($filenameext, PATHINFO_FILENAME);
                                    $filenameext=$request->file('productimage')->getClientOriginalExtension();
                                    $filenametostore=$filename.'.'.time().'.'.$filenameext;
                                    $large='Admin/Adminimages/ProductImages/large/'.$filenametostore;
                                    $medium='Admin/Adminimages/ProductImages/medium/'.$filenametostore;
                                    $small='Admin/Adminimages/ProductImages/small/'.$filenametostore;
                                    Image::make($image)->resize(300, 450)->save($large);
                                    Image::make($image)->resize(200, 300)->save($medium);
                                    Image::make($image)->resize(100, 150)->save($small);
                                    Product::where('slug', $slug)->update(['product_image'=>$filenametostore]);
                                }

                                try{
                                    $sectionid=Category::find($request['category_id']);
                                    product::where('slug', $slug)->update([
                                        'seller_id'=>Auth::guard('api-admins')->user()->id,
                                        'section_id'=>$sectionid['section_id'],
                                        'category_id'=>$request['category_id'],
                                        'product_name'=>$request['product_name'],
                                        'slug'=>Str::slug($request['product_name']).'-'.time(),
                                        'brand_id'=>$request['brand_id'],
                                        'product_code'=>$request['product_code'],
                                        'product_color'=>$request['product_color'],
                                        'product_price'=>($request['product_price']<0)? 1 :$request['product_price'],
                                        'product_discount'=>($request['product_discount'])?$request['product_discount']:'0.00',
                                        'product_weight'=>$request['product_weight'],
                                        // 'product_image'=>$product_image,
                                        'product_description'=>$request['product_description'],
                                        'wash_care'=>$request['wash_care'],
                                        'fabric'=>$request['fabric'],
                                        'pattern'=>$request['pattern'],
                                        'sleeve'=>$request['sleeve'],
                                        'fit'=>$request['fit'],
                                        'occassion'=>$request['occassion'],
                                        'meta_title'=>$request['meta_title'],
                                        'meta_description'=>$request['meta_description'],
                                        'meta_keywords'=>$request['meta_keywords'],

                         ]);
                                    return response()->json(['status'=>200,'msg'=>"product $request->product_name saved"]);
                                } catch (\Throwable $th) {
                                    return response()->json(['status'=>401,'msg'=>"An exception occurred while saving product ".$th->getMessage()]);
                                }
                            } catch (\Throwable $th) {
                                return response()->json(['status'=>400,'msg'=>$th->getMessage()]);
                            }
                        }
                    }
                } catch (\Throwable $th) {
                    return response()->json(['status'=>399,'msg'=>$th->getMessage()]);
                }
            }
    }

    protected function deleteproductbyslug($slug)
    {
        if (!$product=Product::where('slug', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'product not found']);
        } else {
            try {
                $product->delete();
                return response()->json(['status'=>200,'msg'=>'product deleted']);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while deleting product ".$th->getMessage()]);
            }
        }
    }
    protected function updateproductstatusbyslug(Request $request, $slug)
    {
        if (!$product=Product::where('slug', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'product not found']);
        } else {
            try {
                if ($product['is_enabled']==1) {
                    $is_enabled=0;
                } else {
                    $is_enabled=1;
                }
                Product::where('slug', $slug)->update(['is_enabled'=>$is_enabled]);
                return response()->json(['status'=>200,'newdata'=>$is_enabled,'msg'=>"product status updated"]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while updating product status ".$th->getMessage()]);
            }
        }
    }
    protected function updateproductattributestatusbyslug(Request $request, $slug)
    {
        if (!$product=ProductAttribute::where('id', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'product attribute not found']);
        } else {
            try {
                if ($product['is_enabled']==1) {
                    $is_enabled=0;
                } else {
                    $is_enabled=1;
                }
                ProductAttribute::where('id', $slug)->update(['is_enabled'=>$is_enabled]);
                return response()->json(['status'=>200,'newdata'=>$is_enabled,'msg'=>"product attribute status updated"]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while updating product attribute status ".$th->getMessage()]);
            }
        }
    }

    protected function trashedproducts()
    {
        try {
            $trashed=Product::onlyTrashed()->get();
            return response()->json(['status'=>200,'products'=>$trashed]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching trashed  products ".$th->getMessage()]);
        }
    }
    protected function forcedelete($slug)
    {
        if (!$product=Product::onlyTrashed()->where('slug', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'product not found']);
        } else {
            try {
                $productimage=$product['product_image'];
                $large='Admin/Adminimages/ProductImages/large/'.$productimage;
                $medium='Admin/Adminimages/ProductImages/medium/'.$productimage;
                $small='Admin/Adminimages/ProductImages/small/'.$productimage;
                if (File::exists($large)) {
                    File::delete($large);
                }
                if (File::exists($medium)) {
                    File::delete($medium);
                }
                if (File::exists($small)) {
                    File::delete($small);
                }
                $product->forcedelete();
                return response()->json(['status'=>200,'msg'=>'product permanently deleted']);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while deleting product ".$th->getMessage()]);
            }
        }
    }
    protected function forcedeleteproductattribute($slug){
        if (!$product=ProductAttribute::where('id', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'product attribute not found']);
        } else {
            try{
              $product->forcedelete();
              return response()->json(['status'=>200,'msg'=>'product attribute permanently deleted']);
            }catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while deleting product atribute ".$th->getMessage()]);
            }
        }
    }
    protected function restore($productslug)
    {
        if (!$product=Product::withTrashed()->where('slug', $productslug)->first()) {
            return response()->json(['status'=>404,'msg'=>'product not found']);
        } else {
            try {
                $product->restore();
                return response()->json(['status'=>200,'msg'=>'product restored']);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while restoring product ".$th->getMessage()]);
            }
        }
    }
    protected function fetchprouctandattributes($slug){
        try {
                   if (!$product=Product::select('id','product_name','product_code','product_color','product_image')->with('productattributes')->where('slug',$slug)->first()){
                       return response()->json(['status'=>404,'msg'=>'product  not found']);
                   }else{
                       return response()->json(['status'=>200,'product'=>$product]);
                   }
               } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching product ".$th->getMessage()]);
            }

    }
    protected function saveproductattributes(Request $request,$slug){
        $validator=Validator::make($request->all(),[
            'size'=>'required|string',
            'sku'=>'required|string',
            'price'=>'required|numeric',
            'stock'=>'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['status'=>422,'validation_errors'=>$validator->messages()]);
        } else {
            if(!$product=Product::where('slug',$slug)->first()){
                return response()->json(['status'=>404,'msg'=>'Product Not found']);
            }
            try {
                $skucount=ProductAttribute::where(['sku'=>$request['sku']])->count();
                if($skucount>0)
                {
                    return response()->json(['status'=>401,'msg'=>"sku $request->sku is already taken choose another one"]);
                }
                $sizecount=ProductAttribute::where(['size'=>$request['size'],'product_id'=>$product['id']])->count();
                if($sizecount>0){
                    return response()->json(['status'=>402,'msg'=>"size $request->size is already taken choose another one"]);

                }
                $CREATED=ProductAttribute::create([
                    'product_id'=>$product['id'],
                    'size'=>$request['size'],
                    'sku'=>$request['sku'],
                    'price'=>$request['price'],
                    'stock'=>$request['stock'],
                ]);
                return response()->json(['status'=>200,'msg'=>'Product Attribute Created','product'=>$CREATED]);


            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>'An err occurred while saving Product attribute']);
            }
        }

   }
   protected function decproattrprice($id){
    if(!$product=ProductAttribute::find($id)){
        return response()->json(['status'=>404,'msg'=>'Product attribute  Not found']);
    }else{
        try {
             $price=$product['price']-1;
            ProductAttribute::where('id',$id)->update([
                 'price'=>$price
             ]);
            //  $proattr=ProductAttribute::find($id);
              $newprice=ProductAttribute::find($id);
             return response()->json(['status'=>200,'msg'=>'Product attribute  price updated','newprice'=>$newprice]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>'An err occurred while decrementing Product attribute price'.$th->getMessage()]);

        }
    }

   }
   protected function incproattrprice($id){
    if(!$product=ProductAttribute::find($id)){
        return response()->json(['status'=>404,'msg'=>'Product attribute  Not found']);
    }else{
        try {
             $price=$product['price']+1;
            ProductAttribute::where('id',$id)->update([
                 'price'=>$price
             ]);
            //  $proattr=ProductAttribute::find($id);
              $newprice=ProductAttribute::find($id);
             return response()->json(['status'=>200,'msg'=>'Product attribute  price updated','newprice'=>$newprice]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>'An err occurred while decrementing Product attribute price'.$th->getMessage()]);

        }
    }

   }
   protected function decproattrstock($id){
    if(!$product=ProductAttribute::find($id)){
        return response()->json(['status'=>404,'msg'=>'Product attribute  Not found']);
    }else{
        try {
             $stock=$product['stock']-1;
            ProductAttribute::where('id',$id)->update([
                 'stock'=>$stock
             ]);
            //  $proattr=ProductAttribute::find($id);
              $newstock=ProductAttribute::find($id);
             return response()->json(['status'=>200,'msg'=>'Product attribute  stock updated','newstock'=>$newstock]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>'An err occurred while decrementing Product attribute stock'.$th->getMessage()]);

        }
    }

   }
   protected function incproattrstock($id){
    if(!$product=ProductAttribute::find($id)){
        return response()->json(['status'=>404,'msg'=>'Product attribute  Not found']);
    }else{
        try {
             $stock=$product['stock']+1;
            ProductAttribute::where('id',$id)->update([
                 'stock'=>$stock
             ]);
            //  $proattr=ProductAttribute::find($id);
              $newstock=ProductAttribute::find($id);
             return response()->json(['status'=>200,'msg'=>'Product attribute  stock updated','newstock'=>$newstock]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>'An err occurred while decrementing Product attribute stock'.$th->getMessage()]);

        }
    }

   }
   protected function getaddmultipleproductimages($slug){
          if (!$product=Product::with('productimages')->select('id','product_name','product_code','product_color','product_image')->where('slug',$slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'Product   Not found']);

          }else{
              try {
                return response()->json(['status'=>200,'product'=>$product]);
                } catch (\Throwable $th) {
                    return response()->json(['status'=>400,'msg'=>'An err occurred while fetching Product details'.$th->getMessage()]);

                }
          }

      }
      protected function savemultipleimages(Request $request,$slug ){

            if(!$product=Product::where('slug',$slug)->first()){
                return response()->json(['status'=>404,'msg'=>'Product Not found']);
            }
            try{
            if ($request->get('file')) {
                    foreach ($request->get('file') as $file) {
                            $img=Image::make($file);
                    // $name = time() . '.' . explode('/', explode(':', substr($file, 0, strpos($file, ';')))[1])[1];
                    $name = time().rand(111,999999). '.' . explode('/', explode(':', substr($file, 0, strpos($file, ';')))[1])[1];
                    $large='Admin/Adminimages/ProductImages/multipleimages/large/'.$name;
                    $medium='Admin/Adminimages/ProductImages/multipleimages/medium/'.$name;
                    $small='Admin/Adminimages/ProductImages/multipleimages/small/'.$name;
                    Image::make($img)->resize(300, 450)->save($large);
                    Image::make($img)->resize(200, 300)->save($medium);
                    Image::make($img)->resize(100, 150)->save($small);
                    ProductImage::create([
                        'image'=>$name,
                        'product_id'=>$product['id']
                    ]);
                }
            }
           $productt=ProductImage::where('product_id',$product['id'])->get()->toArray();

            // return the response
          return response()->json(['status'=>200,'msg'=>'Product images saved','product'=>$productt]);
        } catch (\Throwable $th) {
                        return response()->json(['status'=>401,'msg'=>'An err occurred while saving Product images '.$th->getMessage()]);
         }

            // try {

            //     if ($request->hasFile('image')) {
            //         $image=$request->file('image');

            //                    try {
            //             foreach($image as $key=>$imagee){
            //                 $productmultiple=new ProductImage();
            //                  $img=Image::make($imagee);
            //                  $filenamexactt=$imagee->getClientOriginalName();
            //                  $filename=pathinfo($filenamexactt, PATHINFO_FILENAME);
            //                  $extension=$imagee->getClientOriginalExtension();
            //                  $imagename=$filename.rand(111,999999).time().".".$extension;
            //                  $large='Admin/Adminimages/ProductImages/multipleimages/large/'.$imagename;
            //                  $medium='Admin/Adminimages/ProductImages/multipleimages/medium/'.$imagename;
            //                  $small='Admin/Adminimages/ProductImages/multipleimages/small/'.$imagename;
            //                  Image::make($img)->resize(300, 450)->save($large);
            //                  Image::make($img)->resize(200, 300)->save($medium);
            //                  Image::make($img)->resize(100, 150)->save($small);

            //                  $productmultiple->image=$imagename;
            //                  $productmultiple->product_id=$product['id'];
            //                  $productmultiple->is_enabled=0;
            //                  $productmultiple->save();
            //             }
            //             if($productt=ProductImage::where('product_id',$product['id'])->get()->toArray()){
            //                 return response()->json(['status'=>200,'msg'=>'Product images saved','product'=>$productt]);
            //             }
            //             return response()->json(['status'=>201,'msg'=>'Product does not have images']);

            //           } catch (\Throwable $th) {
            //             return response()->json(['status'=>401,'msg'=>'An err occurred while saving Product images '.$th->getMessage()]);

            //           }

            //                      }else{
            //                         return response()->json(['status'=>409,'msg'=>'No files','request'=>$request->all()]);

            //                      }

            // } catch (\Throwable $th) {
            //     return response()->json(['status'=>400,'msg'=>'An err occurred while saving Product images '.$th->getMessage()]);
            // }
      }

      protected function updamuteltipleimagesstatus(Request $request, $id)
      {
          if (!$product=ProductImage::where('id', $id)->first()) {
              return response()->json(['status'=>404,'msg'=>'product image not found']);
          } else {
              try {
                  if ($product['is_enabled']==1) {
                      $is_enabled=0;
                  } else {
                      $is_enabled=1;
                  }
                  ProductImage::where('id', $id)->update(['is_enabled'=>$is_enabled]);
                  return response()->json(['status'=>200,'newdata'=>$is_enabled,'msg'=>"product image status updated"]);
              } catch (\Throwable $th) {
                  return response()->json(['status'=>400,'msg'=>"An exception occurred while updating product image status ".$th->getMessage()]);
              }
          }
      }
      protected function deletemuteltipleimages($id){
        if (!$product=ProductImage::where('id', $id)->first()) {
            return response()->json(['status'=>404,'msg'=>'product image not found']);
        } else {
            try{
                $productimage=$product['image'];
                $large='Admin/Adminimages/ProductImages/multipleimages/large/'.$productimage;
                $medium='Admin/Adminimages/ProductImages/multipleimages/medium/'.$productimage;
                $small='Admin/Adminimages/ProductImages/multipleimages/small/'.$productimage;
                if (File::exists($large)) {
                    File::delete($large);
                }
                if (File::exists($medium)) {
                    File::delete($medium);
                }
                if (File::exists($small)) {
                    File::delete($small);
                }
              $product->forcedelete();
              return response()->json(['status'=>200,'msg'=>'product image permanently deleted']);
            }catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while deleting product image ".$th->getMessage()]);
            }
        }
    }

}