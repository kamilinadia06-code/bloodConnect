<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IdentityVerification extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'cin',
        'card_image',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}