<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'crop_type', 'planting_date', 'stage', 'assigned_to', 'created_by'];

    protected $casts = ['planting_date' => 'date'];

    public function agent() { return $this->belongsTo(User::class, 'assigned_to'); }
    public function creator() { return $this->belongsTo(User::class, 'created_by'); }
    public function updates() { return $this->hasMany(FieldUpdate::class)->latest(); }
    public function latestUpdate() { return $this->hasOne(FieldUpdate::class)->latest(); }

    public function getStatusAttribute(): string
    {
        return match($this->stage) {
            'planted'   => 'active',
            'growing'   => 'active',
            'ready'     => 'ready',
            'harvested' => 'completed',
            default     => 'unknown',
        };
    }

    public function getDaysSincePlantingAttribute(): int
    {
        return $this->planting_date->diffInDays(now());
    }
}
