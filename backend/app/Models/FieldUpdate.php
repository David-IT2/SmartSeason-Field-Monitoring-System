<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FieldUpdate extends Model
{
    use HasFactory;

    protected $fillable = ['field_id', 'user_id', 'stage', 'notes'];

    public function user() { return $this->belongsTo(User::class); }
    public function field() { return $this->belongsTo(Field::class); }
}
