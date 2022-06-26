<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        // $this->call(UsersTbleSeeder::class);
        // $this->call(Roletableseeder::class);
        // $this->call(Admintableseeder::class);
        // $this->call(ShopsTableSeeder::class);
        $this->call(SellerTableSeeder::class);
    }
}
