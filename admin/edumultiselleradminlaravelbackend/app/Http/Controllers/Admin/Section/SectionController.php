<?php

namespace App\Http\Controllers\Admin\Section;

use App\Models\Section;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Shop;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SectionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api-admins');
    }

    protected function fetchshops()
    {
        try {
            $shops=Shop::where('is_enabled', 1)->count();
            if (!$shops>0) {
                return response()->json(['status'=>404,'msg'=>"No shops found"]);
            } else {
                $shops=Shop::where('is_enabled', 1)->get();

                return response()->json(['status'=>200,'shops'=>$shops]);
            }
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching shops ".$th->getMessage()]);
        }
    }

    public function save(Request $request)
    {
        $validator=Validator::make($request->only(['section','shop_id']), [
          'section'=>'required|string|unique:sections|max:255',
          'shop_id'=>'required|numeric'
      ]);
        if ($validator->fails()) {
            return response()->json(['status'=>401,'validation_errors'=>$validator->messages()]);
        } else {
            try {
                Section::create([
                  'admin_id'=>Auth::guard('api-admins')->user()->id,
                  'section'=>$request['section'],
                  'shop_id'=>$request['shop_id'],
                  'slug'=>Str::slug($request['section']).'-'.time()
              ]);
                return response()->json(['status'=>200,'msg'=>"section $request->section created"]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while saving section ".$th->getMessage()]);
            }
        }
    }
    public function viewsections()
    {
        try {
            $sections=Section::with(array('admin'=>function ($query) {
                $query->select('id', 'name');
            },'shop'=>function ($query) {
                $query->select('id', 'shop');
            }
        ))->get();
            return response()->json(['status'=>200,'sections'=>$sections]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching sections ".$th->getMessage()]);
        }
    }
    public function trashedsections()
    {
        try {
            $trashed=Section::onlyTrashed()->get();
            return response()->json(['status'=>200,'sections'=>$trashed]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching trashed  sections ".$th->getMessage()]);
        }
    }
    public function forcedelete($slug)
    {
        if (!$section=Section::onlyTrashed()->where('slug', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'Section not found']);
        } else {
            try {
                $section->forcedelete();
                return response()->json(['status'=>200,'msg'=>'Section permanently deleted']);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while deleting section ".$th->getMessage()]);
            }
        }
    }
    public function editsectionbyslug($slug)
    {
        if (!$section=Section::where('slug', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'Section not found']);
        } else {
            try {
                return response()->json(['status'=>200,'section'=>$section]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while fetching the request section ".$th->getMessage()]);
            }
        }
    }
    public function updatesectionbyslug($slug, Request $request)
    {
        $validator=Validator::make($request->only(['section','shop_id']), [
        'section'=>'required|string|max:255',
        'shop_id'=>'required|numeric'
    ]);
        if ($validator->fails()) {
            return response()->json(['status'=>401,'validation_errors'=>$validator->messages()]);
        } else {
            try {
                if (!$section=Section::where('slug', $slug)->first()) {
                    return response()->json(['status'=>404,'msg'=>'Section not found']);
                } else {
                    $count=Section::where('section', $request['section'])->where('slug', '!=', $section['slug'])->count();
                    if ($count>0) {
                        return response()->json(['status'=>202,'msg'=>"$request->section already exist, please update to another name"]);
                    } else {
                        Section::where('slug', $section['slug'])->update([
                    'admin_id'=>Auth::guard('api-admins')->user()->id,
                    'section'=>$request['section'],
                    'shop_id'=>$request['shop_id'],
                    'slug'=>Str::slug($request['section']).'-'.time()
                  ]);
                        return response()->json(['status'=>200,'msg'=>"$request->section updated"]);
                    }
                }
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while Updating section ".$th->getMessage()]);
            }
        }
    }
    public function deletesectionbyslug($slug)
    {
        if (!$section=Section::where('slug', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'Section not found']);
        } else {
            try {
                $section->delete();
                return response()->json(['status'=>200,'msg'=>'Section deleted']);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while deletgin section ".$th->getMessage()]);
            }
        }
    }
    public function updatesectionstatusbyslug(Request $request, $slug)
    {
        if (!$section=Section::where('slug', $slug)->first()) {
            return response()->json(['status'=>404,'msg'=>'Section not found']);
        } else {
            try {
                if ($section['is_enabled']==1) {
                    $is_enabled=0;
                } else {
                    $is_enabled=1;
                }
                Section::where('slug', $slug)->update(['is_enabled'=>$is_enabled]);
                return response()->json(['status'=>200,'newdata'=>$is_enabled,'msg'=>"Section status updated"]);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while updating section status ".$th->getMessage()]);
            }
        }
    }

    protected function restore($sectionslug)
    {
        if (!$section=Section::withTrashed()->where('slug', $sectionslug)->first()) {
            return response()->json(['status'=>404,'msg'=>'section not found']);
        } else {
            try{
                $section->restore();
                return response()->json(['status'=>200,'msg'=>'section resored']);
            }catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>"An exception occurred while restoring section ".$th->getMessage()]);
            }
        }
    }
}