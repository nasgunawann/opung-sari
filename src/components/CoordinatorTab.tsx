import React, { useState } from 'react';
import {
  Scale,
  Building2,
  User,
  CheckCircle2,
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
import { WasteCategoryIcon, StudentAvatar } from '../lib/appIcons';

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
      <div className="bg-primary text-primary-foreground rounded-2xl p-4 sm:p-6 border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-active text-primary-foreground text-xs font-bold">
              <Scale size={14} aria-hidden="true" /> Pos Timbang Bank Sampah
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-primary-foreground">
              Pencatatan Setor Sampah Fisik
            </h2>
            <p className="text-xs sm:text-sm text-primary-foreground/90 max-w-xl">
              Timbang sampah terpilah dari kelas. Nilai rupiah langsung masuk ke buku kas kelas
              dan menambah rekor poin Adiwiyata kelas tersebut.
            </p>
          </div>

          {pendingApprovalsCount > 0 && onNavigateToApprovals && (
            <button
              type="button"
              onClick={onNavigateToApprovals}
              className="self-start sm:self-center inline-flex items-center gap-2 min-h-10 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-foreground text-xs font-bold shadow transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="w-2 h-2 rounded-full bg-destructive" />
              <span>{pendingApprovalsCount} Permohonan Kas Menunggu</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {isSuccess && lastSuccessData && (
        <div className="p-4 rounded-2xl bg-secondary border-2 border-primary text-secondary-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} aria-hidden="true" />
            </div>
            <div>
              <div className="font-black text-sm sm:text-base text-primary">
                Setoran Berhasil Dicatat ke {lastSuccessData.className}!
              </div>
              <div className="text-xs text-primary/90 mt-0.5">
                +{lastSuccessData.weightKg} kg {lastSuccessData.categoryName} • Masuk Kas{' '}
                <span className="font-extrabold text-primary">
                  +Rp {lastSuccessData.amountRp.toLocaleString('id-ID')}
                </span>
                {lastSuccessData.studentName && (
                  <> (Penyetor: {lastSuccessData.studentName} dapat +{lastSuccessData.points} XP)</>
                )}
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-primary bg-secondary px-3 py-1 rounded-full self-start sm:self-center">
            Tersimpan di Buku Kas
          </span>
        </div>
      )}

      {/* Main Grid: Step 1 (Class Selection) & Step 2 (Deposit Weight & Submit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Select Class & Representative (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Step 1: Pilih Kelas */}
          <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-secondary text-primary text-xs font-extrabold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm font-bold text-foreground">Pilih Kelas Penyetor</h2>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {classes.length} Kelas Terdaftar
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
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
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isSelected
                        ? 'border-primary bg-secondary ring-2 ring-primary shadow-xs'
                        : 'border-border hover:border-primary/40 hover:bg-muted/50 bg-card'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-black text-sm text-foreground">{cls.name}</span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                          <Check size={10} strokeWidth={3} aria-hidden="true" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-muted-foreground">#{cls.rank}</span>
                      )}
                    </div>

                    <div className="text-[11px] text-muted-foreground truncate leading-tight mb-2">
                      {cls.waliKelas.split(',')[0]}
                    </div>

                    <div className="pt-1.5 border-t border-border flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground font-medium">Saldo Kas</span>
                      <span className="text-xs font-black text-primary">
                        Rp {(cls.balanceRp ?? 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Perwakilan Siswa (Opsional) */}
          <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-secondary text-primary text-xs font-extrabold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-bold text-foreground">Perwakilan Siswa (Opsional)</h2>
              </div>
              <span className="text-[11px] font-semibold text-primary bg-secondary px-2 py-0.5 rounded-md">
                Bonus XP
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Jika ada siswa yang mengantar langsung, pilih namanya agar ia memperoleh poin XP
              keaktifan Adiwiyata.
            </p>

            <div className="space-y-1.5">
              <label
                htmlFor="coordinator-student-select"
                className="text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <User size={13} className="text-muted-foreground" aria-hidden="true" />
                Nama Siswa Pengantar ({selectedClass?.name || 'Kelas'})
              </label>
              <select
                id="coordinator-student-select"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/50 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-card"
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
              <div className="p-2.5 rounded-xl bg-secondary border border-border flex items-center justify-between text-xs text-secondary-foreground">
                <div className="flex items-center gap-2 truncate">
                  <StudentAvatar name={selectedStudent.name} size={24} />
                  <div className="truncate">
                    <span className="font-bold">{selectedStudent.name}</span>
                    <span className="text-[10px] text-primary block">
                      NIS: {selectedStudent.nis} • Level {selectedStudent.level}
                    </span>
                  </div>
                </div>
                <span className="font-bold shrink-0 bg-primary/15 text-primary px-2 py-0.5 rounded-md text-[11px]">
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
            className="bg-card rounded-2xl p-4 sm:p-6 border border-border shadow-sm space-y-5"
          >
            {/* Step 3: Kategori Sampah */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-secondary text-primary text-xs font-extrabold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm font-bold text-foreground">Pilih Kategori Sampah</h2>
                </div>
                <span className="text-xs text-primary font-bold">
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
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isSelected
                          ? 'border-primary bg-secondary ring-2 ring-primary shadow-xs'
                          : 'border-border hover:border-primary/40 hover:bg-muted/50 bg-card'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <WasteCategoryIcon category={cat.id} size={24} />
                        <span className="text-xs font-bold text-primary bg-secondary px-2 py-0.5 rounded-md">
                          Rp {cat.pricePerKg.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-foreground leading-tight">
                        {cat.name}
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Bobot Timbangan Fisik */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-secondary text-primary text-xs font-extrabold flex items-center justify-center">
                    4
                  </span>
                  <h2 className="text-sm font-bold text-foreground">Timbangan Aktual (Kg)</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setWeightKg(1.0)}
                  className="inline-flex items-center gap-1 min-h-10 px-2 rounded-lg text-[11px] font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <RotateCcw size={12} aria-hidden="true" /> Reset (1 kg)
                </button>
              </div>

              {/* Main Stepper Control */}
              <div className="flex items-center justify-between gap-3 p-3 bg-muted rounded-2xl border border-border">
                <button
                  type="button"
                  onClick={() => handleAdjustWeight(-0.5)}
                  disabled={weightKg <= 0.1}
                  aria-label="Kurangi berat 0,5 kg"
                  className="w-11 h-11 rounded-xl bg-card border border-border text-foreground hover:bg-muted active:scale-95 disabled:opacity-40 flex items-center justify-center shadow-xs transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                      aria-label="Berat timbangan (kg)"
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setWeightKg(isNaN(val) ? 0 : Number(val.toFixed(2)));
                      }}
                      className="w-24 sm:w-28 text-center text-3xl sm:text-4xl font-black text-foreground bg-transparent border-b-2 border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <span className="text-sm sm:text-base font-bold text-muted-foreground">kg</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    Minimal 0.05 kg
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdjustWeight(0.5)}
                  aria-label="Tambah berat 0,5 kg"
                  className="w-11 h-11 rounded-xl bg-card border border-border text-foreground hover:bg-muted active:scale-95 flex items-center justify-center shadow-xs transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Quick Weight Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground mr-1">Tambah Cepat:</span>
                {[0.2, 0.5, 1.0, 2.5, 5.0].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAddWeight(val)}
                    className="inline-flex items-center justify-center h-10 px-3 rounded-lg bg-muted hover:bg-secondary hover:text-primary hover:border-primary/40 border border-border text-xs font-bold text-foreground transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    +{val} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Catatan Tambahan (Opsional) */}
            <div className="space-y-1.5">
              <label htmlFor="coordinator-notes" className="text-xs font-semibold text-foreground">
                Catatan Setoran (Opsional)
              </label>
              <input
                id="coordinator-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Dari piket kelas pagi, botol mineral bersih..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs sm:text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Real-time Calculation Summary Card */}
            <div className="p-4 rounded-2xl bg-secondary border-2 border-primary/20 space-y-2.5">
              <div className="text-xs font-bold tracking-wider text-primary flex items-center gap-1.5">
                <Info size={14} className="text-primary" aria-hidden="true" /> Ringkasan Nilai Setoran
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-card p-3 rounded-xl border border-primary/20">
                  <span className="text-[11px] text-muted-foreground block">Kas Masuk ke {selectedClass?.name}:</span>
                  <span className="text-lg sm:text-xl font-black text-primary">
                    +Rp {calculatedRp.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="bg-card p-3 rounded-xl border border-primary/20">
                  <span className="text-[11px] text-muted-foreground block">Poin Adiwiyata:</span>
                  <span className="text-lg sm:text-xl font-black text-primary">
                    +{calculatedPoints} XP
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-primary/80 pt-1 flex items-center gap-1">
                <Info size={13} className="shrink-0 text-primary" aria-hidden="true" />
                <span>
                  Hasil timbangan langsung terakumulasi ke klasemen Adiwiyata sekolah secara instan.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={weightKg <= 0}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-active active:scale-[0.99] disabled:opacity-50 text-primary-foreground font-black text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CheckCircle2 size={18} aria-hidden="true" />
              <span>Simpan Setoran ke Kas {selectedClass?.name || 'Kelas'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
