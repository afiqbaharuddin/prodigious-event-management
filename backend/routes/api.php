<?php
// routes/api.php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\RegistrationController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public event routes
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{event}', [EventController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Event management (admin only)
    Route::middleware('admin')->group(function () {
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{event}', [EventController::class, 'update']);
        Route::delete('/events/{event}', [EventController::class, 'destroy']);
    });
    
    // Registration routes
    Route::post('/events/{event}/register', [RegistrationController::class, 'register']);
    Route::get('/my-registrations', [RegistrationController::class, 'myRegistrations']);
    Route::delete('/registrations/{registration}', [RegistrationController::class, 'cancel']);
});