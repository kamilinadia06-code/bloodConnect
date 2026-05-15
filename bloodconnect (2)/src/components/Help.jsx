import React from 'react';
import { Badge } from './ui/badge';
import { Heart, ShieldCheck, Droplet, HelpCircle, MessageCircle } from 'lucide-react';

export function Help() {
  const sections = [
    {
      title: "L'Impact Vital",
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-50",
      content: "Chaque jour au Maroc, des centaines de vies dépendent de la générosité des donneurs. Le sang est irremplaçable et essentiel pour les urgences chirurgicales, les accouchements complexes et le traitement des maladies chroniques."
    },
    {
      title: "Parcours du Donneur",
      icon: Droplet,
      color: "text-blue-500",
      bg: "bg-blue-50",
      content: "Le processus dure environ 45 minutes : \n• Accueil & Inscription\n• Entretien Médical confidentiel\n• Prélèvement (10 min)\n• Collation & Repos (20 min)"
    },
    {
      title: "Préparation & Soins",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      content: "Pour un don optimal :\n• Ne venez pas à jeun, privilégiez un repas léger.\n• Hydratez-vous abondamment (eau, jus).\n• Évitez l'alcool avant le don.\n• Prévoyez une pièce d'identité valide."
    },
    {
      title: "Fréquence & Délais",
      icon: HelpCircle,
      color: "text-violet-500",
      bg: "bg-violet-50",
      content: "Un homme peut donner jusqu'à 6 fois par an, et une femme 4 fois. Un intervalle minimum de 8 semaines doit être respecté entre chaque don pour préserver votre santé."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <Badge className="bg-rose-600/10 text-rose-600 border-none rounded-full px-4 py-1 text-xs uppercase tracking-widest font-bold">
          Centre de Connaissance
        </Badge>
        <h2 className="text-5xl font-bold text-slate-900 tracking-tight leading-tight">Comprendre le Don de Sang</h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Tout ce qu'il faut savoir pour transformer votre générosité en un acte serein et efficace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <div key={i} className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm p-8 space-y-6 h-full flex flex-col group hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${section.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                  <Icon className={`w-7 h-7 ${section.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">{section.title}</h3>
              </div>
              <div className="text-slate-500 whitespace-pre-line leading-relaxed flex-1 font-medium">
                {section.content}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-10 h-10 text-rose-600" />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-bold leading-tight">Sécurité & Confidentialité</h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              Vos données sur <span className="text-white font-medium">BloodConnect</span> sont protégées. Elles ne sont utilisées que pour vous notifier en cas d'urgence correspondant à votre profil de donneur ou pour faciliter votre prise de rendez-vous.
            </p>
          </div>
        </div>
        
        <MessageCircle className="absolute -bottom-10 -left-10 w-48 h-48 text-white/5 rotate-12" />
      </div>

      <div className="text-center pt-8">
        <p className="text-slate-400 text-sm font-medium">
          Vous avez encore des questions ? Consultez le site officiel du <a href="#" className="text-rose-600 hover:underline font-bold">Centre National de Transfusion Sanguine</a>.
        </p>
      </div>
    </div>
  );
}
