<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class UsersTbleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users=[
           [
            'name' => "user one",
            'email' => "userone@gmail.com",
            'email_verified_at' => now(),
            'password' =>bcrypt('userone@gmail.com') ,
            'remember_token' => Str::random(10),
           ],
           [
            'name' => "user two",
            'email' => "usertwo@gmail.com",
            'email_verified_at' => now(),
            'password' =>bcrypt('usertwo@gmail.com') ,
            'remember_token' => Str::random(10),
           ],
        ];
        foreach($users as $use){
            User::create($use);
        }
    }
}
