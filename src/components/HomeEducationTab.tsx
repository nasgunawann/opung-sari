import React, { useState, useMemo } from 'react';
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
  CheckCircle2,
  Info,
  ChevronRight,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { EDUCATION_MODULES, QUIZ_QUESTIONS } from '../data/initialData';
import { EducationModule, SchoolClass, Student } from '../types';
import confetti from 'canvas-confetti';
import { StudentAvatar } from '../lib/appIcons';
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

  const currentRank = useMemo(
    () =>
      studentsList && currentStudent
        ? [...studentsList].sort((a, b) => b.points - a.points).findIndex((s) => s.id === currentStudent.id) + 1
        : 1,
    [studentsList, currentStudent],
  );

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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-active text-primary-foreground shadow-md p-4 sm:p-5">
        {/* Top Bar: Profile & Class */}
        <div className="relative flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary-foreground/20 flex items-center justify-center text-2xl border border-primary-foreground/25 shadow-inner">
                <StudentAvatar name={currentStudent?.name ?? 'Siswa'} size={22} />
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-secondary text-secondary-foreground rounded-full text-[9px] font-black shadow-xs border border-primary-foreground/80">
                Lv.{currentStudent?.level ?? 1}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-primary-foreground truncate tracking-tight">
                  {currentStudent?.name || 'Siswa'}
                </h2>
                <span className="text-xs font-bold text-primary-foreground/80 shrink-0">
                  #{currentRank}
                </span>
              </div>
              <p className="text-xs text-primary-foreground/80 font-medium truncate">
                {currentStudent?.className || '-'} • Wali Kelas: {currentClass?.waliKelas || 'Guru Pembina'}
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Saldo Hero Display (Kas Kelas Bersama) */}
        <div className="relative mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary-foreground/90 text-[11px] font-bold tracking-wider">
              <Wallet size={13} className="opacity-90" aria-hidden="true" />
              <span>Saldo Kas {currentClass?.name?.split(' - ')[0] || currentStudent?.className}</span>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-primary-foreground mt-1">
            {formatCurrency(currentClass?.balanceRp ?? currentStudent?.balanceRp ?? 0)}
          </div>
          <p className="text-[11px] text-primary-foreground/75 mt-0.5">
            Dikelola bersama oleh Wali Kelas untuk kebutuhan kelas.
          </p>
        </div>

        {/* Bottom Bar: Personal Contribution & Tarik Button */}
        <div className="relative mt-4 pt-3 border-t border-primary-foreground/15 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Personal Points & Contribution Badges */}
          <div className="flex items-center gap-1.5">
            <div className="inline-flex items-center gap-1 bg-overlay/20 px-2.5 py-1 rounded-full border border-primary-foreground/10">
              <Coins size={13} className="text-primary-foreground" aria-hidden="true" />
              <span className="text-xs font-bold text-primary-foreground">
                {currentStudent?.points ?? 0} <span className="text-primary-foreground/80 text-[10px] font-semibold">poin</span>
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onOpenWithdrawal}
            className="flex items-center gap-1.5 h-10 bg-card hover:bg-secondary active:scale-95 text-primary font-extrabold text-xs px-3.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowDownToLine size={13} className="text-primary" aria-hidden="true" />
            <span>Pencairan Kas</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Video & Edukasi 3R (FR-EDU-01) */}
      <section className="w-full min-w-0 space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <PlayCircle size={18} className="text-primary" aria-hidden="true" />
            <h2 className="text-sm font-bold text-foreground tracking-wide">
              Edukasi
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-muted/70 p-0.5 rounded-xl border border-border text-[11px]">
            <button
              type="button"
              onClick={() => setModuleFilter('all')}
              className={`h-10 px-3 rounded-lg font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                moduleFilter === 'all'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setModuleFilter('video')}
              className={`h-10 px-3 rounded-lg font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                moduleFilter === 'video'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Video
            </button>
            <button
              type="button"
              onClick={() => setModuleFilter('article')}
              className={`h-10 px-3 rounded-lg font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring ${
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
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedModule(item)}
                className="w-[230px] sm:w-[260px] shrink-0 snap-start rounded-2xl border border-border bg-card overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-xs transition-all flex flex-col group active:scale-[0.99] text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {/* Thumbnail Header */}
                <div className="relative h-28 w-full overflow-hidden bg-muted">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    width={640}
                    height={360}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-overlay/60 via-transparent to-overlay/20" />

                  {/* Type Badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-card/90 text-foreground border border-border flex items-center gap-1">
                    {isVideo ? <Film size={10} className="text-destructive" aria-hidden="true" /> : <BookOpen size={10} className="text-primary" aria-hidden="true" />}
                    <span>{isVideo ? 'Video' : 'Panduan'}</span>
                  </span>

                  {/* Time / Duration Badge */}
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-overlay/75 text-primary-foreground flex items-center gap-1">
                    {isVideo ? <PlayCircle size={10} aria-hidden="true" /> : <Clock size={10} aria-hidden="true" />}
                    <span>{item.durationOrReadTime}</span>
                  </span>

                  {/* Video Play Overlay */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-primary-foreground/85 text-primary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <PlayCircle size={22} aria-hidden="true" />
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
                      {isVideo ? 'Tonton Video' : 'Baca Panduan'}
                    </span>
                    {isCompleted ? (
                      <span className="text-[10px] font-bold text-primary bg-secondary border border-border px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5">
                        <Check size={10} strokeWidth={3} aria-hidden="true" /> Selesai
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-primary bg-secondary border border-border px-1.5 py-0.2 rounded-full">
                        +10 poin
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Kuis Seru */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-primary" aria-hidden="true" />
            <h2 className="text-sm font-bold text-foreground tracking-wide">
              Kuis Seru
            </h2>
          </div>
          <button
            type="button"
            onClick={nextQuiz}
            className="flex items-center gap-1 h-10 text-xs font-bold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-3 rounded-full cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RefreshCw size={12} aria-hidden="true" /> Ganti Soal
          </button>
        </div>

        <Card className="bg-card border-border shadow-xs">
          <CardContent className="p-4 sm:p-5 space-y-4">
            {/* Question Header Box */}
            <div className="bg-muted/40 p-4 sm:p-5 rounded-2xl border border-border/70 space-y-2 text-center">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wider text-primary bg-secondary border border-border px-2.5 py-0.5 rounded-full">
                Hadiah +{currentQuiz.points} Poin
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
                          ? 'bg-primary-foreground/20 text-primary-foreground'
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
                      <div className="w-6 h-6 rounded-full bg-primary-foreground/25 flex items-center justify-center shrink-0">
                        <Check className="text-primary-foreground stroke-[3]" size={14} aria-hidden="true" />
                      </div>
                    )}
                    {hasAnswered && selectedOption === idx && !opt.isCorrect && (
                      <div className="w-6 h-6 rounded-full bg-primary-foreground/25 flex items-center justify-center shrink-0">
                        <X className="text-primary-foreground stroke-[3]" size={14} aria-hidden="true" />
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
                  {currentQuiz.options[selectedOption ?? 0]?.isCorrect ? (
                    <>
                      <CheckCircle2 size={15} strokeWidth={2.5} aria-hidden="true" />
                      <span>Hebat, Jawaban Kamu Benar!</span>
                    </>
                  ) : (
                    <>
                      <Info size={15} strokeWidth={2.5} aria-hidden="true" />
                      <span>Yuk Pelajari Penjelasannya:</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
                  {currentQuiz.explanation}
                </p>
                <Button
                  className="w-full mt-3 h-10 text-xs font-bold rounded-xl cursor-pointer"
                  size="sm"
                  onClick={nextQuiz}
                >
                  Lanjut Soal Berikutnya
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Interactive Modal: Video Player & Article Reader */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 bg-overlay/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
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
                type="button"
                onClick={() => setSelectedModule(null)}
                aria-label="Tutup"
                className="size-10 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 transition-colors shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Media Area */}
            <div className="relative rounded-2xl overflow-hidden bg-overlay/90 aspect-video flex items-center justify-center border border-border">
              <img
                src={selectedModule.thumbnail}
                alt={selectedModule.title}
                width={640}
                height={360}
                loading="lazy"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-overlay/70 via-overlay/20 to-transparent flex flex-col items-center justify-center text-center p-3 text-primary-foreground">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg mb-1.5">
                  {selectedModule.type === 'video' ? <PlayCircle size={28} aria-hidden="true" /> : <BookOpen size={24} aria-hidden="true" />}
                </div>
                <span className="text-xs font-extrabold">
                  {selectedModule.type === 'video' ? 'Video Simulasi Edukasi' : 'Materi Edukasi 3R'}
                </span>
                <span className="text-[10px] text-primary-foreground/80 mt-0.5">
                  Sumber: {selectedModule.author || 'Adiwiyata Sekolah'}
                </span>
              </div>
            </div>

            {/* Summary & Points List */}
            <div className="space-y-2.5">
              <p className="text-xs text-foreground font-medium leading-relaxed bg-muted/40 p-3 rounded-xl border border-border/60">
                {selectedModule.summary}
              </p>

              {/* Eco-Theology / Quranic Foundation Card */}
              {selectedModule.quranVerse && (
                <div className="p-3.5 rounded-2xl bg-secondary border border-border space-y-2">
                  <div className="flex items-center justify-between gap-1.5 border-b border-border pb-1.5">
                    <span className="text-[11px] font-black text-foreground flex items-center gap-1.5">
                      <BookOpen size={13} aria-hidden="true" /> Dalil & Ekoteologi
                    </span>
                    <span className="text-[10px] font-bold text-primary bg-accent px-2 py-0.5 rounded-full">
                      {selectedModule.quranVerse.surah}
                    </span>
                  </div>
                  <p className="text-right font-arabic text-sm text-foreground font-bold leading-relaxed pt-1" dir="rtl">
                    {selectedModule.quranVerse.arabic}
                  </p>
                  <p className="text-[11px] text-foreground/90 italic leading-relaxed">
                    &ldquo;{selectedModule.quranVerse.translation}&rdquo;
                  </p>
                  <div className="pt-1 border-t border-border text-[11px] text-foreground font-medium">
                    <strong className="text-foreground">Hikmah Ekologis:</strong> {selectedModule.quranVerse.tafsirEco}
                  </div>
                </div>
              )}

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
                <CheckCircle2 className="size-4" aria-hidden="true" />
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
