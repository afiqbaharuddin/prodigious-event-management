<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RegistrationController extends Controller
{
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

        // Wrap in a transaction to avoid race conditions for capacity
        $registration = DB::transaction(function () use ($event, $user) {
            // Lock the event row to minimize race conditions (noop on SQLite)
            $lockedEvent = Event::where('id', $event->id)->lockForUpdate()->first();

            if ($lockedEvent->is_full) {
                throw ValidationException::withMessages([
                    'event' => ['This event is already full.']
                ]);
            }

            // If a cancelled registration exists, reactivate it
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
