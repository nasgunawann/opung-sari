import React, { useState } from 'react';
import {
  Scale,
  Building2,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Wallet,
  Plus,
  Minus,
  RotateCcw,
  Check,
  Award,
  Info,
} from 'lucide-react';
import { SchoolClass, Student, WasteCategory, WasteCategoryInfo } from '../types';
import { WASTE_CATEGORIES } from '../data/initialData';

interface CoordinatorTabProps {
  classes: SchoolClass[];
  students: Student[];
  onManualDeposit: (
    classId: string,
    categoryId: WasteCategory,
    weightKg: number,
    studentId?: string,
    notes?: string
  ) => void;
  onNavigateToApprovals?: () => void;
  pendingApprovalsCount?: number;
}

export const CoordinatorTab: React.FC<CoordinatorTabProps> = ({
  classes,
  students,
  onManualDeposit,
  onNavigateToApprovals,
  pendingApprovalsCount = 0,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<WasteCategoryInfo>(
    WASTE_CATEGORIES.plastik
  );
  const [weightKg, setWeightKg] = useState<number>(1.0);
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSuccessData, setLastSuccessData] = useState<{
    className: string;
    studentName?: string;
    categoryName: string;
    weightKg: number;
    amountRp: number;
    points: number;
  } | null>(null);

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const selectedStudent = classStudents.find((s) => s.id === selectedStudentId);

  const calculatedRp = Math.round(selectedCategory.pricePerKg * weightKg);
  const calculatedPoints = Math.floor(weightKg * 15);

  const handleAdjustWeight = (delta: number) => {
    setWeightKg((prev) => {
      const next = Math.max(0.1, Number((prev + delta).toFixed(2)));
      return next;
    });
  };

  const handleQuickAddWeight = (val: number) => {
    setWeightKg((prev) => Number((prev + val).toFixed(2)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !selectedCategory || weightKg <= 0) return;

    onManualDeposit(
      selectedClassId,
      selectedCategory.id,
      weightKg,
      selectedStudentId ? selectedStudentId : undefined,
      notes
    );

    setLastSuccessData({
      className: selectedClass?.name || 'Kelas',
      studentName: selectedStudent?.name,
      categoryName: selectedCategory.name,
      weightKg,
      amountRp: calculatedRp,
      points: calculatedPoints,
    });

    setIsSuccess(true);
    setWeightKg(1.0);
    setNotes('');

    setTimeout(() => {
      setIsSuccess(false);
    }, 4500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-5 px-3 sm:px-6 space-y-5">
      {/* Header Banner */}
      <div className="bg-emerald-800 text-white rounded-2xl p-4 sm:p-6 border border-emerald-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900 text-emerald-200 text-xs font-bold">
              <Scale size={14} /> Pos Timbang Bank Sampah
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Pencatatan Setor Sampah Fisik
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
              Timbang sampah terpilah dari kelas. Nilai rupiah langsung masuk ke buku kas kelas
              dan menambah rekor poin Adiwiyata kelas tersebut.
            </p>
          </div>

          {pendingApprovalsCount > 0 && onNavigateToApprovals && (
            <button
              onClick={onNavigateToApprovals}
              className="self-start sm:self-center inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-bold shadow transition-all active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>{pendingApprovalsCount} Permohonan Kas Menunggu</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {isSuccess && lastSuccessData && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="font-black text-sm sm:text-base text-emerald-900">
                Setoran Berhasil Dicatat ke {lastSuccessData.className}!
              </div>
              <div className="text-xs text-emerald-800 mt-0.5">
                +{lastSuccessData.weightKg} kg {lastSuccessData.categoryName} • Masuk Kas{' '}
                <span className="font-extrabold text-emerald-900">
                  +Rp {lastSuccessData.amountRp.toLocaleString('id-ID')}
                </span>
                {lastSuccessData.studentName && (
                  <> (Penyetor: {lastSuccessData.studentName} dapat +{lastSuccessData.points} XP)</>
                )}
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full self-start sm:self-center">
            Tersimpan di Buku Kas
          </span>
        </div>
      )}

      {/* Main Grid: Step 1 (Class Selection) & Step 2 (Deposit Weight & Submit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Select Class & Representative (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Step 1: Pilih Kelas */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm font-bold text-stone-900">Pilih Kelas Penyetor</h2>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {classes.length} Kelas Terdaftar
              </span>
            </div>

            <p className="text-xs text-stone-500">
              Uang rupiah dari hasil timbangan akan ditambahkan langsung ke saldo kas kelas ini.
            </p>

            {/* Class Cards Grid (2 columns on mobile & desktop) */}
            <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
              {classes.map((cls) => {
                const isSelected = selectedClassId === cls.id;
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => {
                      setSelectedClassId(cls.id);
                      setSelectedStudentId(''); // reset representative when class changes
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500 shadow-xs'
                        : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50/70 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-black text-sm text-stone-900">{cls.name}</span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-stone-400">#{cls.rank}</span>
                      )}
                    </div>

                    <div className="text-[11px] text-stone-500 truncate leading-tight mb-2">
                      {cls.waliKelas.split(',')[0]}
                    </div>

                    <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] text-stone-500 font-medium">Saldo Kas</span>
                      <span className="text-xs font-black text-emerald-800">
                        Rp {(cls.balanceRp ?? 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Perwakilan Siswa (Opsional) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-bold text-stone-900">Perwakilan Siswa (Opsional)</h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Bonus XP
              </span>
            </div>

            <p className="text-xs text-stone-500">
              Jika ada siswa yang mengantar langsung, pilih namanya agar ia memperoleh poin XP
              keaktifan Adiwiyata.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <User size={13} className="text-stone-400" />
                Nama Siswa Pengantar ({selectedClass?.name || 'Kelas'})
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="">-- Tanpa Perwakilan Khusus (Atas Nama Kelas) --</option>
                {classStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (NIS: {s.nis}) • Lvl {s.level}
                  </option>
                ))}
              </select>
            </div>

            {selectedStudent && (
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-lg">{selectedStudent.avatar}</span>
                  <div className="truncate">
                    <span className="font-bold">{selectedStudent.name}</span>
                    <span className="text-[10px] text-amber-700 block">
                      NIS: {selectedStudent.nis} • Level {selectedStudent.level}
                    </span>
                  </div>
                </div>
                <span className="font-bold shrink-0 bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-md text-[11px]">
                  +{calculatedPoints} XP saat setor
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Category, Weight, Calculation & Submit (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm space-y-5"
          >
            {/* Step 3: Kategori Sampah */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm font-bold text-stone-900">Pilih Kategori Sampah</h2>
                </div>
                <span className="text-xs text-emerald-800 font-bold">
                  Tarif: Rp {selectedCategory.pricePerKg.toLocaleString('id-ID')}/kg
                </span>
              </div>

              {/* 2x2 Category Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(WASTE_CATEGORIES).map((cat) => {
                  const isSelected = selectedCategory.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500 shadow-xs'
                          : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50/70 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          Rp {cat.pricePerKg.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                        {cat.name}
                      </div>
                      <span className="text-[10px] text-stone-500 truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Bobot Timbangan Fisik */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center justify-center">
                    4
                  </span>
                  <h2 className="text-sm font-bold text-stone-900">Timbangan Aktual (Kg)</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setWeightKg(1.0)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-stone-800"
                >
                  <RotateCcw size={12} /> Reset (1 kg)
                </button>
              </div>

              {/* Main Stepper Control */}
              <div className="flex items-center justify-between gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => handleAdjustWeight(-0.5)}
                  disabled={weightKg <= 0.1}
                  className="w-11 h-11 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 active:scale-95 disabled:opacity-40 flex items-center justify-center shadow-xs transition-transform"
                >
                  <Minus size={18} />
                </button>

                <div className="flex flex-col items-center">
                  <div className="flex items-baseline gap-1.5">
                    <input
                      type="number"
                      step="0.05"
                      min="0.05"
                      max="200"
                      value={weightKg}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setWeightKg(isNaN(val) ? 0 : Number(val.toFixed(2)));
                      }}
                      className="w-24 sm:w-28 text-center text-3xl sm:text-4xl font-black text-stone-900 bg-transparent border-b-2 border-emerald-500 focus:outline-none"
                    />
                    <span className="text-sm sm:text-base font-bold text-stone-500">kg</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium mt-0.5">
                    Minimal 0.05 kg
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdjustWeight(0.5)}
                  className="w-11 h-11 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 active:scale-95 flex items-center justify-center shadow-xs transition-transform"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Quick Weight Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-stone-500 mr-1">Tambah Cepat:</span>
                {[0.2, 0.5, 1.0, 2.5, 5.0].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAddWeight(val)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-stone-200 text-xs font-bold text-stone-700 transition-all active:scale-95"
                  >
                    +{val} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Catatan Tambahan (Opsional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Catatan Setoran (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Dari piket kelas pagi, botol mineral bersih..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Real-time Calculation Summary Card */}
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-700" /> Ringkasan Nilai Setoran
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-200/70">
                  <span className="text-[11px] text-stone-600 block">Kas Masuk ke {selectedClass?.name}:</span>
                  <span className="text-lg sm:text-xl font-black text-emerald-800">
                    +Rp {calculatedRp.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-200/70">
                  <span className="text-[11px] text-stone-600 block">Poin Adiwiyata:</span>
                  <span className="text-lg sm:text-xl font-black text-teal-800">
                    +{calculatedPoints} XP
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-900/80 pt-1 flex items-center gap-1">
                <Info size={13} className="shrink-0 text-emerald-700" />
                <span>
                  Hasil timbangan langsung terakumulasi ke klasemen Adiwiyata sekolah secara instan.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={weightKg <= 0}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] disabled:opacity-50 text-white font-black text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              <span>Simpan Setoran ke Kas {selectedClass?.name || 'Kelas'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
