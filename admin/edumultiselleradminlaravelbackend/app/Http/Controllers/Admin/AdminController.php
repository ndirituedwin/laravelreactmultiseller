<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
class AdminController extends Controller
{
    public function __construct(){
        $this->middleware('auth:api-admins')->except(['login','register','forgot']);

    }
    public function register(Request $request){

        $validator=Validator::make($request->only(['name','role_id','mobile','email','password','password_confirmation']),[
            'name' => ['required', 'string', 'max:255'],
            'role_id' => ['required', 'numeric'],
            'mobile' => ['required', 'numeric'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        if($validator->fails()){
            return response()->json(['status'=>401,'validation_errors'=>$validator->messages()]);

        }else{
            try {
                Admin::create([
                    'name' => $request['name'],
                    'role_id'=>$request['role_id'],
                    'mobile'=>$request['mobile'],
                    'email' => $request['email'],
                     'password' => bcrypt($request['password']),
                    'is_enbled'=>0
                ]);
                return response()->json(['status'=>201,'msg'=>'admin created']);
            } catch (\Throwable $th) {
                return response()->json(['status'=>400,'msg'=>$th->getMessage()]);

            }
        }
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
           if (!Auth::guard('admin')->attempt($request->only(['email','password']), $request->has('remember'))) {
                return response()->json([
                    'status'=>205,
                    'msg'=>'Invalid login details']);
            }
            $admin=Auth::guard('admin')->user();
            /** @var Admin  $admin */
            // $token['token'] =$admin->createToken('multiseller')->accessToken;
            $token['token']=$admin->createToken('multiselleradmin')->accessToken;
            $token['admin']=$admin;
            return response()->json([
                    'msg'=>'Login successful',
                    'token'=>$token,
                    'status'=>200
                ]);
        } catch (\Throwable $th) {
            return response()->json(['status'=>400,'msg'=>$th->getMessage()]);
        }
    }
    }
    public function admin(){
        try{
            $admin=Auth::guard('api-admins')->user();
            return response()->json(['admin'=>$admin,'status'=>200]);
     } catch (\Throwable $th) {
         return response()->json(['msg'=>$th->getMessage(),'status'=>400]);
     }
    }
    public function logoutdmin(Request $request){
        try {
            //logout from all devices
            // use Laravel\Passport\RefreshToken;
            // use Laravel\Passport\Token;
           /* $tokens =  $user->tokens->pluck('id');
            Token::whereIn('id', $tokens)
                ->update(['revoked', true]);
            RefreshToken::whereIn('access_token_id', $tokens)->update(['revoked' => true]);*/
            //logout from the device you are currently in
            $token=$request->user('api-admins')->token();
            $token->revoke();
            return response()->json(['msg'=>"Logged out successfully",'status'=>200]);
        } catch (\Throwable $th) {
            return response()->json(['msg'=>$th->getMessage(),'status'=>400]);
        }

    }
      public function username()
     {

        return 'email';
     }

}