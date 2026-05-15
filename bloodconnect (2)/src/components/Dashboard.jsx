import React, { useState, useEffect } from 'react';
import { Droplet, Calendar, Award, Activity, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function Dashboard({ onNavigate }) {
  const { profile } = useAuth();
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    api.get('/urgent-requests')
      .then((res) => setRecentRequests(res.data.slice(0, 3)))
      .catch(console.error);
  }, []);

  const donationImages = [
    "/image1.jpg",
    "/image2.jpg",
    "/image3.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % donationImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Bonjour, {profile?.name?.split(' ')[0] || 'Ami'} !
          </h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">Prêt à sauver des vies aujourd'hui ?</p>
        </div>
        {profile?.role === 'admin' && (
          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center space-x-3 bg-white border border-black/5 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-2 bg-rose-50 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-700 group-hover:text-rose-600 transition-colors">Panel Admin</span>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-rose-600 transition-colors" />
          </button>
        )}
      </div>

      {/* Hero image */}
      <div className="relative rounded-[3rem] overflow-hidden h-72 shadow-2xl">
        {donationImages.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Don de sang"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <p className="text-2xl font-bold">Chaque don compte.</p>
          <p className="text-white/70">1 don peut sauver jusqu'à 3 vies.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] border border-black/5 p-8 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-rose-50 rounded-2xl text-rose-600">
            <Droplet className="w-7 h-7" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{profile?.total_donations || 0}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Dons effectués</p>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] border border-black/5 p-8 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-orange-50 rounded-2xl text-orange-600">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{(profile?.total_donations || 0) * 2}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Vies sauvées</p>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] border border-black/5 p-8 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {profile?.last_donation_date
                ? format(new Date(profile.last_donation_date), 'dd MMM yyyy', { locale: fr })
                : 'Aucun'}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Dernier don</p>
          </div>
        </div>
      </div>

      {/* Recent urgent requests */}
      {recentRequests.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Appels urgents récents</h2>
            <button
              onClick={() => onNavigate('requests')}
              className="text-rose-600 font-bold text-sm hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-[2rem] border border-rose-100 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-12 h-12 bg-rose-600 text-white rounded-xl flex items-center justify-center font-black text-lg">
                    {req.blood_group}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    req.urgency_level === 'critical' ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {req.urgency_level}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 line-clamp-1">{req.hospital_name}</h3>
                <p className="text-sm text-gray-400 font-medium mt-1">{req.city}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}