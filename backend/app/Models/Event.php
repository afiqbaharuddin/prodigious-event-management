<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'location',
        'max_participants',
        'image_url',
        'status'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date'   => 'datetime',
    ];

    /**
     * Get the registrations for the event.
     */
    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    /**
     * Get the users who are registered for the event.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'registrations');
    }

    public function getAvailableSpotsAttribute()
    {
        if (!$this->max_participants) {
            return null;
        }
        return $this->max_participants - $this->registrations()->where('status', 'registered')->count();
    }

    public function getIsFullAttribute()
    {
        return $this->max_participants && $this->registrations()->where('status', 'registered')->count() >= $this->max_participants;
    }

    public function getIsUpcomingAttribute()
    {
        return $this->start_date > now();
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>', now());
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
