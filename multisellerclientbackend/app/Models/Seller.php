<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Seller extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable=[
        'seller_name',
        'shop_id',
        'seller_email',
        'seller_mobile',
        'is_enabled',

    ];
}
