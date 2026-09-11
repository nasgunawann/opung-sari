import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Info,
  Lightbulb,
  Check,
  X,
  Flame,
  Leaf,
} from 'lucide-react';
import { QUIZ_QUESTIONS, WASTE_CATEGORIES, WASTE_ITEMS } from '../data/initialData';
import { WasteCategory } from '../types';
import confetti from 'canvas-confetti';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface HomeEducationTabProps {
  onGoToIoTBin: () => void;
  onAddPoints: (pts: number) => void;
  userPoints: number;
}

export const HomeEducationTab: React.FC<HomeEducationTabProps> = ({
  onGoToIoTBin,
  onAddPoints,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory | null>(null);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Daily challenges state
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
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#10B981', '#FBBF24', '#34D399'],
      });
      onAddPoints(currentQuiz.points);
      setQuizScore((prev) => prev + currentQuiz.points);
    } else {
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
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.7 },
        });
      }
      return { ...prev, [id]: next };
    });
  };

  return (
      <div className="w-full space-y-4 pb-20 pt-1 md:px-4">
        {/* Hero Welcome Card */}
      <Card className="bg-emerald-900 text-white border-emerald-950 overflow-hidden relative shadow-sm">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-800 rounded-full blur-xl opacity-50"></div>
        <CardContent className="p-4 relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <Badge className="bg-emerald-800 hover:bg-emerald-800 text-emerald-100 border-emerald-700/50 mb-1 font-medium px-2 py-0 border">
                🌱 Edukasi Pilah Sampah
              </Badge>
              <h2 className="text-sm font-bold text-white leading-snug">
                Pilah Sampah, Raih Tabungan & Juara Kelas
              </h2>
              <p className="text-xs text-emerald-100/90 leading-relaxed max-w-[220px]">
                Setor botol, kertas, dan sampah terpilah ke Tong Pintar IoT untuk menambah saldo tabunganmu.
              </p>
              <div className="pt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white text-emerald-950 hover:bg-emerald-50 h-8 text-[11px] px-3 font-semibold shadow-sm"
                  onClick={onGoToIoTBin}
                >
                  Buka Simulasi IoT Tong
                  <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </div>
            </div>
            <div className="w-14 shrink-0 relative flex items-center justify-center">
              <div className="text-5xl transform rotate-12 filter drop-shadow-md">
                ♻️
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Panduan Tong Sampah - Minimal Flat Grid */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BookOpen size={16} className="text-stone-700" />
              <CardTitle className="text-xs uppercase tracking-wider text-stone-900">
                4 Kategori Tong
              </CardTitle>
            </div>
            <span className="text-[10px] text-stone-500">Ketuk untuk detail</span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
          {/* Organik */}
          <button
            id="guide-card-organik"
            onClick={() => {
              setSelectedCategory(selectedCategory === 'organik' ? null : 'organik');
            }}
            className={`text-left p-3 rounded-xl border transition-colors ${
              selectedCategory === 'organik'
                ? 'bg-emerald-50/60 border-emerald-600'
                : 'bg-white hover:bg-stone-50 border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">{WASTE_CATEGORIES.organik.icon}</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Hijau
              </span>
            </div>
            <div className="text-xs font-semibold text-stone-900">Organik</div>
            <div className="text-[11px] text-stone-500 truncate">
              Sisa makanan & dedaunan
            </div>
            <div className="mt-1 text-[11px] font-medium text-emerald-800">
              Rp {WASTE_CATEGORIES.organik.pricePerKg.toLocaleString('id-ID')} /kg
            </div>
          </button>

          {/* Plastik */}
          <button
            id="guide-card-plastik"
            onClick={() => {
              setSelectedCategory(selectedCategory === 'plastik' ? null : 'plastik');
            }}
            className={`text-left p-3 rounded-xl border transition-colors ${
              selectedCategory === 'plastik'
                ? 'bg-amber-50/60 border-amber-600'
                : 'bg-white hover:bg-stone-50 border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">{WASTE_CATEGORIES.plastik.icon}</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                Kuning
              </span>
            </div>
            <div className="text-xs font-semibold text-stone-900">Plastik & Anorganik</div>
            <div className="text-[11px] text-stone-500 truncate">
              Botol PET, cup, kemasan
            </div>
            <div className="mt-1 text-[11px] font-medium text-stone-800">
              Rp {WASTE_CATEGORIES.plastik.pricePerKg.toLocaleString('id-ID')} /kg
            </div>
          </button>

          {/* Kertas */}
          <button
            id="guide-card-kertas"
            onClick={() => {
              setSelectedCategory(selectedCategory === 'kertas' ? null : 'kertas');
            }}
            className={`text-left p-3 rounded-xl border transition-colors ${
              selectedCategory === 'kertas'
                ? 'bg-sky-50/60 border-sky-600'
                : 'bg-white hover:bg-stone-50 border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">{WASTE_CATEGORIES.kertas.icon}</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                Biru
              </span>
            </div>
            <div className="text-xs font-semibold text-stone-900">Kertas & Karton</div>
            <div className="text-[11px] text-stone-500 truncate">
              Kardus, buku bekas, HVS
            </div>
            <div className="mt-1 text-[11px] font-medium text-stone-800">
              Rp {WASTE_CATEGORIES.kertas.pricePerKg.toLocaleString('id-ID')} /kg
            </div>
          </button>

          {/* Logam / B3 */}
          <button
            id="guide-card-b3"
            onClick={() => {
              setSelectedCategory(selectedCategory === 'logam_b3' ? null : 'logam_b3');
            }}
            className={`text-left p-3 rounded-xl border transition-colors ${
              selectedCategory === 'logam_b3'
                ? 'bg-rose-50/60 border-rose-600'
                : 'bg-white hover:bg-stone-50 border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">{WASTE_CATEGORIES.logam_b3.icon}</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                Merah
              </span>
            </div>
            <div className="text-xs font-semibold text-stone-900">Logam & B3</div>
            <div className="text-[11px] text-stone-500 truncate">
              Baterai, kaleng soda
            </div>
            <div className="mt-1 text-[11px] font-medium text-stone-800">
              Rp {WASTE_CATEGORIES.logam_b3.pricePerKg.toLocaleString('id-ID')} /kg
            </div>
          </button>
        </div>

        {/* Selected Category Detail Banner */}
        {selectedCategory && (
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-800 animate-in fade-in duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{WASTE_CATEGORIES[selectedCategory].icon}</span>
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">
                    Tong {WASTE_CATEGORIES[selectedCategory].name} ({WASTE_CATEGORIES[selectedCategory].colorName})
                  </h4>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    {WASTE_CATEGORIES[selectedCategory].description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded"
              >
                <X size={14} />
              </button>
            </div>

            <div className="mt-2 pt-2 border-t border-stone-200/70 flex flex-wrap gap-1 items-center">
              <span className="text-[10px] font-semibold text-stone-600">
                Contoh barang:
              </span>
              {WASTE_CATEGORIES[selectedCategory].examples.map((ex, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-white border border-stone-200 text-stone-700 px-1.5 py-0.5 rounded"
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
        )}
        </CardContent>
      </Card>

      {/* Interactive Kuis Pilah Sampah - Flat Minimalist */}
      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-sm">
                ?
              </div>
              <div>
                <h3 className="text-xs font-semibold text-stone-900">Kuis Edukasi Singkat</h3>
                <p className="text-[10px] text-stone-500">
                  Jawab benar untuk mendapatkan +{currentQuiz.points} poin
                </p>
              </div>
            </div>
            <button
              onClick={nextQuiz}
              className="flex items-center gap-1 text-[10px] font-medium text-stone-600 hover:text-stone-900 bg-stone-100 px-2.5 py-1.5 rounded-md"
            >
              <RefreshCw size={12} />
              <span>Ganti Kuis</span>
            </button>
          </div>

        {/* Question */}
        <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
          <p className="text-xs font-medium text-stone-800 leading-relaxed">
            {currentQuiz.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-1.5">
          {currentQuiz.options.map((opt, idx) => {
            let btnStyle = 'bg-white border-stone-200 hover:bg-stone-50 text-stone-800';

            if (hasAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold';
              } else if (selectedOption === idx) {
                btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-medium';
              } else {
                btnStyle = 'opacity-40 bg-stone-50 border-stone-200 text-stone-400';
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                disabled={hasAnswered}
                onClick={() => handleAnswerQuiz(idx)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt.text}</span>
                {hasAnswered && opt.isCorrect && (
                  <Check size={14} className="text-emerald-700 shrink-0 ml-1" />
                )}
                {hasAnswered && selectedOption === idx && !opt.isCorrect && (
                  <X size={14} className="text-rose-600 shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {hasAnswered && (
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800">
              <Lightbulb size={13} className="text-stone-600" />
              <span>
                {currentQuiz.options[selectedOption ?? 0].isCorrect
                  ? 'Jawaban Benar!'
                  : 'Penjelasan:'}
              </span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              {currentQuiz.explanation}
            </p>
            <div className="pt-1">
              <button
                onClick={nextQuiz}
                className="bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium px-3 py-1 rounded-md"
              >
                Soal Berikutnya -&gt;
              </button>
            </div>
          </div>
        )}
        </CardContent>
      </Card>

      {/* Tantangan Harian - Clean Flat Checklist */}
      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-stone-700" />
              <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                Tantangan Harian
              </h3>
            </div>
            <span className="text-[10px] text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded">
              Reset 17:00 WIB
            </span>
          </div>

          <div className="space-y-1.5">
          {/* Challenge 1 */}
          <div
            onClick={() => toggleQuest('quest1', 10)}
            className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
              completedQuests['quest1']
                ? 'bg-stone-50 border-stone-300'
                : 'bg-white border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🥤</span>
              <div>
                <div
                  className={`text-xs font-medium ${
                    completedQuests['quest1'] ? 'text-stone-400 line-through' : 'text-stone-900'
                  }`}
                >
                  Bawa Tempat Minum (Tumbler) Sendiri
                </div>
                <div className="text-[10px] text-stone-500">Hemat 1 botol plastik sekali pakai</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-stone-500">+10 pts</span>
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border ${
                  completedQuests['quest1']
                    ? 'bg-stone-800 border-stone-900 text-white'
                    : 'border-stone-300 bg-white'
                }`}
              >
                {completedQuests['quest1'] && <Check size={11} strokeWidth={2.5} />}
              </div>
            </div>
          </div>

          {/* Challenge 2 */}
          <div
            onClick={() => toggleQuest('quest2', 15)}
            className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
              completedQuests['quest2']
                ? 'bg-stone-50 border-stone-300'
                : 'bg-white border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🗑️</span>
              <div>
                <div
                  className={`text-xs font-medium ${
                    completedQuests['quest2'] ? 'text-stone-400 line-through' : 'text-stone-900'
                  }`}
                >
                  Setor Sampah Bersih ke IoT EcoBin
                </div>
                <div className="text-[10px] text-stone-500">Pilah sesuai warna kompartemen</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-stone-500">+15 pts</span>
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border ${
                  completedQuests['quest2']
                    ? 'bg-stone-800 border-stone-900 text-white'
                    : 'border-stone-300 bg-white'
                }`}
              >
                {completedQuests['quest2'] && <Check size={11} strokeWidth={2.5} />}
              </div>
            </div>
          </div>

          {/* Challenge 3 */}
          <div
            onClick={() => toggleQuest('quest3', 10)}
            className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
              completedQuests['quest3']
                ? 'bg-stone-50 border-stone-300'
                : 'bg-white border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🍱</span>
              <div>
                <div
                  className={`text-xs font-medium ${
                    completedQuests['quest3'] ? 'text-stone-400 line-through' : 'text-stone-900'
                  }`}
                >
                  Habiskan Makanan Tanpa Sisa
                </div>
                <div className="text-[10px] text-stone-500">Cegah timbulan sampah organik busuk</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-stone-500">+10 pts</span>
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border ${
                  completedQuests['quest3']
                    ? 'bg-stone-800 border-stone-900 text-white'
                    : 'border-stone-300 bg-white'
                }`}
              >
                {completedQuests['quest3'] && <Check size={11} strokeWidth={2.5} />}
              </div>
            </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
