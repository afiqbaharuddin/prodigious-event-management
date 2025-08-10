<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventSeeder extends Seeder
{
    public function run(): void
    {   
        $events = [
            [
                'title'             => 'Sheila on 7 Live in Malaysia 2025',
                'description'       => 'Hi SheilaGank Malaysia! We are here!',
                'start_date'        => '2025-08-31 20:00:00',
                'end_date'          => '2025-08-31 23:00:00',
                'location'          => 'Axiata Arena, Bukit Jalil, Kuala Lumpur',
                'max_participants'  => 5000,
                'image_url'         => 'http://localhost:8000/storage/events/EZgC7kCt6YY4qrla46UPKJcmVZCiRR1txHr84AZ7.jpg',
                'status'            => 'active',
            ],
            [
                'title'             => 'Latihan Pestapora Malaysia 2025!',
                'description'       => 'Hitboy Solutions brings you, the largest music fest into Malaysia, Latihan Pestapora Malaysia! Get your tickets now and enjoy the largest music fest in Indonesia!',
                'start_date'        => '2025-08-29 20:30:00',
                'end_date'          => '2025-08-30 07:59:00',
                'location'          => 'Stadium Nasional Bukit Jalil, Kuala Lumpur',
                'max_participants'  => 10000,
                'image_url'         => 'http://localhost:8000/storage/events/3LIhrOhJNbM4C8ORum1nj9gQICnLYN2Br2fXnqgj.jpg',
                'status'            => 'active',
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
