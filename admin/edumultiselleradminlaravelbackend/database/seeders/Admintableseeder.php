<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class Admintableseeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admins=[
            [
            'name'=>'edwin ndiritu',
            'role_id'=>1,
            'mobile'=>'0799149758',
            'email'=>'edwinnderitu018@gmail.com',
            'avatar'=>'',
            'is_enabled'=>0,
            'password'=>bcrypt('edwinnderitu018@gmail.com')
            ],
            [
                'name'=>'apollo ndiritu',
                'role_id'=>2,
                'mobile'=>'0796149758',
                'email'=>'apollonderitu018@gmail.com',
                'avatar'=>'',
                'is_enabled'=>0,
                'password'=>bcrypt('apollonderitu018@gmail.com')
            ]
            ];
            foreach ($admins as  $admin) {
                Admin::Create($admin);
            }
    }
}
