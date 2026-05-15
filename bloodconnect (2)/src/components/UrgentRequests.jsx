import React, { useState, useEffect } from 'react';
import { Phone, Loader2, Heart, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth.jsx';
import { toast } from 'sonner';

export function UrgentRequests() {
  const { profile } = useAuth();
  const [activeRequests, setActiveRequests] = useState([]);
  const [fulfilledRequests, setFulfilledRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/urgent-requests');
      setActiveRequests(res.data.filter((r) => r.status === 'active'));
      setFulfilledRequests(res.data.filter((r) => r.status === 'fulfilled').slice(0, 4));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleFulfill = async (id) => {
    setProcessing(id);
    try {
      await api.put(`/urgent-requests/${id}`, { status: 'fulfilled' });
      toast.success('Demande marquée comme satisfaite !');
      fetchRequests();
    } catch {
      toast.error('Erreur lors de la mise à jour.');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <Loader2 className="w-10 h-10 animate-spin text-rose-600" />
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-extrabold text-slate-900">
          Appels <span className="text-rose-600">Urgents</span>
        </h2>
        <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full text-rose-600 font-bold text-xs border border-rose-100">
          <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
          EN DIRECT
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800">Demandes en attente</h3>
        {activeRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-100 p-16 text-center">
            <p className="text-gray-400 font-bold">Aucun appel urgent actif.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-3xl border border-rose-100 p-6 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">{req.city}</p>
                    <h3 className="font-bold text-slate-900">{req.hospital_name}</h3>
                  </div>
                  <div className="w-12 h-12 bg-rose-600 text-white rounded-xl flex items-center justify-center font-black">
                    {req.blood_group}
                  </div>
                </div>
                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
                  req.urgency_level === 'critical' ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500'
                }`}>
                  {req.urgency_level}
                </span>
                <div className="flex gap-2 mt-4">
                  <a href={`tel:${req.contact_phone}`}
                    className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-700 transition-all text-sm">
                    <Phone className="w-4 h-4" /> Répondre
                  </a>
                  {profile?.role === 'admin' && (
                    <button onClick={() => handleFulfill(req.id)} disabled={processing === req.id}
                      className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all">
                      {processing === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {fulfilledRequests.length > 0 && (
        <div className="space-y-4 opacity-70">
          <h3 className="text-xl font-bold text-slate-800">Mission Accomplie</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fulfilledRequests.map((req) => (
              <div key={req.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm">
                    {req.blood_group}
                  </div>
                  <Heart className="w-3 h-3 text-emerald-500 fill-current" />
                </div>
                <p className="font-bold text-slate-700 text-sm line-clamp-1">{req.hospital_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}