<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Field;
use App\Http\Controllers\Api\FieldController;

Route::post('/login', function (Request $request) {
    $request->validate(['email' => 'required|email', 'password' => 'required']);
    $user = User::where('email', $request->email)->first();
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials.'], 401);
    }
    $token = $user->createToken('api-token')->plainTextToken;
    return response()->json([
        'token' => $token,
        'user'  => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'role' => $user->role],
    ]);
});

Route::post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out.']);
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());

    Route::get('/dashboard', function (Request $request) {
        $fields = Field::with(['agent', 'latestUpdate'])->get();
        $atRisk = $fields->filter(fn($f) => $f->days_since_planting > 90 && $f->stage !== 'harvested');
        return response()->json([
            'total_fields'      => $fields->count(),
            'total_agents'      => User::where('role', 'agent')->count(),
            'unassigned_fields' => $fields->whereNull('assigned_to')->count(),
            'status_breakdown'  => [
                'active'    => $fields->where('status', 'active')->count(),
                'at_risk'   => $atRisk->count(),
                'completed' => $fields->where('status', 'completed')->count(),
            ],
            'stage_breakdown'   => [
                'planted'   => $fields->where('stage', 'planted')->count(),
                'growing'   => $fields->where('stage', 'growing')->count(),
                'ready'     => $fields->where('stage', 'ready')->count(),
                'harvested' => $fields->where('stage', 'harvested')->count(),
            ],
            'at_risk_fields' => $atRisk->values()->map(fn($f) => [
                'id'                  => $f->id,
                'name'                => $f->name,
                'crop_type'           => $f->crop_type,
                'stage'               => $f->stage,
                'days_since_planting' => $f->days_since_planting,
                'agent'               => $f->agent ? ['name' => $f->agent->name] : null,
            ]),
        ]);
    });

    Route::middleware('admin')->group(function () {
        Route::post('/fields', [FieldController::class, 'store']);
        Route::put('/fields/{field}', [FieldController::class, 'update']);
        Route::delete('/fields/{field}', [FieldController::class, 'destroy']);
        Route::get('/agents', [FieldController::class, 'agents']);
    });

    Route::get('/fields', [FieldController::class, 'index']);
    Route::get('/fields/my', [FieldController::class, 'myFields']);
    Route::get('/fields/{field}', [FieldController::class, 'show']);
    Route::post('/fields/{field}/updates', [FieldController::class, 'postUpdate']);
});
