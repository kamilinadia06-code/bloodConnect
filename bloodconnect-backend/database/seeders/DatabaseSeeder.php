<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Crée un admin
        User::create([
            'name'           => 'Admin BloodConnect',
            'email'          => 'admin@bloodconnect.ma',
            'password'       => Hash::make('password123'),
            'blood_group'    => 'O+',
            'role'           => 'admin',
            'total_donations'=> 0,
        ]);

        // Crée un donneur de test
        User::create([
            'name'           => 'Karim Donor',
            'email'          => 'donor@bloodconnect.ma',
            'password'       => Hash::make('password123'),
            'blood_group'    => 'A+',
            'role'           => 'donor',
            'total_donations'=> 0,
        ]);
    }
}