import React, { useState } from 'react';
import { MapPin, Phone, Clock, Search, Navigation } from 'lucide-react';

export function DonationCenters() {
  const [search, setSearch] = useState('');

  const centers = [
    { id: 1, name: 'Centre Régional de Transfusion', city: 'El Jadida', address: 'Près de l\'Hôpital Mohammed V', phone: '05 23 34 22 11', hours: '08:30 - 16:30' },
    { id: 2, name: 'Unité Mobile Place Hansali', city: 'El Jadida', address: 'Place Hansali (Centre Ville)', phone: 'Contact Direct sur Place', hours: '09:00 - 18:00' },
    { id: 3, name: 'Hôpital Provincial Lalla Hasnaa', city: 'El Jadida', address: 'Avenue Mohammed VI', phone: '05 23 35 44 22', hours: '24h/24 (Urgences)' },
  ];

  const filtered = centers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-4">
          <h2 className="text-4xl font-bold">Où donner ?</h2>
          <p className="text-slate-400">Trouvez le point de collecte le plus proche de chez vous à El Jadida.</p>
          <div className="relative group pt-4">
            <Search className="absolute left-4 top-1/2 mt-2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text"
              placeholder="Rechercher un centre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl pl-12 pr-4 focus:bg-white/20 transition-all outline-none"
            />
          </div>
        </div>
        <Navigation className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(center => (
          <div key={center.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{center.city}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{center.name}</h3>
            <div className="space-y-3 text-slate-500 text-sm">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" /> {center.address}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" /> {center.phone}</p>
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 shrink-0" /> {center.hours}</p>
            </div>
            <button className="w-full mt-8 py-3 bg-slate-50 rounded-xl font-bold text-slate-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
              Itinéraire
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
