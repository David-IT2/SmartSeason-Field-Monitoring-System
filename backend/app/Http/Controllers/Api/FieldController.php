<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Field;
use App\Models\FieldUpdate;
use App\Models\User;
use Illuminate\Http\Request;

class FieldController extends Controller
{
    public function index(Request $request)
    {
        $fields = Field::with(['agent:id,name,email', 'latestUpdate'])
            ->latest()
            ->get()
            ->map(fn($f) => $this->formatField($f));

        return response()->json($fields);
    }

    public function myFields(Request $request)
    {
        $fields = Field::with(['agent:id,name,email', 'latestUpdate'])
            ->where('assigned_to', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn($f) => $this->formatField($f));

        return response()->json($fields);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'crop_type'     => 'required|string|max:255',
            'planting_date' => 'required|date',
            'stage'         => 'sometimes|in:planted,growing,ready,harvested',
            'assigned_to'   => 'nullable|exists:users,id',
        ]);

        $data['created_by'] = $request->user()->id;
        $data['stage'] = $data['stage'] ?? 'planted';

        $field = Field::create($data);
        $field->load('agent:id,name,email');

        return response()->json($this->formatField($field), 201);
    }

    public function show(Request $request, Field $field)
    {
        $user = $request->user();

        if ($user->isAgent() && $field->assigned_to !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $field->load(['agent:id,name,email', 'updates.user:id,name', 'creator:id,name']);

        return response()->json($this->formatField($field, true));
    }

    public function update(Request $request, Field $field)
    {
        $data = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'crop_type'     => 'sometimes|string|max:255',
            'planting_date' => 'sometimes|date',
            'stage'         => 'sometimes|in:planted,growing,ready,harvested',
            'assigned_to'   => 'nullable|exists:users,id',
        ]);

        $field->update($data);
        $field->load('agent:id,name,email');

        return response()->json($this->formatField($field));
    }

    public function destroy(Field $field)
    {
        $field->delete();

        return response()->json(['message' => 'Field deleted.']);
    }

    public function postUpdate(Request $request, Field $field)
    {
        $user = $request->user();

        if ($user->isAgent() && $field->assigned_to !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'stage' => 'required|in:planted,growing,ready,harvested',
            'notes' => 'nullable|string',
        ]);

        $update = FieldUpdate::create([
            'field_id' => $field->id,
            'user_id'  => $user->id,
            'stage'    => $data['stage'],
            'notes'    => $data['notes'] ?? null,
        ]);

        $field->update(['stage' => $data['stage']]);

        return response()->json([
            'message' => 'Field updated.',
            'update'  => [
                'id'         => $update->id,
                'stage'      => $update->stage,
                'notes'      => $update->notes,
                'updated_by' => $user->name,
                'created_at' => $update->created_at,
            ],
        ], 201);
    }

    public function agents()
    {
        $agents = User::where('role', 'agent')
            ->select('id', 'name', 'email')
            ->get();

        return response()->json($agents);
    }

    private function formatField(Field $field, bool $withUpdates = false): array
    {
        $data = [
            'id'                  => $field->id,
            'name'                => $field->name,
            'crop_type'           => $field->crop_type,
            'planting_date'       => $field->planting_date->format('Y-m-d'),
            'stage'               => $field->stage,
            'status'              => $field->status,
            'days_since_planting' => $field->days_since_planting,
            'agent'               => $field->agent,
            'latest_update'       => $field->latestUpdate ? [
                'stage'      => $field->latestUpdate->stage,
                'notes'      => $field->latestUpdate->notes,
                'created_at' => $field->latestUpdate->created_at,
            ] : null,
            'created_at'          => $field->created_at,
        ];

        if ($withUpdates) {
            $data['creator'] = $field->creator;
            $data['updates'] = $field->updates->map(fn($u) => [
                'id'         => $u->id,
                'stage'      => $u->stage,
                'notes'      => $u->notes,
                'updated_by' => $u->user?->name,
                'created_at' => $u->created_at,
            ]);
        }

        return $data;
    }
}
