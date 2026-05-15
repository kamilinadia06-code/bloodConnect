import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Droplet, Calendar, MapPin, Award, History as HistoryIcon, Settings, Loader2, Plus, Trash2, Megaphone, CheckCircle, CreditCard, ShieldCheck, ShieldAlert, Clock, Upload, User } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

export function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingDonation, setIsAddingDonation] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [donations, setDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [verification, setVerification] = useState(null);

  const [formData, setFormData] = useState({ name: '', blood_group: '', city: '', cin: '' });
  const [donationForm, setDonationForm] = useState({ date: format(new Date(), 'yyyy-MM-dd'), location: '', notes: '' });
  const [verifyForm, setVerifyForm] = useState({ first_name: '', last_name: '', cin: '', card_image: null });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({ name: profile.name || '', blood_group: profile.blood_group || '', city: profile.city || '', cin: profile.cin || '' });
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    api.get('/donations').then((res) => setDonations(res.data)).catch(console.error);
    api.get('/urgent-requests').then((res) => {
      setMyRequests(res.data.filter((r) => r.user_id === user.id));
    }).catch(console.error);
    api.get('/identity-verification/me').then((res) => {
      setVerification(res.data);
    }).catch(() => setVerification(null));
  }, [user]);

  if (!profile) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-rose-600" />
      </div>
    );
  }

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      await api.put('/profile', formData);
      await refreshProfile();
      toast.success('Profil mis à jour avec succès !');
      setIsEditing(false);
    } catch {
      toast.error('Erreur lors de la mise à jour du profil.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddDonation = async () => {
    setUpdating(true);
    try {
      await api.post('/donations', donationForm);
      toast.success('Don enregistré ! Il sera comptabilisé après validation.');
      setIsAddingDonation(false);
      setDonationForm({ date: format(new Date(), 'yyyy-MM-dd'), location: '', notes: '' });
      const res = await api.get('/donations');
      setDonations(res.data);
    } catch {
      toast.error("Erreur lors de l'enregistrement du don.");
    } finally {
      setUpdating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVerifyForm({ ...verifyForm, card_image: file });
    if (file.type === 'application/pdf') {
      setImagePreview('pdf');
    } else {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitVerification = async () => {
    if (!verifyForm.first_name || !verifyForm.last_name || !verifyForm.cin || !verifyForm.card_image) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    setUpdating(true);
    try {
      const data = new FormData();
      data.append('first_name', verifyForm.first_name);
      data.append('last_name', verifyForm.last_name);
      data.append('cin', verifyForm.cin);
      data.append('card_image', verifyForm.card_image);
      await api.post('/identity-verification', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Demande envoyée ! En attente de validation admin.');
      setIsVerifying(false);
      const res = await api.get('/identity-verification/me');
      setVerification(res.data);
    } catch {
      toast.error("Erreur lors de l'envoi de la demande.");
    } finally {
      setUpdating(false);
    }
  };

  const executeDeletion = async () => {
    if (!itemToDelete) return;
    setUpdating(true);
    try {
      if (itemToDelete.type === 'donation') {
        await api.delete(`/donations/${itemToDelete.id}`);
        setDonations((prev) => prev.filter((d) => d.id !== itemToDelete.id));
      } else {
        await api.delete(`/urgent-requests/${itemToDelete.id}`);
        setMyRequests((prev) => prev.filter((r) => r.id !== itemToDelete.id));
      }
      toast.success(itemToDelete.type === 'donation' ? 'Don supprimé.' : 'Appel supprimé.');
      setItemToDelete(null);
    } catch {
      toast.error('Erreur lors de la suppression.');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleRequestStatus = async (requestId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'fulfilled' : 'active';
    try {
      await api.put(`/urgent-requests/${requestId}`, { status: newStatus });
      setMyRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status: newStatus } : r));
      toast.success(newStatus === 'fulfilled' ? 'Demande marquée comme satisfaite !' : 'Demande réactivée.');
    } catch {
      toast.error('Erreur lors de la mise à jour.');
    }
  };

  const confirmedDonations = donations.filter((d) => d.status === 'confirmed').length;
  const isVerified = verification && verification.status === 'approved';
  const hasPendingVerification = verification && verification.status === 'pending';
  const hasRejectedVerification = verification && verification.status === 'rejected';

  const stats = [
    { label: 'Dons vérifiés', value: profile.total_donations || 0, icon: Droplet, color: 'text-rose-600 bg-rose-50' },
    { label: 'Vies sauvées', value: (profile.total_donations || 0) * 2, icon: Award, color: 'text-orange-600 bg-orange-50' },
    {
      label: 'Dernier don',
      value: profile.last_donation_date ? format(new Date(profile.last_donation_date), 'dd MMM yyyy', { locale: fr }) : 'Aucun',
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  // ─── Donor Card Section ───────────────────────────────────────────────────
  const renderDonorCard = () => {
    // Pas assez de dons
    if (confirmedDonations < 2) {
      return (
        <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100/50 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-slate-200 rounded-[2rem] flex items-center justify-center text-slate-400">
            <CreditCard className="w-12 h-12" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <h4 className="text-xl font-bold text-slate-900">Carte de Donneur "Pass Héros"</h4>
            <p className="text-slate-500 font-medium text-sm max-w-lg">
              Effectuez encore{' '}
              <span className="text-rose-600 font-bold">
                {2 - confirmedDonations} don{2 - confirmedDonations > 1 ? 's' : ''} validé{2 - confirmedDonations > 1 ? 's' : ''}
              </span>{' '}
              pour débloquer votre carte digitale.
            </p>
            <div className="w-full max-w-sm">
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${(confirmedDonations / 2) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2 dons validés — carte débloquée et identité vérifiée
    if (isVerified) {
      return (
        <div className="animate-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-rose-600" />
              Votre Carte de Donneur
            </h3>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold">
              ✓ Identité vérifiée
            </Badge>
          </div>
          <div className="relative group max-w-xl mx-auto sm:mx-0">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white min-h-[220px] relative overflow-hidden shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(225,29,72,0.3)] border border-white/10">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(225,29,72,0.5),transparent)] pointer-events-none" />
              <Droplet className="absolute -right-12 -bottom-12 w-48 h-48 text-rose-600/20 rotate-12" />
              <div className="h-full flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-black italic tracking-tighter text-rose-600 uppercase">Héros de Sang</h4>
                    <p className="text-[8px] uppercase tracking-[.4em] font-bold text-slate-500">Carte Officielle de Donneur</p>
                  </div>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-0.5">
                    <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest leading-none">Détenteur</p>
                    <p className="text-2xl font-bold tracking-tight">{profile.name}</p>
                  </div>
                  <div className="flex justify-between items-end border-t border-white/5 pt-4">
                    <div className="space-y-4">
                      <div className="flex gap-6">
                        <div className="space-y-0.5">
                          <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest leading-none">Groupe</p>
                          <p className="text-xl font-black text-rose-600">{profile.blood_group}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest leading-none">CIN</p>
                          <p className="text-xl font-bold font-mono">{profile.cin || '---'}</p>
                        </div>
                      </div>
                      <div className="text-[8px] uppercase font-black text-emerald-500 tracking-[.5em] bg-emerald-500/10 w-fit px-3 py-1 rounded-full">
                        Niveau Or
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-2xl shadow-xl border border-rose-100 rotate-3 group-hover:rotate-0 transition-transform">
                      <QRCodeCanvas value={`HERO-CARD:${user?.id}:${profile.cin}`} size={64} level="H" includeMargin={false} fgColor="#0f172a" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2 dons validés — demande en attente
    if (hasPendingVerification) {
      return (
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-rose-600" />
              Votre Carte de Donneur
            </h3>
            <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-none rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold">
              En cours de vérification
            </Badge>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-orange-100 rounded-[2rem] flex items-center justify-center text-orange-500 shrink-0">
              <Clock className="w-12 h-12" />
            </div>
            <div className="text-center md:text-left space-y-2">
              <h4 className="text-xl font-bold text-slate-900">Vérification en cours...</h4>
              <p className="text-slate-500 font-medium text-sm max-w-lg">
                Votre demande a été soumise. L'équipe BloodConnect vérifie votre identité. Vous serez notifié dès l'approbation.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // 2 dons validés — demande rejetée ou pas encore soumise
    return (
      <div className="animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <CreditCard className="w-6 h-6 mr-3 text-rose-600" />
            Votre Carte de Donneur
          </h3>
          <Badge className="bg-rose-100 text-rose-600 hover:bg-rose-100 border-none rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold">
            Vérification requise
          </Badge>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <Droplet className="absolute -right-10 -bottom-10 w-48 h-48 text-rose-600/10 rotate-12 pointer-events-none" />
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-rose-500 shrink-0">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-3 relative z-10">
            <h4 className="text-xl font-bold text-white">
              {hasRejectedVerification ? 'Vérification refusée — Réessayez' : 'Félicitations ! Votre carte est prête'}
            </h4>
            <p className="text-slate-400 font-medium text-sm max-w-lg">
              {hasRejectedVerification
                ? 'Votre demande précédente a été refusée. Vérifiez vos informations et soumettez à nouveau.'
                : 'Vous avez atteint 2 dons validés. Vérifiez votre identité pour débloquer votre carte officielle de donneur.'}
            </p>
          </div>

          {/* Bouton qui ouvre le dialog */}
          <Dialog open={isVerifying} onOpenChange={setIsVerifying}>
            <DialogTrigger asChild>
              <button className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-rose-600/30 transition-all hover:-translate-y-0.5 flex items-center gap-3 relative z-10">
                <ShieldCheck className="w-5 h-5" />
                Vérifier mon identité
              </button>
            </DialogTrigger>

            <DialogContent className="rounded-[2.5rem] p-6 border-none shadow-2xl max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-3">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-2">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <DialogTitle className="text-3xl font-bold">Vérification d'identité</DialogTitle>
                <DialogDescription className="text-gray-500 font-medium">
                  Ces informations seront affichées sur votre carte officielle de donneur.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Prénom</Label>
                    <Input
                      placeholder="Ex: Youssef"
                      className="h-14 rounded-2xl bg-slate-50 border-none px-5 font-bold shadow-none"
                      value={verifyForm.first_name}
                      onChange={(e) => setVerifyForm({ ...verifyForm, first_name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Nom</Label>
                    <Input
                      placeholder="Ex: El Amrani"
                      className="h-14 rounded-2xl bg-slate-50 border-none px-5 font-bold shadow-none"
                      value={verifyForm.last_name}
                      onChange={(e) => setVerifyForm({ ...verifyForm, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Numéro CIN</Label>
                  <Input
                    placeholder="Ex: AB123456"
                    className="h-14 rounded-2xl bg-slate-50 border-none px-5 font-bold shadow-none uppercase"
                    value={verifyForm.cin}
                    onChange={(e) => setVerifyForm({ ...verifyForm, cin: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Photo de la carte nationale</Label>
                  <label className="cursor-pointer group">
                    <div className={`h-36 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${imagePreview ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50 hover:border-rose-300 hover:bg-rose-50/30'}`}>
                {imagePreview ? (
  imagePreview === 'pdf' ? (
    <div className="flex flex-col items-center justify-center gap-3 h-full">
      <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center">
        <span className="text-rose-600 font-black text-lg">PDF</span>
      </div>
      <p className="text-sm font-bold text-slate-600">Fichier PDF sélectionné</p>
    </div>
  ) : (
    <img src={imagePreview} alt="Aperçu" className="h-full w-full object-cover rounded-2xl" />
  )
) : (
  <>
    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-rose-500">
      <Upload className="w-6 h-6" />
    </div>
    <p className="text-sm font-bold text-slate-400">Cliquez pour uploader</p>
    <p className="text-[10px] text-slate-300 font-medium">JPG, PNG, PDF — max 5MB</p>
  </>
)}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} /><input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white h-14 rounded-2xl text-lg shadow-xl shadow-rose-600/20 font-bold"
                  onClick={handleSubmitVerification}
                  disabled={updating}
                >
                  {updating ? <Loader2 className="mr-2 h-5 w-5 animate-spin mx-auto" /> : 'Soumettre ma demande'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Profile header */}
      <div className="bg-white rounded-[3rem] overflow-hidden border border-black/5 shadow-xl">
        <div className="h-48 bg-gradient-to-br from-rose-600 via-rose-500 to-orange-400 relative overflow-hidden">
          <Droplet className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12" />
        </div>
        <div className="relative pt-0 px-8 pb-10">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:space-x-8 mb-10">
            <Avatar className="h-32 w-32 border-8 border-white shadow-2xl">
              <AvatarFallback className="bg-rose-100 text-rose-600 text-4xl font-bold">
                {profile.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left mt-6 md:mt-0 flex-1 space-y-1">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h2 className="text-4xl font-bold text-gray-900">{profile.name}</h2>
                {isVerified && (
                  <div className="flex items-center gap-1 bg-emerald-100 text-emerald-600 rounded-full px-3 py-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Vérifié</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-400">
                <MapPin className="w-4 h-4 text-rose-600/40" />
                <span className="text-sm font-bold uppercase tracking-widest">{profile.city || 'Maroc'}</span>
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-sm px-8 py-4 rounded-3xl flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold tracking-[.3em] text-rose-600/60 mb-1">Groupe</span>
                <span className="text-4xl font-black text-rose-600">{profile.blood_group}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-gray-50/50 rounded-[2rem] border border-gray-100 p-6 flex flex-col items-center text-center">
                  <div className={`p-3 rounded-2xl ${stat.color} mb-4 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Donor Card */}
      {renderDonorCard()}

      {/* Donations + Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <HistoryIcon className="w-6 h-6 mr-3 text-rose-600" />
              Historique des dons
            </h3>
            <Dialog open={isAddingDonation} onOpenChange={setIsAddingDonation}>
              <DialogTrigger asChild>
                <div className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full px-6 py-2 cursor-pointer font-bold transition-all shadow-lg shadow-rose-600/20">
                  <Plus className="w-4 h-4" />
                  Nouveau don
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-3xl font-bold">Enregistrer un don</DialogTitle>
                  <DialogDescription className="text-gray-500 text-lg font-medium">
                    Chaque don est un acte héroïque. Merci de partager votre force.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-8">
                  <div className="grid gap-3">
                    <Label className="text-xs uppercase tracking-widest font-bold text-gray-400">Date du don</Label>
                    <Input type="date" className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-rose-600/20 px-4" value={donationForm.date} onChange={(e) => setDonationForm({ ...donationForm, date: e.target.value })} />
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-xs uppercase tracking-widest font-bold text-gray-400">Lieu (Hôpital ou Centre)</Label>
                    <Input placeholder="Ex: Hôpital Mohammed V" className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-rose-600/20 px-4" value={donationForm.location} onChange={(e) => setDonationForm({ ...donationForm, location: e.target.value })} />
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-xs uppercase tracking-widest font-bold text-gray-400">Notes (optionnel)</Label>
                    <Input placeholder="Ex: Don lors d'une campagne..." className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-rose-600/20 px-4" value={donationForm.notes} onChange={(e) => setDonationForm({ ...donationForm, notes: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white h-14 rounded-2xl text-lg shadow-xl shadow-rose-600/20 font-bold" onClick={handleAddDonation} disabled={updating || !donationForm.location}>
                    {updating ? <Loader2 className="mr-2 h-5 w-5 animate-spin mx-auto" /> : "Confirmer l'enregistrement"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {donations.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 py-20 text-center flex flex-col items-center justify-center opacity-60">
              <HistoryIcon className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-400 font-bold text-lg">Votre voyage commence ici.</p>
              <p className="text-sm text-gray-400 mt-2 font-medium">Enregistrez votre premier don pour voir votre impact.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div key={donation.id} className="bg-white rounded-[2rem] border border-black/5 p-6 flex items-center justify-between group hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 bg-rose-600/5 rounded-2xl flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 text-rose-600">
                      <Droplet className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <p className="font-bold text-xl text-gray-900">{donation.location}</p>
                        <Badge className={`rounded-full px-3 py-0 scale-75 border-none shadow-none ${donation.status === 'confirmed' ? 'bg-green-100 text-green-700' : donation.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          {donation.status === 'confirmed' ? 'Accepté' : donation.status === 'rejected' ? 'Refusé' : 'En attente'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                        {format(new Date(donation.date), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-rose-600/5 hover:text-rose-600 transition-colors" onClick={() => setItemToDelete({ id: donation.id, type: 'donation', title: 'Supprimer ce don ?', message: 'Cette action est irréversible.' })}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Megaphone className="w-6 h-6 mr-3 text-rose-600" />
            Mes Appels Urgents
          </h3>
          {myRequests.length === 0 ? (
            <div className="bg-slate-50 rounded-[2rem] p-10 text-center">
              <p className="text-slate-400 text-sm italic font-medium">Vous n'avez lancé aucun appel pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => (
                <div key={req.id} className={`rounded-[2rem] p-6 transition-all ${req.status === 'fulfilled' ? 'bg-emerald-50 opacity-60' : 'bg-white border border-black/5'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${req.status === 'fulfilled' ? 'bg-emerald-400' : 'bg-rose-600'}`}>{req.blood_group}</div>
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{req.hospital_name}</p>
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">{req.status === 'active' ? 'En cours' : 'Satisfait'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className={`flex-1 rounded-xl text-[10px] font-bold uppercase transition-all shadow-none ${req.status === 'active' ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`} onClick={() => handleToggleRequestStatus(req.id, req.status)}>
                      <CheckCircle className="w-3 h-3 mr-2" />
                      {req.status === 'active' ? 'Marquer Satisfait' : 'Réactiver'}
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-xl p-2 h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-600/5 shadow-none" onClick={() => setItemToDelete({ id: req.id, type: 'request', title: 'Supprimer cet appel ?', message: 'Voulez-vous vraiment supprimer cet appel urgent ?' })}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 className="text-2xl font-bold text-gray-900 flex items-center pt-4">
            <Settings className="w-6 h-6 mr-3 text-gray-400" />
            Paramètres
          </h3>
          <div className="bg-white rounded-[2rem] border border-black/5 p-8 space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-[.3em] text-gray-300">Compte</p>
              <p className="text-lg font-bold text-gray-900">{profile.email}</p>
            </div>
            {profile.role === 'admin' && (
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-[.3em] text-gray-300">Rôle</p>
                <Badge variant="outline" className="rounded-full border-gray-100 bg-rose-50 px-4 py-1 flex w-fit items-center lowercase font-bold text-rose-600">
                  <span className="w-2 h-2 bg-rose-600 rounded-full mr-2 animate-pulse" />
                  {profile.role}
                </Badge>
              </div>
            )}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <div className="w-full h-14 rounded-2xl border border-slate-100 hover:border-rose-600/30 hover:bg-rose-600/5 hover:text-rose-600 transition-all font-bold flex items-center justify-center cursor-pointer">
                  Mettre à jour le profil
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl">
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-3xl font-bold">Édition du Profil</DialogTitle>
                </DialogHeader>
                <div className="grid gap-8 py-10">
                  <div className="grid gap-3">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Nom complet</Label>
                    <Input className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold shadow-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Groupe Sanguin</Label>
                    <select className="w-full h-14 rounded-2xl bg-slate-50 border-none px-6 outline-none font-bold" value={formData.blood_group} onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}>
                      <option value="">Choisir</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Ville</Label>
                    <Input placeholder="Ex: Casablanca" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold shadow-none" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">N° CIN</Label>
                    <Input placeholder="Ex: AB123456" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold shadow-none uppercase" value={formData.cin} onChange={(e) => setFormData({ ...formData, cin: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white h-14 rounded-2xl text-lg shadow-xl shadow-rose-600/20 font-bold" onClick={handleUpdateProfile} disabled={updating}>
                    {updating ? <Loader2 className="mr-2 h-5 w-5 animate-spin mx-auto" /> : 'Sauvegarder les changements'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Delete dialog */}
      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl max-w-md">
          <DialogHeader className="space-y-4">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-2">
              <Trash2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold">{itemToDelete?.title}</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">{itemToDelete?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button variant="ghost" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setItemToDelete(null)}>Annuler</Button>
            <Button className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-600/10" onClick={executeDeletion} disabled={updating}>
              {updating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}