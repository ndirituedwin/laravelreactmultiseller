<?php

namespace Database\Seeders;

use App\Models\Shop;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class ShopsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $shops=[
            [
                'admin_id'=>1,
                'shop'=>'Electronics',
                'slug'=>Str::slug('Electronics')
            ],
            [
                'admin_id'=>1,
                'shop'=>'Fashion',
                'slug'=>Str::slug('Fashion')
            ],
        ];
        foreach($shops as $shop){
            Shop::Create($shop);
        }
    }
}
