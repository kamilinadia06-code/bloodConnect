import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Check, X, Loader2, User as UserIcon, Calendar, MapPin, ShieldCheck, ShieldAlert, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

export function AdminDonations() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [pendingDonations, setPendingDonations] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [confirmReject, setConfirmReject] = useState(null);
  const [confirmRejectVerif, setConfirmRejectVerif] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeTab, setActiveTab] = useState('donations');

  useEffect(() => {
    if (!authLoading && profile && profile.role !== 'admin') {
      navigate('/');
    }
  }, [profile, authLoading, navigate]);

  const fetchAll = async () => {
    try {
      const [donRes, verifRes] = await Promise.all([
        api.get('/admin/donations'),
        api.get('/admin/identity-verifications'),
      ]);
      setPendingDonations(donRes.data.filter((d) => d.status === 'pending'));
      setPendingVerifications(verifRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ── Dons ──────────────────────────────────────────────────────────────────
  const handleVerify = async (donation) => {
    setProcessing(donation.id);
    try {
      await api.put(`/admin/donations/${donation.id}/confirm`);
      toast.success('Don vérifié et comptabilisé !');
      fetchAll();
    } catch {
      toast.error('Erreur lors de la vérification.');
    } finally {
      setProcessing(null);
    }
  };

  const executeReject = async () => {
    if (!confirmReject) return;
    setProcessing(confirmReject);
    try {
      await api.put(`/donations/${confirmReject}`, { status: 'rejected' });
      toast.info('Don refusé.');
      setConfirmReject(null);
      fetchAll();
    } catch {
      toast.error('Erreur lors du rejet.');
    } finally {
      setProcessing(null);
    }
  };

  // ── Vérifications ─────────────────────────────────────────────────────────
  const handleApproveVerif = async (id) => {
    setProcessing(id);
    try {
      await api.put(`/admin/identity-verifications/${id}/approve`);
      toast.success('Identité approuvée ! La carte est débloquée.');
      fetchAll();
    } catch {
      toast.error("Erreur lors de l'approbation.");
    } finally {
      setProcessing(null);
    }
  };

  const executeRejectVerif = async () => {
    if (!confirmRejectVerif) return;
    setProcessing(confirmRejectVerif);
    try {
      await api.put(`/admin/identity-verifications/${confirmRejectVerif}/reject`);
      toast.info('Vérification rejetée.');
      setConfirmRejectVerif(null);
      fetchAll();
    } catch {
      toast.error('Erreur lors du rejet.');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="space-y-4">
        <h2 className="text-5xl font-bold text-gray-900 tracking-tight">
          Validation <span className="text-rose-600 italic">Héroïque</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl leading-relaxed font-medium">
          Vérifiez les dons et les identités pour garantir la sécurité de notre communauté.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('donations')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'donations'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
              : 'bg-white border border-slate-100 text-slate-500 hover:border-rose-200 hover:text-rose-600'
          }`}
        >
          <Check className="w-4 h-4" />
          Dons
          {pendingDonations.length > 0 && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === 'donations' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
              {pendingDonations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('verifications')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'verifications'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
              : 'bg-white border border-slate-100 text-slate-500 hover:border-rose-200 hover:text-rose-600'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Identités
          {pendingVerifications.length > 0 && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === 'verifications' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
              {pendingVerifications.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Tab Dons ── */}
      {activeTab === 'donations' && (
        pendingDonations.length === 0 ? (
          <div className="bg-white rounded-[3rem] py-24 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-100 opacity-60">
            <div className="p-6 bg-green-50 rounded-full mb-6 text-green-500">
              <Check className="w-12 h-12" />
            </div>
            <p className="text-gray-900 font-bold text-2xl">Tout est à jour !</p>
            <p className="text-gray-400 mt-2 font-medium">Aucune déclaration de don en attente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {pendingDonations.map((donation) => (
              <div key={donation.id} className="bg-white rounded-[3rem] group overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5">
                <div className="p-8 flex-1 space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                        <UserIcon className="w-8 h-8 text-gray-300 group-hover:text-rose-600 transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                          {donation.user?.name || 'Donneur anonyme'}
                        </h3>
                        <p className="text-xs font-mono text-gray-400 font-bold">ID: {donation.user_id}</p>
                      </div>
                    </div>
                    <Badge className="rounded-full px-4 py-1 bg-orange-100 text-orange-600 border-none shadow-none uppercase tracking-widest text-[10px] font-bold">
                      En attente
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center text-rose-600 border border-white/20">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Date du don</p>
                        <p className="text-lg font-bold text-gray-900">{format(new Date(donation.date), 'dd MMMM yyyy', { locale: fr })}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center text-rose-600 border border-white/20">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Lieu déclaré</p>
                        <p className="text-lg font-bold text-gray-900">{donation.location}</p>
                      </div>
                    </div>
                  </div>
                  {donation.notes && (
                    <div className="bg-rose-50 p-5 rounded-2xl border-l-4 border-rose-600/20 italic text-gray-600 leading-relaxed font-medium">
                      "{donation.notes}"
                    </div>
                  )}
                </div>
                <div className="bg-gray-50/80 p-8 flex flex-row lg:flex-col justify-center gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 w-full lg:w-64">
                  <Button className="flex-1 lg:flex-none h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg font-bold text-lg" onClick={() => handleVerify(donation)} disabled={processing === donation.id}>
                    {processing === donation.id ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : <><Check className="w-6 h-6 mr-2" />Certifier</>}
                  </Button>
                  <Button variant="ghost" className="flex-1 lg:flex-none h-14 rounded-2xl text-red-400 hover:text-rose-600 hover:bg-rose-50 font-bold" onClick={() => setConfirmReject(donation.id)} disabled={processing === donation.id}>
                    <X className="w-5 h-5 mr-2" />Réfuter
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── Tab Identités ── */}
      {activeTab === 'verifications' && (
        pendingVerifications.length === 0 ? (
          <div className="bg-white rounded-[3rem] py-24 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-100 opacity-60">
            <div className="p-6 bg-green-50 rounded-full mb-6 text-green-500">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <p className="text-gray-900 font-bold text-2xl">Aucune demande !</p>
            <p className="text-gray-400 mt-2 font-medium">Toutes les identités ont été traitées.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {pendingVerifications.map((verif) => (
              <div key={verif.id} className="bg-white rounded-[3rem] group overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5">
                <div className="p-8 flex-1 space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                        <ShieldAlert className="w-8 h-8 text-gray-300 group-hover:text-rose-600 transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                          {verif.first_name} {verif.last_name}
                        </h3>
                        <p className="text-xs font-mono text-gray-400 font-bold">Compte : {verif.user?.name}</p>
                      </div>
                    </div>
                    <Badge className="rounded-full px-4 py-1 bg-orange-100 text-orange-600 border-none shadow-none uppercase tracking-widest text-[10px] font-bold">
                      En attente
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">N° CIN</p>
                      <p className="text-xl font-black font-mono text-gray-900 uppercase">{verif.cin}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Soumis le</p>
                      <p className="text-lg font-bold text-gray-900">{format(new Date(verif.created_at), 'dd MMM yyyy', { locale: fr })}</p>
                    </div>
                  </div>

                  {/* Photo carte nationale */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Photo Carte Nationale</p>
                    <div
                      className="relative h-48 rounded-2xl overflow-hidden border border-slate-100 cursor-pointer group/img"
                      onClick={() => setPreviewImage(
  verif.card_image?.endsWith('.pdf')
    ? 'pdf'
    : `http://localhost:8000/storage/${verif.card_image}`
)}
                    >
                      {verif.card_image?.endsWith('.pdf') ? (
  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-rose-50">
    <div className="w-16 h-16 bg-white rounded-2xl shadow flex items-center justify-center">
      <span className="text-rose-600 font-black text-xl">PDF</span>
    </div>
    <p className="text-sm font-bold text-slate-500">Document PDF</p>
    
     <a href={`http://localhost:8000/storage/${verif.card_image}`}
      target="_blank"
      rel="noreferrer"
      className="text-[10px] uppercase font-black tracking-widest text-rose-600 bg-rose-100 px-4 py-2 rounded-full hover:bg-rose-200 transition-all"
      onClick={(e) => e.stopPropagation()}
    >
      Ouvrir le PDF
    </a>
  </div>
) : (
  <img
    src={`http://localhost:8000/storage/${verif.card_image}`}
    alt="Carte nationale"
    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
  />
)}
                      <div className="absolute inset-0 bg-slate-900/0 group-hover/img:bg-slate-900/40 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover/img:opacity-100 transition-opacity bg-white rounded-2xl px-4 py-2 flex items-center gap-2 font-bold text-slate-900 text-sm shadow-xl">
                          <Eye className="w-4 h-4" /> Agrandir
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/80 p-8 flex flex-row lg:flex-col justify-center gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 w-full lg:w-64">
                  <Button className="flex-1 lg:flex-none h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg font-bold text-lg" onClick={() => handleApproveVerif(verif.id)} disabled={processing === verif.id}>
                    {processing === verif.id ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : <><ShieldCheck className="w-5 h-5 mr-2" />Approuver</>}
                  </Button>
                  <Button variant="ghost" className="flex-1 lg:flex-none h-14 rounded-2xl text-red-400 hover:text-rose-600 hover:bg-rose-50 font-bold" onClick={() => setConfirmRejectVerif(verif.id)} disabled={processing === verif.id}>
                    <X className="w-5 h-5 mr-2" />Rejeter
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Dialog agrandissement photo */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="rounded-[2.5rem] p-4 border-none shadow-2xl max-w-2xl">
         {previewImage === 'pdf' ? (
  <iframe src={previewImage} className="w-full h-[80vh] rounded-2xl" />
) : (
  <img src={previewImage} alt="Carte nationale" className="w-full rounded-2xl object-contain max-h-[80vh]" />
)}
        </DialogContent>
      </Dialog>

      {/* Dialog rejet don */}
      <Dialog open={!!confirmReject} onOpenChange={(open) => !open && setConfirmReject(null)}>
        <DialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl max-w-md">
          <DialogHeader className="space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-2">
              <X className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold">Réfuter ce don ?</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              Ce don passera en statut "Refusé" et ne sera pas comptabilisé.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button variant="ghost" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setConfirmReject(null)}>Annuler</Button>
            <Button className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold" onClick={executeReject} disabled={!!processing}>
              {processing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirmer le rejet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog rejet vérification */}
      <Dialog open={!!confirmRejectVerif} onOpenChange={(open) => !open && setConfirmRejectVerif(null)}>
        <DialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl max-w-md">
          <DialogHeader className="space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-2">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold">Rejeter cette vérification ?</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              Le donneur devra soumettre une nouvelle demande avec des documents corrects.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button variant="ghost" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setConfirmRejectVerif(null)}>Annuler</Button>
            <Button className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold" onClick={executeRejectVerif} disabled={!!processing}>
              {processing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirmer le rejet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}