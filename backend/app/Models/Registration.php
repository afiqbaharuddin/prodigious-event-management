<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'event_id',
        'status',
        'registered_at'
    ];

    protected $casts = [
        'registered_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($registration) {
            $registration->registered_at = now();
            if (!$registration->status) {
                $registration->status = 'registered';
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
