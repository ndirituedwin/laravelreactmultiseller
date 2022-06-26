<?php

namespace App\Http\Controllers\Admin\Category;
use App\Models\Section;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api-admins');
    }
    protected function fetchsections()
    {
        try {
            if (!$sections=Section::where('is_enabled', 1)->get()) {
                return response()->json(['status'=>404,'msg'=>"Sections Not found"]);
            }
            return response()->json(['status'=>200,'sections'=>$sections]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching sections ".$th->getMessage()]);
        }
    }
    protected function save(Request $request)
    {
        $validator=Validator::make($request->only(['category_name','section_id','parent_id']), [
            'category_name'=>'required|string|unique:categories|max:255',
            'section_id'=>'required|numeric',
            'parent_id'=>'required|numeric',
        ]);
        if ($validator->fails()) {
            return response()->json(['status'=>422,'validation_errors'=>$validator->messages()]);
        } else {
            try {
                if ($request->hasFile('category_image')) {
                    $filenameext=$request->file('category_image')->getClientOriginalName();
                    $filename=pathinfo($filenameext, PATHINFO_FILENAME);
                    $filenameext=$request->file('category_image')->getClientOriginalExtension();
                    $filenametostore=$filename.'.'.time().'.'.$filenameext;
                    $path=$request->file('category_image')->move('Admin/Adminimages/Categoryimages', $filenametostore);
                    $category_image=$filenametostore;
                } else {
                    $category_image="";
                }
                if (!$request['category_discount']) {
                    $category_discount='0.00';
                } else {
                    $category_discount=$request['category_discount'];
                }
                try {
                    Category::create([
               'admin_id'=>Auth::guard('api-admins')->user()->id,
               'parent_id'=>$request['parent_id'],
                 'section_id'=>$request['section_id'],
                 'category_name'=>$request['category_name'],
                 'slug'=>Str::slug($request['category_name']).'-'.time(),
                'category_image'=>$category_image,
                 'category_discount'=>$category_discount,
                 'description'=>$request['description'],
                 'meta_title'=>$request['meta_title'],
                 'meta_description'=>$request['meta_description'],
                 'meta_keywords'=>$request['meta_keywords'],
             ]);
                    return response()->json(['status'=>200,'msg'=>"category $request->category_name saved"]);
                } catch (\Throwable $th) {
                    return response()->json(['status'=>401,'msg'=>"An exception occurred while saving category ".$th->getMessage()]);
                }
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>$th->getMessage()]);
            }
        }
    }

    protected function sectioncategories($id)
    {
        try {
            $categories=Category::with(array('subcategories'=>function ($query) {
             $query->select('id', 'category_name', 'parent_id', 'is_enabled', 'deleted_at');
            }))->where(['section_id'=>$id,'parent_id'=>0,'is_enabled'=>1])->get();

                     return response()->json(['status'=>200,'categories'=>$categories]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>$th->getMessage()]);
        }
    }
    protected function viewcategories()
    {
        try {
            $categories=Category::with(['admin','section','parentcategory'])->get();
            return response()->json(['status'=>200,'categories'=>$categories]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>$th->getMessage()]);
        }
    }
    protected function updatecategoriestatusbyslug($slug)
    {
        if (!$category=Category::where('slug', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'category not found']);
        } else {
            try {
                if ($category['is_enabled']==1) {
                    $is_enabled=0;
                } else {
                    $is_enabled=1;
                }
                Category::where('slug', $slug)->update(['is_enabled'=>$is_enabled]);
                return response()->json(['status'=>200,'newdata'=>$is_enabled,'msg'=>"category status updated"]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while updating category status ".$th->getMessage()]);
            }
        }
    }
    protected function editcategorybyslug($slug)
    {
        if (!$category=Category::where('slug', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'category not found']);
        } else {
            try {
                return response()->json(['status'=>200,'category'=>$category]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching the requested category ".$th->getMessage()]);
            }
        }
    }
    protected function updatecategorybyslug(Request $request, $slug)
    {
        $validator=Validator::make($request->only(['category_name','section_id','parent_id']), [
        'category_name'=>'required|string|max:255',
        'section_id'=>'required|numeric',
        'parent_id'=>'required|numeric',
    ]);
        if ($validator->fails()) {
            return response()->json(['status'=>422,'validation_errors'=>$validator->messages()]);
        } else {
            try {
                $find=Category::where('slug', $slug)->first();
                if (!$find) {
                    return response()->json(['status'=>402,'msg'=>"category_ not found"]);
                } else {
                    $exists=Category::where('category_name', $request['category_name'])->where('slug', '!=', $slug)->first();
                    if ($exists) {
                        return response()->json(['status'=>403,'msg'=>"category already exists,choose another name"]);
                    } else {
                        try {
                            if ($request->hasFile('category_image')) {
                                $categoryimage=$find['category_image'];
                                $path='Admin/Adminimages/Categoryimages/'.$categoryimage;
                                if (File::exists($path)) {
                                    File::delete($path);
                                }
                                $filenameext=$request->file('category_image')->getClientOriginalName();
                                $filename=pathinfo($filenameext, PATHINFO_FILENAME);
                                $filenameext=$request->file('category_image')->getClientOriginalExtension();
                                $filenametostore=$filename.'.'.time().'.'.$filenameext;
                                $path=$request->file('category_image')->move('Admin/Adminimages/Categoryimages', $filenametostore);
                                $category_image=$filenametostore;
                                Category::where('slug', $slug)->update(['category_image'=>$category_image]);
                            }
                            // else {
                            //     $category_image="";
                            // }
                            if (!$request['category_discount']) {
                                $category_discount='0.00';
                            } else {
                                $category_discount=$request['category_discount'];
                            }
                            try {
                                Category::where('slug', $slug)->update([
                       'admin_id'=>Auth::guard('api-admins')->user()->id,
                       'parent_id'=>$request['parent_id'],
                         'section_id'=>$request['section_id'],
                         'category_name'=>$request['category_name'],
                         'slug'=>Str::slug($request['category_name']).'-'.time(),
                        // 'category_image'=>$category_image,
                         'category_discount'=>$category_discount,
                         'description'=>$request['description'],
                         'meta_title'=>$request['meta_title'],
                         'meta_description'=>$request['meta_description'],
                         'meta_keywords'=>$request['meta_keywords'],
                     ]);
                                return response()->json(['status'=>200,'msg'=>"category $request->category_name saved"]);
                            } catch (\Throwable $th) {
                                return response()->json(['status'=>401,'msg'=>"An exception occurred while saving category ".$th->getMessage()]);
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

    public function deletecategorybyslug($slug)
    {
        if (!$category=Category::where('slug', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'category not found']);
        } else {
            try {
                $category->delete();
                return response()->json(['status'=>200,'msg'=>'category deleted']);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while deleting category ".$th->getMessage()]);
            }
        }
    }
    protected function trashedcategories()
    {
        try {
            $trashed=Category::onlyTrashed()->get();
            return response()->json(['status'=>200,'categories'=>$trashed]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching trashed  categories ".$th->getMessage()]);
        }
    }
    protected function forcedelete($slug)
    {
        if (!$category=Category::onlyTrashed()->where('slug', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'category not found']);
        } else {
            try {
                $category->forcedelete();
                return response()->json(['status'=>200,'msg'=>'category permanently deleted']);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while deleting category ".$th->getMessage()]);
            }
        }
    }
    protected function restore($categoryslug)
    {
        if (!$category=Category::withTrashed()->where('slug', $categoryslug)->first()) {
            return response()->json(['status'=>404,'msg'=>'category not found']);
        } else {
            try {
                $category->restore();
                return response()->json(['status'=>200,'msg'=>'category resoredt']);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while restoring category ".$th->getMessage()]);
            }
        }
    }
}
