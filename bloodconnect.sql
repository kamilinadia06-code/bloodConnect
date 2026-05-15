-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 15 mai 2026 à 02:40
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bloodconnect`
--

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `donations`
--

CREATE TABLE `donations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `location` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `donations`
--

INSERT INTO `donations` (`id`, `user_id`, `date`, `location`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 10, '2026-05-14', 'mohammed5', 'confirmed', 'exellente  expérience', '2026-05-14 10:40:33', '2026-05-14 10:59:39'),
(2, 10, '2026-05-14', 'elyassamin hospital', 'confirmed', 'cool', '2026-05-14 10:41:22', '2026-05-14 10:59:44'),
(3, 10, '2026-05-15', 'alnassr', 'confirmed', NULL, '2026-05-14 23:32:32', '2026-05-14 23:34:28'),
(4, 10, '2026-05-15', 'mohammed 4', 'confirmed', NULL, '2026-05-14 23:46:47', '2026-05-14 23:48:42');

-- --------------------------------------------------------

--
-- Structure de la table `donation_centers`
--

CREATE TABLE `donation_centers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `opening_hours` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `identity_verifications`
--

CREATE TABLE `identity_verifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `cin` varchar(255) NOT NULL,
  `card_image` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `identity_verifications`
--

INSERT INTO `identity_verifications` (`id`, `user_id`, `first_name`, `last_name`, `cin`, `card_image`, `status`, `created_at`, `updated_at`) VALUES
(1, 10, 'AYA', 'qaremy', 'm458790', 'identity_cards/vtu2o17FIZEb8R7Lt6ow2IEJpmfJyYxeLrxcLhS9.jpg', 'approved', '2026-05-14 22:56:36', '2026-05-14 23:05:16');

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_23_224513_add_fields_to_users_table', 2),
(5, '2026_04_23_225200_create_donations_table', 3),
(6, '2026_04_23_225437_create_urgent_requests_table', 4),
(7, '2026_04_23_225545_create_donation_centers_table', 5),
(8, '2026_04_23_230505_create_personal_access_tokens_table', 6),
(9, '2026_05_14_112541_create_identity_verifications_table', 7);

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 4, 'auth_token', '7e70ef6f8083fefc1593c225443c905064e43df45d3c139b7c27c989d7795b39', '[\"*\"]', NULL, NULL, '2026-04-24 00:05:06', '2026-04-24 00:05:06'),
(2, 'App\\Models\\User', 5, 'auth_token', 'db5a73f1d58c290a1994485d006b73a1ab2fc722721d149cbddea29a5e31e3ce', '[\"*\"]', NULL, NULL, '2026-04-24 00:05:25', '2026-04-24 00:05:25'),
(3, 'App\\Models\\User', 6, 'auth_token', 'c0bd4a8af20656ae23ce7d035682c6db91fed9e465a9f8b90ac67e867f9bcd8a', '[\"*\"]', NULL, NULL, '2026-04-24 00:06:45', '2026-04-24 00:06:45'),
(4, 'App\\Models\\User', 7, 'auth_token', '85e3b3c8d6792cbd32eb6c18c9b80c50c6a9fe92c197c320cd0f089753a5d975', '[\"*\"]', NULL, NULL, '2026-04-24 21:39:21', '2026-04-24 21:39:21'),
(5, 'App\\Models\\User', 8, 'auth_token', '63d0936c23694b8e1c934e4968b39077d32bc4ad94c16dbcc63239022b6a520c', '[\"*\"]', NULL, NULL, '2026-04-24 22:00:24', '2026-04-24 22:00:24'),
(6, 'App\\Models\\User', 9, 'auth_token', 'cdb57cbbc631875ab038237147c16ce8f32fdc199f7662fdb64f47cb7b8feac2', '[\"*\"]', NULL, NULL, '2026-04-24 22:01:26', '2026-04-24 22:01:26'),
(7, 'App\\Models\\User', 8, 'auth_token', '00db0144d679308199e70c70d45bf87c4b79497706318b385b49605c80b9cc9f', '[\"*\"]', NULL, NULL, '2026-04-24 22:04:46', '2026-04-24 22:04:46'),
(8, 'App\\Models\\User', 8, 'auth_token', '5d99057fb9dfec5bed92224e40bad2096d55300741ce2d4a4fcb42e35102085a', '[\"*\"]', '2026-04-25 15:26:32', NULL, '2026-04-25 15:14:30', '2026-04-25 15:26:32'),
(9, 'App\\Models\\User', 8, 'auth_token', 'd23274655a24c9ef8341356955209da52d538f1b1eccf1c7699c5905824f490a', '[\"*\"]', '2026-04-27 07:53:22', NULL, '2026-04-25 15:26:36', '2026-04-27 07:53:22'),
(10, 'App\\Models\\User', 10, 'auth_token', '5551996a161dd7c4c40e39c507b704544a1a3dc33e21a6e49ebbf3009602040b', '[\"*\"]', '2026-05-12 17:22:08', NULL, '2026-04-27 07:56:27', '2026-05-12 17:22:08'),
(11, 'App\\Models\\User', 8, 'auth_token', '98268f7ae7d23c371f820d1d4fed31cd39d93d24cf8af509bb10d44c4527f0c6', '[\"*\"]', '2026-05-12 17:26:54', NULL, '2026-05-12 17:24:40', '2026-05-12 17:26:54'),
(12, 'App\\Models\\User', 8, 'auth_token', '0451499126cf136abe2c6244276d3bd01ed46406fb7f3c2245d02c4845cdb9f7', '[\"*\"]', '2026-05-13 01:27:22', NULL, '2026-05-13 01:19:49', '2026-05-13 01:27:22'),
(13, 'App\\Models\\User', 8, 'auth_token', '949a942d50017732e3d94db1aa349f7aec8e7d0d588f0564bb8a69709d94cc43', '[\"*\"]', '2026-05-13 07:28:42', NULL, '2026-05-13 07:28:37', '2026-05-13 07:28:42'),
(14, 'App\\Models\\User', 10, 'auth_token', '8d96ead4f51889576d6340e3129a936db7bdf43b239fa711ca02947ac40354d3', '[\"*\"]', '2026-05-14 09:29:26', NULL, '2026-05-14 09:18:40', '2026-05-14 09:29:26'),
(15, 'App\\Models\\User', 10, 'auth_token', 'c1a22b9e8e9d82aa0b072fa5af1fc6f3a5631f819cb8fa509f4f6df3a1ca5f95', '[\"*\"]', '2026-05-14 11:07:19', NULL, '2026-05-14 09:57:07', '2026-05-14 11:07:19'),
(16, 'App\\Models\\User', 11, 'auth_token', '0853f2aff6fc3106d0e768f91d4f30018001a2e27c9ea9301b3464ffb501bd5a', '[\"*\"]', '2026-05-14 23:48:44', NULL, '2026-05-14 10:58:56', '2026-05-14 23:48:44'),
(17, 'App\\Models\\User', 10, 'auth_token', 'dfc0bb8ee2cdcf20b052af17ab7eef07927d8c4fc6614d1d9df5d371ce42ebb1', '[\"*\"]', '2026-05-14 23:20:19', NULL, '2026-05-14 22:52:46', '2026-05-14 23:20:19'),
(18, 'App\\Models\\User', 10, 'auth_token', '41c45d3b500de1f79eebfea921f56bfefe31e9c8655a1731535b5aa98cb9f241', '[\"*\"]', '2026-05-14 23:37:51', NULL, '2026-05-14 23:31:26', '2026-05-14 23:37:51'),
(19, 'App\\Models\\User', 10, 'auth_token', '5c477f4b690f97e5b4eb725cb21d20c5e96730f4b9e90094a447af7b09d7d7d3', '[\"*\"]', '2026-05-14 23:48:58', NULL, '2026-05-14 23:46:03', '2026-05-14 23:48:58');

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0KZXPPLn0Pv1fwxUQyhuAAKTxW3KOH3o2ipkwgiO', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiamhDd2EwMzRpWExxNlY0dGo4VDNOUERoaU1xNVVmdlNzZ3llMVJHQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778796697),
('c2Ai6djUgSvoWNlHXui1J9oRV5AjLMFbLRlm6Wu6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYUdiT0lIcGQweXd0ZVJITXBPMHIxNnhhSXRFOGFXdVBEZThPQjFydSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778613927),
('eKQZPq6XPECPHC7kqLyooH9HTlJASSK5j9ctk6ju', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid0NQMlRTRHlUSGdRUUJxd1FwbmtFWkp6cHRwd3Y0THZoWENRV0NabiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778657300),
('MCVNZe457DmwTanyiDPFaMbA1zhliHKcNTnzzsyZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.119.1 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTlhiQmRkVkM5QXVzcXpvSmkzdWpCeDFrM1c2amo2aGh1ZGhtNDdOVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778613872),
('OuGiOneL7UDU8AyEdq4DhXfCnhwaFwJwvRAQat0B', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia3pVaXZoQ0x3ZGw5UzkzcXNmbEhJNkhVQnh6NmJkSTVzeWZPOFZkbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777130003),
('pHBT1chVxXVRnhuf0HVzUcqWBcq2ZAWXStEhstt6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRDBsT3hlc1AzM3lGd0JUMTFmNmNGS1NlNU9hWFd0cFhwWFhUblFpZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776989014),
('Ri6vQMZYRLkD92olOtBH1rDw98PEx024GEwpxBza', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVTlLc2pxejdvcFhJM2dXSHB6U1dpMkhNOXBYY3BpMHBzMFV5WmRRSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778802359),
('uTcgHZ4t1X0phhgdgqBHnfQt5G1WuW6009tVDoor', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTXBJVmV1Zm9MUXprUXpXZlFQRUFNdnNmUXhKeFJrTUlVRlozSzlYVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778752619),
('v53cMi3os7jQtM0Wax7CQWUXgFnqWP0mbLJZRK7W', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.119.0 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTllsVnlpbmQySGdGZ2FTQXY0ZGVXenpuTUZKakV1QnZ0ZkZ5Sm9XUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778606363),
('vH8Ed2ZO64MAZ9iC0X9PhdAu2u8xuRKEQwWuqmNo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNzBQM1U2aWhhUTJWVk5abXZXWHduV0tBT1JEaDBMSVZqQkxlY3lUaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777067929),
('xeU9lJc0NR153eSXOFT01RcBZjwgkij6LGtB1FHp', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSk5iQnMzZzhCYjFBOHoxdWhmWk9XeWROUm9wMWRLMktGbTRvRExoZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778635115),
('zKdhaKSKxm2DzfqGTL5OTiAOr2tIKoK8cqwxATbd', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN1dHWEhkSERPMlpwYjJSYnZDVUhkMlZNYVlPb1ozMEFlRlJKUWg0eiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1778606370);

-- --------------------------------------------------------

--
-- Structure de la table `urgent_requests`
--

CREATE TABLE `urgent_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `hospital_name` varchar(255) NOT NULL,
  `blood_group` varchar(255) NOT NULL,
  `urgency_level` varchar(255) NOT NULL,
  `contact_phone` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `urgent_requests`
--

INSERT INTO `urgent_requests` (`id`, `user_id`, `hospital_name`, `blood_group`, `urgency_level`, `contact_phone`, `city`, `status`, `created_at`, `updated_at`) VALUES
(1, 8, 'Clinique Yassmin', 'O+', 'high', '0607654345', 'El jadida', 'active', '2026-04-25 15:28:16', '2026-04-25 15:28:16');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'donor',
  `blood_group` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `cin` varchar(255) DEFAULT NULL,
  `last_donation_date` date DEFAULT NULL,
  `total_donations` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`, `blood_group`, `city`, `cin`, `last_donation_date`, `total_donations`) VALUES
(1, 'KM', 'kamilinadia2005@gmail.com', NULL, '$2y$12$IiRl.TNyvib/UiZFi0JR8ur/yboKrhxu7h78k1jSQIxJFsVRgXOtm', NULL, '2026-04-23 23:49:52', '2026-04-23 23:49:52', 'donor', NULL, NULL, NULL, NULL, 0),
(2, 'vb', 'jklomp@gmail.com', NULL, '$2y$12$nrpOXqfkpY1cBrl84vXwqe9JjSpCf/xtOzl4zzSvlgmZIDfHyeDWq', NULL, '2026-04-23 23:52:46', '2026-04-23 23:52:46', 'donor', NULL, NULL, NULL, NULL, 0),
(3, 'km', 'njklou@gmail.com', NULL, '$2y$12$UIBE75kIm8P3qdleDLTFc.VnlIaU2Au8TlcaMePqFvpD2LwsVmQWK', NULL, '2026-04-23 23:56:09', '2026-04-23 23:56:09', 'donor', 'A-', NULL, NULL, NULL, 0),
(4, 'kamilia', 'kamilia07@gmail.com', NULL, '$2y$12$5bczAyYhPwJ7HZBlA2Qkp.zTgAyoG1WtANxSxPvsKCRQvBWwqZ/Tq', NULL, '2026-04-24 00:05:06', '2026-04-24 00:05:06', 'donor', 'O-', NULL, NULL, NULL, 0),
(5, 'kamilia', 'kamilinadia06@gmail.com', NULL, '$2y$12$IliIiwRjU9QpakIBZEsYSuhNS731zkThw1863iyplkS7WVyYiHPEi', NULL, '2026-04-24 00:05:25', '2026-04-24 00:05:25', 'donor', 'O-', NULL, NULL, NULL, 0),
(6, 'kamilia', 'kamili.n205@gmail.com', NULL, '$2y$12$pg.iQJ4gXDVYouXx887ja.qRqbuUUM164ikxSEns3sy7y/t250Ihu', NULL, '2026-04-24 00:06:45', '2026-04-24 00:06:45', 'donor', 'O-', NULL, NULL, NULL, 0),
(7, 'VC', 'kamilinadia08@gmail.com', NULL, '$2y$12$n8ScK5RxBBejXF/v/3th5uWyg67klFW1MB4rGC53btceyyC3c3fv.', NULL, '2026-04-24 21:39:21', '2026-04-24 21:39:21', 'donor', 'A+', NULL, NULL, NULL, 0),
(8, 'ahmed', 'ahmedtest@gmail.com', NULL, '$2y$12$TObG232l8eXI37S3MvCm0eGwIC.bvik/7HGkB991C2bMwLNE8YToe', NULL, '2026-04-24 22:00:24', '2026-04-24 22:00:24', 'admin', 'A+', NULL, NULL, NULL, 0),
(9, 'nouhaila', 'nana@gmail.com', NULL, '$2y$12$ofp8Vxu0EKwh26Kk.Dk0e.HigN1fg7yeTm7KF3E195Yq6qdMS/Euy', NULL, '2026-04-24 22:01:26', '2026-04-24 22:01:26', 'donor', 'A-', NULL, NULL, NULL, 0),
(10, 'AYA qaremy', 'ayaqaremy24@gmail.com', NULL, '$2y$12$iqGtGafaNCNtuxqRjxAalOX6UB/nx7uWvd78ePQx5gfYlCVNtS1UK', NULL, '2026-04-27 07:56:27', '2026-05-14 23:48:42', 'donor', 'AB-', 'El jadida', 'm458799', '2026-05-15', 6),
(11, 'Admin BloodConnect', 'admin@bloodconnect.ma', NULL, '$2y$12$dQciNj6YXF2BDSL/Fy6rpej6UviQ3Mwm21aLc/1bFC731A3mqgOym', NULL, '2026-05-12 19:17:36', '2026-05-12 19:17:36', 'admin', 'O+', NULL, NULL, NULL, 0),
(12, 'Karim Donor', 'donor@bloodconnect.ma', NULL, '$2y$12$5hoB3/sK5eVzwxhi5P53DuWbkXu/DEU/cck9EFIJT/fqWUPh8Y5kO', NULL, '2026-05-12 19:17:36', '2026-05-12 19:17:36', 'donor', 'A+', NULL, NULL, NULL, 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `donations_user_id_foreign` (`user_id`);

--
-- Index pour la table `donation_centers`
--
ALTER TABLE `donation_centers`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `identity_verifications`
--
ALTER TABLE `identity_verifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `identity_verifications_user_id_foreign` (`user_id`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `urgent_requests`
--
ALTER TABLE `urgent_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `urgent_requests_user_id_foreign` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `donations`
--
ALTER TABLE `donations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `donation_centers`
--
ALTER TABLE `donation_centers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `identity_verifications`
--
ALTER TABLE `identity_verifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `urgent_requests`
--
ALTER TABLE `urgent_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `donations`
--
ALTER TABLE `donations`
  ADD CONSTRAINT `donations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `identity_verifications`
--
ALTER TABLE `identity_verifications`
  ADD CONSTRAINT `identity_verifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `urgent_requests`
--
ALTER TABLE `urgent_requests`
  ADD CONSTRAINT `urgent_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
