<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Session;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;
    protected $fillable=['session_id','user_id','product_id','size','quantity'];


    public static function usercartitems(){
        if(Auth::check()){

            $usercartitems=Cart::with('product')->where('user_id',Auth::user()->id)->orderBy('created_at','DESC')->get()->toArray();
       }else{
           $usercartitems=Cart::with('product')->where('session_id',Session::get('session_id'))->orderBy('created_at','DESC')->get()->toArray();

       }
           return $usercartitems;
    }
    public function product(){
        return $this->belongsTo(Product::class);
    }
}
