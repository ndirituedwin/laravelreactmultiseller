<?php

namespace App\Http\Controllers\Auth\Implemented;

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
            $token=$user->createToken('app')->accessToken;
            return response()->json([
                    'msg'=>'success',
                    'token'=>$token,
                    'user'=>$user,
                    'status'=>200
                ]);
        } catch (\Throwable $th) {
            return response()->json(['msg'=>$th->getMessage(),'status'=>400]);
        }
    }
    }
   public function user(){
       try{

           return response()->json(['user'=>Auth::user(),'status'=>200]);
    } catch (\Throwable $th) {
        return response()->json(['msg'=>$th->getMessage(),'status'=>400]);
    }
   }
     public function username()
    {

       return 'email';
    }
    public function register(Request $request){

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
                     'password' => bcrypt($request['password']),
                    'is_active'=>0
                ]);
                return response()->json(['status'=>201,'msg'=>'user created']);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>$th->getMessage()]);

            }
        }
    }

}