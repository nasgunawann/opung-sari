import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, Check, X, Leaf, RefreshCw } from 'lucide-react';
import { QUIZ_QUESTIONS, WASTE_CATEGORIES } from '../data/initialData';
import confetti from 'canvas-confetti';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface HomeEducationTabProps {
  onGoToIoTBin: () => void;
  onAddPoints: (pts: number) => void;
  userPoints: number;
}

export const HomeEducationTab: React.FC<HomeEducationTabProps> = ({
  onAddPoints,
}) => {
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({
    quest1: true,
    quest2: false,
    quest3: false,
  });

  const currentQuiz = QUIZ_QUESTIONS[currentQuizIdx];

  const handleAnswerQuiz = (optIndex: number) => {
    if (hasAnswered) return;
    setSelectedOption(optIndex);
    setHasAnswered(true);

    const isCorrect = currentQuiz.options[optIndex].isCorrect;
    if (isCorrect) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      onAddPoints(currentQuiz.points);
    }
  };

  const nextQuiz = () => {
    setSelectedOption(null);
    setHasAnswered(false);
    setCurrentQuizIdx((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  const toggleQuest = (id: string, pts: number) => {
    setCompletedQuests((prev) => {
      const next = !prev[id];
      if (next) {
        onAddPoints(pts);
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 } });
      }
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="w-full space-y-6 pb-24 pt-2 md:px-4">
      {/* SECTION 1: Tantangan Harian (Primary Focus) */}
      <section>
        <div className="flex items-center gap-2 mb-3 px-1">
          <CheckCircle2 size={24} className="text-primary" />
          <h2 className="text-lg font-bold text-foreground">Tantangan Harian</h2>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 'quest1', pts: 10, title: 'Bawa Tempat Minum Sendiri', icon: '💧', bg: 'bg-blue-50', border: 'border-blue-100' },
            { id: 'quest2', pts: 15, title: 'Setor Sampah ke IoT Tong', icon: '♻️', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { id: 'quest3', pts: 10, title: 'Habiskan Makanan Tanpa Sisa', icon: '🍱', bg: 'bg-amber-50', border: 'border-amber-100' },
          ].map((q) => {
            const isDone = completedQuests[q.id];
            return (
              <Card 
                key={q.id} 
                className={`cursor-pointer transition-all active:scale-[0.98] ${isDone ? 'bg-muted opacity-60' : 'bg-card'}`}
                onClick={() => toggleQuest(q.id, q.pts)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isDone ? 'bg-background' : q.bg} border ${q.border}`}>
                    {q.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {q.title}
                    </h3>
                    <p className="text-sm text-primary font-bold mt-1">+{q.pts} Poin</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isDone ? 'bg-primary border-primary text-primary-foreground' : 'border-muted bg-background text-transparent'
                  }`}>
                    <Check size={18} strokeWidth={3} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Kuis Seru */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <HelpCircle size={24} className="text-amber-500" />
            <h2 className="text-lg font-bold text-foreground">Kuis Seru</h2>
          </div>
          <button onClick={nextQuiz} className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground bg-muted px-3 py-1.5 rounded-full">
            <RefreshCw size={14} /> Ganti
          </button>
        </div>

        <Card className="bg-card">
          <CardContent className="p-5 space-y-4">
            <div className="bg-muted/50 p-4 rounded-2xl">
              <p className="text-base font-bold leading-relaxed text-foreground text-center">
                {currentQuiz.question}
              </p>
            </div>

            <div className="space-y-3">
              {currentQuiz.options.map((opt, idx) => {
                let btnVariant: 'outline' | 'default' | 'destructive' = 'outline';
                if (hasAnswered) {
                  if (opt.isCorrect) btnVariant = 'default';
                  else if (selectedOption === idx) btnVariant = 'destructive';
                }

                return (
                  <Button
                    key={idx}
                    variant={btnVariant}
                    className="w-full justify-between h-auto py-4 px-5 text-left items-center group"
                    disabled={hasAnswered}
                    onClick={() => handleAnswerQuiz(idx)}
                  >
                    <span className="text-base whitespace-normal font-bold flex-1">{opt.text}</span>
                    {hasAnswered && opt.isCorrect && <Check className="ml-3 shrink-0" size={20} />}
                    {hasAnswered && selectedOption === idx && !opt.isCorrect && <X className="ml-3 shrink-0" size={20} />}
                  </Button>
                );
              })}
            </div>

            {hasAnswered && (
              <div className="bg-primary/10 text-primary-active p-4 rounded-2xl animate-in fade-in zoom-in-95 mt-4">
                <div className="font-bold flex items-center gap-2 mb-1">
                  {currentQuiz.options[selectedOption ?? 0].isCorrect ? '✅ Benar!' : '💡 Penjelasan:'}
                </div>
                <p className="text-sm font-medium leading-relaxed">{currentQuiz.explanation}</p>
                <Button className="w-full mt-4" size="sm" onClick={nextQuiz}>Soal Berikutnya</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* SECTION 3: Panduan Warna Tong */}
      <section>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Leaf size={24} className="text-emerald-500" />
          <h2 className="text-lg font-bold text-foreground">Panduan Tong Sampah</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { cat: 'organik', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            { cat: 'plastik', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
            { cat: 'kertas', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
            { cat: 'logam_b3', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
          ].map((item) => {
            const data = WASTE_CATEGORIES[item.cat as keyof typeof WASTE_CATEGORIES];
            return (
              <Card key={item.cat} className={`${item.bg} border-0 shadow-none`}>
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <span className="text-4xl drop-shadow-sm">{data.icon}</span>
                  <div className={`text-xs font-bold px-2 py-1 rounded-full bg-white/60 ${item.text} border ${item.border}`}>
                    Tong {data.colorName}
                  </div>
                  <h3 className="font-bold text-sm text-foreground mt-1">{data.name}</h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};