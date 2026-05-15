<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('donor');
            $table->string('blood_group')->nullable();
            $table->string('city')->nullable();
            $table->string('cin')->nullable();
            $table->date('last_donation_date')->nullable();
            $table->integer('total_donations')->default(0);
        });
    }

    public function down(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'blood_group', 'city', 'cin', 'last_donation_date', 'total_donations']);
        });
    }
};