import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  Check,
  X,
  Leaf,
  RefreshCw,
  Wallet,
  ArrowDownToLine,
  Coins,
} from 'lucide-react';
import { QUIZ_QUESTIONS, WASTE_CATEGORIES } from '../data/initialData';
import { Student } from '../types';
import confetti from 'canvas-confetti';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface HomeEducationTabProps {
  currentStudent: Student;
  studentsList: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenWithdrawal: () => void;
  onGoToIoTBin: () => void;
  onAddPoints: (pts: number) => void;
}

export const HomeEducationTab: React.FC<HomeEducationTabProps> = ({
  currentStudent,
  studentsList,
  onSelectStudent,
  onOpenWithdrawal,
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

  const currentRank = studentsList && currentStudent
    ? [...studentsList].sort((a, b) => b.points - a.points).findIndex((s) => s.id === currentStudent.id) + 1
    : 1;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
    <div className="w-full space-y-4 pb-24 pt-1 md:px-4">
      {/* SECTION 0: Student Fintech Wallet Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md p-4 sm:p-5">
        {/* Subtle background ambient glows */}
        <div className="pointer-events-none absolute -right-6 -top-6 w-36 h-36 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-400/15 blur-lg" />

        {/* Top Bar: Profile & Switcher */}
        <div className="relative flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/25 shadow-inner">
                {currentStudent?.avatar || '👨‍🎓'}
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-full text-[9px] font-black shadow-xs border border-white/80">
                Lv.{currentStudent?.level ?? 1}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-white truncate tracking-tight">
                  {currentStudent?.name || 'Siswa'}
                </h2>
                <span className="text-xs font-bold text-emerald-200/80 shrink-0">
                  #{currentRank}
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 font-medium truncate">
                {currentStudent?.className || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Saldo Hero Display */}
        <div className="relative mt-4">
          <div className="flex items-center gap-1.5 text-emerald-100/80 text-[11px] font-bold uppercase tracking-wider">
            <Wallet size={13} className="opacity-90" />
            <span>Saldo Tabungan</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
            {formatCurrency(currentStudent?.balanceRp ?? 0)}
          </div>
        </div>

        {/* Bottom Bar: Points Badge & Tarik Button */}
        <div className="relative mt-4 pt-3 border-t border-white/15 flex items-center justify-between gap-2">
          {/* Points Pill */}
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <Coins size={14} className="text-amber-300" />
            <span className="text-xs font-bold text-white">
              {currentStudent?.points ?? 0} <span className="text-emerald-200 text-[11px] font-semibold">poin</span>
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={onOpenWithdrawal}
            className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-900 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <ArrowDownToLine size={13} className="text-emerald-700" />
            <span>Tarik Saldo</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Tantangan Harian (Primary Focus) */}
      <section>
        <div className="flex items-center gap-2 mb-2 px-1">
          <CheckCircle2 size={18} className="text-primary" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Tantangan Harian</h2>
        </div>
        
        <div className="space-y-2">
          {[
            { id: 'quest1', pts: 10, title: 'Bawa Tempat Minum Sendiri', icon: '💧', bg: 'bg-blue-50', border: 'border-blue-100' },
            { id: 'quest2', pts: 15, title: 'Setor Sampah ke IoT Tong', icon: '♻️', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { id: 'quest3', pts: 10, title: 'Habiskan Makanan Tanpa Sisa', icon: '🍱', bg: 'bg-amber-50', border: 'border-amber-100' },
          ].map((q) => {
            const isDone = completedQuests[q.id];
            return (
              <Card 
                key={q.id} 
                className={`cursor-pointer transition-all active:scale-[0.99] border ${isDone ? 'bg-muted/40 opacity-70 border-border/50' : 'bg-card border-border'}`}
                onClick={() => toggleQuest(q.id, q.pts)}
              >
                <CardContent className="p-2.5 px-3 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${isDone ? 'bg-background' : q.bg} border ${q.border} shrink-0`}>
                    {q.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xs md:text-sm font-bold truncate ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {q.title}
                    </h3>
                    <p className="text-[11px] text-primary font-bold">+{q.pts} Poin</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors shrink-0 ${
                    isDone ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 bg-background text-transparent'
                  }`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Kuis Seru */}
      <section>
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-amber-500" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Kuis Seru</h2>
          </div>
          <button onClick={nextQuiz} className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground bg-muted px-2.5 py-1 rounded-full">
            <RefreshCw size={12} /> Ganti
          </button>
        </div>

        <Card className="bg-card">
          <CardContent className="p-3.5 space-y-3">
            <div className="bg-muted/50 p-3 rounded-xl">
              <p className="text-xs md:text-sm font-bold leading-relaxed text-foreground text-center">
                {currentQuiz.question}
              </p>
            </div>

            <div className="space-y-2">
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
                    className="w-full justify-between h-auto py-2 px-3 text-left items-center group rounded-xl"
                    disabled={hasAnswered}
                    onClick={() => handleAnswerQuiz(idx)}
                  >
                    <span className="text-xs md:text-sm whitespace-normal font-bold flex-1">{opt.text}</span>
                    {hasAnswered && opt.isCorrect && <Check className="ml-2 shrink-0" size={16} />}
                    {hasAnswered && selectedOption === idx && !opt.isCorrect && <X className="ml-2 shrink-0" size={16} />}
                  </Button>
                );
              })}
            </div>

            {hasAnswered && (
              <div className="bg-primary/10 text-primary-active p-3 rounded-xl animate-in fade-in zoom-in-95 mt-2">
                <div className="font-bold flex items-center gap-1.5 text-xs mb-1">
                  {currentQuiz.options[selectedOption ?? 0].isCorrect ? '✅ Benar!' : '💡 Penjelasan:'}
                </div>
                <p className="text-xs font-medium leading-relaxed">{currentQuiz.explanation}</p>
                <Button className="w-full mt-3 h-8 text-xs rounded-lg" size="sm" onClick={nextQuiz}>Soal Berikutnya</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* SECTION 3: Panduan Warna Tong */}
      <section>
        <div className="flex items-center gap-2 mb-2 px-1">
          <Leaf size={18} className="text-emerald-500" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Panduan Tong Sampah</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { cat: 'organik', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            { cat: 'plastik', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
            { cat: 'kertas', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
            { cat: 'logam_b3', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
          ].map((item) => {
            const data = WASTE_CATEGORIES[item.cat as keyof typeof WASTE_CATEGORIES];
            return (
              <Card key={item.cat} className={`${item.bg} border border-border/40 shadow-none`}>
                <CardContent className="p-2.5 flex flex-col items-center text-center gap-1">
                  <span className="text-2xl drop-shadow-sm">{data.icon}</span>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 ${item.text} border ${item.border}`}>
                    Tong {data.colorName}
                  </div>
                  <h3 className="font-bold text-xs text-foreground mt-0.5">{data.name}</h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};
