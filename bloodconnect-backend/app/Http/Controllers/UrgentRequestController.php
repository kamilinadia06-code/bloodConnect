<?php
namespace App\Http\Controllers;

use App\Models\UrgentRequest;
use Illuminate\Http\Request;

class UrgentRequestController extends Controller
{
    // Liste toutes les demandes actives
    public function index()
    {
        $requests = UrgentRequest::with('user')
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($requests);
    }

    // Créer une nouvelle demande
    public function store(Request $request)
    {
        $request->validate([
            'hospital_name' => 'required|string',
            'blood_group' => 'required|string',
            'urgency_level' => 'required|in:low,medium,high,critical',
            'contact_phone' => 'required|string',
            'city' => 'required|string',
        ]);

        $urgentRequest = UrgentRequest::create([
            'user_id' => $request->user()->id,
            'hospital_name' => $request->hospital_name,
            'blood_group' => $request->blood_group,
            'urgency_level' => $request->urgency_level,
            'contact_phone' => $request->contact_phone,
            'city' => $request->city,
            'status' => 'active',
        ]);

        return response()->json($urgentRequest, 201);
    }

    // Modifier une demande
    public function update(Request $request, $id)
    {
        $urgentRequest = UrgentRequest::findOrFail($id);
        $urgentRequest->update($request->only([
            'hospital_name', 'blood_group', 
            'urgency_level', 'contact_phone', 
            'city', 'status'
        ]));
        return response()->json($urgentRequest);
    }

    // Supprimer une demande
    public function destroy($id)
    {
        $urgentRequest = UrgentRequest::findOrFail($id);
        $urgentRequest->delete();
        return response()->json(['message' => 'Demande supprimée avec succès']);
    }
}