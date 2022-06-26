<?php

namespace Database\Seeders;

use App\Models\Seller;
use Illuminate\Database\Seeder;

class SellerTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sellers=[
            [
                'seller_name'=>'sellerone',
                'shop_id'=>1,
                'seller_email'=>'sellerone@gmail.com',
                'seller_phone'=>'0799149758',
                'is_enabled'=>1
            ],
            [
                'seller_name'=>'sellertwo',
                'shop_id'=>1,
                'seller_email'=>'sellertwo@gmail.com',
                'seller_phone'=>'099149758',
                'is_enabled'=>1
            ]
            ];
            foreach ($sellers as $key => $seller) {
                Seller::Create($seller);
            }
    }
}
