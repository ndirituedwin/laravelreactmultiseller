<?php

namespace App\Http\Controllers\Front\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{


    public function __construct(){
        $this->middleware('auth:api')->except(['login','register']);

    }


    public function login(Request $request)

    {
        $validator=Validator::make($request->only(['email','password']), [
            $this->username() => 'required|string',
            'password' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['status'=>401,'validation_errors'=>$validator->messages()]);
        } else {

        try {
            if (!Auth::attempt($request->only(['email','password']), $request->has('remember'))) {
                return response()->json([
                    'status'=>205,
                    'msg'=>'Invalid login details']);
            }
            $user=Auth::user();
            /** @var User  $user */
            $token['token']=$user->createToken('multisellerclient')->accessToken;
            $token['customer']=$user;
            return response()->json([
                //    'user'=>$user,
                    'msg'=>'login successfull',
                    'token'=>$token,
                    'status'=>200
                ]);

        } catch (\Throwable $th) {
            return response()->json(['msg'=>$th->getMessage(),'status'=>400]);
        }
    }
    }
   public function user(){
       try{
           if(!Auth::user()){
            return response()->json(['msg'=>'You are un authenticated','status'=>401]);
           }else{
               return response()->json(['user'=>Auth::user(),'status'=>200]);
           }
    } catch (\Throwable $th) {
        return response()->json(['msg'=>$th->getMessage(),'status'=>400]);
    }
   }
     public function username()
    {

       return 'email';
    }

   protected function register(Request $request){
    $validator=Validator::make($request->only(['name','email','password','password_confirmation']),[
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
        'password' => ['required', 'string', 'min:8', 'confirmed'],
    ]);

    if($validator->fails()){
        return response()->json(['status'=>401,'validation_errors'=>$validator->messages()]);
    }else{
        try {
            User::create([
                'name' => $request['name'],
                'email' => $request['email'],
                'role_id' =>4,
                 'password' => bcrypt($request['password']),
                'is_enabled'=>0
            ]);
            return response()->json(['status'=>201,'msg'=>'user created']);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>$th->getMessage()]);

        }
    }
   }

   protected function logout(Request $request){
    try {
        $user =Auth::user()->token();
      $user->revoke();
        // $token=$request->user('api')->token();
        // $token->revoke();
        return response()->json(['msg'=>"Logged out successfully",'status'=>200]);
    } catch (\Throwable $th) {
        return response()->json(['msg'=>$th->getMessage(),'status'=>400]);
    }

   }
}