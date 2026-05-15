import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, ChevronLeft, AlertCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    id: 1,
    text: "Avez-vous entre 18 et 70 ans ?",
    info: "L'âge légal pour donner son sang est compris entre 18 et 70 ans révolus."
  },
  {
    id: 2,
    text: "Pesez-vous au moins 50 kg ?",
    info: "Pour la sécurité du donneur, un poids minimum de 50 kg est requis."
  },
  {
    id: 3,
    text: "Avez-vous mangé et êtes-vous bien hydraté(e) ?",
    info: "Il est important de ne pas être à jeun avant un don de sang."
  },
  {
    id: 4,
    text: "Tatouage ou piercing récent (4 mois) ?",
    info: "Un délai de 4 mois est nécessaire après un tatouage ou un piercing.",
    negative: true
  },
  {
    id: 5,
    text: "Intervention chirurgicale (4 mois) ?",
    info: "Certaines interventions nécessitent un délai de repos.",
    negative: true
  },
  {
    id: 6,
    text: "Sous traitement antibiotique ?",
    info: "Il faut attendre la fin du traitement pour donner son sang.",
    negative: true
  }
];

export function EligibilityQuiz() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [questions[currentStep].id]: answer });
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const isEligible = () => {
    return questions.every(q => {
      const answer = answers[q.id];
      return q.negative ? !answer : answer;
    });
  };

  if (showResult) {
    const eligible = isEligible();
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in duration-500 text-center">
        <div className={`bg-white rounded-[3rem] p-12 shadow-xl border-t-8 ${eligible ? 'border-green-500' : 'border-rose-600'}`}>
          <div className="flex justify-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${eligible ? 'bg-green-50 text-green-500' : 'bg-rose-50 text-rose-600'}`}>
              {eligible ? (
                <CheckCircle2 className="w-12 h-12" />
              ) : (
                <XCircle className="w-12 h-12" />
              )}
            </div>
          </div>
          
          <div className="space-y-4 mb-10">
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
              {eligible ? "Vous semblez éligible !" : "Disponibilité Différée"}
            </h2>
            <p className="text-xl text-slate-500 leading-relaxed max-w-xl mx-auto font-medium">
              {eligible 
                ? "D'après vos réponses, vous remplissez les conditions essentielles pour offrir votre aide aujourd'hui."
                : "Certaines de vos réponses suggèrent qu'un délai de repos ou une contre-indication temporaire s'applique."}
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl mx-auto mb-10 max-w-xl flex items-start gap-4 text-left border border-slate-100">
            <AlertCircle className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-500 leading-relaxed italic">
              <strong>Note importante :</strong> Ce test est purement informatif. Seul l'entretien médical complet réalisé par un médecin sur le lieu de collecte confirmera votre éligibilité définitive.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {eligible && (
              <Button 
                onClick={() => navigate('/centers')}
                className="h-16 px-8 rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-200 text-lg font-bold"
              >
                Trouver un centre de collecte
              </Button>
            )}
            <Button 
              variant="outline" 
              className="h-16 px-8 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 text-lg font-bold"
              onClick={reset}
            >
              Recommencer le test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-4 text-center">
        <Badge className="bg-rose-600/10 text-rose-600 border-none rounded-full px-4 py-1 text-xs uppercase tracking-widest font-bold">
          Auto-Évaluation
        </Badge>
        <h2 className="text-5xl font-bold text-gray-900 tracking-tight">Suis-je éligible ?</h2>
        <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed font-medium">
          Répondez à ces quelques questions pour savoir si vous pouvez donner votre sang aujourd'hui.
        </p>
      </div>

      <div className="relative pt-2">
        <div className="flex justify-between items-end mb-4 px-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400">
            <Sparkles className="w-3 h-3 text-rose-600" />
            Vérification en cours
          </div>
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-black/5 space-y-10">
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-slate-900 leading-snug">
            {question.text}
          </h3>
          <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 text-amber-700 text-sm leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            {question.info}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Button 
            variant="ghost" 
            className="h-24 rounded-[2rem] bg-slate-50 hover:bg-green-50 hover:text-green-700 transition-all text-2xl font-bold border-2 border-transparent hover:border-green-100 shadow-none hover:shadow-none"
            onClick={() => handleAnswer(true)}
          >
            Oui
          </Button>
          <Button 
            variant="ghost" 
            className="h-24 rounded-[2rem] bg-slate-50 hover:bg-rose-50 hover:text-rose-600 transition-all text-2xl font-bold border-2 border-transparent hover:border-rose-100 shadow-none hover:shadow-none"
            onClick={() => handleAnswer(false)}
          >
            Non
          </Button>
        </div>

        <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="text-slate-400 hover:text-slate-600 font-bold"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Précédent
          </Button>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300">
            Question {currentStep + 1} / {questions.length}
          </span>
        </div>
      </div>
    </div>
  );
}
