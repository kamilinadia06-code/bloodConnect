import React from 'react';
import { motion } from 'motion/react';
import { Home, MapPin, User, Info, LogOut, Droplet, PlusCircle, History, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

// Helper for ClipboardCheck icon
const ClipboardCheck = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
);

export function Layout({ children, onNavigate, currentPage, userProfile }) {
  const navItems = [
    { name: 'Accueil', id: 'dashboard', icon: Home },
    { name: 'Centres', id: 'centers', icon: MapPin },
    { name: 'Éligibilité', id: 'eligibility', icon: ClipboardCheck },
    { name: 'Profil', id: 'profile', icon: User },
    { name: 'Aide', id: 'help', icon: Info },
  ];

  // Add Admin link only if role is admin
  if (userProfile?.role === 'admin') {
    navItems.push({ name: 'Validation', id: 'admin', icon: History });
  }

  return (
    <div className="flex flex-col min-h-screen bg-[oklch(0.99_0_0)]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <div onClick={() => onNavigate('dashboard')} className="flex items-center space-x-3 group cursor-pointer">
            <div className="p-2 bg-rose-600/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Droplet className="w-8 h-8 text-rose-600 fill-current" />
            </div>
            <span className="text-2xl font-bold text-gray-900 hidden sm:inline tracking-tight">BloodConnect</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              {userProfile?.role === 'admin' ? (
                <button 
                  onClick={() => onNavigate('new-request')}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-6 py-2 shadow-md shadow-rose-600/20 text-sm font-bold flex items-center transition-all hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Urgence
                </button>
              ) : (
                <button 
                  onClick={() => onNavigate('centers')}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-6 py-2 shadow-md shadow-rose-600/20 text-sm font-bold flex items-center transition-all hover:-translate-y-0.5"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler pour aide
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-100">
              <div className="hidden sm:flex flex-col text-right mr-2">
                <span className="text-sm font-semibold text-gray-900">{userProfile?.name || 'Utilisateur'}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  {userProfile?.role === 'admin' ? 'Administrateur' : 'Membre'}
                </span>
              </div>
              <div className="h-10 w-10 border-2 border-white shadow-sm rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold overflow-hidden">
                 {userProfile?.name ? userProfile.name.charAt(0) : 'U'}
              </div>
              <button 
                onClick={() => onNavigate('logout')}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8">
        {/* Sidebar Navigation (Desktop) */}
        <nav className="hidden sm:flex sticky top-20 h-[calc(100vh-5rem)] flex-col items-center py-12 space-y-10 w-32 -ml-8 pr-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 w-full group relative ${
                  isActive 
                    ? 'text-rose-600' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-rose-600/5 rounded-2xl -z-10"
                  />
                )}
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(225,29,72,0.2)]' : ''}`} />
                <span className={`text-[10px] mt-2 font-bold uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        <main className="flex-1 py-10">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="sm:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md rounded-3xl flex justify-around items-center h-16 px-4 z-50 shadow-lg border border-white/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                isActive ? 'text-rose-600 scale-110' : 'text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
