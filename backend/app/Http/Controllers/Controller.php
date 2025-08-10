<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    description: "Event Management System API - A mini event management platform where users can view events, register for events, and admins can manage events.",
    title: "Prodigious Event Management API",
    contact: new OA\Contact(
        name: "Prodigious Event Management Team",
        email: "support@prodigious-events.com"
    )
)]
#[OA\Server(
    url: "http://localhost:8000/api",
    description: "Local development server"
)]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Use the Bearer token obtained from login endpoint"
)]
#[OA\Tag(
    name: "Authentication",
    description: "User authentication endpoints"
)]
#[OA\Tag(
    name: "Events",
    description: "Event management endpoints"
)]
#[OA\Tag(
    name: "Registrations",
    description: "Event registration endpoints"
)]
abstract class Controller
{
    //
}
