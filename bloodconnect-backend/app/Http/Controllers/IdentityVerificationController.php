<?php

namespace App\Http\Controllers;

use App\Models\IdentityVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class IdentityVerificationController extends Controller
{
    // Donor soumet sa demande de vérification
    public function store(Request $request)
    {
        $user = $request->user();

        // Vérifier qu'il a au moins 2 dons confirmés
        $confirmedDonations = $user->donations()->where('status', 'confirmed')->count();
        if ($confirmedDonations < 2) {
            return response()->json(['message' => 'Il faut au moins 2 dons validés.'], 403);
        }

        // Vérifier qu'il n'a pas déjà une demande en attente ou approuvée
        $existing = IdentityVerification::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'approved'])
            ->first();
        if ($existing) {
            return response()->json(['message' => 'Une demande existe déjà.'], 409);
        }

        $request->validate([
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
            'cin'        => 'required|string',
            'card_image' => 'required|image|max:5120','card_image' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $path = $request->file('card_image')->store('identity_cards', 'public');

        $verification = IdentityVerification::create([
            'user_id'    => $user->id,
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'cin'        => $request->cin,
            'card_image' => $path,
            'status'     => 'pending',
        ]);

        return response()->json($verification, 201);
    }

    // Donor consulte sa propre demande
    public function myVerification(Request $request)
    {
        $verification = IdentityVerification::where('user_id', $request->user()->id)
            ->latest()
            ->first();
        return response()->json($verification);
    }

    // Admin voit toutes les demandes en attente
    public function adminIndex()
    {
        $verifications = IdentityVerification::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get();
        return response()->json($verifications);
    }

    // Admin approuve
    public function approve($id)
    {
        $verification = IdentityVerification::findOrFail($id);
        $verification->update(['status' => 'approved']);

        // Mettre à jour le user avec les vraies infos + verified_donor
        $user = User::findOrFail($verification->user_id);
        $user->update([
            'name'           => $verification->first_name . ' ' . $verification->last_name,
            'cin'            => $verification->cin,
            'verified_donor' => true,
        ]);

        return response()->json(['message' => 'Vérification approuvée.']);
    }

    // Admin rejette
    public function reject($id)
    {
        $verification = IdentityVerification::findOrFail($id);
        $verification->update(['status' => 'rejected']);
        return response()->json(['message' => 'Vérification rejetée.']);
    }
}