import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { UrgentRequests } from './components/UrgentRequests.jsx';
import { DonationCenters } from './components/DonationCenters.jsx';
import { Auth } from './components/Auth.jsx';
import { Profile } from './components/Profile.jsx';
import { Help } from './components/Help.jsx';
import { EligibilityQuiz } from './components/EligibilityQuiz.jsx';
import { UrgentRequestForm } from './components/UrgentRequestForm.jsx';
import { AdminDonations } from './components/AdminDonations.jsx';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.99_0_0)]">
        <Loader2 className="w-12 h-12 animate-spin text-rose-600" />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const getPageId = (path) => {
    if (path === '/') return 'dashboard';
    if (path === '/centers') return 'centers';
    if (path === '/requests') return 'requests';
    if (path === '/help') return 'help';
    if (path === '/profile') return 'profile';
    if (path === '/eligibility') return 'eligibility';
    if (path === '/new-request') return 'new-request';
    if (path === '/admin') return 'admin';
    return 'dashboard';
  };

  const handleNavigate = (id) => {
    if (id === 'logout') {
      logout();
      return;
    }
    if (id === 'dashboard') navigate('/');
    else if (id === 'requests') navigate('/requests');
    else navigate(`/${id}`);
  };

  return (
    <Layout
      onNavigate={handleNavigate}
      currentPage={getPageId(location.pathname)}
      userProfile={profile}
    >
      <Routes>
        <Route path="/" element={<Dashboard onNavigate={handleNavigate} />} />
        <Route path="/requests" element={<UrgentRequests />} />
        <Route path="/centers" element={<DonationCenters />} />
        <Route path="/eligibility" element={<EligibilityQuiz />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<Help />} />
        <Route path="/new-request" element={<UrgentRequestForm />} />
        <Route path="/admin" element={<AdminDonations />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster position="top-center" richColors />
      </Router>
    </AuthProvider>
  );
}