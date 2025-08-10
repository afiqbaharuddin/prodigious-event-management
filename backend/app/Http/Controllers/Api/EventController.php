<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use OpenApi\Attributes as OA;

class EventController extends Controller
{
    use AuthorizesRequests;

    #[OA\Get(
        path: "/api/events",
        summary: "Get all events",
        description: "Retrieve a paginated list of all active and upcoming events",
        tags: ["Events"],
        parameters: [
            new OA\Parameter(
                name: "search",
                in: "query",
                description: "Search in title, description, or location",
                required: false,
                schema: new OA\Schema(type: "string")
            ),
            new OA\Parameter(
                name: "location",
                in: "query",
                description: "Filter by location",
                required: false,
                schema: new OA\Schema(type: "string")
            ),
            new OA\Parameter(
                name: "start_date",
                in: "query",
                description: "Filter events starting from this date",
                required: false,
                schema: new OA\Schema(type: "string", format: "date")
            ),
            new OA\Parameter(
                name: "end_date",
                in: "query",
                description: "Filter events ending before this date",
                required: false,
                schema: new OA\Schema(type: "string", format: "date")
            ),
            new OA\Parameter(
                name: "sort_by",
                in: "query",
                description: "Sort by field (default: start_date)",
                required: false,
                schema: new OA\Schema(type: "string", enum: ["start_date", "title", "created_at"])
            ),
            new OA\Parameter(
                name: "sort_order",
                in: "query",
                description: "Sort order (default: asc)",
                required: false,
                schema: new OA\Schema(type: "string", enum: ["asc", "desc"])
            ),
            new OA\Parameter(
                name: "page",
                in: "query",
                description: "Page number for pagination",
                required: false,
                schema: new OA\Schema(type: "integer", minimum: 1)
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of events with pagination",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "current_page", type: "integer", example: 1),
                        new OA\Property(
                            property: "data",
                            type: "array",
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: "id", type: "integer", example: 1),
                                    new OA\Property(property: "title", type: "string", example: "Tech Conference 2025"),
                                    new OA\Property(property: "description", type: "string", example: "Annual technology conference"),
                                    new OA\Property(property: "location", type: "string", example: "Convention Center"),
                                    new OA\Property(property: "start_date", type: "string", format: "datetime", example: "2025-09-01 09:00:00"),
                                    new OA\Property(property: "end_date", type: "string", format: "datetime", example: "2025-09-01 17:00:00"),
                                    new OA\Property(property: "max_participants", type: "integer", nullable: true, example: 100),
                                    new OA\Property(property: "available_spots", type: "integer", example: 50),
                                    new OA\Property(property: "is_full", type: "boolean", example: false),
                                    new OA\Property(property: "registration_count", type: "integer", example: 50)
                                ],
                                type: "object"
                            )
                        ),
                        new OA\Property(property: "total", type: "integer", example: 25),
                        new OA\Property(property: "per_page", type: "integer", example: 10)
                    ]
                )
            )
        ]
    )]
    public function index(Request $request)
    {
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

        $sortBy    = $request->get('sort_by', 'start_date');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

    $events = $query->paginate(10);

        $events->getCollection()->transform(function ($event) {
            $event->available_spots = $event->available_spots;
            $event->is_full = $event->is_full;
            // count only active registrations
            $event->registration_count = $event->registrations->where('status', 'registered')->count();
            return $event;
        });

        return response()->json($events);
    }

    #[OA\Post(
        path: "/api/events",
        summary: "Create a new event",
        description: "Create a new event (Admin only)",
        tags: ["Events"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["title", "description", "location", "start_date", "end_date"],
                    properties: [
                        new OA\Property(property: "title", type: "string", example: "Tech Conference 2025"),
                        new OA\Property(property: "description", type: "string", example: "Annual technology conference with industry experts"),
                        new OA\Property(property: "location", type: "string", example: "Convention Center, Downtown"),
                        new OA\Property(property: "start_date", type: "string", format: "datetime", example: "2025-09-01 09:00:00"),
                        new OA\Property(property: "end_date", type: "string", format: "datetime", example: "2025-09-01 17:00:00"),
                        new OA\Property(property: "max_participants", type: "integer", nullable: true, example: 100),
                        new OA\Property(property: "image", type: "string", format: "binary", description: "Event image file")
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Event created successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Event created successfully"),
                        new OA\Property(
                            property: "event",
                            type: "object",
                            properties: [
                                new OA\Property(property: "id", type: "integer", example: 1),
                                new OA\Property(property: "title", type: "string", example: "Tech Conference 2025"),
                                new OA\Property(property: "description", type: "string", example: "Annual technology conference"),
                                new OA\Property(property: "location", type: "string", example: "Convention Center"),
                                new OA\Property(property: "start_date", type: "string", format: "datetime"),
                                new OA\Property(property: "end_date", type: "string", format: "datetime"),
                                new OA\Property(property: "max_participants", type: "integer", nullable: true),
                                new OA\Property(property: "image_url", type: "string", nullable: true)
                            ]
                        )
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthorized"),
            new OA\Response(response: 403, description: "Forbidden - Admin access required"),
            new OA\Response(response: 422, description: "Validation errors")
        ]
    )]
    public function store(StoreEventRequest $request)
    {
        $this->authorize('create', Event::class);

        $data = $request->validated();

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

    #[OA\Get(
        path: "/api/events/{id}",
        summary: "Get event details",
        description: "Retrieve detailed information about a specific event",
        tags: ["Events"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                description: "Event ID",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Event details",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: "event",
                            type: "object",
                            properties: [
                                new OA\Property(property: "id", type: "integer", example: 1),
                                new OA\Property(property: "title", type: "string", example: "Tech Conference 2025"),
                                new OA\Property(property: "description", type: "string", example: "Annual technology conference"),
                                new OA\Property(property: "location", type: "string", example: "Convention Center"),
                                new OA\Property(property: "start_date", type: "string", format: "datetime"),
                                new OA\Property(property: "end_date", type: "string", format: "datetime"),
                                new OA\Property(property: "max_participants", type: "integer", nullable: true),
                                new OA\Property(property: "available_spots", type: "integer"),
                                new OA\Property(property: "is_full", type: "boolean"),
                                new OA\Property(property: "registration_count", type: "integer"),
                                new OA\Property(
                                    property: "registrations",
                                    type: "array",
                                    items: new OA\Items(
                                        properties: [
                                            new OA\Property(property: "id", type: "integer"),
                                            new OA\Property(property: "status", type: "string", example: "registered"),
                                            new OA\Property(
                                                property: "user",
                                                type: "object",
                                                properties: [
                                                    new OA\Property(property: "id", type: "integer"),
                                                    new OA\Property(property: "name", type: "string"),
                                                    new OA\Property(property: "email", type: "string")
                                                ]
                                            )
                                        ],
                                        type: "object"
                                    )
                                )
                            ]
                        )
                    ]
                )
            ),
            new OA\Response(response: 404, description: "Event not found")
        ]
    )]
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

    #[OA\Put(
        path: "/api/events/{id}",
        summary: "Update an event",
        description: "Update an existing event (Admin only)",
        tags: ["Events"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                description: "Event ID",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: "title", type: "string", example: "Updated Tech Conference 2025"),
                        new OA\Property(property: "description", type: "string", example: "Updated description"),
                        new OA\Property(property: "location", type: "string", example: "New Convention Center"),
                        new OA\Property(property: "start_date", type: "string", format: "datetime", example: "2025-09-01 09:00:00"),
                        new OA\Property(property: "end_date", type: "string", format: "datetime", example: "2025-09-01 17:00:00"),
                        new OA\Property(property: "max_participants", type: "integer", nullable: true, example: 150),
                        new OA\Property(property: "image", type: "string", format: "binary", description: "Event image file")
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Event updated successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Event updated successfully"),
                        new OA\Property(property: "event", type: "object")
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthorized"),
            new OA\Response(response: 403, description: "Forbidden - Admin access required"),
            new OA\Response(response: 404, description: "Event not found"),
            new OA\Response(response: 422, description: "Validation errors")
        ]
    )]
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

    #[OA\Delete(
        path: "/api/events/{id}",
        summary: "Delete an event",
        description: "Delete an existing event (Admin only)",
        tags: ["Events"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                description: "Event ID",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Event deleted successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Event deleted successfully")
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthorized"),
            new OA\Response(response: 403, description: "Forbidden - Admin access required"),
            new OA\Response(response: 404, description: "Event not found")
        ]
    )]
    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }
}
