<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class RegistrationController extends Controller
{
    #[OA\Post(
        path: "/api/events/{id}/register",
        summary: "Register for an event",
        description: "Register the authenticated user for a specific event",
        tags: ["Registrations"],
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
                response: 201,
                description: "Successfully registered for the event",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Successfully registered for the event"),
                        new OA\Property(
                            property: "registration",
                            type: "object",
                            properties: [
                                new OA\Property(property: "id", type: "integer", example: 1),
                                new OA\Property(property: "user_id", type: "integer", example: 1),
                                new OA\Property(property: "event_id", type: "integer", example: 1),
                                new OA\Property(property: "status", type: "string", example: "registered"),
                                new OA\Property(property: "registered_at", type: "string", format: "datetime"),
                                new OA\Property(
                                    property: "event",
                                    type: "object",
                                    properties: [
                                        new OA\Property(property: "id", type: "integer"),
                                        new OA\Property(property: "title", type: "string"),
                                        new OA\Property(property: "start_date", type: "string", format: "datetime"),
                                        new OA\Property(property: "location", type: "string")
                                    ]
                                )
                            ]
                        )
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthorized"),
            new OA\Response(response: 404, description: "Event not found"),
            new OA\Response(
                response: 422,
                description: "Validation errors",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "The given data was invalid."),
                        new OA\Property(
                            property: "errors",
                            type: "object",
                            properties: [
                                new OA\Property(
                                    property: "event",
                                    type: "array",
                                    items: new OA\Items(type: "string", example: "Cannot register for past events.")
                                )
                            ]
                        )
                    ]
                )
            )
        ]
    )]
    public function register(Request $request, Event $event)
    {
        $user = $request->user();

        // Basic validations first
        if (!$event->is_upcoming) {
            throw ValidationException::withMessages([
                'event' => ['Cannot register for past events.']
            ]);
        }

        // If already actively registered, block
        if ($event->registrations()->where('user_id', $user->id)->where('status', 'registered')->exists()) {
            throw ValidationException::withMessages([
                'event' => ['You are already registered for this event.']
            ]);
        }

        $registration = DB::transaction(function () use ($event, $user) {
            // Lock the event row to minimize race conditions (noop on SQLite)
            $lockedEvent = Event::where('id', $event->id)->lockForUpdate()->first();

            if ($lockedEvent->is_full) {
                throw ValidationException::withMessages([
                    'event' => ['This event is already full.']
                ]);
            }

            // If a cancelled registration exists, reactivate
            $existing = Registration::where('event_id', $event->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existing) {
                // Only allow if currently cancelled
                if ($existing->status !== 'cancelled') {
                    throw ValidationException::withMessages([
                        'event' => ['You are already registered for this event.']
                    ]);
                }

                $existing->update([
                    'status'        => 'registered',
                    'registered_at' => now(),
                ]);

                return $existing;
            }

            // Otherwise create a new registration
            return Registration::create([
                'user_id'  => $user->id,
                'event_id' => $lockedEvent->id,
            ]);
        });

        return response()->json([
            'message'      => 'Successfully registered for the event',
            'registration' => $registration->load(['event'])
        ], 201);
    }

    #[OA\Get(
        path: "/api/registrations",
        summary: "Get user's registrations",
        description: "Get all active registrations for the authenticated user",
        tags: ["Registrations"],
        security: [["bearerAuth" => []]],
        parameters: [
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
                description: "User's registrations",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "current_page", type: "integer", example: 1),
                        new OA\Property(
                            property: "data",
                            type: "array",
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: "id", type: "integer", example: 1),
                                    new OA\Property(property: "status", type: "string", example: "registered"),
                                    new OA\Property(property: "registered_at", type: "string", format: "datetime"),
                                    new OA\Property(
                                        property: "event",
                                        type: "object",
                                        properties: [
                                            new OA\Property(property: "id", type: "integer"),
                                            new OA\Property(property: "title", type: "string"),
                                            new OA\Property(property: "description", type: "string"),
                                            new OA\Property(property: "location", type: "string"),
                                            new OA\Property(property: "start_date", type: "string", format: "datetime"),
                                            new OA\Property(property: "end_date", type: "string", format: "datetime")
                                        ]
                                    )
                                ],
                                type: "object"
                            )
                        ),
                        new OA\Property(property: "total", type: "integer"),
                        new OA\Property(property: "per_page", type: "integer", example: 10)
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthorized")
        ]
    )]
    public function myRegistrations(Request $request)
    {
        $user = $request->user();
        
        $registrations = Registration::with(['event'])
            ->where('user_id', $user->id)
            ->where('status', 'registered')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($registrations);
    }

    #[OA\Delete(
        path: "/api/registrations/{id}",
        summary: "Cancel registration",
        description: "Cancel a registration for an event",
        tags: ["Registrations"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                description: "Registration ID",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Registration cancelled successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Registration cancelled successfully")
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthorized"),
            new OA\Response(response: 403, description: "Forbidden - Cannot cancel someone else's registration"),
            new OA\Response(response: 404, description: "Registration not found")
        ]
    )]
    public function cancel(Request $request, Registration $registration)
    {
        $user = $request->user();

        if ($registration->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        // If already cancelled, no-op to keep idempotency
        if ($registration->status !== 'cancelled') {
            $registration->update(['status' => 'cancelled']);
        }

        return response()->json([
            'message' => 'Registration cancelled successfully'
        ]);
    }
}
