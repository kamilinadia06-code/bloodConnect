<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UrgentRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'hospital_name',
        'blood_group',
        'urgency_level',
        'contact_phone',
        'city',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}