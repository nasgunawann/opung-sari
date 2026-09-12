import React, { useState } from 'react';
import {
  HelpCircle,
  Check,
  X,
  RefreshCw,
  Wallet,
  ArrowDownToLine,
  Coins,
  PlayCircle,
  BookOpen,
  Film,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { EDUCATION_MODULES, QUIZ_QUESTIONS } from '../data/initialData';
import { EducationModule, SchoolClass, Student } from '../types';
import confetti from 'canvas-confetti';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface HomeEducationTabProps {
  currentStudent: Student;
  currentClass?: SchoolClass;
  studentsList: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenWithdrawal: () => void;
  onGoToIoTBin: () => void;
  onAddPoints: (pts: number) => void;
}

export const HomeEducationTab: React.FC<HomeEducationTabProps> = ({
  currentStudent,
  currentClass,
  studentsList,
  onOpenWithdrawal,
  onAddPoints,
}) => {
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Education Modules state (FR-EDU-01)
  const [moduleFilter, setModuleFilter] = useState<'all' | 'video' | 'article'>('all');
  const [selectedModule, setSelectedModule] = useState<EducationModule | null>(null);
  const [readModules, setReadModules] = useState<Record<string, boolean>>({});

  const currentQuiz = QUIZ_QUESTIONS[currentQuizIdx];

  const currentRank =
    studentsList && currentStudent
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

  const handleCompleteModule = (mod: EducationModule) => {
    if (!readModules[mod.id]) {
      setReadModules((prev) => ({ ...prev, [mod.id]: true }));
      onAddPoints(10);
      confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
    }
    setSelectedModule(null);
  };

  const filteredModules = EDUCATION_MODULES.filter((m) => {
    if (moduleFilter === 'all') return true;
    return m.type === moduleFilter;
  });

  return (
    <div className="w-full min-w-0 max-w-4xl mx-auto space-y-4 pb-24 pt-1 md:px-2">
      {/* SECTION 0: Student Fintech Wallet Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md p-4 sm:p-5">
        {/* Subtle background ambient glows */}
        <div className="pointer-events-none absolute -right-6 -top-6 w-36 h-36 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-400/15 blur-lg" />

        {/* Top Bar: Profile & Class */}
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
                {currentStudent?.className || '-'} • Wali Kelas: {currentClass?.waliKelas || 'Guru Pembina'}
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Saldo Hero Display (Kas Kelas Bersama) */}
        <div className="relative mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-100/90 text-[11px] font-bold uppercase tracking-wider">
              <Wallet size={13} className="opacity-90" />
              <span>Saldo Kas {currentClass?.name?.split(' - ')[0] || currentStudent?.className}</span>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            {formatCurrency(currentClass?.balanceRp ?? currentStudent?.balanceRp ?? 0)}
          </div>
          <p className="text-[11px] text-emerald-100/75 mt-0.5">
            Dikelola bersama oleh Wali Kelas untuk kebutuhan kelas.
          </p>
        </div>

        {/* Bottom Bar: Personal Contribution & Tarik Button */}
        <div className="relative mt-4 pt-3 border-t border-white/15 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Personal Points & Contribution Badges */}
          <div className="flex items-center gap-1.5">
            <div className="inline-flex items-center gap-1 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <Coins size={13} className="text-amber-300" />
              <span className="text-xs font-bold text-white">
                {currentStudent?.points ?? 0} <span className="text-emerald-200 text-[10px] font-semibold">poin</span>
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onOpenWithdrawal}
            className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-900 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            <ArrowDownToLine size={13} className="text-emerald-700" />
            <span>Pencairan Kas</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Video & Edukasi 3R (FR-EDU-01) */}
      <section className="w-full min-w-0 space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <PlayCircle size={18} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground tracking-wide">
              Edukasi
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-muted/70 p-0.5 rounded-xl border border-border text-[11px]">
            <button
              onClick={() => setModuleFilter('all')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                moduleFilter === 'all'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setModuleFilter('video')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                moduleFilter === 'video'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Video
            </button>
            <button
              onClick={() => setModuleFilter('article')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                moduleFilter === 'article'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Panduan
            </button>
          </div>
        </div>

        {/* Horizontal Snap Carousel */}
        <div className="w-full min-w-0 max-w-full flex items-stretch gap-3 overflow-x-auto snap-x scrollbar-none pb-1.5 px-0.5">
          {filteredModules.map((item) => {
            const isVideo = item.type === 'video';
            const isCompleted = readModules[item.id];

            return (
              <div
                key={item.id}
                onClick={() => setSelectedModule(item)}
                className="w-[230px] sm:w-[260px] shrink-0 snap-start rounded-2xl border border-border bg-card overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-xs transition-all flex flex-col group active:scale-[0.99]"
              >
                {/* Thumbnail Header */}
                <div className="relative h-28 w-full overflow-hidden bg-muted">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Type Badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-foreground border border-white/50 backdrop-blur-xs flex items-center gap-1">
                    {isVideo ? <Film size={10} className="text-rose-600" /> : <BookOpen size={10} className="text-blue-600" />}
                    <span>{isVideo ? 'Video' : 'Panduan'}</span>
                  </span>

                  {/* Time / Duration Badge */}
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/75 text-white backdrop-blur-xs flex items-center gap-1">
                    {isVideo ? <PlayCircle size={10} /> : <Clock size={10} />}
                    <span>{item.durationOrReadTime}</span>
                  </span>

                  {/* Video Play Overlay */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-white/85 text-primary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <PlayCircle size={22} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-primary inline-flex items-center gap-0.5 group-hover:underline">
                      {isVideo ? 'Tonton Video' : 'Baca Panduan'} →
                    </span>
                    {isCompleted ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                        ✓ Selesai
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full">
                        +10 poin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Kuis Seru */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-amber-500" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
              Kuis Seru
            </h2>
          </div>
          <button
            onClick={nextQuiz}
            className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-3 py-1 rounded-full cursor-pointer transition-colors"
          >
            <RefreshCw size={12} /> Ganti Soal
          </button>
        </div>

        <Card className="bg-card border-border shadow-xs">
          <CardContent className="p-4 sm:p-5 space-y-4">
            {/* Question Header Box */}
            <div className="bg-muted/40 p-4 sm:p-5 rounded-2xl border border-border/70 space-y-2 text-center">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Reward +{currentQuiz.points} Poin
              </span>
              <p className="text-sm sm:text-base font-extrabold leading-relaxed text-foreground max-w-xl mx-auto">
                {currentQuiz.question}
              </p>
            </div>

            {/* ABCD Options Grid (2x2 on sm+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuiz.options.map((opt, idx) => {
                const letter = ['A', 'B', 'C', 'D'][idx];
                let btnVariant: 'outline' | 'default' | 'destructive' = 'outline';
                if (hasAnswered) {
                  if (opt.isCorrect) btnVariant = 'default';
                  else if (selectedOption === idx) btnVariant = 'destructive';
                }

                const isSelectedCorrect = hasAnswered && opt.isCorrect;
                const isSelectedWrong = hasAnswered && selectedOption === idx && !opt.isCorrect;

                return (
                  <Button
                    key={idx}
                    variant={btnVariant}
                    className="w-full justify-start h-auto py-3.5 px-4 text-left items-center group rounded-2xl gap-3 cursor-pointer transition-all active:scale-[0.99]"
                    disabled={hasAnswered}
                    onClick={() => handleAnswerQuiz(idx)}
                  >
                    {/* ABCD Badge */}
                    <span
                      className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-colors ${
                        isSelectedCorrect || isSelectedWrong
                          ? 'bg-white/20 text-white'
                          : 'bg-muted border border-border text-foreground group-hover:bg-primary/15 group-hover:text-primary group-hover:border-primary/30'
                      }`}
                    >
                      {letter}
                    </span>

                    {/* Option Text */}
                    <span className="text-xs sm:text-sm whitespace-normal font-bold flex-1 leading-relaxed">
                      {opt.text}
                    </span>

                    {/* Feedback Icon */}
                    {hasAnswered && opt.isCorrect && (
                      <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center shrink-0">
                        <Check className="text-white stroke-[3]" size={14} />
                      </div>
                    )}
                    {hasAnswered && selectedOption === idx && !opt.isCorrect && (
                      <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center shrink-0">
                        <X className="text-white stroke-[3]" size={14} />
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Answer Explanation Box */}
            {hasAnswered && (
              <div className="bg-primary/10 text-primary-active p-4 rounded-2xl border border-primary/20 animate-in fade-in zoom-in-95 space-y-2 mt-2">
                <div className="font-extrabold flex items-center gap-1.5 text-xs sm:text-sm">
                  {currentQuiz.options[selectedOption ?? 0]?.isCorrect
                    ? '✅ Hebat, Jawaban Kamu Benar!'
                    : '💡 Yuk Pelajari Penjelasannya:'}
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
                  {currentQuiz.explanation}
                </p>
                <Button
                  className="w-full mt-3 h-10 text-xs font-bold rounded-xl cursor-pointer"
                  size="sm"
                  onClick={nextQuiz}
                >
                  Lanjut Soal Berikutnya →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Interactive Modal: Video Player & Article Reader */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-card rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl p-4 sm:p-5 space-y-4 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {selectedModule.categoryLabel}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {selectedModule.durationOrReadTime}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-foreground mt-1 leading-snug">
                  {selectedModule.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 transition-colors shrink-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Media Area */}
            <div className="relative rounded-2xl overflow-hidden bg-black/90 aspect-video flex items-center justify-center border border-border">
              <img
                src={selectedModule.thumbnail}
                alt={selectedModule.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-center justify-center text-center p-3 text-white">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg mb-1.5">
                  {selectedModule.type === 'video' ? <PlayCircle size={28} /> : <BookOpen size={24} />}
                </div>
                <span className="text-xs font-extrabold">
                  {selectedModule.type === 'video' ? 'Video Simulasi Edukasi' : 'Materi Edukasi 3R'}
                </span>
                <span className="text-[10px] text-white/80 mt-0.5">
                  Sumber: {selectedModule.author || 'Adiwiyata Sekolah'}
                </span>
              </div>
            </div>

            {/* Summary & Points List */}
            <div className="space-y-2.5">
              <p className="text-xs text-foreground font-medium leading-relaxed bg-muted/40 p-3 rounded-xl border border-border/60">
                {selectedModule.summary}
              </p>

              {selectedModule.content && selectedModule.content.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-bold text-foreground">
                    Poin Kunci Pembelajaran:
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedModule.content.map((point, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Action CTA */}
            <div className="pt-2">
              <Button
                onClick={() => handleCompleteModule(selectedModule)}
                size="sm"
                className="w-full font-bold text-xs gap-1.5 cursor-pointer"
              >
                <Sparkles className="size-4" />
                <span>
                  {readModules[selectedModule.id]
                    ? 'Tutup Modul'
                    : 'Tandai Selesai & Klaim +10 Poin'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
