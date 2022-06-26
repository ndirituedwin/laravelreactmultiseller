<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class Roletableseeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles=[
            [
                // 'admin_id'=>1,
                'role'=>'super admin'
            ],
            [
                // 'admin_id'=>1,
                'role'=>'admin'
            ]
            ];
            foreach($roles as $role){
                Role::Create($role);
            }
    }
}