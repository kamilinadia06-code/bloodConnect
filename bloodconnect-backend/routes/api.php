<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\UrgentRequestController;
use App\Http\Controllers\IdentityVerificationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Dons - utilisateur
    Route::get('/donations', [DonationController::class, 'index']);
    Route::post('/donations', [DonationController::class, 'store']);
    Route::get('/donations/{id}', [DonationController::class, 'show']);
    Route::put('/donations/{id}', [DonationController::class, 'update']);
    Route::delete('/donations/{id}', [DonationController::class, 'destroy']);

    // Dons - admin
    Route::get('/admin/donations', [DonationController::class, 'adminIndex']);
    Route::put('/admin/donations/{id}/confirm', [DonationController::class, 'confirm']);

    // Demandes urgentes
    Route::get('/urgent-requests', [UrgentRequestController::class, 'index']);
    Route::post('/urgent-requests', [UrgentRequestController::class, 'store']);
    Route::put('/urgent-requests/{id}', [UrgentRequestController::class, 'update']);
    Route::delete('/urgent-requests/{id}', [UrgentRequestController::class, 'destroy']);

    // Vérification d'identité - donor
    Route::post('/identity-verification', [IdentityVerificationController::class, 'store']);
    Route::get('/identity-verification/me', [IdentityVerificationController::class, 'myVerification']);

    // Vérification d'identité - admin
    Route::get('/admin/identity-verifications', [IdentityVerificationController::class, 'adminIndex']);
    Route::put('/admin/identity-verifications/{id}/approve', [IdentityVerificationController::class, 'approve']);
    Route::put('/admin/identity-verifications/{id}/reject', [IdentityVerificationController::class, 'reject']);
});