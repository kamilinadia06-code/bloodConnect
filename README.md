# 🩸 BloodConnect

### 🎓 École Nationale des Sciences Appliquées — El Jadida (ENSA El Jadida)

Application web de gestion des dons de sang développée dans le cadre du cours de Développement Web — 2ITE S2 (2025-2026), sous la supervision du **Pr. ERRATTAHI Rahhal**.

---

## 👥 Binôme

- Nadia Kamili
- Aya Qaremy

---

## 📌 Description

BloodConnect est une plateforme qui connecte les donneurs de sang avec les hôpitaux et centres de santé à El Jadida. Elle permet de gérer les dons, de publier des demandes urgentes de sang, et de vérifier l'identité des donneurs pour leur délivrer une carte officielle digitale.

### Fonctionnalités principales

- Inscription et connexion sécurisée avec deux rôles : **Admin** et **Donor**
- Tableau de bord personnalisé selon le rôle
- Déclaration et suivi des dons de sang
- Publication et gestion des demandes urgentes de sang
- Vérification d'identité par upload de la carte nationale
- Carte de donneur digitale débloquée après 2 dons validés
- Panel d'administration pour valider les dons et les identités

---

## 🛠️ Technologies utilisées

| Côté | Technologie |
|------|-------------|
| Frontend | React.js, Tailwind CSS, Axios |
| Backend | Laravel (API RESTful) |
| Base de données | MySQL |
| Authentification | Laravel Sanctum (JWT) |
| Stockage fichiers | Laravel Storage |

---

## ⚙️ Installation et lancement

### Prérequis

- Node.js >= 18
- PHP >= 8.1
- Composer
- MySQL

---

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/bloodconnect.git
cd bloodconnect
```

---

### 2. Backend Laravel

```bash
cd bloodconnect-backend
composer install
```

Copier le fichier d'environnement :

```bash
cp .env.example .env
```

Configurer la base de données dans `.env` :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bloodconnect
DB_USERNAME=root
DB_PASSWORD=
```

Générer la clé et lancer les migrations :

```bash
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

Le backend tourne sur **http://localhost:8000**

---

### 3. Frontend React

```bash
cd bloodconnect
npm install
npm run dev
```

Le frontend tourne sur **http://localhost:3000**

---

## 🔐 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@bloodconnect.ma | password123 |
| Donor | donor@bloodconnect.ma | password123 |

---

## 📁 Structure du projet

```
bloodconnect/               → Frontend React
├── src/
│   ├── components/         → Composants UI
│   ├── hooks/              → useAuth
│   ├── lib/                → Configuration Axios
│   └── App.jsx

bloodconnect-backend/       → Backend Laravel
├── app/
│   ├── Http/Controllers/   → AuthController, DonationController...
│   └── Models/             → User, Donation, UrgentRequest...
├── database/migrations/    → Tables MySQL
└── routes/api.php          → Routes API
```

---

## 🗄️ Base de données

Le fichier `bloodconnect.sql` contient la structure complète de la base de données avec quelques données de test.

Pour l'importer :

```bash
mysql -u root -p bloodconnect < bloodconnect.sql
```

---

