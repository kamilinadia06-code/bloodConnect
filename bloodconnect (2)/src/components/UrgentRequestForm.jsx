import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth.jsx';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function UrgentRequestForm() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [hospitalName, setHospitalName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && profile && profile.role !== 'admin') {
      toast.error('Seuls les administrateurs peuvent diffuser des demandes.');
      navigate('/');
    }
  }, [profile, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/urgent-requests', {
        hospital_name: hospitalName,
        blood_group: bloodGroup,
        urgency_level: urgencyLevel,
        contact_phone: contactPhone,
        city: city,
      });
      toast.success('Demande publiée avec succès !');
      navigate('/requests');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la publication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-gray-900">Nouvelle Demande Urgente</h2>
        <p className="text-gray-500">Remplissez les informations pour alerter les donneurs.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-black/5">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Établissement de Santé</label>
            <input
              placeholder="Ex: Hôpital Mohammed V"
              className="w-full h-14 rounded-2xl bg-slate-50 border-transparent px-6 text-lg font-bold outline-none focus:ring-2 focus:ring-rose-200"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Ville</label>
            <input
              placeholder="Ex: Casablanca"
              className="w-full h-14 rounded-2xl bg-slate-50 border-transparent px-6 text-lg font-bold outline-none focus:ring-2 focus:ring-rose-200"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Groupe Sanguin</label>
              <select
                className="w-full h-14 rounded-2xl bg-slate-50 px-4 text-lg font-bold outline-none focus:ring-2 focus:ring-rose-200"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
              >
                <option value="">Choisir...</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Urgence</label>
              <select
                className="w-full h-14 rounded-2xl bg-slate-50 px-4 text-lg font-bold outline-none focus:ring-2 focus:ring-rose-200"
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(e.target.value)}
                required
              >
                <option value="">Niveau...</option>
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
                <option value="critical">Critique</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Téléphone</label>
            <input
              type="tel"
              placeholder="Ex: 06 00 00 00 00"
              className="w-full h-14 rounded-2xl bg-slate-50 border-transparent px-6 text-lg font-bold outline-none focus:ring-2 focus:ring-rose-200"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate('/')}
              className="flex-1 h-14 rounded-2xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all">
              Annuler
            </button>
            <button type="submit" disabled={loading}
              className="flex-[2] h-14 rounded-2xl bg-rose-600 text-white text-lg font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20">
              {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Diffuser l'Alerte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}