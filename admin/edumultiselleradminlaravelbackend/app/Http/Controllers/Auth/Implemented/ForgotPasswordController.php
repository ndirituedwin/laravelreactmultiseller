<?php

namespace App\Http\Controllers\Auth\Implemented;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    public function __construct(){
        $this->middleware('auth:api');

    }
    public function forgot(Request $request){
        $validator=Validator::make($request->only(['email']),[
               'email'=>'required|email'
        ]);
        if($validator->fails()){
            return response()->json(['status'=>422,'validation_errors'=>$validator->messages()]);
        }else{
            $email=$request['email'];
            try {
             if(User::where('email',$email)->doesntExist()){
                 return response()->json(['status'=>404,'msg'=>'User doesn\'t exist']);
             }
             $token=Str::random(10);

             try {
                 DB::table('password_resets')->insert(['email'=>$request['email'],'token'=>$token,'created_at'=>now()]);
                   //send email
              Mail::send('mails.forgotpassword',['token'=>$token],function(Message $message) use ($email){
                $message->to($email);

                $message->subject("Reset your password");
                });

                return response()->json(['status'=>200,'msg'=>"Mail sent"]);
             } catch (\Throwable $th) {
                return response()->json(['status'=>300,'msg'=>$th->getMessage()]);
             }
            }catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>$th->getMessage()]);
            }
        }
    }
    public function reset(Request $request){
        $validator=Validator::make($request->only(['token','password','password_confirmation']),[
            'token'=>'required|string',
            'password' => ['required', 'string', 'min:8', 'confirmed'],

     ]);
     if($validator->fails()){
         return response()->json(['status'=>422,'validation_errors'=>$validator->messages()]);
     }else{
        try {


        $token=$request->input('token');
        if(!$passwordreset=DB::table('password_resets')->where('token',$token)->first()){
            return response()->json(['msg'=>'Invalid token','status'=>400]);
        }
        /** @var  User $user */
        if(!$user=User::where('email',$passwordreset->email)->first()){
             return response()->json(['msg'=>'User doesn\'t exist','status'=>400]);
        }
        // if($user !=Auth::user()){
        //     return response()->json(['msg'=>'You must be the one logged in to change the password','status'=>122]);
        // }
                    $user->password=bcrypt($request->input('password'));
                    $user->save();
                    return response()->json(['msg'=>'success,Password updated','status'=>200]);

                } catch (\Throwable $th) {
                    return response()->json(['status'=>400,'msg'=>$th->getMessage()]);
                  }

                }
}
}
