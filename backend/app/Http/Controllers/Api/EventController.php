<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class EventController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
    // Only eager load active registrations for consistency
    $query = Event::with(['registrations' => function ($q) {
        $q->where('status', 'registered');
        }])
            ->active()
            ->upcoming();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Filter by location
        if ($request->has('location')) {
            $query->where('location', 'like', "%{$request->get('location')}%");
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('start_date', '>=', $request->get('start_date'));
        }

        if ($request->has('end_date')) {
            $query->where('end_date', '<=', $request->get('end_date'));
        }

        // Sort options
        $sortBy    = $request->get('sort_by', 'start_date');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

    $events = $query->paginate(10);

        // Add computed attributes
        $events->getCollection()->transform(function ($event) {
            $event->available_spots = $event->available_spots;
            $event->is_full = $event->is_full;
            // count only active registrations
            $event->registration_count = $event->registrations->where('status', 'registered')->count();
            return $event;
        });

        return response()->json($events);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventRequest $request)
    {
        $this->authorize('create', Event::class);

        $data = $request->validated();

        // If an image file is uploaded, store it and set image_url
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $data['image_url'] = asset('storage/' . $path);
        }

        $event = Event::create($data);

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        // Only load active registrations
        $event->load(['registrations' => function ($q) {
            $q->where('status', 'registered')->with('user');
        }]);

        $event->available_spots    = $event->available_spots;
        $event->is_full            = $event->is_full;
        $event->registration_count = $event->registrations->count();

        return response()->json([
            'event' => $event
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        $this->authorize('update', $event);
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $data['image_url'] = asset('storage/' . $path);
        }

        $event->update($data);

        return response()->json([
            'message' => 'Event updated successfully',
            'event'   => $event
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }
}
