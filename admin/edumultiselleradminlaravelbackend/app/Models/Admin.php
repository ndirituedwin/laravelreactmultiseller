<?php

namespace App\Models;

use Laravel\Passport\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable,SoftDeletes;

    protected $guard='admin';
    protected $fillable=[
        'name',
        'role_id',
        'mobile',
        'email',
        'avatar',
        'is_enabled',
        'password'
    ];
    protected $hidden=['password','remember_token'];
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
   public function role(){
       return $this->belongsTo(Role::class);
   }
   public function sections(){
       return $this->hasMany(Section::class);
   }
   public function categories(){
    return $this->hasMany(Category::class);
}
   public function brands(){
    return $this->hasMany(Brand::class);
   }
   public function shops()
   {
      return $this->hasMany(Shop::class);
   }

}
