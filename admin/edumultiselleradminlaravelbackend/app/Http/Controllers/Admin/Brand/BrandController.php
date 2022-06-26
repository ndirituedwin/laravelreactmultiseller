<?php

namespace App\Http\Controllers\Admin\Brand;

use App\Models\Brand;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
    public function __construct(){
        $this->middleware('auth:api-admins');
    }
    protected function save(Request $request)
    {
        $validator=Validator::make($request->only(['brand','shop_id']), [
            'brand'=>'required|string|unique:brands|max:255',
            'shop_id'=>'required|numeric'
        ]);
            if ($validator->fails()) {
                return response()->json(['status'=>401,'validation_errors'=>$validator->messages()]);
            } else {
                try {
                    Brand::create([
                        'admin_id'=>Auth::guard('api-admins')->user()->id,
                           'brand'=>$request['brand'],
                           'shop_id'=>$request['shop_id'],
                        'slug'=>Str::slug($request['brand']).'-'.time()
                    ]);
                    return response()->json(['status'=>200,'msg'=>"brand $request->brand created"]);
                } catch (\Throwable $th) {
                    return response()->json(['status'=>400,'msg'=>"An exception occurred while saving brand ".$th->getMessage()]);
                }
            }
        }



    protected function viewbrands()
    {
        try {
            $brands=Brand::with(array('admin'=>function($query){
                $query->select('id','name');
            },'shop'=>function($query){
                $query->select('id','shop');
            }))->get();

            return response()->json(['status'=>200,'brands'=>$brands]);

        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching brands ".$th->getMessage()]);
        }

    }
    protected function trashedbrands(){
        try {
            $trashed=Brand::onlyTrashed()->get();
            return response()->json(['status'=>200,'brands'=>$trashed]);

        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching trashed  brands ".$th->getMessage()]);

        }
    }
    protected function forcedelete($slug){
        if(!$brand=Brand::onlyTrashed()->where('slug',$slug)->first()){
            return response()->json(['status'=>404,'msg'=>'brand not found']);
        }else{
            try {
                $brand->forcedelete();
                return response()->json(['status'=>200,'msg'=>'brand permanently deleted']);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while deleting brand ".$th->getMessage()]);
            }
        }
    }
    public function editbrandbyslug($slug){

        if(!$brand=Brand::where('slug',$slug)->first()){
            return response()->json(['status'=>404,'msg'=>'brand not found']);
        }else{
            try {
                return response()->json(['status'=>200,'brand'=>$brand]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching the request brand ".$th->getMessage()]);

            }
        }

    }
    public function updatebrandbyslug($slug,Request $request){
        $validator=Validator::make($request->only(['brand','shop_id']),[
            'brand'=>'required|string|max:255',
            'shop_id'=>'required|numeric'
        ]);
        if($validator->fails()){
            return response()->json(['status'=>401,'validation_errors'=>$validator->messages()]);
        }else{
            try {
                if (!$brand=Brand::where('slug', $slug)->first()) {
                    return response()->json(['status'=>404,'msg'=>'brand not found']);
                }else{
                    $count=Brand::where('brand',$request['brand'])->where('slug','!=',$brand['slug'])->count();
                    if($count>0){
                            return response()->json(['status'=>202,'msg'=>"$request->brand already exist, please update to another name"]);
                    }else{
                      Brand::where('slug',$brand['slug'])->update([
                        'admin_id'=>Auth::guard('api-admins')->user()->id,
                        'brand'=>$request['brand'],
                        'shop_id'=>$request['shop_id'],
                        'slug'=>Str::slug($request['brand']).'-'.time()
                      ]);
                      return response()->json(['status'=>200,'msg'=>"$request->brand updated"]);
                    }
                }

            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while Updating brand ".$th->getMessage()]);
            }
        }
    }
    public function deletebrandbyslug($slug)
    {
        if(!$brand=Brand::where('slug',$slug)->first()){
            return response()->json(['status'=>404,'msg'=>'brand not found']);
        }else{
            try {
                $brand->delete();
                return response()->json(['status'=>200,'msg'=>'brand deleted']);

            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while deleting brand ".$th->getMessage()]);
            }
        }
    }
    public function updatebrandstatusbyslug(Request $request,$slug){

        if(!$brand=Brand::where('slug',$slug)->first()){
            return response()->json(['status'=>404,'msg'=>'brand not found']);
        }else{
            try {
                if($brand['is_enabled']==1){
                    $is_enabled=0;
                }else{
                    $is_enabled=1;
                }
                    Brand::where('slug',$slug)->update(['is_enabled'=>$is_enabled]);
                    return response()->json(['status'=>200,'newdata'=>$is_enabled,'msg'=>"brand status updated"]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while updating brand status ".$th->getMessage()]);
            }
        }
    }
    protected function restore($brandslug)
    {
        if (!$brand=Brand::withTrashed()->where('slug', $brandslug)->first()) {
            return response()->json(['status'=>404,'msg'=>'brand not found']);
        } else {
            try {
                $brand->restore();
                return response()->json(['status'=>200,'msg'=>'brand resored']);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while restoring brand ".$th->getMessage()]);
            }
        }
    }

}