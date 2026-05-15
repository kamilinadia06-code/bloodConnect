import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { RefreshCw, Droplet } from 'lucide-react';

export function Auth() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Connexion réussie !');
      } else {
        if (!bloodGroup) {
          toast.error('Veuillez sélectionner votre groupe sanguin.');
          setLoading(false);
          return;
        }
        await register(name, email, password, bloodGroup);
        toast.success('Compte créé avec succès !');
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      if (status === 401 || status === 422) {
        toast.error(message || 'Email ou mot de passe incorrect.');
      } else if (status === 409) {
        toast.error('Cet email est déjà utilisé.');
      } else {
        toast.error(message || 'Une erreur est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[oklch(0.99_0_0)] relative overflow-hidden px-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-400/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden">
        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-600/20">
                <Droplet className="w-6 h-6 text-white fill-current" />
              </div>
              <span className="font-bold text-2xl tracking-tight">BloodConnect</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl font-bold leading-[1.1]">
                Sauver des vies, <br /> <span className="text-rose-600 italic">une goutte</span> à la fois.
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Rejoignez la plus grande communauté de donneurs de sang au Maroc. Simple, rapide et impactant.
              </p>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-white/10 pt-12">
            <div>
              <p className="text-3xl font-bold text-white">12k+</p>
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Donneurs Activés</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">450+</p>
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Vies Sauvées</p>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="p-10 lg:p-20 flex flex-col justify-center bg-white">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-slate-900">
                {isLogin ? 'Bon retour' : 'Bienvenue'}
              </h2>
              <p className="text-slate-500">
                {isLogin ? 'Heureux de vous revoir parmi nous.' : "Commencez votre voyage de donneur aujourd'hui."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Nom Complet</Label>
                    <Input
                      placeholder="Jean Dupont"
                      className="h-14 rounded-xl bg-slate-50 border-transparent focus:border-rose-600/20 focus:bg-white transition-all shadow-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Groupe Sanguin</Label>
                    <select
                      className="w-full h-14 rounded-xl bg-slate-50 border-transparent px-4 focus:border-rose-600/20 focus:bg-white transition-all outline-none"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      required
                    >
                      <option value="">Choisir...</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Email</Label>
                <Input
                  type="email"
                  placeholder="nom@exemple.com"
                  className="h-14 rounded-xl bg-slate-50 border-transparent focus:border-rose-600/20 focus:bg-white transition-all shadow-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Mot de passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-14 rounded-xl bg-slate-50 border-transparent focus:border-rose-600/20 focus:bg-white transition-all shadow-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-lg font-bold shadow-xl shadow-rose-600/20 transition-all"
                disabled={loading}
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : (isLogin ? 'Se connecter' : 'Créer un compte')}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-sm font-bold text-slate-400 hover:text-rose-600 transition-colors"
            >
              {isLogin ? "Nouveau ici ? S'inscrire gratuitement" : 'Déjà membre ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}