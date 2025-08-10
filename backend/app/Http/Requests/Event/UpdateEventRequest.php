<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
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
            'title'             => 'sometimes|required|string|max:255',
            'description'       => 'sometimes|required|string',
            'start_date'        => 'sometimes|required|date',
            'end_date'          => 'sometimes|required|date|after:start_date',
            'location'          => 'sometimes|required|string|max:255',
            'max_participants'  => 'sometimes|nullable|integer|min:1',
            'image'             => 'sometimes|nullable|image|max:4096',
            'image_url'         => 'sometimes|nullable|url',
            'status'            => 'sometimes|in:active,cancelled,completed'
        ];
    }
}
