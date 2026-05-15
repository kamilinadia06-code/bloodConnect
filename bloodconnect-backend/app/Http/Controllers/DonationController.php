<?php
namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    // Liste des dons de l'utilisateur connecté
    public function index(Request $request)
    {
        $donations = Donation::where('user_id', $request->user()->id)
            ->orderBy('date', 'desc')
            ->get();
        return response()->json($donations);
    }

    // Créer un nouveau don
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'location' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $donation = Donation::create([
            'user_id' => $request->user()->id,
            'date' => $request->date,
            'location' => $request->location,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        // Mettre à jour le total des dons
        $request->user()->increment('total_donations');

        return response()->json($donation, 201);
    }

    // Voir un don spécifique
    public function show(Request $request, $id)
    {
        $donation = Donation::where('user_id', $request->user()->id)
            ->findOrFail($id);
        return response()->json($donation);
    }

    // Modifier un don
    public function update(Request $request, $id)
    {
        $donation = Donation::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $donation->update($request->only(['date', 'location', 'notes', 'status']));
        return response()->json($donation);
    }

    // Supprimer un don
    public function destroy(Request $request, $id)
    {
        $donation = Donation::where('user_id', $request->user()->id)
            ->findOrFail($id);
        $donation->delete();
        return response()->json(['message' => 'Don supprimé avec succès']);
    }

    // Pour l'admin - voir tous les dons
    public function adminIndex()
    {
        $donations = Donation::with('user')->orderBy('date', 'desc')->get();
        return response()->json($donations);
    }

    // Pour l'admin - confirmer un don
    public function confirm(int $id)
    {
        $donation = Donation::findOrFail($id);
    $donation->update(['status' => 'confirmed']);
    $donation->user->increment('total_donations');
    $donation->user->update([
        'last_donation_date' => $donation->date,
    ]);
    return response()->json($donation);
}
}