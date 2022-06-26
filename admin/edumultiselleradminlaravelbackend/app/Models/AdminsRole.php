<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminsRole extends Model
{
    use HasFactory;
    protected $fillable=[
        'admin_id',
        'module',
        'view_access',
        'edit_access',
        'delete_access',
        'full_access'
    ];
}