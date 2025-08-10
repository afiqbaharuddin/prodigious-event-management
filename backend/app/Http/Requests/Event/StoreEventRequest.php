<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'             => 'required|string|max:255',
            'description'       => 'required|string',
            'start_date'        => 'required|date|after:now',
            'end_date'          => 'required|date|after:start_date',
            'location'          => 'required|string|max:255',
            'max_participants'  => 'nullable|integer|min:1',
            // Allow either an image file upload or a URL (for backward compatibility)
            'image'             => 'nullable|image|max:4096',
            'image_url'         => 'nullable|url',
            'status'            => 'in:active,cancelled,completed'
        ];
    }
}
